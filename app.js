import { SUPPORTED_LANGUAGES, applyTranslations, normalizeLanguage, t } from './i18n.js?v=1.1.5-20260918-sources1';

const root = document.documentElement;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const STORAGE = {
  theme: 'caseycz-theme',
  language: 'caseycz-language',
  category: 'ioshub-source-category',
  genre: 'ioshub-genre',
  sort: 'ioshub-source-sort',
  query: 'ioshub-source-query'
};

const SOURCE_CATEGORIES = new Set(['all', 'official', 'trusted', 'community', 'modified']);
const GENRES = new Set(['all', 'games', 'emulators', 'video', 'music', 'anime', 'social', 'downloads', 'sideload', 'utilities']);
const SORT_MODES = new Set(['name', 'apps-desc', 'apps-asc']);
const GENRE_RULES = {
  games: ['games','pokemon','mmo','geometry-dash','game'],
  emulators: ['emulator','retro','dreamcast','dolphinios','virtualization'],
  video: ['video','streaming','youtube','media','stremio','kodi'],
  music: ['music','audio'],
  anime: ['anime','manga','comics'],
  social: ['social','mastodon','fediverse'],
  downloads: ['torrent','download','qbittorrent','network'],
  sideload: ['sideload','signing','livecontainer','debug'],
  utilities: ['utility','developer','terminal','linux','privacy','app','ios']
};

const state = {
  registry: [],
  status: {},
  catalog: {},
  sourceCategory: 'all',
  genre: 'all',
  sort: 'name',
  query: '',
  lang: 'en'
};

