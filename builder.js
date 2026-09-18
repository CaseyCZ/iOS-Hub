const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

const STORAGE = {
  selection: 'ioshub-mix-selection',
  category: 'ioshub-mix-category',
  genre: 'ioshub-mix-genre',
  platform: 'ioshub-mix-platform',
  compatibility: 'ioshub-mix-compatibility',
  query: 'ioshub-mix-query'
};

const SOURCE_CATEGORIES = new Set(['all', 'official', 'trusted', 'community', 'modified']);
const GENRES = new Set(['all', 'games', 'emulators', 'video', 'music', 'anime', 'social', 'downloads', 'sideload', 'utilities']);
const PLATFORMS = new Set(['all', 'classic', 'pal', 'sidestore', 'livecontainer']);
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
    title:'Custom Source Builder', desc:'Filter checked online sources, select any combination and build your own CaseyCZ Mix for AltStore, SideStore or LiveContainer.',
    selectPass:'Select compatible', selectAll:'Select all shown', clear:'Clear selection', build:'Build CaseyCZ Mix', selected:'selected', shown:'shown', pass:'PASS', try:'TRY',
    mixStatus:'Mix status', statusAll:'All', statusPass:'PASS only', statusTry:'TRY only', platform:'Platform', platformAll:'All', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Auto tested',
    altPackage:'CaseyCZ AltStore Source', sidePackage:'CaseyCZ SideStore Source', livePackage:'CaseyCZ LiveContainer Source', customMix:'Custom Mix', filters:'⚙ Filters · 🔎 Search · ☑ Selection',
    addAlt:'＋ Add to AltStore', addSide:'＋ Add to SideStore', addLive:'＋ Add to LiveContainer', copyUrl:'Copy URL', json:'JSON ↗', apps:'apps', sources:'sources',
    hosted:'Hosted Mix ready', local:'Local Mix ready', experimental:'Experimental Mix ready', localNote:'This PASS combination is valid but is not pre-hosted. Download the JSON to inspect or host it; direct Add requires a public source URL.', tryNote:'This Mix contains one or more TRY sources. Download and test the JSON first; PAL or installer-specific metadata may not work after merging.',
    conflicts:'duplicates resolved', download:'Download JSON', preview:'Preview JSON', building:'Testing and combining sources…', failed:'The selected Mix could not be built.', copied:'Source URL copied.', empty:'No sources match the current filters.'
  },
  cs: {
    title:'Custom Source Builder', desc:'Filtruj kontrolované online zdroje, vyber libovolnou kombinaci a vytvoř vlastní CaseyCZ Mix pro AltStore, SideStore nebo LiveContainer.',
    selectPass:'Vybrat kompatibilní', selectAll:'Vybrat vše zobrazené', clear:'Zrušit výběr', build:'Vytvořit CaseyCZ Mix', selected:'vybráno', shown:'zobrazeno', pass:'PASS', try:'ZKUSIT',
    mixStatus:'Stav Mixu', statusAll:'Vše', statusPass:'Jen PASS', statusTry:'Jen ZKUSIT', platform:'Platforma', platformAll:'Vše', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Automaticky testováno',
    altPackage:'CaseyCZ AltStore Source', sidePackage:'CaseyCZ SideStore Source', livePackage:'CaseyCZ LiveContainer Source', customMix:'Vlastní Mix', filters:'⚙ Filtry · 🔎 Hledání · ☑ Výběr',
    addAlt:'＋ Přidat do AltStore', addSide:'＋ Přidat do SideStore', addLive:'＋ Přidat do LiveContainer', copyUrl:'Kopírovat URL', json:'JSON ↗', apps:'aplikací', sources:'zdrojů',
    hosted:'Veřejný Mix je připraven', local:'Lokální Mix je připraven', experimental:'Experimentální Mix je připraven', localNote:'Tato PASS kombinace je validní, ale není předem hostovaná. JSON můžeš stáhnout nebo hostovat; přímé přidání vyžaduje veřejnou URL.', tryNote:'Tento Mix obsahuje jeden nebo více zdrojů ZKUSIT. JSON nejdřív stáhni a otestuj; PAL nebo installer-specifická metadata se po sloučení nemusí chovat stejně.',
    conflicts:'duplicit vyřešeno', download:'Stáhnout JSON', preview:'Náhled JSON', building:'Testuji a spojuji zdroje…', failed:'Vybraný Mix se nepodařilo vytvořit.', copied:'URL zdroje zkopírována.', empty:'Aktuálním filtrům neodpovídá žádný zdroj.'
  },
  de: {
    title:'Custom Source Builder', desc:'Filtere geprüfte Online-Quellen, wähle eine beliebige Kombination und erstelle deinen eigenen CaseyCZ Mix für AltStore, SideStore oder LiveContainer.',
    selectPass:'Kompatible wählen', selectAll:'Alle sichtbaren wählen', clear:'Auswahl löschen', build:'CaseyCZ Mix erstellen', selected:'ausgewählt', shown:'sichtbar', pass:'PASS', try:'TEST',
    mixStatus:'Mix-Status', statusAll:'Alle', statusPass:'Nur PASS', statusTry:'Nur TEST', platform:'Plattform', platformAll:'Alle', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Automatisch geprüft',
    altPackage:'CaseyCZ AltStore Source', sidePackage:'CaseyCZ SideStore Source', livePackage:'CaseyCZ LiveContainer Source', customMix:'Eigener Mix', filters:'⚙ Filter · 🔎 Suche · ☑ Auswahl',
    addAlt:'＋ Zu AltStore', addSide:'＋ Zu SideStore', addLive:'＋ Zu LiveContainer', copyUrl:'URL kopieren', json:'JSON ↗', apps:'Apps', sources:'Quellen',
    hosted:'Gehosteter Mix bereit', local:'Lokaler Mix bereit', experimental:'Experimenteller Mix bereit', localNote:'Diese PASS-Kombination ist gültig, aber nicht vorab gehostet. Für direktes Hinzufügen ist eine öffentliche URL nötig.', tryNote:'Dieser Mix enthält TEST-Quellen. Lade die JSON-Datei herunter und teste sie zuerst.', conflicts:'Duplikate gelöst', download:'JSON laden', preview:'JSON ansehen', building:'Quellen werden getestet…', failed:'Der ausgewählte Mix konnte nicht erstellt werden.', copied:'URL kopiert.', empty:'Keine Quellen entsprechen den Filtern.'
  },
  es: {
    title:'Custom Source Builder', desc:'Filtra fuentes online comprobadas, elige cualquier combinación y crea tu propio CaseyCZ Mix para AltStore, SideStore o LiveContainer.',
    selectPass:'Seleccionar compatibles', selectAll:'Seleccionar visibles', clear:'Borrar selección', build:'Crear CaseyCZ Mix', selected:'seleccionadas', shown:'visibles', pass:'PASS', try:'PROBAR',
    mixStatus:'Estado del Mix', statusAll:'Todo', statusPass:'Solo PASS', statusTry:'Solo PROBAR', platform:'Plataforma', platformAll:'Todo', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Prueba automática',
    altPackage:'CaseyCZ AltStore Source', sidePackage:'CaseyCZ SideStore Source', livePackage:'CaseyCZ LiveContainer Source', customMix:'Mix personalizado', filters:'⚙ Filtros · 🔎 Búsqueda · ☑ Selección',
    addAlt:'＋ Añadir a AltStore', addSide:'＋ Añadir a SideStore', addLive:'＋ Añadir a LiveContainer', copyUrl:'Copiar URL', json:'JSON ↗', apps:'apps', sources:'fuentes',
    hosted:'Mix alojado listo', local:'Mix local listo', experimental:'Mix experimental listo', localNote:'Esta combinación PASS es válida pero no está alojada. Añadir directamente requiere una URL pública.', tryNote:'Este Mix contiene fuentes PROBAR. Descarga y prueba primero el JSON.', conflicts:'duplicados resueltos', download:'Descargar JSON', preview:'Ver JSON', building:'Probando fuentes…', failed:'No se pudo crear el Mix.', copied:'URL copiada.', empty:'Ninguna fuente coincide con los filtros.'
  },
  fr: {
    title:'Custom Source Builder', desc:'Filtrez les sources en ligne vérifiées, choisissez n’importe quelle combinaison et créez votre propre CaseyCZ Mix pour AltStore, SideStore ou LiveContainer.',
    selectPass:'Sélectionner compatibles', selectAll:'Tout sélectionner affiché', clear:'Effacer la sélection', build:'Créer CaseyCZ Mix', selected:'sélectionnées', shown:'affichées', pass:'PASS', try:'TEST',
    mixStatus:'Statut du Mix', statusAll:'Tout', statusPass:'PASS seulement', statusTry:'TEST seulement', platform:'Plateforme', platformAll:'Tout', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Test automatique',
    altPackage:'CaseyCZ AltStore Source', sidePackage:'CaseyCZ SideStore Source', livePackage:'CaseyCZ LiveContainer Source', customMix:'Mix personnalisé', filters:'⚙ Filtres · 🔎 Recherche · ☑ Sélection',
    addAlt:'＋ Ajouter à AltStore', addSide:'＋ Ajouter à SideStore', addLive:'＋ Ajouter à LiveContainer', copyUrl:'Copier URL', json:'JSON ↗', apps:'apps', sources:'sources',
    hosted:'Mix hébergé prêt', local:'Mix local prêt', experimental:'Mix expérimental prêt', localNote:'Cette combinaison PASS est valide mais non hébergée. L’ajout direct nécessite une URL publique.', tryNote:'Ce Mix contient des sources TEST. Téléchargez et testez d’abord le JSON.', conflicts:'doublons résolus', download:'Télécharger JSON', preview:'Aperçu JSON', building:'Test des sources…', failed:'Impossible de créer le Mix.', copied:'URL copiée.', empty:'Aucune source ne correspond aux filtres.'
  }
};

