import { Archive } from './vendor/libarchive/libarchive.js';
import { SUPPORTED_LANGUAGES, applyTranslations, normalizeLanguage, t } from './i18n.js?v=1.1.5-20260918-audit8';

const root = document.documentElement;
const $ = (selector, scope = document) => scope.querySelector(selector);

const STORAGE = { theme:'caseycz-theme', language:'caseycz-language' };
const BETA_WARNING = {
  en:'Beta: Mach-O executables are written with executable UNIX permissions. Packages that depend on symbolic links or other special filesystem metadata may still require a desktop conversion tool.',
  cs:'Beta: Mach-O binárním souborům při balení vracíme spustitelná UNIX oprávnění. Balíčky závislé na symbolických odkazech nebo jiných speciálních filesystem metadatech mohou stále vyžadovat desktopový nástroj.',
  de:'Beta: Mach-O-Binärdateien erhalten beim Verpacken ausführbare UNIX-Rechte. Pakete mit symbolischen Links oder speziellen Dateisystem-Metadaten können weiterhin ein Desktop-Werkzeug benötigen.',
  es:'Beta: los binarios Mach-O reciben permisos UNIX ejecutables al crear la IPA. Los paquetes que dependen de enlaces simbólicos u otros metadatos especiales pueden seguir necesitando una herramienta de escritorio.',
  fr:'Bêta : les binaires Mach-O reçoivent des permissions UNIX exécutables lors de la création de l’IPA. Les paquets utilisant des liens symboliques ou des métadonnées spéciales peuvent encore nécessiter un outil de bureau.'
};

let lang = 'en';
let selectedFile = null;
let resultFile = null;
let resultUrl = null;
let busy = false;

const tr = key => t(lang, key);
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

Archive.init({ workerUrl: new URL('./vendor/libarchive/worker-bundle.js', import.meta.url).href });

function applyTheme(theme) {
  const value = theme === 'light' ? 'light' : 'dark';
  root.dataset.theme = value;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#070b14' : '#eef3f8');
  $('#themeToggle').textContent = value === 'dark' ? '☀' : '☾';
  safeSet(STORAGE.theme, value);
}

function applyLanguage(value) {
  lang = normalizeLanguage(value);
  root.lang = lang;
  applyTranslations(lang);
  const select = $('#languageSelect');
  if (select) select.value = lang;
  const warning = $('#metadataWarning');
  if (warning) warning.textContent = BETA_WARNING[lang] || BETA_WARNING.en;
  document.title = 'DEB → IPA Converter — iOS Hub';
  safeSet(STORAGE.language, lang);
  if (!busy) updateRuntimeReady();
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit += 1; }
  return `${value >= 10 || unit === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`;
}

function normalizePath(path) {
  const normalized = String(path || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/\/+/g, '/');
  if (!normalized || normalized.includes('\0')) return '';
  const parts = normalized.split('/');
  if (parts.some(part => !part || part === '.' || part === '..')) return '';
  return normalized;
}

function flattenExtracted(node, prefix = '') {
  const files = [];
  if (!node || typeof node !== 'object') return files;
  for (const [name, value] of Object.entries(node)) {
    const path = normalizePath(prefix ? `${prefix}/${name}` : name);
    if (!path) continue;
    if (value instanceof File) files.push({ file: value, path });
    else if (value && typeof value === 'object') files.push(...flattenExtracted(value, path));
  }
  return files;
}

function dataArchiveEntry(entries) {
  const candidates = entries.filter(entry => /^data\.tar(?:\..+)?$/i.test(entry.path.split('/').pop() || ''));
  if (!candidates.length) return null;
  candidates.sort((a, b) => a.path.length - b.path.length);
  return candidates[0];
}

function findAppRoot(entries) {
  const roots = new Set();
  for (const entry of entries) {
    const normalized = normalizePath(entry.path);
    if (!normalized) continue;
    const parts = normalized.split('/');
    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i].toLowerCase().endsWith('.app')) {
        roots.add(parts.slice(0, i + 1).join('/'));
        break;
      }
    }
  }
  if (!roots.size) return null;
  return [...roots].sort((a, b) => {
    const aApps = /(^|\/)Applications\//i.test(a) ? 0 : 1;
    const bApps = /(^|\/)Applications\//i.test(b) ? 0 : 1;
    if (aApps !== bApps) return aApps - bApps;
    return a.split('/').length - b.split('/').length || a.length - b.length;
  })[0];
}

