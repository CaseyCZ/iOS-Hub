const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

const STORAGE = {
  selection: 'ioshub-experimental-mix-selection',
  category: 'ioshub-experimental-mix-category',
  genre: 'ioshub-experimental-mix-genre',
  compatibility: 'ioshub-mix-compatibility',
  query: 'ioshub-experimental-mix-query'
};

const SOURCE_CATEGORIES = new Set(['all', 'official', 'trusted', 'community', 'modified']);
const GENRES = new Set(['all', 'games', 'emulators', 'video', 'music', 'anime', 'social', 'downloads', 'sideload', 'utilities']);
const COMPATIBILITY = new Set(['all', 'pass', 'try']);
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

const copy = {
  en: {
    title:'Source Builder',
    desc:'All online sources are in one list. Filter them, select any combination, and the Builder will use the automated Mix test to decide whether it is verified or experimental.',
    selectPass:'Select compatible', selectAll:'Select all shown', clear:'Clear', build:'Build CaseyCZ Mix', selected:'selected', shown:'shown', pass:'PASS', experimental:'TRY',
    mixStatus:'Mix status', statusAll:'All', statusPass:'PASS only', statusTry:'TRY only', autoTested:'Auto tested',
    hosted:'Hosted Mix ready', local:'Experimental Mix ready', localNote:'This combination is not pre-hosted. Download the JSON to inspect/test it. PAL or SideStore-specific apps may still require their original installer.',
    apps:'apps', conflicts:'duplicates resolved', add:'＋ Add to AltStore', copyUrl:'Copy URL', download:'Download JSON', preview:'Preview JSON', building:'Testing and combining sources…', failed:'The selected Mix could not be built.', copied:'Mix URL copied.', empty:'No sources match the current filters.'
  },
  cs: {
    title:'Source Builder',
    desc:'Všechny online zdroje jsou v jednom seznamu. Odfiltruj je, vyber libovolnou kombinaci a Builder podle automatického Mix testu pozná, jestli je výběr ověřený nebo experimentální.',
    selectPass:'Vybrat kompatibilní', selectAll:'Vybrat vše zobrazené', clear:'Zrušit výběr', build:'Vytvořit CaseyCZ Mix', selected:'vybráno', shown:'zobrazeno', pass:'PASS', experimental:'ZKUSIT',
    mixStatus:'Stav Mixu', statusAll:'Vše', statusPass:'Jen PASS', statusTry:'Jen ZKUSIT', autoTested:'Automaticky testováno',
    hosted:'Veřejný Mix je připraven', local:'Experimentální Mix je připraven', localNote:'Tato kombinace není předem hostovaná. JSON můžeš stáhnout a otestovat. PAL nebo SideStore aplikace mohou stále vyžadovat svůj původní instalátor.',
    apps:'aplikací', conflicts:'duplicit vyřešeno', add:'＋ Přidat do AltStore', copyUrl:'Kopírovat URL', download:'Stáhnout JSON', preview:'Náhled JSON', building:'Testuji a spojuji zdroje…', failed:'Vybraný Mix se nepodařilo vytvořit.', copied:'URL Mixu zkopírována.', empty:'Aktuálním filtrům neodpovídá žádný zdroj.'
  },
  de: {
    title:'Source Builder',
    desc:'Alle Online-Quellen befinden sich in einer Liste. Filtere sie, wähle eine beliebige Kombination und der automatische Mix-Test kennzeichnet sie als geprüft oder experimentell.',
    selectPass:'Kompatible wählen', selectAll:'Alle sichtbaren wählen', clear:'Leeren', build:'CaseyCZ Mix erstellen', selected:'ausgewählt', shown:'sichtbar', pass:'PASS', experimental:'TEST',
    mixStatus:'Mix-Status', statusAll:'Alle', statusPass:'Nur PASS', statusTry:'Nur TEST', autoTested:'Automatisch geprüft',
    hosted:'Gehosteter Mix bereit', local:'Experimenteller Mix bereit', localNote:'Diese Kombination ist nicht vorab gehostet. Lade die JSON-Datei zum Testen herunter. PAL- oder SideStore-Apps können weiterhin ihren ursprünglichen Installer benötigen.',
    apps:'Apps', conflicts:'Duplikate gelöst', add:'＋ Zu AltStore hinzufügen', copyUrl:'URL kopieren', download:'JSON laden', preview:'JSON ansehen', building:'Quellen werden getestet und kombiniert…', failed:'Der ausgewählte Mix konnte nicht erstellt werden.', copied:'Mix-URL kopiert.', empty:'Keine Quellen entsprechen den aktuellen Filtern.'
  },
  es: {
    title:'Source Builder',
    desc:'Todas las fuentes online están en una sola lista. Filtra, selecciona cualquier combinación y la prueba automática indicará si el Mix está verificado o es experimental.',
    selectPass:'Seleccionar compatibles', selectAll:'Seleccionar todo lo visible', clear:'Limpiar', build:'Crear CaseyCZ Mix', selected:'seleccionadas', shown:'visibles', pass:'PASS', experimental:'PROBAR',
    mixStatus:'Estado del Mix', statusAll:'Todo', statusPass:'Solo PASS', statusTry:'Solo PROBAR', autoTested:'Prueba automática',
    hosted:'Mix alojado listo', local:'Mix experimental listo', localNote:'Esta combinación no está alojada previamente. Descarga el JSON para probarlo. Las apps PAL o SideStore pueden seguir necesitando su instalador original.',
    apps:'apps', conflicts:'duplicados resueltos', add:'＋ Añadir a AltStore', copyUrl:'Copiar URL', download:'Descargar JSON', preview:'Ver JSON', building:'Probando y combinando fuentes…', failed:'No se pudo crear el Mix seleccionado.', copied:'URL del Mix copiada.', empty:'Ninguna fuente coincide con los filtros actuales.'
  },
  fr: {
    title:'Source Builder',
    desc:'Toutes les sources en ligne sont regroupées dans une seule liste. Filtrez-les, sélectionnez n’importe quelle combinaison et le test automatique indiquera si le Mix est vérifié ou expérimental.',
    selectPass:'Sélectionner compatibles', selectAll:'Tout sélectionner affiché', clear:'Effacer', build:'Créer CaseyCZ Mix', selected:'sélectionnées', shown:'affichées', pass:'PASS', experimental:'TEST',
    mixStatus:'Statut du Mix', statusAll:'Tout', statusPass:'PASS seulement', statusTry:'TEST seulement', autoTested:'Test automatique',
    hosted:'Mix hébergé prêt', local:'Mix expérimental prêt', localNote:'Cette combinaison n’est pas pré-hébergée. Téléchargez le JSON pour la tester. Les apps PAL ou SideStore peuvent toujours nécessiter leur installateur d’origine.',
    apps:'apps', conflicts:'doublons résolus', add:'＋ Ajouter à AltStore', copyUrl:'Copier URL', download:'Télécharger JSON', preview:'Aperçu JSON', building:'Test et fusion des sources…', failed:'Impossible de créer le Mix sélectionné.', copied:'URL du Mix copiée.', empty:'Aucune source ne correspond aux filtres actuels.'
  }
};

