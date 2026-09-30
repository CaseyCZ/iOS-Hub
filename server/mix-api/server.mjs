import http from 'node:http';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, stat, unlink, utimes, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '127.0.0.1';
const SITE_BASE = String(process.env.SITE_BASE_URL || 'https://caseycz.github.io/iOS-Hub').replace(/\/$/, '');
const PUBLIC_BASE = String(process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
const MIX_DIR = process.env.MIX_DIR || new URL('./data/mixes/', import.meta.url).pathname;
const TTL_MS = Number(process.env.MIX_TTL_HOURS || 24) * 60 * 60 * 1000;
const MAX_SOURCES = Number(process.env.MAX_SOURCES || 30);
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 32768);
const RATE_LIMIT_PER_HOUR = Number(process.env.RATE_LIMIT_PER_HOUR || 60);
const ALLOWED_TARGETS = new Set(['altstore', 'sidestore', 'livecontainer', 'flarestore', 'feather']);
const DEFAULT_ORIGINS = ['https://caseycz.github.io', 'https://raw.githack.com'];
const ALLOWED_ORIGINS = new Set(
  String(process.env.ALLOWED_ORIGINS || DEFAULT_ORIGINS.join(','))
    .split(',')
    .map(value => value.trim())
    .filter(Boolean)
);

let metadataCache = null;
let metadataCacheAt = 0;
const rateBuckets = new Map();

function json(res, statusCode, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
    ...extraHeaders
  });
  res.end(body);
}

function corsHeaders(req, { publicGet = false } = {}) {
  if (publicGet) return { 'access-control-allow-origin': '*' };
  const origin = req.headers.origin || '';
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'vary': 'Origin'
    };
  }
  return {};
}

function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.socket.remoteAddress || 'unknown';
}

function rateAllowed(ip) {
  const now = Date.now();
  const cutoff = now - 60 * 60 * 1000;
  const bucket = (rateBuckets.get(ip) || []).filter(ts => ts > cutoff);
  if (bucket.length >= RATE_LIMIT_PER_HOUR) {
    rateBuckets.set(ip, bucket);
    return false;
  }
  bucket.push(now);
  rateBuckets.set(ip, bucket);
  return true;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'iOS-Hub-Mix-API/1.0' },
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
}

async function getMetadata() {
  const now = Date.now();
  if (metadataCache && now - metadataCacheAt < 5 * 60 * 1000) return metadataCache;
  const [registryPayload, status] = await Promise.all([
    fetchJson(`${SITE_BASE}/sources/registry.json`),
    fetchJson(`${SITE_BASE}/data/status.json`)
  ]);
  const sources = Array.isArray(registryPayload?.sources) ? registryPayload.sources : [];
  metadataCache = {
    registry: new Map(sources.map(source => [String(source.id), source])),
    status
  };
  metadataCacheAt = now;
  return metadataCache;
}

function sourceAllowed(meta, sourceId, target) {
  const source = meta.registry.get(sourceId);
  const sourceStatus = meta.status?.sources?.[sourceId];
  if (!source || source.builder === false || sourceStatus?.online !== true) return false;
  if (sourceStatus?.mixTest === 'fail') return false;
  const compatibility = sourceStatus?.installerCompatibility?.[target];
  if (compatibility?.directSource === 'fail') return false;
  if (Array.isArray(source.installers) && !source.installers.includes(target)) return false;
  if (!source.installers && source.mode === 'pal') return false;
  return true;
}

