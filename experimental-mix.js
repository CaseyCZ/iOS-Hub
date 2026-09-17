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
const PLATFORMS = new Set(['all', 'classic', 'pal', 'sidestore']);
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
    title:'Source Builder', desc:'All online sources are in one list. Filter them, select any combination, and the Builder will use the automated Mix test to decide whether it is verified or experimental.',
    selectPass:'Select compatible', selectAll:'Select all shown', clear:'Clear', build:'Build CaseyCZ Mix', selected:'selected', shown:'shown', pass:'PASS', experimental:'TRY',
    mixStatus:'Mix status', statusAll:'All', statusPass:'PASS only', statusTry:'TRY only', platform:'Platform', platformAll:'All', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', autoTested:'Auto tested',
    packages:'Official CaseyCZ sources', packagesDesc:'Ready-to-add sources generated from the latest online checks.', altPackage:'CaseyCZ AltStore Source', sidePackage:'CaseyCZ SideStore Source', addAlt:'＋ Add to AltStore', addSide:'＋ Add to SideStore', copyUrl:'Copy URL', json:'JSON ↗', apps:'apps', sources:'sources',
    hosted:'Hosted Mix ready', local:'Experimental Mix ready', localNote:'This combination is not pre-hosted. Download the JSON to inspect/test it. PAL or SideStore-specific apps may still require their original installer.',
    conflicts:'duplicates resolved', download:'Download JSON', preview:'Preview JSON', building:'Testing and combining sources…', failed:'The selected Mix could not be built.', copied:'Source URL copied.', empty:'No sources match the current filters.'
  },
  cs: {
    title:'Source Builder', desc:'Všechny online zdroje jsou v jednom seznamu. Odfiltruj je, vyber libovolnou kombinaci a Builder podle automatického Mix testu pozná, jestli je výběr ověřený nebo experimentální.',
    selectPass:'Vybrat kompatibilní', selectAll:'Vybrat vše zobrazené', clear:'Zrušit výběr', build:'Vytvořit CaseyCZ Mix', selected:'vybráno', shown:'zobrazeno', pass:'PASS', experimental:'ZKUSIT',
    mixStatus:'Stav Mixu', statusAll:'Vše', statusPass:'Jen PASS', statusTry:'Jen ZKUSIT', platform:'Platforma', platformAll:'Vše', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', autoTested:'Automaticky testováno',
    packages:'Oficiální CaseyCZ zdroje', packagesDesc:'Hotové zdroje generované z poslední online kontroly.', altPackage:'CaseyCZ AltStore Source', sidePackage:'CaseyCZ SideStore Source', addAlt:'＋ Přidat do AltStore', addSide:'＋ Přidat do SideStore', copyUrl:'Kopírovat URL', json:'JSON ↗', apps:'aplikací', sources:'zdrojů',
    hosted:'Veřejný Mix je připraven', local:'Experimentální Mix je připraven', localNote:'Tato kombinace není předem hostovaná. JSON můžeš stáhnout a otestovat. PAL nebo SideStore aplikace mohou stále vyžadovat svůj původní instalátor.',
    conflicts:'duplicit vyřešeno', download:'Stáhnout JSON', preview:'Náhled JSON', building:'Testuji a spojuji zdroje…', failed:'Vybraný Mix se nepodařilo vytvořit.', copied:'URL zdroje zkopírována.', empty:'Aktuálním filtrům neodpovídá žádný zdroj.'
  },
  de: {
    title:'Source Builder', desc:'Alle Online-Quellen befinden sich in einer Liste. Filtere sie und kombiniere beliebige Quellen.', selectPass:'Kompatible wählen', selectAll:'Alle sichtbaren wählen', clear:'Leeren', build:'CaseyCZ Mix erstellen', selected:'ausgewählt', shown:'sichtbar', pass:'PASS', experimental:'TEST',
    mixStatus:'Mix-Status', statusAll:'Alle', statusPass:'Nur PASS', statusTry:'Nur TEST', platform:'Plattform', platformAll:'Alle', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', autoTested:'Automatisch geprüft', packages:'Offizielle CaseyCZ Quellen', packagesDesc:'Fertige Quellen aus der letzten Online-Prüfung.', altPackage:'CaseyCZ AltStore Source', sidePackage:'CaseyCZ SideStore Source', addAlt:'＋ Zu AltStore', addSide:'＋ Zu SideStore', copyUrl:'URL kopieren', json:'JSON ↗', apps:'Apps', sources:'Quellen', hosted:'Gehosteter Mix bereit', local:'Experimenteller Mix bereit', localNote:'Diese Kombination ist nicht vorab gehostet. Lade die JSON-Datei zum Testen herunter.', conflicts:'Duplikate gelöst', download:'JSON laden', preview:'JSON ansehen', building:'Quellen werden getestet…', failed:'Der ausgewählte Mix konnte nicht erstellt werden.', copied:'URL kopiert.', empty:'Keine Quellen entsprechen den Filtern.'
  },
  es: {
    title:'Source Builder', desc:'Todas las fuentes online están en una sola lista. Filtra y combina cualquier selección.', selectPass:'Seleccionar compatibles', selectAll:'Seleccionar visibles', clear:'Limpiar', build:'Crear CaseyCZ Mix', selected:'seleccionadas', shown:'visibles', pass:'PASS', experimental:'PROBAR',
    mixStatus:'Estado del Mix', statusAll:'Todo', statusPass:'Solo PASS', statusTry:'Solo PROBAR', platform:'Plataforma', platformAll:'Todo', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', autoTested:'Prueba automática', packages:'Fuentes oficiales CaseyCZ', packagesDesc:'Fuentes listas generadas desde la última comprobación.', altPackage:'CaseyCZ AltStore Source', sidePackage:'CaseyCZ SideStore Source', addAlt:'＋ Añadir a AltStore', addSide:'＋ Añadir a SideStore', copyUrl:'Copiar URL', json:'JSON ↗', apps:'apps', sources:'fuentes', hosted:'Mix alojado listo', local:'Mix experimental listo', localNote:'Esta combinación no está alojada previamente. Descarga el JSON para probarlo.', conflicts:'duplicados resueltos', download:'Descargar JSON', preview:'Ver JSON', building:'Probando fuentes…', failed:'No se pudo crear el Mix.', copied:'URL copiada.', empty:'Ninguna fuente coincide con los filtros.'
  },
  fr: {
    title:'Source Builder', desc:'Toutes les sources en ligne sont regroupées dans une seule liste. Filtrez-les et combinez votre sélection.', selectPass:'Sélectionner compatibles', selectAll:'Tout sélectionner affiché', clear:'Effacer', build:'Créer CaseyCZ Mix', selected:'sélectionnées', shown:'affichées', pass:'PASS', experimental:'TEST',
    mixStatus:'Statut du Mix', statusAll:'Tout', statusPass:'PASS seulement', statusTry:'TEST seulement', platform:'Plateforme', platformAll:'Tout', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', autoTested:'Test automatique', packages:'Sources officielles CaseyCZ', packagesDesc:'Sources prêtes issues du dernier contrôle en ligne.', altPackage:'CaseyCZ AltStore Source', sidePackage:'CaseyCZ SideStore Source', addAlt:'＋ Ajouter à AltStore', addSide:'＋ Ajouter à SideStore', copyUrl:'Copier URL', json:'JSON ↗', apps:'apps', sources:'sources', hosted:'Mix hébergé prêt', local:'Mix expérimental prêt', localNote:'Cette combinaison n’est pas pré-hébergée. Téléchargez le JSON pour la tester.', conflicts:'doublons résolus', download:'Télécharger JSON', preview:'Aperçu JSON', building:'Test des sources…', failed:'Impossible de créer le Mix.', copied:'URL copiée.', empty:'Aucune source ne correspond aux filtres.'
  }
};