let registry = [];
let status = {};
let catalog = {};
let selected = new Set();
let blobUrl = null;
let category = 'all';
let genre = 'all';
let platform = 'all';
let compatibility = 'all';
let query = '';

function lang() {
  const value = safeGet('caseycz-language') || document.documentElement.lang || 'en';
  return copy[value] ? value : 'en';
}
function tr(key) { return copy[lang()][key] || copy.en[key] || key; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
const INSTALLER_ICONS = {
  alt: 'https://2606795771-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FAfe8qEztjcTjsjjaMBY2%2Fuploads%2FQGRbFk9rdQ37ddG4uK5S%2FAltStoreIcon_Rounded.png?alt=media&token=1dd5cf66-df1e-4a07-8e8a-1039c4f22ff9',
  side: 'https://sidestore.io/assets/icon.png',
  live: 'https://raw.githubusercontent.com/LiveContainer/LiveContainer/main/screenshots/AppIcon1024.png'
};
function installerIcon(type) {
  const src = INSTALLER_ICONS[type];
  return src ? `<img class="installer-icon" src="${escapeHtml(src)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : '';
}
function getStatus(id) { return status?.sources?.[id] || {}; }
function catalogSource(id) { return catalog?.sources?.find(item => item.id === id) || null; }
function allCandidates() { return registry.filter(source => getStatus(source.id).online === true && getStatus(source.id).mixTest !== 'fail'); }
function autoCompatibleIds() { return new Set(status?.mixes?.autoCompatibleSourceIDs || []); }
function hostedIds() { return new Set(status?.mixes?.mergeableSourceIDs || []); }

function sourceTags(source) {
  return new Set((source.tags || []).map(tag => String(tag).toLowerCase()));
}
function isCommunitySource(source) {
  const tags = sourceTags(source);
  return source.community === true || source.official !== true || tags.has('community');
}
function isModifiedSource(source) {
  const tags = sourceTags(source);
  return source.modified === true || ['modified','mods','modded','tweak','tweaks'].some(tag => tags.has(tag));
}
function matchesCategory(source) {
  if (category === 'all') return true;
  if (category === 'official') return source.official === true;
  if (category === 'trusted') return source.trusted === true;
  if (category === 'community') return isCommunitySource(source);
  if (category === 'modified') return isModifiedSource(source);
  return true;
}
function matchesGenre(source) {
  if (genre === 'all') return true;
  const tags = [...sourceTags(source)];
  return (GENRE_RULES[genre] || []).some(rule => tags.includes(rule));
}
function matchesPlatform(source) {
  if (platform === 'all') return true;
  if (platform === 'livecontainer') {
    const ids = status?.altstore?.sourceIDs || status?.mixes?.autoCompatibleSourceIDs || [];
    return ids.includes(source.id);
  }
  return (source.mode || 'classic') === platform;
}
function matchesCompatibility(source) {
  if (compatibility === 'all') return true;
  const test = getStatus(source.id).mixTest;
  return compatibility === 'pass' ? test === 'pass' : test !== 'pass';
}
function sourceSearchText(source) {
  const apps = (catalogSource(source.id)?.apps || []).flatMap(app => [
    app.name, app.developerName, app.bundleIdentifier, app.subtitle, app.version
  ]);
  return [source.name, source.mode, ...(source.tags || []), source.description?.en, source.description?.cs, ...apps]
    .filter(Boolean).join(' ').toLowerCase();
}
function matchesQuery(source) {
  const q = query.trim().toLowerCase();
  return !q || sourceSearchText(source).includes(q);
}
function candidates() {
  return allCandidates().filter(source => matchesCategory(source) && matchesGenre(source) && matchesPlatform(source) && matchesCompatibility(source) && matchesQuery(source));
}

function restoreSettings() {
  try {
    const data = JSON.parse(safeGet(STORAGE.selection) || '[]');
    if (Array.isArray(data)) selected = new Set(data.map(String));
  } catch (_) { selected = new Set(); }
  const savedCategory = safeGet(STORAGE.category);
  const savedGenre = safeGet(STORAGE.genre);
  const savedPlatform = safeGet(STORAGE.platform);
  const savedCompatibility = safeGet(STORAGE.compatibility);
  category = SOURCE_CATEGORIES.has(savedCategory) ? savedCategory : 'all';
  genre = GENRES.has(savedGenre) ? savedGenre : 'all';
  platform = PLATFORMS.has(savedPlatform) ? savedPlatform : 'all';
  compatibility = COMPATIBILITY.has(savedCompatibility) ? savedCompatibility : 'all';
  query = safeGet(STORAGE.query) || '';
}
function saveSelection() { safeSet(STORAGE.selection, JSON.stringify([...selected])); }
function saveFilters() {
  safeSet(STORAGE.category, category);
  safeSet(STORAGE.genre, genre);
  safeSet(STORAGE.platform, platform);
  safeSet(STORAGE.compatibility, compatibility);
  safeSet(STORAGE.query, query);
}
function hideResult() { $('#expResult')?.classList.remove('show'); }

function applyCopy() {
  const map = {expSelectCompatible:'selectPass', expSelectAll:'selectAll', expClear:'clear', expBuild:'build'};
  Object.entries(map).forEach(([id,key]) => { const node = $('#' + id); if (node) node.textContent = tr(key); });
  if ($('#builderTitle')) $('#builderTitle').textContent = tr('title');
  if ($('#builderDesc')) $('#builderDesc').textContent = tr('desc');
  if ($('#customMixCardTitle')) $('#customMixCardTitle').textContent = tr('customMix');
  if ($('#customMixFiltersLabel')) $('#customMixFiltersLabel').textContent = tr('filters');
  if ($('#mixPlatformLabel')) $('#mixPlatformLabel').textContent = tr('platform');
  if ($('#mixStatusLabel')) $('#mixStatusLabel').textContent = tr('mixStatus');
  if ($('#mixTestBadge')) $('#mixTestBadge').textContent = tr('autoTested');

  const platformLabels = {all:'platformAll', classic:'classic', pal:'pal', sidestore:'sidestore', livecontainer:'livecontainer'};
  $$('[data-exp-platform-filter]').forEach(button => { button.textContent = tr(platformLabels[button.dataset.expPlatformFilter] || 'platformAll'); });
  const statusLabels = {all:'statusAll', pass:'statusPass', try:'statusTry'};
  $$('[data-exp-compat-filter]').forEach(button => { button.textContent = tr(statusLabels[button.dataset.expCompatFilter] || 'statusAll'); });
}

function syncFilterUi() {
  $$('[data-exp-category-filter]').forEach(button => button.classList.toggle('active', button.dataset.expCategoryFilter === category));
  $$('[data-exp-genre-filter]').forEach(button => button.classList.toggle('active', button.dataset.expGenreFilter === genre));
  $$('[data-exp-platform-filter]').forEach(button => button.classList.toggle('active', button.dataset.expPlatformFilter === platform));
  $$('[data-exp-compat-filter]').forEach(button => button.classList.toggle('active', button.dataset.expCompatFilter === compatibility));
  const search = $('#expSourceSearch');
  if (search && search.value !== query) search.value = query;
}

function packageCard(name, url, meta, type) {
  if (!url) return '';
  let install = `altstore://source?url=${encodeURIComponent(url)}`;
  let addLabel = tr('addAlt');
  let badge = 'AltStore';
  if (type === 'side') {
    install = `sidestore://source?url=${encodeURIComponent(url)}`;
    addLabel = tr('addSide');
    badge = 'SideStore';
  } else if (type === 'live') {
    install = `livecontainer://sources?url=${encodeURIComponent(url)}`;
    addLabel = tr('addLive');
    badge = 'LiveContainer';
  }
  return `<article class="official-source-card">
    <span class="pill mode service-pill">${installerIcon(type)}${badge}</span>
    <h4>${escapeHtml(name)}</h4>
    <div class="muted">${escapeHtml(meta)}</div>
    <div class="official-source-actions">
      <a class="btn small primary installer-action" href="${escapeHtml(install)}">${installerIcon(type)}${escapeHtml(addLabel)}</a>
      <button class="btn small secondary" type="button" data-copy-source="${escapeHtml(url)}">${escapeHtml(tr('copyUrl'))}</button>
      <a class="btn small ghost" target="_blank" rel="noopener" href="${escapeHtml(url)}">${escapeHtml(tr('json'))}</a>
    </div>
  </article>`;
}

function renderOfficialPackages() {
  const node = $('#officialSourcePackages');
  if (!node) return;
  const altUrl = status?.altstore?.sourceURL || status?.mixes?.allCompatibleURL || '';
  const altSources = status?.altstore?.sourceIDs?.length || status?.mixes?.autoCompatibleSourceIDs?.length || 0;
  const altApps = status?.altstore?.appCount || 0;
  const sideUrl = status?.sidestore?.sourceURL || '';
  const sideSources = status?.sidestore?.sourceIDs?.length || 0;
  const sideApps = status?.sidestore?.appCount || 0;
  const altMeta = altApps ? `${altSources} ${tr('sources')} · ${altApps} ${tr('apps')}` : `${altSources} ${tr('sources')}`;
  const sideMeta = `${sideSources} ${tr('sources')} · ${sideApps} ${tr('apps')}`;
  node.innerHTML = [
    packageCard(tr('altPackage'), altUrl, altMeta, 'alt'),
    packageCard(tr('sidePackage'), sideUrl, sideMeta, 'side'),
    packageCard(tr('livePackage'), altUrl, altMeta, 'live')
  ].join('');
}

function modeName(source) {
  return source.mode === 'pal' ? 'AltStore PAL' : source.mode === 'sidestore' ? 'SideStore' : 'AltStore Classic';
}

function render() {
  applyCopy();
  syncFilterUi();
  renderOfficialPackages();
  const list = $('#experimentalBuilderList');
  if (!list) return;

  const available = candidates();
  const validIds = new Set(allCandidates().map(source => source.id));
  [...selected].forEach(id => { if (!validIds.has(id)) selected.delete(id); });
  saveSelection();

  list.innerHTML = available.length ? available.map(source => {
    const item = getStatus(source.id);
    const checked = selected.has(source.id);
    const passed = item.mixTest === 'pass';
    const test = passed ? tr('pass') : tr('try');
    const cls = passed ? 'online' : 'mode';
    return `<label class="builder-item" title="${escapeHtml(item.mixReason || '')}">
      <input type="checkbox" data-exp-source="${escapeHtml(source.id)}" ${checked ? 'checked' : ''}>
      <div><strong>${escapeHtml(source.name)}</strong><span>${escapeHtml(modeName(source))}</span></div>
      <div class="builder-count"><span class="pill ${cls}">${escapeHtml(test)}</span> ${Number.isFinite(item.appCount) ? `${item.appCount} ${escapeHtml(tr('apps'))}` : ''}</div>
    </label>`;
  }).join('') : `<div class="notice">${escapeHtml(tr('empty'))}</div>`;

  const count = $('#expSelectedCount');
  if (count) count.textContent = `${selected.size} ${tr('selected')} · ${available.length} ${tr('shown')}`;
  const build = $('#expBuild');
  if (build) build.disabled = selected.size === 0;
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
        merged.set(bundle, {source,app});
      } else {
        conflicts += 1;
        const old = merged.get(bundle);
        if (appDate(app) > appDate(old.app)) merged.set(bundle, {source,app});
      }
    }
  }
  return {
    apps:[...merged.values()].map(item => item.app).sort((a,b) => String(a.name || '').localeCompare(String(b.name || ''))),
    conflicts
  };
}
function hashIds(ids) {
  let hash = 2166136261;
  for (const ch of ids.join('|')) { hash ^= ch.charCodeAt(0); hash = Math.imul(hash,16777619); }
  return (hash >>> 0).toString(16).padStart(8,'0');
}
function sameIds(ids, expected) {
  const a = [...ids].sort();
  const b = [...expected].sort();
  return a.length === b.length && a.every((id,i) => id === b[i]);
}