let registry = [];
let status = {};
let selected = new Set();
let blobUrl = null;
let category = 'all';
let genre = 'all';
let compatibility = 'all';
let query = '';

function lang() {
  const value = safeGet('caseycz-language') || document.documentElement.lang || 'en';
  return copy[value] ? value : 'en';
}
function tr(key) { return copy[lang()][key] || copy.en[key] || key; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function getStatus(id) { return status?.sources?.[id] || {}; }
function allCandidates() { return registry.filter(source => getStatus(source.id).online === true && getStatus(source.id).mixTest !== 'fail'); }
function autoCompatibleIds() { return new Set(status?.mixes?.autoCompatibleSourceIDs || []); }
function hostedIds() { return new Set(status?.mixes?.mergeableSourceIDs || []); }

function matchesCategory(source) {
  if (category === 'all') return true;
  if (category === 'official') return source.official === true;
  if (category === 'trusted') return source.trusted === true;
  if (category === 'community') return source.official !== true;
  if (category === 'modified') return source.modified === true;
  return true;
}
function matchesGenre(source) {
  if (genre === 'all') return true;
  const tags = (source.tags || []).map(tag => String(tag).toLowerCase());
  return (GENRE_RULES[genre] || []).some(rule => tags.includes(rule));
}
function matchesCompatibility(source) {
  if (compatibility === 'all') return true;
  const test = getStatus(source.id).mixTest;
  return compatibility === 'pass' ? test === 'pass' : test !== 'pass';
}
function matchesQuery(source) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [source.name, source.mode, ...(source.tags || []), source.description?.en, source.description?.cs]
    .filter(Boolean).join(' ').toLowerCase().includes(q);
}
function candidates() {
  return allCandidates().filter(source => matchesCategory(source) && matchesGenre(source) && matchesCompatibility(source) && matchesQuery(source));
}