function parseDate(value) {
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

function appDate(app) {
  let best = Math.max(parseDate(app?.versionDate), parseDate(app?.date));
  if (Array.isArray(app?.versions)) {
    for (const version of app.versions) {
      if (version && typeof version === 'object') {
        best = Math.max(best, parseDate(version.date), parseDate(version.versionDate));
      }
    }
  }
  return best;
}

function sanitizeApp(app) {
  const cleaned = { ...app };
  delete cleaned.marketplaceID;
  delete cleaned.Build;
  delete cleaned.build;
  if (Array.isArray(cleaned.versions)) {
    cleaned.versions = cleaned.versions.map(version => {
      if (!version || typeof version !== 'object' || Array.isArray(version)) return version;
      const item = { ...version };
      delete item.Build;
      delete item.build;
      return item;
    });
  }
  return cleaned;
}

function dedupe(payloads) {
  const merged = new Map();
  let conflicts = 0;

  for (const { payload } of payloads) {
    for (const app of (Array.isArray(payload?.apps) ? payload.apps : [])) {
      if (!app || typeof app !== 'object') continue;
      const bundle = String(app.bundleIdentifier || app.bundleID || '').trim();
      if (!bundle) continue;
      const key = bundle.toLowerCase();
      const previous = merged.get(key);
      if (!previous) {
        merged.set(key, app);
      } else {
        conflicts += 1;
        if (appDate(app) > appDate(previous)) merged.set(key, app);
      }
    }
  }

  const apps = [...merged.values()].map(sanitizeApp);
  apps.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  return { apps, conflicts };
}

function hashSourceIds(ids) {
  return createHash('sha256').update(ids.join('|')).digest('hex').slice(0, 24);
}

async function readBody(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('Request body is too large.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

async function buildHostedMix(sourceIds, target) {
  const ids = [...new Set(sourceIds.map(String))].sort();
  if (!ids.length) throw new Error('Select at least one Source.');
  if (ids.length > MAX_SOURCES) throw new Error(`Maximum ${MAX_SOURCES} Sources per Mix.`);
  if (!ALLOWED_TARGETS.has(target)) throw new Error('Unsupported installer target.');

  const meta = await getMetadata();
  const invalid = ids.filter(id => !sourceAllowed(meta, id, target));
  if (invalid.length) throw new Error(`Incompatible or unavailable Sources: ${invalid.join(', ')}`);

  const payloads = await Promise.all(ids.map(async id => ({
    id,
    source: meta.registry.get(id),
    payload: await fetchJson(`${SITE_BASE}/data/source-cache/${encodeURIComponent(id)}.json`)
  })));

  const { apps, conflicts } = dedupe(payloads);
  if (!apps.length) throw new Error('No mergeable app entries were found.');

  const hash = hashSourceIds(ids);
  const filename = `${hash}.json`;
  const filePath = join(MIX_DIR, filename);
  const names = payloads.map(item => item.source?.name || item.id);
  const now = new Date();
  const publicUrl = `${PUBLIC_BASE}/mix/${filename}`;
  const mix = {
    name: `Mix · ${names.join(' + ')}`,
    identifier: `com.caseycz.ios.mix.${hash}`,
    subtitle: 'Combined source generated by iOS Hub',
    website: 'https://caseycz.github.io/iOS-Hub/',
    sourceURL: publicUrl,
    tintColor: '#38BDF8',
    apps,
    userInfo: {
      sourceIDs: ids,
      generatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + TTL_MS).toISOString()
    }
  };

  await mkdir(MIX_DIR, { recursive: true });
  await writeFile(filePath, JSON.stringify(mix, null, 2) + '\n', 'utf8');

  return {
    hash,
    url: publicUrl,
    expiresAt: mix.userInfo.expiresAt,
    sourceCount: ids.length,
    appCount: apps.length,
    conflicts
  };
}

async function serveMix(req, res, pathname) {
  const match = pathname.match(/^\/mix\/([a-f0-9]{24})\.json$/);
  if (!match) return false;

  const filePath = join(MIX_DIR, `${match[1]}.json`);
  try {
    const info = await stat(filePath);
    if (Date.now() - info.mtimeMs > TTL_MS) {
      await unlink(filePath).catch(() => {});
      json(res, 410, { error: 'Mix expired.' }, corsHeaders(req, { publicGet: true }));
      return true;
    }
    const body = await readFile(filePath);
    res.writeHead(200, {
      'content-type': 'application/json; charset=utf-8',
      'content-length': body.length,
      'cache-control': 'public, max-age=300',
      ...corsHeaders(req, { publicGet: true })
    });
    res.end(body);
    return true;
  } catch {
    json(res, 404, { error: 'Mix not found.' }, corsHeaders(req, { publicGet: true }));
    return true;
  }
}

async function cleanupExpired() {
  await mkdir(MIX_DIR, { recursive: true });
  const names = await readdir(MIX_DIR).catch(() => []);
  const now = Date.now();
  await Promise.all(names.filter(name => /^[a-f0-9]{24}\.json$/.test(name)).map(async name => {
    const path = join(MIX_DIR, name);
    try {
      const info = await stat(path);
      if (now - info.mtimeMs > TTL_MS) await unlink(path);
    } catch {}
  }));
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/health') {
      return json(res, 200, { ok: true, ttlHours: TTL_MS / 3600000, maxSources: MAX_SOURCES }, corsHeaders(req, { publicGet: true }));
    }

    if (req.method === 'GET' && await serveMix(req, res, url.pathname)) return;

    if (req.method === 'OPTIONS' && url.pathname === '/api/mix') {
      const headers = corsHeaders(req);
      if (!headers['access-control-allow-origin']) return json(res, 403, { error: 'Origin not allowed.' });
      res.writeHead(204, headers);
      return res.end();
    }

    if (req.method === 'POST' && url.pathname === '/api/mix') {
      const headers = corsHeaders(req);
      if (req.headers.origin && !headers['access-control-allow-origin']) {
        return json(res, 403, { error: 'Origin not allowed.' });
      }
      if (!PUBLIC_BASE.startsWith('https://')) {
        return json(res, 503, { error: 'PUBLIC_BASE_URL must be configured with HTTPS.' }, headers);
      }
      if (!rateAllowed(clientIp(req))) {
        return json(res, 429, { error: 'Too many Mix requests. Try again later.' }, headers);
      }
      const body = await readBody(req);
      const sourceIds = Array.isArray(body.sourceIDs) ? body.sourceIDs : [];
      const target = String(body.target || '');
      const result = await buildHostedMix(sourceIds, target);
      return json(res, 200, result, headers);
    }

    json(res, 404, { error: 'Not found.' });
  } catch (error) {
    console.error(error);
    json(res, 400, { error: error?.message || 'Mix request failed.' });
  }
});

await mkdir(MIX_DIR, { recursive: true });
await cleanupExpired();
setInterval(() => cleanupExpired().catch(console.error), 60 * 60 * 1000).unref();

server.listen(PORT, HOST, () => {
  console.log(`iOS Hub Mix API listening on http://${HOST}:${PORT}`);
  console.log(`Public base: ${PUBLIC_BASE || '(not configured)'}`);
  console.log(`TTL: ${TTL_MS / 3600000}h · max Sources: ${MAX_SOURCES}`);
});