function hostedTarget(ids) {
  const sorted = [...ids].sort();
  const manual = hostedIds();
  const max = Number(status?.mixes?.maxSourcesPerMix || 0);
  if (sorted.length && sorted.length <= max && sorted.every(id => manual.has(id))) {
    return {url:new URL(`mix/${sorted.join('--')}.json`, window.location.href).href.split('#')[0], alt:true, side:true, live:true};
  }

  const auto = [...autoCompatibleIds()];
  if (auto.length && sameIds(sorted, auto)) {
    return {url:status?.mixes?.allCompatibleURL || null, alt:true, side:true, live:true};
  }

  const altIds = status?.altstore?.sourceIDs || [];
  if (altIds.length && sameIds(sorted, altIds)) {
    return {url:status?.altstore?.sourceURL || null, alt:true, side:true, live:true};
  }

  const sideIds = status?.sidestore?.sourceIDs || [];
  if (sideIds.length && sameIds(sorted, sideIds)) {
    return {url:status?.sidestore?.sourceURL || null, alt:false, side:true, live:true};
  }

  return {url:null, alt:false, side:false, live:false};
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
      return {source,payload};
    }));

    const {apps,conflicts} = dedupe(payloads);
    if (!apps.length) throw new Error('No mergeable app entries were found.');

    const target = hostedTarget(ids);
    const names = ids.map(id => registry.find(source => source.id === id)?.name || id);
    const hasTry = ids.some(id => getStatus(id).mixTest !== 'pass');
    const mix = {
      name:`CaseyCZ Mix · ${names.join(' + ')}`,
      identifier:`com.caseycz.ios.mix.${hashIds(ids)}`,
      subtitle:hasTry ? 'Experimental combined source generated locally by CaseyCZ iOS Hub' : 'Combined source generated by CaseyCZ iOS Hub',
      website:'https://caseycz.github.io/iOS-Hub/',
      tintColor:'#38BDF8',
      apps,
      userInfo:{sourceIDs:ids, sourceURLs:ids.map(id => registry.find(source => source.id === id)?.url || ''), experimental:hasTry}
    };

    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = URL.createObjectURL(new Blob([JSON.stringify(mix,null,2) + '\n'], {type:'application/json'}));

    $('#expResultTitle').textContent = target.url ? tr('hosted') : (hasTry ? tr('experimental') : tr('local'));
    $('#expResultInfo').textContent = `${apps.length} ${tr('apps')} · ${conflicts} ${tr('conflicts')}`;
    $('#expResultNote').textContent = target.url ? '' : (hasTry ? tr('tryNote') : tr('localNote'));
    $('#expDownload').href = blobUrl;
    $('#expDownload').download = `CaseyCZ-Mix-${hashIds(ids)}.json`;
    $('#expDownload').textContent = tr('download');
    $('#expPreview').href = blobUrl;
    $('#expPreview').textContent = tr('preview');

    const alt = $('#expAdd');
    const side = $('#expAddSideStore');
    const live = $('#expAddLiveContainer');
    const copyButton = $('#expCopyUrl');

    if (target.url && target.alt) {
      alt.hidden = false;
      alt.href = `altstore://source?url=${encodeURIComponent(target.url)}`;
      alt.textContent = tr('addAlt');
    } else {
      alt.hidden = true;
    }

    if (target.url && target.side) {
      side.hidden = false;
      side.href = `sidestore://source?url=${encodeURIComponent(target.url)}`;
      side.textContent = tr('addSide');
    } else {
      side.hidden = true;
    }

    if (target.url && target.live) {
      live.hidden = false;
      live.href = `livecontainer://sources?url=${encodeURIComponent(target.url)}`;
      live.textContent = tr('addLive');
    } else {
      live.hidden = true;
    }

    if (target.url) {
      copyButton.hidden = false;
      copyButton.dataset.url = target.url;
      copyButton.textContent = tr('copyUrl');
    } else {
      copyButton.hidden = true;
      delete copyButton.dataset.url;
    }

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

  try {
    const [registryResponse,statusResponse,catalogResponse] = await Promise.all([
      fetch('sources/registry.json',{cache:'no-store'}),
      fetch('data/status.json',{cache:'no-store'}),
      fetch('data/catalog.json',{cache:'no-store'})
    ]);
    registry = (await registryResponse.json()).sources || [];
    status = await statusResponse.json();
    catalog = await catalogResponse.json();
  } catch (error) {
    console.error(error);
  }

  render();

  $('#expSelectCompatible')?.addEventListener('click', () => {
    selected = new Set(candidates().filter(source => getStatus(source.id).mixTest === 'pass').map(source => source.id));
    saveSelection();
    hideResult();
    render();
  });
  $('#expSelectAll')?.addEventListener('click', () => {
    selected = new Set(candidates().map(source => source.id));
    saveSelection();
    hideResult();
    render();
  });
  $('#expClear')?.addEventListener('click', () => {
    selected.clear();
    saveSelection();
    hideResult();
    render();
  });
  $('#expBuild')?.addEventListener('click', buildMix);

  $('#experimentalBuilderList')?.addEventListener('change', event => {
    const id = event.target?.dataset?.expSource;
    if (!id) return;
    if (event.target.checked) selected.add(id); else selected.delete(id);
    saveSelection();
    hideResult();
    render();
  });

  $$('[data-exp-category-filter]').forEach(button => button.addEventListener('click', () => {
    category = SOURCE_CATEGORIES.has(button.dataset.expCategoryFilter) ? button.dataset.expCategoryFilter : 'all';
    saveFilters(); render();
  }));
  $$('[data-exp-genre-filter]').forEach(button => button.addEventListener('click', () => {
    genre = GENRES.has(button.dataset.expGenreFilter) ? button.dataset.expGenreFilter : 'all';
    saveFilters(); render();
  }));
  $$('[data-exp-platform-filter]').forEach(button => button.addEventListener('click', () => {
    platform = PLATFORMS.has(button.dataset.expPlatformFilter) ? button.dataset.expPlatformFilter : 'all';
    saveFilters(); render();
  }));
  $$('[data-exp-compat-filter]').forEach(button => button.addEventListener('click', () => {
    compatibility = COMPATIBILITY.has(button.dataset.expCompatFilter) ? button.dataset.expCompatFilter : 'all';
    saveFilters(); render();
  }));

  $('#expSourceSearch')?.addEventListener('input', event => {
    query = event.target.value || '';
    saveFilters();
    render();
  });

  $('#expCopyUrl')?.addEventListener('click', async event => {
    const url = event.currentTarget.dataset.url;
    if (!url) return;
    try { await navigator.clipboard.writeText(url); } catch (_) {}
    event.currentTarget.textContent = tr('copied');
    setTimeout(() => { event.currentTarget.textContent = tr('copyUrl'); }, 1600);
  });

  $('#languageSelect')?.addEventListener('change', () => setTimeout(render,0));
}

init();
