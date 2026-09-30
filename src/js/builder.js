import {
  INSTALLERS,
  SOURCE_BUILDER_INSTALLER_IDS,
  DEFAULT_SOURCE_BUILDER_INSTALLER_ID,
  sourceInstallerDirectAvailable,
  sourceInstallerIds,
  sourceVariantURL,
  sourceFormatLabel
} from './installers.js?v=1.1.5-20260930-source-queue2';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
const safeRemove = key => { try { localStorage.removeItem(key); } catch (_) {} };

const STORAGE = {
  selection: 'ioshub-source-builder-selection',
  category: 'ioshub-source-builder-category',
  genre: 'ioshub-source-builder-genre',
  target: 'ioshub-source-builder-target',
  query: 'ioshub-source-builder-query',
  queue: 'ioshub-source-builder-queue',
  queueIndex: 'ioshub-source-builder-queue-index',
  queueTarget: 'ioshub-source-builder-queue-target'
};

const SOURCE_CATEGORIES = new Set(['all', 'official', 'trusted', 'community', 'modified']);
const GENRES = new Set(['all', 'games', 'emulators', 'video', 'music', 'anime', 'social', 'downloads', 'sideload', 'utilities']);
const TARGETS = new Set(SOURCE_BUILDER_INSTALLER_IDS);
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
    title:'Custom Source Builder',
    desc:'Choose an installer, select original Sources and send them to the app without creating a combined JSON.',
    selectCompatible:'Select all compatible',
    selectAll:'Select compatible shown',
    clear:'Clear selection',
    build:'Bulk import',
    selected:'selected',
    shown:'shown',
    compatible:'COMPATIBLE',
    incompatible:'INCOMPATIBLE',
    incompatibleReason:'Not compatible with the selected installer.',
    removedIncompatible:'{n} previously selected Source(s) were removed because they are not compatible with {tool}.',
    targetLabel:'Where do you want to add the Sources?',
    targetHelpAlt:'Each selected Classic Source is opened in AltStore separately. AltStore keeps the original Source URL, so normal Source updates continue.',
    targetHelpSide:'SideStore currently accepts one Source URL per deep link. The Builder therefore opens the selected original Sources one by one, preserving normal updates.',
    targetHelpLive:'Each selected AltStore-style Source is opened directly in LiveContainer using its original URL.',
    targetHelpFlare:'Each selected compatible repository is opened directly in FlareStore using its original URL.',
    targetHelpFeather:'Each selected repository is opened directly in Feather using its original URL.',
    targetHelpPal:'Each selected PAL Source is opened directly in AltStore PAL. No Classic/PAL conversion is performed.',
    targetHelpGeneric:'The Builder sends original Source URLs directly to the selected installer.',
    targetPrefix:'Target',
    customBuilder:'Selected Sources',
    filters:'⚙ Filters · 🔎 Search · ☑ Selection',
    sourceHelp:'Sources are not merged, copied or re-hosted. Each original URL is added separately, so future updates still come from the original Source.',
    queueHelp:'All selected original Sources are sent to the iOS Hub Source Import Shortcut in one batch.',
    addTo:'Open next in',
    copyUrls:'Copy Source URLs',
    copied:'URLs copied',
    restart:'Restart queue',
    queueReady:'Source queue ready',
    queueFinished:'All selected Sources have been opened.',
    queueProgress:'opened',
    opening:'Opening',
    retry:'Open',
    pending:'Pending',
    opened:'Opened',
    empty:'No Sources match the current filters.',
    apps:'apps',
    sources:'Sources'
  },
  cs: {
    title:'Custom Source Builder',
    desc:'Vyber instalátor, označ původní Sources a pošli je do aplikace bez vytváření společného JSONu.',
    selectCompatible:'Vybrat všechny kompatibilní',
    selectAll:'Vybrat kompatibilní zobrazené',
    clear:'Zrušit výběr',
    build:'Hromadný import',
    selected:'vybráno',
    shown:'zobrazeno',
    compatible:'KOMPATIBILNÍ',
    incompatible:'NEKOMPATIBILNÍ',
    incompatibleReason:'Není kompatibilní se zvoleným instalátorem.',
    removedIncompatible:'Kvůli nekompatibilitě s {tool} bylo z výběru odebráno Sources: {n}.',
    targetLabel:'Kam chceš Sources přidat?',
    targetHelpAlt:'Každá vybraná Classic Source se otevře v AltStore samostatně. AltStore si uloží původní URL, takže aktualizace Source fungují dál normálně.',
    targetHelpSide:'SideStore nyní přijímá jednu Source URL na jeden deep-link. Builder proto otevře vybrané původní Sources postupně a aktualizace zůstanou zachované.',
    targetHelpLive:'Každá vybraná AltStore-style Source se otevře přímo v LiveContaineru přes původní URL.',
    targetHelpFlare:'Každý vybraný kompatibilní repozitář se otevře přímo ve FlareStore přes původní URL.',
    targetHelpFeather:'Každý vybraný repozitář se otevře přímo ve Feather přes původní URL.',
    targetHelpPal:'Každá vybraná PAL Source se otevře přímo v AltStore PAL. Nic nepřevádíme mezi Classic a PAL.',
    targetHelpGeneric:'Builder posílá původní Source URL přímo do zvoleného instalátoru.',
    targetPrefix:'Cíl',
    customBuilder:'Vybrané Sources',
    filters:'⚙ Filtry · 🔎 Hledání · ☑ Výběr',
    sourceHelp:'Sources se neslučují, nekopírují ani nerehostují. Každá původní URL se přidá samostatně, takže budoucí aktualizace dál chodí z originální Source.',
    queueHelp:'Všechny vybrané původní Sources se pošlou najednou do zkratky iOS Hub Source Import.',
    addTo:'Otevřít další v',
    copyUrls:'Kopírovat URL Sources',
    copied:'URL zkopírovány',
    restart:'Začít znovu',
    queueReady:'Fronta Sources je připravená',
    queueFinished:'Všechny vybrané Sources byly otevřeny.',
    queueProgress:'otevřeno',
    opening:'Otevírám',
    retry:'Otevřít',
    pending:'Čeká',
    opened:'Otevřeno',
    empty:'Aktuálním filtrům neodpovídá žádná Source.',
    apps:'aplikací',
    sources:'Sources'
  },
  de: {
    title:'Custom Source Builder',
    desc:'Installer wählen, originale Sources auswählen und direkt an die App senden — ohne kombiniertes JSON.',
    selectCompatible:'Alle kompatiblen wählen',
    selectAll:'Sichtbare kompatible wählen',
    clear:'Auswahl löschen',
    build:'Massenimport',
    selected:'ausgewählt',
    shown:'sichtbar',
    compatible:'KOMPATIBEL',
    incompatible:'NICHT KOMPATIBEL',
    incompatibleReason:'Nicht mit dem gewählten Installer kompatibel.',
    removedIncompatible:'{n} zuvor ausgewählte Source(s) wurden entfernt, da sie nicht mit {tool} kompatibel sind.',
    targetLabel:'Wo sollen die Sources hinzugefügt werden?',
    targetHelpAlt:'Jede Classic Source wird einzeln mit ihrer Original-URL in AltStore geöffnet. Updates bleiben dadurch erhalten.',
    targetHelpSide:'SideStore akzeptiert derzeit eine Source-URL pro Deep-Link. Der Builder öffnet die Original-Sources daher nacheinander.',
    targetHelpLive:'Jede ausgewählte Source wird mit ihrer Original-URL direkt in LiveContainer geöffnet.',
    targetHelpFlare:'Jedes ausgewählte kompatible Repository wird mit seiner Original-URL direkt in FlareStore geöffnet.',
    targetHelpFeather:'Jedes ausgewählte Repository wird mit seiner Original-URL direkt in Feather geöffnet.',
    targetHelpPal:'Jede PAL Source wird direkt in AltStore PAL geöffnet. Es findet keine Classic/PAL-Konvertierung statt.',
    targetHelpGeneric:'Der Builder sendet die Original-Source-URLs direkt an den gewählten Installer.',
    targetPrefix:'Ziel',
    customBuilder:'Ausgewählte Sources',
    filters:'⚙ Filter · 🔎 Suche · ☑ Auswahl',
    sourceHelp:'Sources werden nicht zusammengeführt, kopiert oder neu gehostet. Jede Original-URL bleibt erhalten, damit Updates weiterhin funktionieren.',
    queueHelp:'Alle ausgewählten Original-Sources werden gesammelt an den Shortcut iOS Hub Source Import gesendet.',
    addTo:'Nächste öffnen in',
    copyUrls:'Source-URLs kopieren',
    copied:'URLs kopiert',
    restart:'Warteschlange neu starten',
    queueReady:'Source-Warteschlange bereit',
    queueFinished:'Alle ausgewählten Sources wurden geöffnet.',
    queueProgress:'geöffnet',
    opening:'Öffne',
    retry:'Öffnen',
    pending:'Ausstehend',
    opened:'Geöffnet',
    empty:'Keine Sources entsprechen den Filtern.',
    apps:'Apps',
    sources:'Sources'
  },
  es: {
    title:'Custom Source Builder',
    desc:'Elige un instalador, selecciona Sources originales y envíalas a la app sin crear un JSON combinado.',
    selectCompatible:'Seleccionar compatibles',
    selectAll:'Seleccionar compatibles visibles',
    clear:'Borrar selección',
    build:'Importación masiva',
    selected:'seleccionadas',
    shown:'visibles',
    compatible:'COMPATIBLE',
    incompatible:'INCOMPATIBLE',
    incompatibleReason:'No es compatible con el instalador seleccionado.',
    removedIncompatible:'Se eliminaron {n} Source(s) porque no son compatibles con {tool}.',
    targetLabel:'¿Dónde quieres añadir las Sources?',
    targetHelpAlt:'Cada Source Classic se abre por separado en AltStore con su URL original, por lo que las actualizaciones siguen funcionando.',
    targetHelpSide:'SideStore acepta actualmente una Source URL por deep-link. El Builder abre las Sources originales una a una.',
    targetHelpLive:'Cada Source seleccionada se abre directamente en LiveContainer con su URL original.',
    targetHelpFlare:'Cada repositorio compatible se abre directamente en FlareStore con su URL original.',
    targetHelpFeather:'Cada repositorio se abre directamente en Feather con su URL original.',
    targetHelpPal:'Cada Source PAL se abre directamente en AltStore PAL. No se convierte entre Classic y PAL.',
    targetHelpGeneric:'El Builder envía las URL originales directamente al instalador elegido.',
    targetPrefix:'Destino',
    customBuilder:'Sources seleccionadas',
    filters:'⚙ Filtros · 🔎 Buscar · ☑ Selección',
    sourceHelp:'Las Sources no se combinan, copian ni realojan. Se añade cada URL original por separado para conservar las actualizaciones.',
    queueHelp:'Todas las Sources originales seleccionadas se envían juntas al atajo iOS Hub Source Import.',
    addTo:'Abrir siguiente en',
    copyUrls:'Copiar URLs de Sources',
    copied:'URLs copiadas',
    restart:'Reiniciar cola',
    queueReady:'Cola de Sources preparada',
    queueFinished:'Se abrieron todas las Sources seleccionadas.',
    queueProgress:'abiertas',
    opening:'Abriendo',
    retry:'Abrir',
    pending:'Pendiente',
    opened:'Abierta',
    empty:'Ninguna Source coincide con los filtros.',
    apps:'apps',
    sources:'Sources'
  },
  fr: {
    title:'Custom Source Builder',
    desc:'Choisissez un installateur, sélectionnez les Sources originales et envoyez-les à l’app sans créer de JSON combiné.',
    selectCompatible:'Sélectionner les compatibles',
    selectAll:'Sélectionner les compatibles affichées',
    clear:'Effacer la sélection',
    build:'Import groupé',
    selected:'sélectionnées',
    shown:'affichées',
    compatible:'COMPATIBLE',
    incompatible:'INCOMPATIBLE',
    incompatibleReason:'Non compatible avec l’installateur sélectionné.',
    removedIncompatible:'{n} Source(s) ont été retirées car elles ne sont pas compatibles avec {tool}.',
    targetLabel:'Où voulez-vous ajouter les Sources ?',
    targetHelpAlt:'Chaque Source Classic est ouverte séparément dans AltStore avec son URL originale, afin de conserver les mises à jour.',
    targetHelpSide:'SideStore accepte actuellement une URL de Source par deep-link. Le Builder ouvre donc les Sources originales une par une.',
    targetHelpLive:'Chaque Source sélectionnée est ouverte directement dans LiveContainer avec son URL originale.',
    targetHelpFlare:'Chaque dépôt compatible est ouvert directement dans FlareStore avec son URL originale.',
    targetHelpFeather:'Chaque dépôt est ouvert directement dans Feather avec son URL originale.',
    targetHelpPal:'Chaque Source PAL est ouverte directement dans AltStore PAL. Aucune conversion Classic/PAL n’est effectuée.',
    targetHelpGeneric:'Le Builder envoie les URL originales directement à l’installateur choisi.',
    targetPrefix:'Cible',
    customBuilder:'Sources sélectionnées',
    filters:'⚙ Filtres · 🔎 Recherche · ☑ Sélection',
    sourceHelp:'Les Sources ne sont ni fusionnées, ni copiées, ni réhébergées. Chaque URL originale est ajoutée séparément afin de conserver les mises à jour.',
    queueHelp:'Toutes les Sources originales sélectionnées sont envoyées ensemble au raccourci iOS Hub Source Import.',
    addTo:'Ouvrir suivante dans',
    copyUrls:'Copier les URL des Sources',
    copied:'URL copiées',
    restart:'Recommencer la file',
    queueReady:'File de Sources prête',
    queueFinished:'Toutes les Sources sélectionnées ont été ouvertes.',
    queueProgress:'ouvertes',
    opening:'Ouverture',
    retry:'Ouvrir',
    pending:'En attente',
    opened:'Ouverte',
    empty:'Aucune Source ne correspond aux filtres.',
    apps:'apps',
    sources:'Sources'
  }
};