let registry = [];
let status = {};
let selected = new Set();
let blobUrl = null;
let category = 'all';
let genre = 'all';
let platform = 'all';
let compatibility = 'all';
let query = '';

function lang() { const value = safeGet('caseycz-language') || document.documentElement.lang || 'en'; return copy[value] ? value : 'en'; }
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
function matchesPlatform(source) { return platform === 'all' || (source.mode || 'classic') === platform; }
function matchesCompatibility(source) {
  if (compatibility === 'all') return true;
  const test = getStatus(source.id).mixTest;
  return compatibility === 'pass' ? test === 'pass' : test !== 'pass';
}
function matchesQuery(source) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [source.name, source.mode, ...(source.tags || []), source.description?.en, source.description?.cs].filter(Boolean).join(' ').toLowerCase().includes(q);
}
function candidates() { return allCandidates().filter(source => matchesCategory(source) && matchesGenre(source) && matchesPlatform(source) && matchesCompatibility(source) && matchesQuery(source)); }

function restoreSettings() {
  try { const data = JSON.parse(safeGet(STORAGE.selection) || '[]'); if (Array.isArray(data)) selected = new Set(data.map(String)); } catch (_) { selected = new Set(); }
  const savedCategory = safeGet(STORAGE.category), savedGenre = safeGet(STORAGE.genre), savedPlatform = safeGet(STORAGE.platform), savedCompatibility = safeGet(STORAGE.compatibility);
  category = SOURCE_CATEGORIES.has(savedCategory) ? savedCategory : 'all';
  genre = GENRES.has(savedGenre) ? savedGenre : 'all';
  platform = PLATFORMS.has(savedPlatform) ? savedPlatform : 'all';
  compatibility = COMPATIBILITY.has(savedCompatibility) ? savedCompatibility : 'all';
  query = safeGet(STORAGE.query) || '';
}
function saveSelection() { safeSet(STORAGE.selection, JSON.stringify([...selected])); }
function saveFilters() {
  safeSet(STORAGE.category, category); safeSet(STORAGE.genre, genre); safeSet(STORAGE.platform, platform); safeSet(STORAGE.compatibility, compatibility); safeSet(STORAGE.query, query);
}

