const $ = selector => document.querySelector(selector);
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
const STORAGE_KEY = 'ioshub-experimental-mix-selection';

const copy = {
  en: {
    title:'Experimental Mix Lab', desc:'Try combining the wider online catalog. Every source is checked by automation first. Classic-compatible selections can use a hosted URL; other combinations are built locally as JSON for testing.',
    tested:'Auto tested', selectPass:'Select compatible', selectAll:'Select all online', clear:'Clear', build:'Test & build Mix', selected:'selected', pass:'PASS', experimental:'TRY',
    hosted:'Hosted Mix ready', local:'Local experimental Mix ready', localNote:'This combination is not pre-hosted. Download the JSON to inspect/test it. PAL or SideStore-specific apps may still require their original installer.',
    apps:'apps', conflicts:'duplicates resolved', add:'＋ Add to AltStore', copyUrl:'Copy URL', download:'Download JSON', preview:'Preview JSON', building:'Testing and combining sources…', failed:'Experimental Mix could not be built.', copied:'Mix URL copied.'
  },
  cs: {
    title:'Experimental Mix Lab', desc:'Zkus spojit i širší online katalog. Každý zdroj nejdřív kontroluje automatika. Classic-kompatibilní výběr může dostat veřejnou URL; ostatní kombinace se vytvoří lokálně jako JSON pro otestování.',
    tested:'Automatický test', selectPass:'Vybrat kompatibilní', selectAll:'Vybrat vše online', clear:'Zrušit výběr', build:'Otestovat a vytvořit Mix', selected:'vybráno', pass:'PASS', experimental:'ZKUSIT',
    hosted:'Veřejný Mix je připraven', local:'Lokální experimentální Mix je připraven', localNote:'Tato kombinace není předem hostovaná. JSON můžeš stáhnout a otestovat. PAL nebo SideStore aplikace mohou stále vyžadovat svůj původní instalátor.',
    apps:'aplikací', conflicts:'duplicit vyřešeno', add:'＋ Přidat do AltStore', copyUrl:'Kopírovat URL', download:'Stáhnout JSON', preview:'Náhled JSON', building:'Testuji a spojuji zdroje…', failed:'Experimentální Mix se nepodařilo vytvořit.', copied:'URL Mixu zkopírována.'
  },
  de: {
    title:'Experimental Mix Lab', desc:'Kombiniere testweise den größeren Online-Katalog. Jede Quelle wird zuerst automatisch geprüft. Classic-kompatible Auswahlen können eine gehostete URL nutzen; andere Kombinationen werden lokal als JSON erzeugt.',
    tested:'Automatisch geprüft', selectPass:'Kompatible wählen', selectAll:'Alle online wählen', clear:'Leeren', build:'Mix testen & erstellen', selected:'ausgewählt', pass:'PASS', experimental:'TEST', hosted:'Gehosteter Mix bereit', local:'Lokaler experimenteller Mix bereit', localNote:'Diese Kombination ist nicht vorab gehostet. Lade die JSON-Datei zum Testen herunter. PAL- oder SideStore-Apps können weiterhin ihren ursprünglichen Installer benötigen.', apps:'Apps', conflicts:'Duplikate gelöst', add:'＋ Zu AltStore hinzufügen', copyUrl:'URL kopieren', download:'JSON laden', preview:'JSON ansehen', building:'Quellen werden getestet und kombiniert…', failed:'Experimental Mix konnte nicht erstellt werden.', copied:'Mix-URL kopiert.'
  },
  es: {
    title:'Experimental Mix Lab', desc:'Prueba a combinar el catálogo online más amplio. Cada fuente se comprueba automáticamente. Las selecciones Classic compatibles pueden usar una URL alojada; las demás se generan localmente como JSON.',
    tested:'Prueba automática', selectPass:'Seleccionar compatibles', selectAll:'Seleccionar todo online', clear:'Limpiar', build:'Probar y crear Mix', selected:'seleccionadas', pass:'PASS', experimental:'PROBAR', hosted:'Mix alojado listo', local:'Mix experimental local listo', localNote:'Esta combinación no está alojada previamente. Descarga el JSON para probarlo. Las apps PAL o SideStore pueden seguir necesitando su instalador original.', apps:'apps', conflicts:'duplicados resueltos', add:'＋ Añadir a AltStore', copyUrl:'Copiar URL', download:'Descargar JSON', preview:'Ver JSON', building:'Probando y combinando fuentes…', failed:'No se pudo crear el Mix experimental.', copied:'URL del Mix copiada.'
  },
  fr: {
    title:'Experimental Mix Lab', desc:'Essayez de combiner le catalogue en ligne élargi. Chaque source est d’abord contrôlée automatiquement. Les sélections Classic compatibles peuvent utiliser une URL hébergée; les autres sont générées localement en JSON.',
    tested:'Test automatique', selectPass:'Sélectionner compatibles', selectAll:'Tout sélectionner en ligne', clear:'Effacer', build:'Tester et créer le Mix', selected:'sélectionnées', pass:'PASS', experimental:'TEST', hosted:'Mix hébergé prêt', local:'Mix expérimental local prêt', localNote:'Cette combinaison n’est pas pré-hébergée. Téléchargez le JSON pour le tester. Les apps PAL ou SideStore peuvent toujours nécessiter leur installateur d’origine.', apps:'apps', conflicts:'doublons résolus', add:'＋ Ajouter à AltStore', copyUrl:'Copier URL', download:'Télécharger JSON', preview:'Aperçu JSON', building:'Test et fusion des sources…', failed:'Impossible de créer le Mix expérimental.', copied:'URL du Mix copiée.'
  }
};