const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
const escapeHtml = value => String(value ?? '').replace(/[&<>'\"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[char]));
const tr = key => t(state.lang, key);
const INSTALLER_ICONS = {
  altstore: 'assets/icons/altstore.svg',
  sidestore: 'https://sidestore.io/assets/icon.png',
  livecontainer: 'assets/icons/livecontainer.svg'
};
function installerIcon(installer) {
  const src = INSTALLER_ICONS[installer];
  return src ? `<img class="installer-icon" src="${escapeHtml(src)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : '';
}

function loadPersistedSettings() {
  const category = safeGet(STORAGE.category);
  const genre = safeGet(STORAGE.genre);
  const sort = safeGet(STORAGE.sort);
  if (SOURCE_CATEGORIES.has(category)) state.sourceCategory = category;
  if (GENRES.has(genre)) state.genre = genre;
  if (SORT_MODES.has(sort)) state.sort = sort;
  state.query = safeGet(STORAGE.query) || '';
}

function applyTheme(theme) {
  const value = theme === 'light' ? 'light' : 'dark';
  root.dataset.theme = value;
  const button = $('#themeToggle');
  if (button) button.textContent = value === 'dark' ? '☀' : '☾';
  safeSet(STORAGE.theme, value);
}

function applyLanguage(value) {
  state.lang = normalizeLanguage(value);
  root.lang = state.lang;
  applyTranslations(state.lang);
  const select = $('#languageSelect');
  if (select) select.value = state.lang;
  document.title = state.lang === 'en'
    ? 'CaseyCZ iOS Hub — Sources, Catalog & Tools'
    : `CaseyCZ iOS Hub — ${tr('sources')} · ${tr('tools')}`;
  safeSet(STORAGE.language, state.lang);
  renderSources();
  updateStats();
}

function modeLabel(mode) {
  if (mode === 'pal') return 'AltStore PAL';
  if (mode === 'sidestore') return 'SideStore';
  return 'AltStore Classic';
}

function getStatus(id) {
  return state.status?.sources?.[id] || {};
}

function catalogSource(id) {
  return state.catalog?.sources?.find(item => item.id === id) || null;
}

function sourceIcon(source) {
  const status = getStatus(source.id);
  const icon = status.iconURL || catalogSource(source.id)?.iconURL;
  return icon ? `<img src="${escapeHtml(icon)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : escapeHtml(source.name.slice(0,2).toUpperCase());
}

function sourceInstallerLink(installer, source) {
  const path = installer === 'livecontainer' ? 'sources' : 'source';
  return `${installer}://${path}?url=${encodeURIComponent(source.url)}`;
}

function sourceTags(source) {
  return new Set((source.tags || []).map(tag => String(tag).toLowerCase()));
}

function isCommunitySource(source) {
  const tags = sourceTags(source);
  return source.community === true || source.official !== true || tags.has('community');
}

function isModifiedSource(source) {
  const tags = sourceTags(source);
  return source.modified === true || ['modified','mods','modded','tweak','tweaks','tweaked'].some(tag => tags.has(tag));
}

function matchesSourceCategory(source) {
  if (state.sourceCategory === 'all') return true;
  if (state.sourceCategory === 'official') return source.official === true;
  if (state.sourceCategory === 'trusted') return source.trusted === true;
  if (state.sourceCategory === 'community') return isCommunitySource(source);
  if (state.sourceCategory === 'modified') return isModifiedSource(source);
  return true;
}

function matchesGenre(source) {
  if (state.genre === 'all') return true;
  const tags = [...sourceTags(source)];
  return (GENRE_RULES[state.genre] || []).some(rule => tags.includes(rule));
}

function sourceCategoryBadges(source) {
  const badges = [];
  if (source.official) badges.push(`<span class="pill">✓ ${escapeHtml(tr('official'))}</span>`);
  if (source.trusted) badges.push(`<span class="pill">✓ ${escapeHtml(tr('trusted'))}</span>`);
  if (isCommunitySource(source)) badges.push(`<span class="pill">${escapeHtml(tr('community'))}</span>`);
  if (isModifiedSource(source)) badges.push(`<span class="pill">${escapeHtml(tr('modified'))}</span>`);
  return badges.join('');
}

function sourceSearchText(source) {
  const catalog = catalogSource(source.id);
  const apps = (catalog?.apps || []).flatMap(app => [
    app.name,
    app.developerName,
    app.bundleIdentifier,
    app.subtitle,
    app.version
  ]);
  return [
    source.name,
    source.mode,
    ...(source.tags || []),
    source.description?.cs,
    source.description?.en,
    ...apps
  ].filter(Boolean).join(' ').toLowerCase();
}

function sourceAppCount(source) {
  const apps = catalogSource(source.id)?.apps;
  if (Array.isArray(apps)) return apps.length;
  const statusCount = getStatus(source.id).appCount;
  return Number.isFinite(statusCount) ? statusCount : 0;
}

function compareSources(left, right) {
  const byName = () => String(left.name || '').localeCompare(String(right.name || ''), state.lang, {sensitivity:'base'});
  if (state.sort === 'apps-desc') {
    const diff = sourceAppCount(right) - sourceAppCount(left);
    return diff || byName();
  }
  if (state.sort === 'apps-asc') {
    const diff = sourceAppCount(left) - sourceAppCount(right);
    return diff || byName();
  }
  return byName();
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const localeMap = { en:'en-GB', cs:'cs-CZ', de:'de-DE', es:'es-ES', fr:'fr-FR' };
  return new Intl.DateTimeFormat(localeMap[state.lang] || 'en-GB', {day:'2-digit', month:'2-digit', year:'numeric'}).format(date);
}

function sourceAppsDisclosure(source) {
  const catalog = catalogSource(source.id) || {};
  const apps = [...(catalog.apps || [])]
    .filter(app => app && typeof app === 'object')
    .sort((left, right) => String(left.name || '').localeCompare(String(right.name || '')));
  const statusCount = getStatus(source.id).appCount;
  const count = Number.isFinite(catalog.appCount) ? catalog.appCount : (Number.isFinite(statusCount) ? statusCount : apps.length);
  const limited = catalog.catalogLimited === true && count > apps.length;
  const rows = apps.length ? apps.map(app => {
    const details = [app.developerName, app.version, app.bundleIdentifier].filter(Boolean).map(escapeHtml).join(' · ');
    return `<div class="source-app-row"><strong>${escapeHtml(app.name || 'Unknown app')}</strong>${details ? `<span>${details}</span>` : ''}</div>`;
  }).join('') : `<div class="source-app-empty">${escapeHtml(tr('noApps'))}</div>`;
  const limitNote = limited ? `<div class="source-app-empty">${apps.length} / ${count}</div>` : '';
  return `<details class="source-apps-disclosure">
    <summary title="${escapeHtml(tr('showApps'))}" aria-label="${escapeHtml(tr('showApps'))}">
      <span class="source-app-count">📱 <strong>${count}</strong> ${escapeHtml(tr('apps'))}</span>
      <span class="source-app-chevron" aria-hidden="true">⌄</span>
    </summary>
    <div class="source-app-list">${limitNote}${rows}</div>
  </details>`;
}

function renderSources() {
  const grid = $('#sourceGrid');
  if (!grid) return;
  const q = state.query.trim().toLowerCase();
  const filtered = state.registry.filter(source => {
    if (!matchesSourceCategory(source) || !matchesGenre(source)) return false;
    return !q || sourceSearchText(source).includes(q);
  }).sort(compareSources);

  if (!filtered.length) {
    grid.innerHTML = `<div class="panel empty" style="grid-column:1/-1"><div class="empty-icon">⌕</div><h3>${escapeHtml(tr('nothingFound'))}</h3><p>${escapeHtml(tr('tryFilters'))}</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(source => {
    const status = getStatus(source.id);
    const appCount = Number.isFinite(status.appCount) ? status.appCount : '—';
    const desc = source.description?.[state.lang] || source.description?.en || source.description?.cs || '';
    return `<article class="source-card" data-source-id="${escapeHtml(source.id)}">
      <div class="source-top">
        <div class="source-icon">${sourceIcon(source)}</div>
        <div class="source-title">
          <h3>${escapeHtml(source.name)}</h3>
          <div class="source-meta">
            <span class="pill mode">${escapeHtml(modeLabel(source.mode))}</span>
            ${status.online === true
              ? `<span class="pill online">● ${escapeHtml(tr('online'))}</span>`
              : status.checkedAt
                ? `<span class="pill offline">● ${escapeHtml(tr('offline'))}</span>`
                : `<span class="pill">● ${escapeHtml(tr('checking'))}</span>`}
            ${sourceCategoryBadges(source)}
          </div>
        </div>
      </div>
      <p>${escapeHtml(desc)}</p>
      <div class="source-stats">${sourceAppsDisclosure(source)}${status.checkedAt ? `<span class="source-checked">${escapeHtml(tr('checked'))}: ${escapeHtml(formatDate(status.checkedAt))}</span>` : ''}</div>
      <div class="source-installers" aria-label="Install source">
        <a class="btn small primary installer-link" href="${escapeHtml(sourceInstallerLink('altstore', source))}">${installerIcon('altstore')}AltStore</a>
        <a class="btn small secondary installer-link" href="${escapeHtml(sourceInstallerLink('sidestore', source))}">${installerIcon('sidestore')}SideStore</a>
        <a class="btn small secondary installer-link" href="${escapeHtml(sourceInstallerLink('livecontainer', source))}">${installerIcon('livecontainer')}LiveContainer</a>
      </div>
      <div class="source-actions source-utilities">
        <button class="btn small secondary" type="button" data-copy-source="${escapeHtml(source.url)}">${escapeHtml(tr('copyUrl'))}</button>
        <a class="btn small ghost" href="${escapeHtml(source.url)}" target="_blank" rel="noopener">JSON ↗</a>
        ${source.website ? `<a class="btn small ghost" href="${escapeHtml(source.website)}" target="_blank" rel="noopener">Web ↗</a>` : ''}
      </div>
    </article>`;
  }).join('');
}

function uniqueDiscoveredAppCount() {
  const onlineIds = new Set(
    state.registry
      .filter(source => getStatus(source.id).online === true)
      .map(source => source.id)
  );
  const keys = new Set();
  for (const source of (state.catalog?.sources || [])) {
    if (!onlineIds.has(source.id)) continue;
    for (const app of (source.apps || [])) {
      const bundle = String(app.bundleIdentifier || '').trim().toLowerCase();
      const fallback = `${source.id}:${app.name || ''}:${app.developerName || ''}`.toLowerCase();
      const key = bundle || fallback;
      if (key) keys.add(key);
    }
  }
  return keys.size;
}

function updateStats() {
  const statuses = state.status?.sources || {};
  const online = state.registry.filter(source => statuses[source.id]?.online === true).length;
  const mixReady = state.status?.mixes?.autoCompatibleSourceIDs?.length || 0;
  const apps = uniqueDiscoveredAppCount();
  if ($('#statSources')) $('#statSources').textContent = online || '—';
  if ($('#statMix')) $('#statMix').textContent = mixReady || '—';
  if ($('#statApps')) $('#statApps').textContent = apps || '—';
}

function syncFilterButtons() {
  $$('[data-category-filter]').forEach(btn => btn.classList.toggle('active', btn.dataset.categoryFilter === state.sourceCategory));
  document.querySelectorAll('[data-genre-filter]').forEach(btn => btn.classList.toggle('active', btn.dataset.genreFilter === state.genre));
  document.querySelectorAll('[data-sort-filter]').forEach(btn => btn.classList.toggle('active', btn.dataset.sortFilter === state.sort));
  const search = $('#sourceSearch');
  if (search && search.value !== state.query) search.value = state.query;
}

async function loadData() {
  try {
    const [registryResponse, statusResponse, catalogResponse] = await Promise.all([
      fetch('sources/registry.json', {cache:'no-store'}),
      fetch('data/status.json', {cache:'no-store'}),
      fetch('data/catalog.json', {cache:'no-store'})
    ]);
    const registry = await registryResponse.json();
    state.registry = registry.sources || [];
    state.status = statusResponse.ok ? await statusResponse.json() : {};
    state.catalog = catalogResponse.ok ? await catalogResponse.json() : {};
  } catch (error) {
    console.error(error);
    toast(tr('catalogLoadError'));
  }
  syncFilterButtons();
  renderSources();
  updateStats();
}

async function copyText(value, successMessage) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (_) {
    const input = document.createElement('textarea');
    input.value = value;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  }
  toast(successMessage || tr('copied'));
}

let toastTimer;
function toast(message) {
  const node = $('#toast');
  if (!node) return;
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { node.hidden = true; }, 2600);
}

function openSupport() {
  const modal = $('#supportModal');
  modal?.classList.add('open');
  document.body.classList.add('modal-open');
  modal?.setAttribute('aria-hidden','false');
}
function closeSupport() {
  const modal = $('#supportModal');
  modal?.classList.remove('open');
  document.body.classList.remove('modal-open');
  modal?.setAttribute('aria-hidden','true');
}

document.addEventListener('click', event => {
  const category = event.target.closest('[data-category-filter]');
  if (category) {
    state.sourceCategory = SOURCE_CATEGORIES.has(category.dataset.categoryFilter) ? category.dataset.categoryFilter : 'all';
    safeSet(STORAGE.category, state.sourceCategory);
    syncFilterButtons();
    renderSources();
    return;
  }

  const genre = event.target.closest('[data-genre-filter]');
  if (genre) {
    state.genre = GENRES.has(genre.dataset.genreFilter) ? genre.dataset.genreFilter : 'all';
    safeSet(STORAGE.genre, state.genre);
    syncFilterButtons();
    renderSources();
    return;
  }

  const sort = event.target.closest('[data-sort-filter]');
  if (sort) {
    state.sort = SORT_MODES.has(sort.dataset.sortFilter) ? sort.dataset.sortFilter : 'name';
    safeSet(STORAGE.sort, state.sort);
    syncFilterButtons();
    renderSources();
    return;
  }

  const copy = event.target.closest('[data-copy-source]');
  if (copy) return void copyText(copy.dataset.copySource, tr('sourceCopied'));
  if (event.target.closest('[data-support-open]')) return void openSupport();
  if (event.target.closest('[data-support-close]')) return void closeSupport();
  if (event.target.id === 'supportModal') closeSupport();
});

$('#sourceSearch')?.addEventListener('input', event => {
  state.query = event.target.value || '';
  safeSet(STORAGE.query, state.query);
  renderSources();
});
$('#themeToggle')?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#languageSelect')?.addEventListener('change', event => applyLanguage(event.target.value));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSupport(); });

loadPersistedSettings();
syncFilterButtons();
const savedTheme = safeGet(STORAGE.theme);
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemDark ? 'dark' : 'light'));
const savedLang = safeGet(STORAGE.language);
applyLanguage(SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : 'en');
if ($('#year')) $('#year').textContent = new Date().getFullYear();
loadData();