function setupUnifiedLayout() {
  const section = $('#builder'), host = $('#experimentalMixLab');
  if (!section || !host) return;
  section.querySelector(':scope > .builder')?.remove();
  const sectionHead = section.querySelector(':scope > .section-head');
  if (sectionHead) {
    sectionHead.querySelector('h2').textContent = tr('title');
    const desc = sectionHead.querySelector('p'); if (desc) desc.textContent = tr('desc');
    sectionHead.querySelector('.section-tools')?.remove();
  }
  host.style.marginTop = '0';
  const internalHead = host.querySelector(':scope > .section-head');
  if (internalHead) {
    const textBlock = internalHead.querySelector(':scope > div:first-child'); if (textBlock) textBlock.style.display = 'none';
    internalHead.style.justifyContent = 'flex-end';
  }
  if (!$('#unifiedBuilderStyle')) {
    const style = document.createElement('style'); style.id = 'unifiedBuilderStyle';
    style.textContent = '.select-source{display:none!important}.official-source-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0 0 16px}.official-source-card{padding:16px;border:1px solid var(--border);border-radius:14px;background:var(--panel2)}.official-source-card h4{margin:6px 0}.official-source-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}@media(max-width:720px){.official-source-grid{grid-template-columns:1fr}}';
    document.head.appendChild(style);
  }

  const filters = host.querySelector('.catalog-filters');
  if (filters && !$('#mixPlatformFilters')) {
    const group = document.createElement('div'); group.className = 'filter-group'; group.id = 'mixPlatformFilters';
    group.innerHTML = `<div class="filter-label" id="mixPlatformLabel"></div><div class="filter-tabs"><button class="filter active" type="button" data-exp-platform-filter="all"></button><button class="filter" type="button" data-exp-platform-filter="classic"></button><button class="filter" type="button" data-exp-platform-filter="pal"></button><button class="filter" type="button" data-exp-platform-filter="sidestore"></button></div>`;
    filters.insertBefore(group, $('#expSourceSearch') || null);
  }
  if (filters && !$('#mixCompatibilityFilters')) {
    const group = document.createElement('div'); group.className = 'filter-group'; group.id = 'mixCompatibilityFilters';
    group.innerHTML = `<div class="filter-label" id="mixStatusLabel"></div><div class="filter-tabs"><button class="filter active" type="button" data-exp-compat-filter="all"></button><button class="filter" type="button" data-exp-compat-filter="pass"></button><button class="filter" type="button" data-exp-compat-filter="try"></button></div>`;
    filters.insertBefore(group, $('#expSourceSearch') || null);
  }
  if (!$('#officialSourcePackages')) {
    const packages = document.createElement('div'); packages.id = 'officialSourcePackages';
    const anchor = host.querySelector('.catalog-filters'); host.insertBefore(packages, anchor || host.firstChild);
  }
}