let registry = [];
let status = {};
let selected = new Set();
let category = 'all';
let genre = 'all';
let target = DEFAULT_SOURCE_BUILDER_INSTALLER_ID;
let query = '';
let queueIds = [];
let queueIndex = 0;
let queueTarget = '';

function lang() {
  const value = safeGet('caseycz-language') || document.documentElement.lang || 'en';
  return copy[value] ? value : 'en';
}
function tr(key) { return copy[lang()][key] || copy.en[key] || key; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function installerIcon(installerId) {
  const src = INSTALLERS[installerId]?.icon;
  return src ? `<img class="installer-icon" src="${escapeHtml(src)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : '';
}

function targetName() {
  return INSTALLERS[target]?.label || INSTALLERS[DEFAULT_SOURCE_BUILDER_INSTALLER_ID]?.label || 'Installer';
}
function targetVariant() {
  return INSTALLERS[target]?.variant || null;
}
function targetHelpKey() {
  if (target === 'altstore') return 'targetHelpAlt';
  if (target === 'sidestore') return 'targetHelpSide';
  if (target === 'livecontainer') return 'targetHelpLive';
  if (target === 'flarestore') return 'targetHelpFlare';
  if (target === 'feather') return 'targetHelpFeather';
  if (target === 'altstore-pal') return 'targetHelpPal';
  return 'targetHelpGeneric';
}

function renderTargetButtons() {
  const host = $('#builderTargets');
  if (!host) return;
  const current = INSTALLERS[target] || INSTALLERS[DEFAULT_SOURCE_BUILDER_INSTALLER_ID];
  const options = SOURCE_BUILDER_INSTALLER_IDS.map(installerId => {
    const installer = INSTALLERS[installerId];
    const active = target === installerId;
    return `<button class="builder-target-option${active ? ' active' : ''}" type="button" role="option" aria-selected="${String(active)}" data-exp-target="${escapeHtml(installerId)}">
      ${installerIcon(installerId)}
      <span>${escapeHtml(installer.label)}</span>
    </button>`;
  }).join('');
  host.innerHTML = `<details class="builder-target-picker">
    <summary class="builder-target-select" aria-labelledby="mixTargetLabel">
      ${installerIcon(target)}
      <span>${escapeHtml(current?.label || targetName())}</span>
      <span class="builder-target-chevron" aria-hidden="true">⌄</span>
    </summary>
    <div class="builder-target-menu" role="listbox" aria-labelledby="mixTargetLabel">
      ${options}
    </div>
  </details>`;
}

function getStatus(id) { return status?.sources?.[id] || {}; }
function onlineBuilderSources() {
  return registry.filter(source =>
    source.builder !== false
    && source.compliance?.reviewStatus !== 'restricted'
    && getStatus(source.id).online === true
  );
}
function targetCompatibility(source) {
  const installer = INSTALLERS[target];
  const variant = installer?.variant || null;
  const sourceUrl = variant ? sourceVariantURL(source, variant) : null;
  const supportsInstaller = sourceInstallerIds(source).includes(target);
  const sourceStatus = getStatus(source.id);
  const variantStatus = variant ? sourceStatus?.variants?.[variant] : null;
  const directAllowed = sourceInstallerDirectAvailable(sourceStatus, target);
  const supported = Boolean(
    installer
    && sourceUrl
    && supportsInstaller
    && sourceStatus?.online === true
    && variantStatus?.online !== false
    && directAllowed
  );
  return { supported, sourceUrl };
}
function selectableForTarget(source) { return targetCompatibility(source).supported; }

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
function sourceSearchText(source) {
  return [source.name, source.developer, source.mode, ...(source.tags || []), ...Object.values(source.description || {})]
    .filter(Boolean).join(' ').toLowerCase();
}
function matchesQuery(source) {
  const q = query.trim().toLowerCase();
  return !q || sourceSearchText(source).includes(q);
}
function candidates() {
  return onlineBuilderSources().filter(source =>
    matchesCategory(source) && matchesGenre(source) && matchesQuery(source)
  );
}

function restoreSettings() {
  try {
    const data = JSON.parse(safeGet(STORAGE.selection) || '[]');
    if (Array.isArray(data)) selected = new Set(data.map(String));
  } catch (_) { selected = new Set(); }
  const savedCategory = safeGet(STORAGE.category);
  const savedGenre = safeGet(STORAGE.genre);
  const savedTarget = safeGet(STORAGE.target);
  category = SOURCE_CATEGORIES.has(savedCategory) ? savedCategory : 'all';
  genre = GENRES.has(savedGenre) ? savedGenre : 'all';
  target = TARGETS.has(savedTarget) ? savedTarget : DEFAULT_SOURCE_BUILDER_INSTALLER_ID;
  query = safeGet(STORAGE.query) || '';

  try {
    const savedQueue = JSON.parse(safeGet(STORAGE.queue) || '[]');
    queueIds = Array.isArray(savedQueue) ? savedQueue.map(String) : [];
  } catch (_) { queueIds = []; }
  queueIndex = Math.max(0, Number(safeGet(STORAGE.queueIndex) || 0) || 0);
  queueTarget = safeGet(STORAGE.queueTarget) || '';
}
function saveSelection() { safeSet(STORAGE.selection, JSON.stringify([...selected])); }
function saveFilters() {
  safeSet(STORAGE.category, category);
  safeSet(STORAGE.genre, genre);
  safeSet(STORAGE.target, target);
  safeSet(STORAGE.query, query);
}
function saveQueue() {
  safeSet(STORAGE.queue, JSON.stringify(queueIds));
  safeSet(STORAGE.queueIndex, String(queueIndex));
  safeSet(STORAGE.queueTarget, queueTarget);
}
function clearQueue({hide = true} = {}) {
  queueIds = [];
  queueIndex = 0;
  queueTarget = '';
  safeRemove(STORAGE.queue);
  safeRemove(STORAGE.queueIndex);
  safeRemove(STORAGE.queueTarget);
  if (hide) $('#expResult')?.classList.remove('show');
}

function applyCopy() {
  const map = {
    expSelectCompatible:'selectCompatible',
    expSelectAll:'selectAll',
    expClear:'clear',
    expBuild:'build',
    expCopyUrl:'copyUrls',
    expRestartQueue:'restart'
  };
  Object.entries(map).forEach(([id,key]) => {
    const node = $('#' + id);
    if (node) node.textContent = tr(key);
  });
  if ($('#builderTitle')) $('#builderTitle').textContent = tr('title');
  if ($('#builderDesc')) $('#builderDesc').textContent = tr('desc');
  if ($('#customMixCardTitle')) $('#customMixCardTitle').textContent = tr('customBuilder');
  if ($('#customMixFiltersLabel')) $('#customMixFiltersLabel').textContent = tr('filters');
  if ($('#mixTargetLabel')) $('#mixTargetLabel').textContent = tr('targetLabel');
  if ($('#mixTargetHelp')) $('#mixTargetHelp').textContent = tr(targetHelpKey());
  if ($('#mixPassHelp')) $('#mixPassHelp').textContent = tr('sourceHelp');
  if ($('#mixDedupeHelp')) $('#mixDedupeHelp').textContent = tr('queueHelp');
  const targetBadge = $('#mixTargetBadge');
  if (targetBadge) targetBadge.innerHTML = `${installerIcon(target)}${escapeHtml(tr('targetPrefix'))}: ${escapeHtml(targetName())}`;
  renderTargetButtons();
}

function syncFilterUi() {
  $$('[data-exp-category-filter]').forEach(button => {
    const active = button.dataset.expCategoryFilter === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $$('[data-exp-genre-filter]').forEach(button => {
    const active = button.dataset.expGenreFilter === genre;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-exp-target]').forEach(button => {
    const active = button.dataset.expTarget === target;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  const search = $('#expSourceSearch');
  if (search && search.value !== query) search.value = query;
}

function modeName(source) { return sourceFormatLabel(source); }

function render() {
  applyCopy();
  syncFilterUi();
  const list = $('#experimentalBuilderList');
  if (!list) return;

  const available = candidates();
  const validIds = new Set(onlineBuilderSources().filter(selectableForTarget).map(source => source.id));
  [...selected].forEach(id => {
    if (!validIds.has(id)) selected.delete(id);
  });
  saveSelection();

  list.innerHTML = available.length ? available.map(source => {
    const item = getStatus(source.id);
    const checked = selected.has(source.id);
    const targetInfo = targetCompatibility(source);
    const selectable = targetInfo.supported;
    const cls = selectable ? 'online' : 'offline';
    const label = selectable ? tr('compatible') : tr('incompatible');
    return `<label class="builder-item${selectable ? '' : ' builder-item-disabled'}" title="${escapeHtml(selectable ? '' : tr('incompatibleReason'))}">
      <input type="checkbox" data-exp-source="${escapeHtml(source.id)}" ${checked ? 'checked' : ''} ${selectable ? '' : 'disabled'}>
      <div><strong>${escapeHtml(source.name)}</strong><span>${escapeHtml(modeName(source))} · → ${escapeHtml(targetName())}</span></div>
      <div class="builder-count"><span class="pill online">● ONLINE</span> <span class="pill ${cls}">${escapeHtml(label)}</span> ${Number.isFinite(item.appCount) ? `${item.appCount} ${escapeHtml(tr('apps'))}` : ''}</div>
    </label>`;
  }).join('') : `<div class="notice">${escapeHtml(tr('empty'))}</div>`;

  const count = $('#expSelectedCount');
  if (count) count.textContent = `${selected.size} ${tr('selected')} · ${available.length} ${tr('shown')} · ${tr('targetPrefix')}: ${targetName()}`;
  const build = $('#expBuild');
  if (build) build.disabled = selected.size === 0;

  if (queueIds.length && queueTarget === target) renderQueue();
}

function queueEntries() {
  const installer = INSTALLERS[queueTarget || target];
  if (!installer) return [];
  return queueIds.map(id => {
    const source = registry.find(item => item.id === id);
    if (!source) return null;
    const sourceUrl = sourceVariantURL(source, installer.variant);
    if (!sourceUrl) return null;
    return {
      id,
      name: source.name || id,
      sourceUrl,
      deepLink: installer.buildLink(sourceUrl)
    };
  }).filter(Boolean);
}

function renderQueue() {
  const result = $('#expResult');
  const list = $('#expQueueList');
  if (!result || !list || !queueIds.length || queueTarget !== target) return;

  const entries = queueEntries();
  queueIndex = Math.min(queueIndex, entries.length);
  const installer = INSTALLERS[target];
  const finished = queueIndex >= entries.length;

  $('#expResultTitle').textContent = finished ? tr('queueFinished') : tr('queueReady');
  $('#expResultInfo').textContent = `${queueIndex} / ${entries.length} ${tr('queueProgress')} · ${targetName()}`;
  $('#expResultNote').textContent = tr('queueHelp');

  list.innerHTML = entries.map((entry,index) => {
    const state = index < queueIndex ? tr('opened') : (index === queueIndex ? tr('opening') : tr('pending'));
    const cls = index < queueIndex ? 'online' : (index === queueIndex ? 'mode' : '');
    return `<article class="builder-item">
      <div><strong>${escapeHtml(entry.name)}</strong><span>${escapeHtml(entry.sourceUrl)}</span></div>
      <div class="builder-count">
        <span class="pill ${cls}">${escapeHtml(state)}</span>
        <a class="btn small ghost" href="${escapeHtml(entry.deepLink)}" data-queue-open="${index}">${escapeHtml(tr('retry'))}</a>
      </div>
    </article>`;
  }).join('');

  const next = $('#expAddTarget');
  if (next) {
    if (finished || !entries[queueIndex]) {
      next.hidden = true;
      next.removeAttribute('href');
      delete next.dataset.queueIndex;
    } else {
      next.hidden = false;
      next.href = entries[queueIndex].deepLink;
      next.dataset.queueIndex = String(queueIndex);
      next.innerHTML = `${installerIcon(target)}${escapeHtml(tr('addTo'))} ${escapeHtml(targetName())} · ${queueIndex + 1}/${entries.length}`;
    }
  }

  const copy = $('#expCopyUrl');
  if (copy) copy.hidden = entries.length === 0;
  const restart = $('#expRestartQueue');
  if (restart) restart.hidden = entries.length === 0;
  result.classList.add('show');
}

function markQueueOpened(index) {
  if (!Number.isInteger(index) || index < 0) return;
  if (index >= queueIndex) queueIndex = Math.min(index + 1, queueIds.length);
  saveQueue();
  setTimeout(renderQueue, 0);
}

const SHORTCUT_NAME = 'iOS Hub Source Import';

async function startShortcutImport() {
  const compatibleSelected = registry
    .filter(source => selected.has(source.id) && selectableForTarget(source))
    .map(source => source.id);

  if (!compatibleSelected.length) return;

  queueIds = compatibleSelected;
  queueIndex = 0;
  queueTarget = target;
  saveQueue();

  const entries = queueEntries();
  if (!entries.length) return;

  const payload = [target, ...entries.map(entry => entry.sourceUrl)].join('\n');
  const shortcutBase = `shortcuts://run-shortcut?name=${encodeURIComponent(SHORTCUT_NAME)}`;
  const message = $('#expMessage');
  if (message) message.textContent = tr('queueHelp');

  const encodedPayload = encodeURIComponent(payload);

  // Prefer direct text input so the Shortcut receives the installer key on the
  // very first run. Clipboard handoff on iOS can race with the app switch.
  if (encodedPayload.length <= 6000) {
    window.location.href = `${shortcutBase}&input=text&text=${encodedPayload}`;
    return;
  }

  // Large batches fall back to the clipboard to avoid an oversized URL scheme.
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(payload);
      window.location.href = `${shortcutBase}&input=clipboard`;
      return;
    }
  } catch (_) {
    // If clipboard access is unavailable, use direct text as a last resort.
  }

  window.location.href = `${shortcutBase}&input=text&text=${encodedPayload}`;
}

