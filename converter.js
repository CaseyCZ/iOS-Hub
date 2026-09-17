import { Archive, ArchiveCompression, ArchiveFormat } from './vendor/libarchive/libarchive.js';

const root = document.documentElement;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

let lang = 'cs';
let selectedFile = null;
let resultFile = null;
let resultUrl = null;
let busy = false;

const text = (cs, en) => lang === 'en' ? en : cs;
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

Archive.init({
  workerUrl: new URL('./vendor/libarchive/worker-bundle.js', import.meta.url).href
});

function applyTheme(theme) {
  const value = theme === 'light' ? 'light' : 'dark';
  root.dataset.theme = value;
  $('#themeToggle').textContent = value === 'dark' ? '☀' : '☾';
  safeSet('caseycz-theme', value);
}

function applyLanguage(value) {
  lang = value === 'en' ? 'en' : 'cs';
  root.lang = lang;
  $$('[data-cs][data-en]').forEach(node => { node.textContent = node.dataset[lang]; });
  $$('[data-lang]').forEach(button => button.classList.toggle('active', button.dataset.lang === lang));
  document.title = lang === 'en' ? 'DEB → IPA Converter — CaseyCZ iOS Hub' : 'DEB → IPA Converter — CaseyCZ iOS Hub';
  safeSet('caseycz-language', lang);
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
  return String(path || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/\/+/g, '/');
}

function flattenExtracted(node, prefix = '') {
  const files = [];
  if (!node || typeof node !== 'object') return files;
  for (const [name, value] of Object.entries(node)) {
    const path = normalizePath(prefix ? `${prefix}/${name}` : name);
    if (value instanceof File) {
      files.push({ file: value, path });
    } else if (value && typeof value === 'object') {
      files.push(...flattenExtracted(value, path));
    }
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
    const path = normalizePath(entry.path);
    const parts = path.split('/');
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

function setProgress(percent, title, detail = '') {
  $('#progressPanel').hidden = false;
  $('#progressPercent').textContent = `${Math.max(0, Math.min(100, Math.round(percent)))}%`;
  $('#progressBar').style.width = `${Math.max(0, Math.min(100, percent))}%`;
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
  if (/data\.tar/i.test(raw)) {
    message = text('Balíček nevypadá jako standardní Debian .deb — nenašel jsem data.tar.*.', 'The package does not look like a standard Debian .deb — data.tar.* was not found.');
  } else if (/\.app/i.test(raw)) {
    message = text('V balíčku jsem nenašel iOS aplikaci .app. Tweaky, knihovny a jiné Debian balíčky nelze převést na IPA.', 'No iOS .app was found in the package. Tweaks, libraries and other Debian packages cannot be converted to IPA.');
  }
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
    setProgress(5, text('Otevírám DEB…', 'Opening DEB…'), selectedFile.name);
    await new Promise(resolve => requestAnimationFrame(resolve));

    const deb = await Archive.open(selectedFile);
    setProgress(18, text('Rozbaluji Debian balíček…', 'Extracting Debian package…'));
    const debTree = await deb.extractFiles();
    const debEntries = flattenExtracted(debTree);

    const dataEntry = dataArchiveEntry(debEntries);
    if (!dataEntry) throw new Error('data.tar.* not found');

    setProgress(34, text('Našel jsem data archiv…', 'Data archive found…'), dataEntry.path);
    const dataArchive = await Archive.open(dataEntry.file);
    setProgress(48, text('Hledám iOS aplikaci…', 'Looking for iOS application…'));
    const dataTree = await dataArchive.extractFiles();
    const appEntries = flattenExtracted(dataTree);

    const appRoot = findAppRoot(appEntries);
    if (!appRoot) throw new Error('.app bundle not found');
    const appName = appRoot.split('/').pop();
    const appPrefix = `${appRoot}/`;
    const payloadFiles = appEntries
      .filter(entry => entry.path.startsWith(appPrefix))
      .map(entry => ({
        file: entry.file,
        pathname: `Payload/${appName}/${entry.path.slice(appPrefix.length)}`
      }))
      .filter(entry => entry.pathname.split('/').pop());

    if (!payloadFiles.length) throw new Error('.app bundle is empty');

    setProgress(67, text('Vytvářím Payload…', 'Building Payload…'), `${appName} · ${payloadFiles.length} ${text('souborů', 'files')}`);
    await new Promise(resolve => setTimeout(resolve, 20));

    const baseName = appName.replace(/\.app$/i, '') || selectedFile.name.replace(/\.deb$/i, '') || 'App';
    const outputName = `${baseName}.ipa`;
    setProgress(76, text('Balím IPA…', 'Packaging IPA…'), text('Tohle může u velké aplikace chvíli trvat.', 'This can take a while for a large app.'));

    const archiveFile = await Archive.write({
      files: payloadFiles,
      outputFileName: outputName,
      compression: ArchiveCompression.DEFLATE,
      format: ArchiveFormat.ZIP,
      passphrase: null
    });

    resultFile = new File([archiveFile], outputName, { type: 'application/octet-stream', lastModified: Date.now() });
    resultUrl = URL.createObjectURL(resultFile);

    setProgress(100, text('Hotovo.', 'Done.'), outputName);
    $('#resultName').textContent = outputName;
    $('#resultMeta').textContent = `${formatBytes(resultFile.size)} · ${payloadFiles.length} ${text('souborů v aplikaci', 'app files')} · ${text('zpracováno lokálně', 'processed locally')}`;
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
    if (error?.name !== 'AbortError') showToast(text('Sdílení se nepodařilo.', 'Sharing failed.'));
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
  $('#runtimeText').textContent = text('Převodní engine připraven.', 'Conversion engine ready.');
}

function openSupport() {
  $('#supportModal')?.classList.add('open');
  document.body.classList.add('modal-open');
  $('#supportModal')?.setAttribute('aria-hidden', 'false');
}

function closeSupport() {
  $('#supportModal')?.classList.remove('open');
  document.body.classList.remove('modal-open');
  $('#supportModal')?.setAttribute('aria-hidden', 'true');
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
  if (!file.name.toLowerCase().endsWith('.deb')) return void showToast(text('Vyber soubor s příponou .deb.', 'Choose a .deb file.'));
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
$$('[data-lang]').forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));
document.addEventListener('click', event => {
  if (event.target.closest('[data-support-open]')) openSupport();
  if (event.target.closest('[data-support-close]') || event.target.id === 'supportModal') closeSupport();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSupport(); });
window.addEventListener('beforeunload', cleanupResult);

const savedTheme = safeGet('caseycz-theme');
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemDark ? 'dark' : 'light'));
const savedLang = safeGet('caseycz-language');
const browserEn = (navigator.language || '').toLowerCase().startsWith('en');
applyLanguage(savedLang === 'en' || savedLang === 'cs' ? savedLang : (browserEn ? 'en' : 'cs'));
$('#year').textContent = new Date().getFullYear();
updateRuntimeReady();