function packageCard(name, url, meta, type) {
  if (!url) return '';
  const install = type === 'side' ? `sidestore://source?url=${encodeURIComponent(url)}` : `altstore://source?url=${encodeURIComponent(url)}`;
  const addLabel = type === 'side' ? tr('addSide') : tr('addAlt');
  return `<article class="official-source-card"><span class="pill online">${type === 'side' ? 'SideStore' : 'AltStore'}</span><h4>${escapeHtml(name)}</h4><div class="muted">${escapeHtml(meta)}</div><div class="official-source-actions"><a class="btn small primary" href="${escapeHtml(install)}">${escapeHtml(addLabel)}</a><button class="btn small secondary" type="button" data-copy-source="${escapeHtml(url)}">${escapeHtml(tr('copyUrl'))}</button><a class="btn small ghost" target="_blank" rel="noopener" href="${escapeHtml(url)}">${escapeHtml(tr('json'))}</a></div></article>`;
}
function renderOfficialPackages() {
  const node = $('#officialSourcePackages'); if (!node) return;
  const altUrl = status?.mixes?.allCompatibleURL || '';
  const altSources = status?.mixes?.autoCompatibleSourceIDs?.length || 0;
  const sideUrl = status?.sidestore?.sourceURL || '';
  const sideSources = status?.sidestore?.sourceIDs?.length || 0;
  const sideApps = status?.sidestore?.appCount || 0;
  node.innerHTML = `<div style="margin-bottom:10px"><strong>${escapeHtml(tr('packages'))}</strong><div class="muted">${escapeHtml(tr('packagesDesc'))}</div></div><div class="official-source-grid">${packageCard(tr('altPackage'), altUrl, `${altSources} ${tr('sources')}`, 'alt')}${packageCard(tr('sidePackage'), sideUrl, `${sideSources} ${tr('sources')} · ${sideApps} ${tr('apps')}`, 'side')}</div>`;
  $$('[data-copy-source]').forEach(button => button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(button.dataset.copySource); } catch (_) {}
    const old = button.textContent; button.textContent = tr('copied'); setTimeout(() => { button.textContent = old; }, 1400);
  }));
}