function restoreSettings() {
  try {
    const data = JSON.parse(safeGet(STORAGE.selection) || '[]');
    if (Array.isArray(data)) selected = new Set(data.map(String));
  } catch (_) { selected = new Set(); }
  const savedCategory = safeGet(STORAGE.category);
  const savedGenre = safeGet(STORAGE.genre);
  const savedCompatibility = safeGet(STORAGE.compatibility);
  category = SOURCE_CATEGORIES.has(savedCategory) ? savedCategory : 'all';
  genre = GENRES.has(savedGenre) ? savedGenre : 'all';
  compatibility = COMPATIBILITY.has(savedCompatibility) ? savedCompatibility : 'all';
  query = safeGet(STORAGE.query) || '';
}
function saveSelection() { safeSet(STORAGE.selection, JSON.stringify([...selected])); }
function saveFilters() {
  safeSet(STORAGE.category, category);
  safeSet(STORAGE.genre, genre);
  safeSet(STORAGE.compatibility, compatibility);
  safeSet(STORAGE.query, query);
}

function setupUnifiedLayout() {
  const section = $('#builder');
  const host = $('#experimentalMixLab');
  if (!section || !host) return;

  // Remove the old limited Classic-only Builder so there is one list only.
  section.querySelector(':scope > .builder')?.remove();
  const sectionHead = section.querySelector(':scope > .section-head');
  if (sectionHead) {
    sectionHead.querySelector('h2').textContent = tr('title');
    const desc = sectionHead.querySelector('p');
    if (desc) desc.textContent = tr('desc');
    sectionHead.querySelector('.section-tools')?.remove();
  }

  host.style.marginTop = '0';
  const internalHead = host.querySelector(':scope > .section-head');
  if (internalHead) {
    const textBlock = internalHead.querySelector(':scope > div:first-child');
    if (textBlock) textBlock.style.display = 'none';
    internalHead.style.justifyContent = 'flex-end';
  }

  const statusPill = $('#expSelectedCount')?.parentElement?.querySelector('.pill');
  if (statusPill) statusPill.textContent = tr('autoTested');

  // Old source-card Mix checkboxes belonged to the removed Classic-only Builder.
  if (!$('#unifiedBuilderStyle')) {
    const style = document.createElement('style');
    style.id = 'unifiedBuilderStyle';
    style.textContent = '.select-source{display:none!important}';
    document.head.appendChild(style);
  }

  const filters = host.querySelector('.catalog-filters');
  if (filters && !$('#mixCompatibilityFilters')) {
    const group = document.createElement('div');
    group.className = 'filter-group';
    group.id = 'mixCompatibilityFilters';
    group.innerHTML = `
      <div class="filter-label" id="mixStatusLabel">${escapeHtml(tr('mixStatus'))}</div>
      <div class="filter-tabs">
        <button class="filter active" type="button" data-exp-compat-filter="all">${escapeHtml(tr('statusAll'))}</button>
        <button class="filter" type="button" data-exp-compat-filter="pass">${escapeHtml(tr('statusPass'))}</button>
        <button class="filter" type="button" data-exp-compat-filter="try">${escapeHtml(tr('statusTry'))}</button>
      </div>`;
    const search = $('#expSourceSearch');
    filters.insertBefore(group, search || null);
  }
}