async function copyQueueUrls(button) {
  const urls = queueEntries().map(item => item.sourceUrl);
  if (!urls.length) return;
  try {
    await navigator.clipboard.writeText(urls.join('\n'));
    button.textContent = tr('copied');
    setTimeout(() => { button.textContent = tr('copyUrls'); }, 1600);
  } catch (_) {}
}

async function init() {
  const host = $('#experimentalMixLab');
  if (!host) return;

  restoreSettings();

  try {
    const [registryResponse,statusResponse] = await Promise.all([
      fetch('sources/registry.json',{cache:'no-store'}),
      fetch('data/status.json',{cache:'no-store'})
    ]);
    registry = (await registryResponse.json()).sources || [];
    status = await statusResponse.json();
  } catch (error) {
    console.error(error);
  }

  render();

  $('#expSelectCompatible')?.addEventListener('click', () => {
    selected = new Set(onlineBuilderSources().filter(selectableForTarget).map(source => source.id));
    saveSelection();
    clearQueue();
    render();
  });
  $('#expSelectAll')?.addEventListener('click', () => {
    selected = new Set(candidates().filter(selectableForTarget).map(source => source.id));
    saveSelection();
    clearQueue();
    render();
  });
  $('#expClear')?.addEventListener('click', () => {
    selected.clear();
    saveSelection();
    clearQueue();
    render();
  });
  $('#expBuild')?.addEventListener('click', startShortcutImport);

  $('#experimentalBuilderList')?.addEventListener('change', event => {
    const id = event.target?.dataset?.expSource;
    if (!id) return;
    const source = registry.find(item => item.id === id);
    if (!source || !selectableForTarget(source)) {
      event.target.checked = false;
      selected.delete(id);
      saveSelection();
      return;
    }
    if (event.target.checked) selected.add(id); else selected.delete(id);
    saveSelection();
    clearQueue();
    render();
  });

  $$('[data-exp-category-filter]').forEach(button => button.addEventListener('click', () => {
    const requested = SOURCE_CATEGORIES.has(button.dataset.expCategoryFilter) ? button.dataset.expCategoryFilter : 'all';
    category = requested !== 'all' && requested === category ? 'all' : requested;
    saveFilters();
    render();
  }));
  $$('[data-exp-genre-filter]').forEach(button => button.addEventListener('click', () => {
    const requested = GENRES.has(button.dataset.expGenreFilter) ? button.dataset.expGenreFilter : 'all';
    genre = requested !== 'all' && requested === genre ? 'all' : requested;
    saveFilters();
    render();
  }));

  $('#builderTargets')?.addEventListener('click', event => {
    const button = event.target.closest('[data-exp-target]');
    if (!button) return;
    const nextTarget = TARGETS.has(button.dataset.expTarget) ? button.dataset.expTarget : DEFAULT_SOURCE_BUILDER_INSTALLER_ID;
    let removed = 0;
    if (nextTarget !== target) {
      target = nextTarget;
      [...selected].forEach(id => {
        const source = registry.find(item => item.id === id);
        if (!source || !selectableForTarget(source)) {
          selected.delete(id);
          removed += 1;
        }
      });
      saveSelection();
      clearQueue();
    }
    saveFilters();
    render();
    if (removed) {
      const message = $('#expMessage');
      if (message) message.textContent = tr('removedIncompatible').replace('{n}', String(removed)).replace('{tool}', targetName());
    }
  });

  $('#expSourceSearch')?.addEventListener('input', event => {
    query = event.target.value || '';
    saveFilters();
    render();
  });

  $('#expAddTarget')?.addEventListener('click', event => {
    const index = Number(event.currentTarget.dataset.queueIndex);
    if (Number.isInteger(index)) markQueueOpened(index);
  });

  $('#expQueueList')?.addEventListener('click', event => {
    const link = event.target.closest('[data-queue-open]');
    if (!link) return;
    const index = Number(link.dataset.queueOpen);
    if (Number.isInteger(index)) markQueueOpened(index);
  });

  $('#expCopyUrl')?.addEventListener('click', event => copyQueueUrls(event.currentTarget));
  $('#expRestartQueue')?.addEventListener('click', () => {
    queueIndex = 0;
    saveQueue();
    renderQueue();
  });

  $('#languageSelect')?.addEventListener('change', () => setTimeout(render,0));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && queueIds.length) renderQueue();
  });
}

init();