function applyCopy() {
  const map = {expSelectCompatible:'selectPass', expSelectAll:'selectAll', expClear:'clear', expBuild:'build'};
  Object.entries(map).forEach(([id,key]) => { const node = $('#' + id); if (node) node.textContent = tr(key); });
  const section = $('#builder');
  if (section) { const h2 = section.querySelector(':scope > .section-head h2'), desc = section.querySelector(':scope > .section-head p'); if (h2) h2.textContent = tr('title'); if (desc) desc.textContent = tr('desc'); }
  if ($('#mixPlatformLabel')) $('#mixPlatformLabel').textContent = tr('platform');
  const platformLabels = {all:'platformAll', classic:'classic', pal:'pal', sidestore:'sidestore'};
  $$('[data-exp-platform-filter]').forEach(button => { button.textContent = tr(platformLabels[button.dataset.expPlatformFilter] || 'platformAll'); });
  if ($('#mixStatusLabel')) $('#mixStatusLabel').textContent = tr('mixStatus');
  const statusLabels = {all:'statusAll', pass:'statusPass', try:'statusTry'};
  $$('[data-exp-compat-filter]').forEach(button => { button.textContent = tr(statusLabels[button.dataset.expCompatFilter] || 'statusAll'); });
  const statusPill = $('#expSelectedCount')?.parentElement?.querySelector('.pill'); if (statusPill) statusPill.textContent = tr('autoTested');
}
function syncFilterUi() {
  $$('[data-exp-category-filter]').forEach(button => button.classList.toggle('active', button.dataset.expCategoryFilter === category));
  $$('[data-exp-genre-filter]').forEach(button => button.classList.toggle('active', button.dataset.expGenreFilter === genre));
  $$('[data-exp-platform-filter]').forEach(button => button.classList.toggle('active', button.dataset.expPlatformFilter === platform));
  $$('[data-exp-compat-filter]').forEach(button => button.classList.toggle('active', button.dataset.expCompatFilter === compatibility));
  const search = $('#expSourceSearch'); if (search && search.value !== query) search.value = query;
}
function modeName(source) { return source.mode === 'pal' ? 'AltStore PAL' : source.mode === 'sidestore' ? 'SideStore' : 'AltStore Classic'; }

function render() {
  setupUnifiedLayout(); applyCopy(); syncFilterUi(); renderOfficialPackages();
  const list = $('#experimentalBuilderList'); if (!list) return;
  const available = candidates();
  const allAvailableIds = new Set(allCandidates().map(source => source.id));
  [...selected].forEach(id => { if (!allAvailableIds.has(id)) selected.delete(id); }); saveSelection();
  list.innerHTML = available.length ? available.map(source => {
    const item = getStatus(source.id), checked = selected.has(source.id), test = item.mixTest === 'pass' ? tr('pass') : tr('experimental'), cls = item.mixTest === 'pass' ? 'online' : 'mode';
    return `<label class="builder-item" title="${escapeHtml(item.mixReason || '')}"><input type="checkbox" data-exp-source="${escapeHtml(source.id)}" ${checked ? 'checked' : ''}><div><strong>${escapeHtml(source.name)}</strong><span>${escapeHtml(modeName(source))}</span></div><div class="builder-count"><span class="pill ${cls}">${escapeHtml(test)}</span> ${Number.isFinite(item.appCount) ? `${item.appCount} ${escapeHtml(tr('apps'))}` : ''}</div></label>`;
  }).join('') : `<div class="notice">${escapeHtml(tr('empty'))}</div>`;
  const count = $('#expSelectedCount'); if (count) count.textContent = `${selected.size} ${tr('selected')} · ${available.length} ${tr('shown')}`;
  const build = $('#expBuild'); if (build) build.disabled = selected.size === 0;
  const statMix = $('#statMix'); if (statMix && status?.mixes?.autoCompatibleSourceIDs) statMix.textContent = String(status.mixes.autoCompatibleSourceIDs.length);
}