function applyCopy() {
  const map = {
    expSelectCompatible:'selectPass', expSelectAll:'selectAll', expClear:'clear', expBuild:'build'
  };
  Object.entries(map).forEach(([id,key]) => { const node = $('#' + id); if (node) node.textContent = tr(key); });

  const section = $('#builder');
  if (section) {
    const h2 = section.querySelector(':scope > .section-head h2');
    const desc = section.querySelector(':scope > .section-head p');
    if (h2) h2.textContent = tr('title');
    if (desc) desc.textContent = tr('desc');
  }
  const label = $('#mixStatusLabel');
  if (label) label.textContent = tr('mixStatus');
  const statusLabels = {all:'statusAll', pass:'statusPass', try:'statusTry'};
  $$('[data-exp-compat-filter]').forEach(button => { button.textContent = tr(statusLabels[button.dataset.expCompatFilter] || 'statusAll'); });
  const statusPill = $('#expSelectedCount')?.parentElement?.querySelector('.pill');
  if (statusPill) statusPill.textContent = tr('autoTested');
}
function syncFilterUi() {
  $$('[data-exp-category-filter]').forEach(button => button.classList.toggle('active', button.dataset.expCategoryFilter === category));
  $$('[data-exp-genre-filter]').forEach(button => button.classList.toggle('active', button.dataset.expGenreFilter === genre));
  $$('[data-exp-compat-filter]').forEach(button => button.classList.toggle('active', button.dataset.expCompatFilter === compatibility));
  const search = $('#expSourceSearch');
  if (search && search.value !== query) search.value = query;
}

function render() {
  setupUnifiedLayout();
  applyCopy();
  syncFilterUi();
  const list = $('#experimentalBuilderList');
  if (!list) return;
  const available = candidates();
  const allAvailableIds = new Set(allCandidates().map(source => source.id));
  [...selected].forEach(id => { if (!allAvailableIds.has(id)) selected.delete(id); });
  saveSelection();

  if (!available.length) {
    list.innerHTML = `<div class="notice">${escapeHtml(tr('empty'))}</div>`;
  } else {
    list.innerHTML = available.map(source => {
      const item = getStatus(source.id);
      const checked = selected.has(source.id);
      const test = item.mixTest === 'pass' ? tr('pass') : tr('experimental');
      const cls = item.mixTest === 'pass' ? 'online' : 'mode';
      return `<label class="builder-item" title="${escapeHtml(item.mixReason || '')}">
        <input type="checkbox" data-exp-source="${escapeHtml(source.id)}" ${checked ? 'checked' : ''}>
        <div><strong>${escapeHtml(source.name)}</strong><span>${escapeHtml(source.mode === 'pal' ? 'AltStore PAL' : source.mode === 'sidestore' ? 'SideStore' : 'AltStore Classic')}</span></div>
        <div class="builder-count"><span class="pill ${cls}">${escapeHtml(test)}</span> ${Number.isFinite(item.appCount) ? `${item.appCount} ${escapeHtml(tr('apps'))}` : ''}</div>
      </label>`;
    }).join('');
  }

  const count = $('#expSelectedCount');
  if (count) count.textContent = `${selected.size} ${tr('selected')} · ${available.length} ${tr('shown')}`;
  const build = $('#expBuild');
  if (build) build.disabled = selected.size === 0;

  // The hero stat now reflects every source that passed the automatic Mix test,
  // not only the old manually marked Classic list.
  const statMix = $('#statMix');
  if (statMix && status?.mixes?.autoCompatibleSourceIDs) statMix.textContent = String(status.mixes.autoCompatibleSourceIDs.length);
}