let registry = [];
let status = {};
let selected = new Set();
let blobUrl = null;

function lang() {
  const value = safeGet('caseycz-language') || document.documentElement.lang || 'en';
  return copy[value] ? value : 'en';
}
function tr(key) { return copy[lang()][key] || copy.en[key] || key; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function getStatus(id) { return status?.sources?.[id] || {}; }
function candidates() { return registry.filter(source => getStatus(source.id).online === true && getStatus(source.id).mixTest !== 'fail'); }
function autoCompatibleIds() { return new Set(status?.mixes?.autoCompatibleSourceIDs || []); }
function hostedIds() { return new Set(status?.mixes?.mergeableSourceIDs || []); }

function restoreSelection() {
  try {
    const data = JSON.parse(safeGet(STORAGE_KEY) || '[]');
    if (Array.isArray(data)) selected = new Set(data.map(String));
  } catch (_) { selected = new Set(); }
}
function saveSelection() { safeSet(STORAGE_KEY, JSON.stringify([...selected])); }

function applyCopy() {
  const map = {
    expTitle:'title', expDesc:'desc', expSelectCompatible:'selectPass', expSelectAll:'selectAll', expClear:'clear', expBuild:'build'
  };
  Object.entries(map).forEach(([id,key]) => { const node = $('#' + id); if (node) node.textContent = tr(key); });
}

function render() {
  applyCopy();
  const list = $('#experimentalBuilderList');
  if (!list) return;
  const available = candidates();
  const availableIds = new Set(available.map(source => source.id));
  [...selected].forEach(id => { if (!availableIds.has(id)) selected.delete(id); });
  saveSelection();

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

  const count = $('#expSelectedCount');
  if (count) count.textContent = `${selected.size}/${available.length} ${tr('selected')}`;
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

async function buildExperimental() {
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
    const mix = {
      name: `CaseyCZ Experimental Mix · ${names.join(' + ')}`,
      identifier: `com.caseycz.ios.experimental.${hashIds(ids)}`,
      subtitle: 'Experimental combined source generated locally by CaseyCZ iOS Hub',
      website: 'https://caseycz.github.io/iOS-Hub/',
      tintColor: '#38BDF8',
      apps,
      userInfo: {sourceIDs: ids, sourceURLs: ids.map(id => registry.find(source => source.id === id)?.url || '')}
    };

    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = URL.createObjectURL(new Blob([JSON.stringify(mix, null, 2) + '\n'], {type:'application/json'}));

    $('#expResultTitle').textContent = url ? tr('hosted') : tr('local');
    $('#expResultInfo').textContent = `${apps.length} ${tr('apps')} · ${conflicts} ${tr('conflicts')}`;
    $('#expResultNote').textContent = url ? '' : tr('localNote');
    $('#expDownload').href = blobUrl;
    $('#expDownload').download = `CaseyCZ-Experimental-Mix-${hashIds(ids)}.json`;
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
  restoreSelection();
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

  $('#expSelectCompatible')?.addEventListener('click', () => { selected = new Set([...autoCompatibleIds()].filter(id => getStatus(id).online === true)); saveSelection(); render(); });
  $('#expSelectAll')?.addEventListener('click', () => { selected = new Set(candidates().map(source => source.id)); saveSelection(); render(); });
  $('#expClear')?.addEventListener('click', () => { selected.clear(); saveSelection(); render(); $('#expResult')?.classList.remove('show'); });
  $('#expBuild')?.addEventListener('click', buildExperimental);
  $('#experimentalBuilderList')?.addEventListener('change', event => {
    const id = event.target?.dataset?.expSource;
    if (!id) return;
    if (event.target.checked) selected.add(id); else selected.delete(id);
    saveSelection(); render();
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