async function isExecutableFile(file) {
  const bytes = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  if (bytes.length >= 2 && bytes[0] === 0x23 && bytes[1] === 0x21) return true;
  if (bytes.length < 4) return false;
  const magic = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('').toLowerCase();
  return new Set([
    'feedface', 'cefaedfe',
    'feedfacf', 'cffaedfe',
    'cafebabe', 'bebafeca',
    'cafebabf', 'bfbafeca'
  ]).has(magic);
}

function setProgress(percent, title, detail = '') {
  $('#progressPanel').hidden = false;
  $('#progressPercent').textContent = `${Math.max(0, Math.min(100, Math.round(percent)))}%`;
  const safePercent = Math.max(0, Math.min(100, percent));
  $('#progressBar').style.width = `${safePercent}%`;
  $('#progressTrack')?.setAttribute('aria-valuenow', String(Math.round(safePercent)));
  $('#progressTitle').textContent = title;
  $('#progressDetail').textContent = detail;
}

function setSelectedFile(file) {
  selectedFile = file || null;
  $('#errorPanel').hidden = true;
  $('#resultPanel').hidden = true;
  $('#progressPanel').hidden = true;
  $('#convertButton').disabled = !selectedFile || busy;
  $('#fileCard').hidden = !selectedFile;
  if (!selectedFile) {
    $('#debFile').value = '';
    $('#mobileWarning').hidden = true;
    return;
  }
  $('#fileName').textContent = selectedFile.name;
  $('#fileSize').textContent = `${formatBytes(selectedFile.size)} · .deb`;
  const isMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  $('#mobileWarning').hidden = !(isMobile && selectedFile.size > 180 * 1024 * 1024);
}

function cleanupResult() {
  if (resultUrl) URL.revokeObjectURL(resultUrl);
  resultUrl = null;
  resultFile = null;
  $('#resultPanel').hidden = true;
  $('#shareIpa').hidden = true;
}

function showError(error) {
  console.error(error);
  const raw = error instanceof Error ? error.message : String(error);
  let message = raw;
  if (/data\.tar/i.test(raw)) message = tr('debInvalid');
  else if (/\.app/i.test(raw)) message = tr('appNotFound');
  $('#errorMessage').textContent = message;
  $('#errorPanel').hidden = false;
  $('#progressPanel').hidden = true;
}

async function convertDebToIpa() {
  if (!selectedFile || busy) return;
  busy = true;
  cleanupResult();
  $('#errorPanel').hidden = true;
  $('#convertButton').disabled = true;

  try {
    if (typeof window.JSZip !== 'function') throw new Error('ZIP runtime is not available.');

    setProgress(5, tr('openingDeb'), selectedFile.name);
    await new Promise(resolve => requestAnimationFrame(resolve));

    const deb = await Archive.open(selectedFile);
    setProgress(18, tr('extractingDeb'));
    const debTree = await deb.extractFiles();
    const debEntries = flattenExtracted(debTree);

    const dataEntry = dataArchiveEntry(debEntries);
    if (!dataEntry) throw new Error('data.tar.* not found');

    setProgress(34, tr('dataFound'), dataEntry.path);
    const dataArchive = await Archive.open(dataEntry.file);
    setProgress(48, tr('lookingApp'));
    const dataTree = await dataArchive.extractFiles();
    const appEntries = flattenExtracted(dataTree);

    const appRoot = findAppRoot(appEntries);
    if (!appRoot) throw new Error('.app bundle not found');
    const appName = appRoot.split('/').pop();
    const appPrefix = `${appRoot}/`;
    const payloadFiles = appEntries
      .filter(entry => entry.path.startsWith(appPrefix))
      .map(entry => {
        const relative = normalizePath(entry.path.slice(appPrefix.length));
        const pathname = relative ? normalizePath(`Payload/${appName}/${relative}`) : '';
        return { file: entry.file, pathname };
      })
      .filter(entry => entry.pathname);

    if (!payloadFiles.length) throw new Error('.app bundle is empty');

    setProgress(64, tr('buildingPayload'), `${appName} · ${payloadFiles.length} ${tr('files')}`);
    await new Promise(resolve => setTimeout(resolve, 20));

    const baseName = appName.replace(/\.app$/i, '') || selectedFile.name.replace(/\.deb$/i, '') || 'App';
    const outputName = `${baseName}.ipa`;
    const zip = new window.JSZip();

    for (let index = 0; index < payloadFiles.length; index += 1) {
      const entry = payloadFiles[index];
      const executable = await isExecutableFile(entry.file);
      const data = await entry.file.arrayBuffer();
      zip.file(entry.pathname, data, {
        binary: true,
        createFolders: true,
        date: new Date(entry.file.lastModified || Date.now()),
        unixPermissions: executable ? 0o100755 : 0o100644
      });
      if (index % 20 === 0 || index === payloadFiles.length - 1) {
        const pct = 65 + ((index + 1) / payloadFiles.length) * 15;
        setProgress(pct, tr('buildingPayload'), `${index + 1}/${payloadFiles.length} ${tr('files')}`);
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
    }

    setProgress(82, tr('packagingIpa'), tr('packagingWait'));
    const archiveBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
      platform: 'UNIX',
      streamFiles: true
    }, metadata => {
      setProgress(82 + (metadata.percent * 0.17), tr('packagingIpa'), `${Math.round(metadata.percent)}%`);
    });

    resultFile = new File([archiveBlob], outputName, { type: 'application/octet-stream', lastModified: Date.now() });
    resultUrl = URL.createObjectURL(resultFile);

    setProgress(100, tr('done'), outputName);
    $('#resultName').textContent = outputName;
    $('#resultMeta').textContent = `${formatBytes(resultFile.size)} · ${payloadFiles.length} ${tr('appFiles')} · ${tr('processedLocal')}`;
    $('#downloadIpa').href = resultUrl;
    $('#downloadIpa').download = outputName;

    const canShare = typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [resultFile] });
    $('#shareIpa').hidden = !canShare;
    $('#resultPanel').hidden = false;
    setTimeout(() => { $('#progressPanel').hidden = true; }, 500);
  } catch (error) {
    showError(error);
  } finally {
    busy = false;
    $('#convertButton').disabled = !selectedFile;
  }
}