function parseDate(value) {
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}
function appDate(app) {
  let best = Math.max(parseDate(app.versionDate), parseDate(app.date));
  if (Array.isArray(app.versions)) {
    app.versions.forEach(v => { if (v && typeof v === 'object') best = Math.max(best, parseDate(v.date), parseDate(v.versionDate)); });
  }
  return best;
}
function dedupe(payloads) {
  const merged = new Map();
  let conflicts = 0;
  for (const {source,payload} of payloads) {
    for (const app of (Array.isArray(payload.apps) ? payload.apps : [])) {
      if (!app || typeof app !== 'object') continue;
      const bundle = app.bundleIdentifier || app.bundleID;
      if (!bundle) continue;
      if (!merged.has(bundle)) {
        merged.set(bundle, {source, app});
      } else {
        conflicts += 1;
        const old = merged.get(bundle);
        if (appDate(app) > appDate(old.app)) merged.set(bundle, {source, app});
      }
    }
  }
  const apps = [...merged.values()].map(item => item.app).sort((a,b) => String(a.name || '').localeCompare(String(b.name || '')));
  return {apps, conflicts};
}
function hashIds(ids) {
  let hash = 2166136261;
  for (const ch of ids.join('|')) { hash ^= ch.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return (hash >>> 0).toString(16).padStart(8,'0');
}
function hostedUrl(ids) {
  const sorted = [...ids].sort();
  const normal = hostedIds();
  const max = Number(status?.mixes?.maxSourcesPerMix || 0);
  if (sorted.length && sorted.length <= max && sorted.every(id => normal.has(id))) {
    return new URL(`mix/${sorted.join('--')}.json`, window.location.href).href.split('#')[0];
  }
  const auto = [...autoCompatibleIds()].sort();
  if (auto.length && sorted.length === auto.length && sorted.every((id,index) => id === auto[index])) {
    return status?.mixes?.allCompatibleURL || null;
  }
  return null;
}

async function buildMix() {
  const button = $('#expBuild');
  const message = $('#expMessage');
  const result = $('#expResult');
  if (!selected.size) return;
  if (button) button.disabled = true;
  if (message) message.textContent = tr('building');
  result?.classList.remove('show');

  try {
    const ids = [...selected].sort();
    const payloads = await Promise.all(ids.map(async id => {
      const source = registry.find(item => item.id === id);
      const response = await fetch(`data/source-cache/${encodeURIComponent(id)}.json`, {cache:'no-store'});
      if (!response.ok) throw new Error(`${source?.name || id}: HTTP ${response.status}`);
      const payload = await response.json();
      if (!payload || !Array.isArray(payload.apps)) throw new Error(`${source?.name || id}: invalid apps array`);
      return {source, payload};
    }));

    const {apps, conflicts} = dedupe(payloads);
    if (!apps.length) throw new Error('No mergeable app entries were found.');
    const url = hostedUrl(ids);
    const names = ids.map(id => registry.find(source => source.id === id)?.name || id);
    const hasTry = ids.some(id => getStatus(id).mixTest !== 'pass');
    const mix = {
      name: `CaseyCZ Mix · ${names.join(' + ')}`,
      identifier: `com.caseycz.ios.mix.${hashIds(ids)}`,
      subtitle: hasTry ? 'Experimental combined source generated locally by CaseyCZ iOS Hub' : 'Combined source generated by CaseyCZ iOS Hub',
      website: 'https://caseycz.github.io/iOS-Hub/',
      tintColor: '#38BDF8',
      apps,
      userInfo: {sourceIDs: ids, sourceURLs: ids.map(id => registry.find(source => source.id === id)?.url || ''), experimental: hasTry}
    };

    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = URL.createObjectURL(new Blob([JSON.stringify(mix, null, 2) + '\n'], {type:'application/json'}));

    $('#expResultTitle').textContent = url ? tr('hosted') : tr('local');
    $('#expResultInfo').textContent = `${apps.length} ${tr('apps')} · ${conflicts} ${tr('conflicts')}`;
    $('#expResultNote').textContent = url ? '' : tr('localNote');
    $('#expDownload').href = blobUrl;
    $('#expDownload').download = `CaseyCZ-Mix-${hashIds(ids)}.json`;
    $('#expPreview').href = blobUrl;

    const add = $('#expAdd');
    const copyButton = $('#expCopyUrl');
    if (url) {
      add.hidden = false;
      add.href = `altstore://source?url=${encodeURIComponent(url)}`;
      add.textContent = tr('add');
      copyButton.hidden = false;
      copyButton.dataset.url = url;
      copyButton.textContent = tr('copyUrl');
    } else {
      add.hidden = true;
      copyButton.hidden = true;
      delete copyButton.dataset.url;
    }
    $('#expDownload').textContent = tr('download');
    $('#expPreview').textContent = tr('preview');
    if (message) message.textContent = '';
    result?.classList.add('show');
  } catch (error) {
    console.error(error);
    if (message) message.textContent = `${tr('failed')} ${error.message || error}`;
  } finally {
    if (button) button.disabled = selected.size === 0;
  }
}

async function init() {
  const host = $('#experimentalMixLab');
  if (!host) return;
  restoreSettings();
  setupUnifiedLayout();
  try {
    const [registryResponse, statusResponse] = await Promise.all([
      fetch('sources/registry.json', {cache:'no-store'}),
      fetch('data/status.json', {cache:'no-store'})
    ]);
    const registryData = await registryResponse.json();
    registry = registryData.sources || [];
    status = await statusResponse.json();
  } catch (error) {
    console.error(error);
  }
  render();

  $('#expSelectCompatible')?.addEventListener('click', () => {
    selected = new Set(candidates().filter(source => getStatus(source.id).mixTest === 'pass').map(source => source.id));
    saveSelection(); render();
  });
  $('#expSelectAll')?.addEventListener('click', () => {
    selected = new Set(candidates().map(source => source.id));
    saveSelection(); render();
  });
  $('#expClear')?.addEventListener('click', () => {
    selected.clear(); saveSelection(); render(); $('#expResult')?.classList.remove('show');
  });
  $('#expBuild')?.addEventListener('click', buildMix);
  $('#experimentalBuilderList')?.addEventListener('change', event => {
    const id = event.target?.dataset?.expSource;
    if (!id) return;
    if (event.target.checked) selected.add(id); else selected.delete(id);
    saveSelection(); render();
  });
  $$('[data-exp-category-filter]').forEach(button => button.addEventListener('click', () => {
    category = SOURCE_CATEGORIES.has(button.dataset.expCategoryFilter) ? button.dataset.expCategoryFilter : 'all';
    saveFilters(); render();
  }));
  $$('[data-exp-genre-filter]').forEach(button => button.addEventListener('click', () => {
    genre = GENRES.has(button.dataset.expGenreFilter) ? button.dataset.expGenreFilter : 'all';
    saveFilters(); render();
  }));
  $$('[data-exp-compat-filter]').forEach(button => button.addEventListener('click', () => {
    compatibility = COMPATIBILITY.has(button.dataset.expCompatFilter) ? button.dataset.expCompatFilter : 'all';
    saveFilters(); render();
  }));
  $('#expSourceSearch')?.addEventListener('input', event => {
    query = event.target.value || '';
    saveFilters(); render();
  });
  $('#expCopyUrl')?.addEventListener('click', async event => {
    const url = event.currentTarget.dataset.url;
    if (!url) return;
    try { await navigator.clipboard.writeText(url); } catch (_) {}
    event.currentTarget.textContent = tr('copied');
    setTimeout(() => { event.currentTarget.textContent = tr('copyUrl'); }, 1600);
  });
  $('#languageSelect')?.addEventListener('change', () => setTimeout(render, 0));
}

init();