function parseDate(value) { if (!value) return 0; const time = Date.parse(value); return Number.isFinite(time) ? time : 0; }
function appDate(app) { let best = Math.max(parseDate(app.versionDate), parseDate(app.date)); if (Array.isArray(app.versions)) app.versions.forEach(v => { if (v && typeof v === 'object') best = Math.max(best, parseDate(v.date), parseDate(v.versionDate)); }); return best; }
function dedupe(payloads) {
  const merged = new Map(); let conflicts = 0;
  for (const {source,payload} of payloads) for (const app of (Array.isArray(payload.apps) ? payload.apps : [])) {
    if (!app || typeof app !== 'object') continue; const bundle = app.bundleIdentifier || app.bundleID; if (!bundle) continue;
    if (!merged.has(bundle)) merged.set(bundle, {source,app}); else { conflicts += 1; const old = merged.get(bundle); if (appDate(app) > appDate(old.app)) merged.set(bundle, {source,app}); }
  }
  return {apps:[...merged.values()].map(item => item.app).sort((a,b) => String(a.name || '').localeCompare(String(b.name || ''))), conflicts};
}
function hashIds(ids) { let hash = 2166136261; for (const ch of ids.join('|')) { hash ^= ch.charCodeAt(0); hash = Math.imul(hash,16777619); } return (hash >>> 0).toString(16).padStart(8,'0'); }
function sameIds(ids, expected) { const a = [...ids].sort(), b = [...expected].sort(); return a.length === b.length && a.every((id,i) => id === b[i]); }
function hostedTarget(ids) {
  const sorted = [...ids].sort(), normal = hostedIds(), max = Number(status?.mixes?.maxSourcesPerMix || 0);
  if (sorted.length && sorted.length <= max && sorted.every(id => normal.has(id))) return {url:new URL(`mix/${sorted.join('--')}.json`, window.location.href).href.split('#')[0], alt:true, side:true};
  const auto = [...autoCompatibleIds()];
  if (auto.length && sameIds(sorted, auto)) return {url:status?.mixes?.allCompatibleURL || null, alt:true, side:true};
  const sideIds = status?.sidestore?.sourceIDs || [];
  if (sideIds.length && sameIds(sorted, sideIds)) return {url:status?.sidestore?.sourceURL || null, alt:false, side:true};
  return {url:null, alt:false, side:false};
}

async function buildMix() {
  const button = $('#expBuild'), message = $('#expMessage'), result = $('#expResult'); if (!selected.size) return;
  if (button) button.disabled = true; if (message) message.textContent = tr('building'); result?.classList.remove('show');
  try {
    const ids = [...selected].sort();
    const payloads = await Promise.all(ids.map(async id => { const source = registry.find(item => item.id === id); const response = await fetch(`data/source-cache/${encodeURIComponent(id)}.json`, {cache:'no-store'}); if (!response.ok) throw new Error(`${source?.name || id}: HTTP ${response.status}`); const payload = await response.json(); if (!payload || !Array.isArray(payload.apps)) throw new Error(`${source?.name || id}: invalid apps array`); return {source,payload}; }));
    const {apps,conflicts} = dedupe(payloads); if (!apps.length) throw new Error('No mergeable app entries were found.');
    const target = hostedTarget(ids), names = ids.map(id => registry.find(source => source.id === id)?.name || id), hasTry = ids.some(id => getStatus(id).mixTest !== 'pass');
    const mix = {name:`CaseyCZ Mix · ${names.join(' + ')}`,identifier:`com.caseycz.ios.mix.${hashIds(ids)}`,subtitle:hasTry?'Experimental combined source generated locally by CaseyCZ iOS Hub':'Combined source generated by CaseyCZ iOS Hub',website:'https://caseycz.github.io/iOS-Hub/',tintColor:'#38BDF8',apps,userInfo:{sourceIDs:ids,sourceURLs:ids.map(id=>registry.find(source=>source.id===id)?.url||''),experimental:hasTry}};
    if (blobUrl) URL.revokeObjectURL(blobUrl); blobUrl = URL.createObjectURL(new Blob([JSON.stringify(mix,null,2)+'\n'],{type:'application/json'}));
    $('#expResultTitle').textContent = target.url ? tr('hosted') : tr('local'); $('#expResultInfo').textContent = `${apps.length} ${tr('apps')} · ${conflicts} ${tr('conflicts')}`; $('#expResultNote').textContent = target.url ? '' : tr('localNote');
    $('#expDownload').href = blobUrl; $('#expDownload').download = `CaseyCZ-Mix-${hashIds(ids)}.json`; $('#expDownload').textContent = tr('download'); $('#expPreview').href = blobUrl; $('#expPreview').textContent = tr('preview');
    const alt = $('#expAdd'), copyButton = $('#expCopyUrl'); let side = $('#expAddSideStore');
    if (!side && alt) { side = document.createElement('a'); side.id='expAddSideStore'; side.className='btn small primary'; alt.insertAdjacentElement('afterend', side); }
    if (target.url && target.alt) { alt.hidden=false; alt.href=`altstore://source?url=${encodeURIComponent(target.url)}`; alt.textContent=tr('addAlt'); } else if (alt) alt.hidden=true;
    if (side) { if (target.url && target.side) { side.hidden=false; side.href=`sidestore://source?url=${encodeURIComponent(target.url)}`; side.textContent=tr('addSide'); } else side.hidden=true; }
    if (target.url) { copyButton.hidden=false; copyButton.dataset.url=target.url; copyButton.textContent=tr('copyUrl'); } else { copyButton.hidden=true; delete copyButton.dataset.url; }
    if (message) message.textContent=''; result?.classList.add('show');
  } catch (error) { console.error(error); if (message) message.textContent=`${tr('failed')} ${error.message || error}`; }
  finally { if (button) button.disabled=selected.size===0; }
}