async function shareResult() {
  if (!resultFile || typeof navigator.share !== 'function') return;
  try {
    await navigator.share({ files: [resultFile], title: resultFile.name });
  } catch (error) {
    if (error?.name !== 'AbortError') showToast(tr('shareFailed'));
  }
}

let toastTimer;
function showToast(message) {
  const node = $('#toast');
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { node.hidden = true; }, 2600);
}

function updateRuntimeReady() {
  $('#runtimeDot').classList.add('ready');
  $('#runtimeText').textContent = tr('engineReady');
}

let supportReturnFocus = null;

function openSupport() {
  const modal = $('#supportModal');
  supportReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal?.classList.add('open');
  document.body.classList.add('modal-open');
  modal?.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => modal?.querySelector('[data-support-close]')?.focus());
}
function closeSupport() {
  const modal = $('#supportModal');
  const wasOpen = modal?.classList.contains('open');
  modal?.classList.remove('open');
  document.body.classList.remove('modal-open');
  modal?.setAttribute('aria-hidden', 'true');
  if (wasOpen && supportReturnFocus) {
    const target = supportReturnFocus;
    supportReturnFocus = null;
    requestAnimationFrame(() => target.focus?.());
  }
}

const dropZone = $('#dropZone');
['dragenter', 'dragover'].forEach(type => dropZone.addEventListener(type, event => {
  event.preventDefault();
  dropZone.classList.add('dragging');
}));
['dragleave', 'drop'].forEach(type => dropZone.addEventListener(type, event => {
  event.preventDefault();
  dropZone.classList.remove('dragging');
}));
dropZone.addEventListener('drop', event => {
  const file = event.dataTransfer?.files?.[0];
  if (!file) return;
  if (!file.name.toLowerCase().endsWith('.deb')) return void showToast(tr('chooseDebToast'));
  setSelectedFile(file);
});

$('#debFile').addEventListener('change', event => {
  const file = event.target.files?.[0];
  if (file) setSelectedFile(file);
});
$('#removeFile').addEventListener('click', () => { cleanupResult(); setSelectedFile(null); });
$('#convertButton').addEventListener('click', convertDebToIpa);
$('#retryButton').addEventListener('click', convertDebToIpa);
$('#newConversion').addEventListener('click', () => { cleanupResult(); setSelectedFile(null); window.scrollTo({ top: 0, behavior: 'smooth' }); });
$('#shareIpa').addEventListener('click', shareResult);
$('#themeToggle').addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#languageSelect').addEventListener('change', event => applyLanguage(event.target.value));
document.addEventListener('click', event => {
  if (event.target.closest('[data-support-open]')) openSupport();
  if (event.target.closest('[data-support-close]') || event.target.id === 'supportModal') closeSupport();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSupport(); });
window.addEventListener('beforeunload', cleanupResult);

const savedTheme = safeGet(STORAGE.theme);
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemDark ? 'dark' : 'light'));
const savedLang = safeGet(STORAGE.language);
applyLanguage(SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : 'en');
$('#year').textContent = new Date().getFullYear();
updateRuntimeReady();