async function init() {
  const host = $('#experimentalMixLab'); if (!host) return; restoreSettings(); setupUnifiedLayout();
  try { const [r,s] = await Promise.all([fetch('sources/registry.json',{cache:'no-store'}),fetch('data/status.json',{cache:'no-store'})]); registry=(await r.json()).sources||[]; status=await s.json(); } catch (error) { console.error(error); }
  render();
  $('#expSelectCompatible')?.addEventListener('click',()=>{ selected=new Set(candidates().filter(source=>getStatus(source.id).mixTest==='pass').map(source=>source.id)); saveSelection(); render(); });
  $('#expSelectAll')?.addEventListener('click',()=>{ selected=new Set(candidates().map(source=>source.id)); saveSelection(); render(); });
  $('#expClear')?.addEventListener('click',()=>{ selected.clear(); saveSelection(); render(); $('#expResult')?.classList.remove('show'); });
  $('#expBuild')?.addEventListener('click',buildMix);
  $('#experimentalBuilderList')?.addEventListener('change',event=>{ const id=event.target?.dataset?.expSource; if(!id)return; if(event.target.checked)selected.add(id);else selected.delete(id); saveSelection(); render(); });
  $$('[data-exp-category-filter]').forEach(button=>button.addEventListener('click',()=>{ category=SOURCE_CATEGORIES.has(button.dataset.expCategoryFilter)?button.dataset.expCategoryFilter:'all'; saveFilters(); render(); }));
  $$('[data-exp-genre-filter]').forEach(button=>button.addEventListener('click',()=>{ genre=GENRES.has(button.dataset.expGenreFilter)?button.dataset.expGenreFilter:'all'; saveFilters(); render(); }));
  $$('[data-exp-platform-filter]').forEach(button=>button.addEventListener('click',()=>{ platform=PLATFORMS.has(button.dataset.expPlatformFilter)?button.dataset.expPlatformFilter:'all'; saveFilters(); render(); }));
  $$('[data-exp-compat-filter]').forEach(button=>button.addEventListener('click',()=>{ compatibility=COMPATIBILITY.has(button.dataset.expCompatFilter)?button.dataset.expCompatFilter:'all'; saveFilters(); render(); }));
  $('#expSourceSearch')?.addEventListener('input',event=>{ query=event.target.value||''; saveFilters(); render(); });
  $('#expCopyUrl')?.addEventListener('click',async event=>{ const url=event.currentTarget.dataset.url; if(!url)return; try{await navigator.clipboard.writeText(url);}catch(_){} event.currentTarget.textContent=tr('copied'); setTimeout(()=>{event.currentTarget.textContent=tr('copyUrl');},1600); });
  $('#languageSelect')?.addEventListener('change',()=>setTimeout(render,0));
}

init();
