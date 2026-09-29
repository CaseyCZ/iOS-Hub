import {
  INSTALLERS,
  BUILDER_INSTALLER_IDS,
  DEFAULT_BUILDER_INSTALLER_ID,
  MIX_PACKAGE_IDS,
  installerMixPackageData,
  mixPackageData,
  mixPackageTargetIds,
  sourceInstallerDirectAvailable,
  sourceInstallerIds,
  sourceVariantURL,
  sourceFormatLabel
} from './installers.js?v=1.1.5-20260929-installers14';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

const STORAGE = {
  selection: 'ioshub-mix-selection',
  category: 'ioshub-mix-category',
  genre: 'ioshub-mix-genre',
  target: 'ioshub-mix-target',
  compatibility: 'ioshub-mix-compatibility',
  query: 'ioshub-mix-query'
};

const SOURCE_CATEGORIES = new Set(['all', 'official', 'trusted', 'community', 'modified']);
const GENRES = new Set(['all', 'games', 'emulators', 'video', 'music', 'anime', 'social', 'downloads', 'sideload', 'utilities']);
const TARGETS = new Set(BUILDER_INSTALLER_IDS);
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
    title:'Custom Source Builder', desc:'Filter checked online sources, select any combination and build your own Mix for any supported Classic source installer.',
    selectPass:'Select PASS for', selectAll:'Select all shown', clear:'Clear selection', build:'Build Mix', selected:'selected', shown:'shown', pass:'PASS', try:'TRY', passHelp:'The list is already limited to the selected destination. PASS additionally means the source passed the automated Mix merge test; it does not guarantee every app will run on every iOS device.',
    mixStatus:'Merge test', targetLabel:'Where do you want to add the Mix?', targetHelpGeneric:'Classic AltStore-compatible Mix. This installer can use the same merged source format.', targetHelpAlt:'The finished Mix will be a Classic AltSource for AltStore Classic. SideStore-only and PAL marketplace sources are hidden.', targetHelpSide:'SideStore is fully compatible with AltStore Sources (AltSources). We show Classic IPA-style sources here and remove PAL-only marketplace metadata from the generated Mix.', targetHelpLive:'LiveContainer can browse AltStore-style sources and install apps from their latest version download URL. We show mergeable Classic IPA-style sources here.', targetHelpFlare:'FlareStore accepts AltStore-compatible repositories. The Mix stays a Classic AltSource and opens directly in FlareStore.', targetHelpFeather:'Feather accepts AltStore-compatible repositories. The Mix stays a Classic AltSource and opens directly in Feather.', palNote:'AltStore PAL is not a Custom Mix target because PAL uses notarized marketplace packages and different source metadata than Classic IPA sources.', targetPrefix:'Target', statusAll:'All', statusPass:'PASS only', statusTry:'TRY only', platform:'Platform', platformAll:'All', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Auto tested',
    altPackage:'AltStore Source', sidePackage:'SideStore Source', livePackage:'LiveContainer Source', customMix:'Custom Mix', filters:'⚙ Filters · 🔎 Search · ☑ Selection',
    dedupeHelp:'When multiple app entries use the same bundle ID, the generated Mix keeps only one entry — normally the newest by date. Different variants of the same app can therefore be merged into one.', dedupeResult:'Some app variants shared the same bundle ID and were merged; only one entry per bundle ID remains in the Mix.',
    addTo:'＋ Add to', copyUrl:'Copy URL', json:'JSON ↗', apps:'apps', sources:'sources',
    hosted:'Hosted Mix ready', local:'Local Mix ready', experimental:'Experimental Mix ready', localNote:'This PASS Mix was built locally. The installer action below can add the selected sources individually; Download JSON keeps the merged and deduplicated Mix.', tryNote:'This Mix contains one or more TRY sources. The installer action below can add the selected sources individually, while Download JSON keeps the experimental merged Mix for testing.',
    conflicts:'duplicates resolved', download:'Download JSON', preview:'Preview JSON', building:'Testing and combining sources…', failed:'The selected Mix could not be built.', copied:'Source URL copied.', empty:'No sources match the current filters.', directMixUnavailable:'Direct add of one combined Mix is not available.', notHostedRepos:'Not hosted for Mix', tryRepos:'TRY sources', mixLimit:'Hosted Mix limit', selectedCount:'selected'
  },
  cs: {
    title:'Custom Source Builder', desc:'Filtruj kontrolované online zdroje, vyber libovolnou kombinaci a vytvoř vlastní Mix pro podporované instalátory Classic zdrojů.',
    selectPass:'Vybrat PASS pro', selectAll:'Vybrat vše zobrazené', clear:'Zrušit výběr', build:'Vytvořit Mix', selected:'vybráno', shown:'zobrazeno', pass:'PASS', try:'ZKUSIT', passHelp:'Seznam je už omezený podle zvoleného cíle. PASS navíc znamená, že zdroj prošel automatickým testem sloučení do Mixu; neznamená to, že každá aplikace poběží na každém iOS zařízení.',
    mixStatus:'Test sloučení', targetLabel:'Kam chceš výsledný Mix přidat?', targetHelpGeneric:'Classic Mix kompatibilní s AltStore. Tento instalátor může použít stejný formát sloučeného zdroje.', targetHelpAlt:'Výsledný Mix bude Classic AltSource pro AltStore Classic. SideStore-only a PAL marketplace zdroje se skryjí.', targetHelpSide:'SideStore je plně kompatibilní s AltStore Sources (AltSources). Zobrazujeme zde Classic IPA zdroje a z výsledného Mixu odstraňujeme metadata určená jen pro PAL marketplace.', targetHelpLive:'LiveContainer umí procházet AltStore-style zdroje a instalovat aplikace z download URL jejich nejnovější verze. Zobrazujeme zde sloučitelné Classic IPA zdroje.', targetHelpFlare:'FlareStore přijímá AltStore-kompatibilní repozitáře. Mix zůstává Classic AltSource a otevře se přímo ve FlareStore.', targetHelpFeather:'Feather přijímá AltStore-kompatibilní repozitáře. Mix zůstává Classic AltSource a otevře se přímo ve Feather.', palNote:'AltStore PAL není cílem pro Vlastní Mix, protože PAL používá notarizované marketplace balíčky a jiná metadata než Classic IPA zdroje.', targetPrefix:'Cíl', statusAll:'Vše', statusPass:'Jen PASS', statusTry:'Jen ZKUSIT', platform:'Platforma', platformAll:'Vše', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Automaticky testováno',
    altPackage:'AltStore Source', sidePackage:'SideStore Source', livePackage:'LiveContainer Source', customMix:'Vlastní Mix', filters:'⚙ Filtry · 🔎 Hledání · ☑ Výběr',
    dedupeHelp:'Pokud má více položek aplikace stejné bundle ID, vygenerovaný Mix ponechá jen jednu — zpravidla nejnovější podle data. Různé varianty stejné aplikace se tím mohou sloučit do jedné.', dedupeResult:'Některé varianty aplikací měly stejné bundle ID a byly sloučeny; v Mixu zůstává jen jedna položka pro každé bundle ID.',
    addTo:'＋ Přidat do', copyUrl:'Kopírovat URL', json:'JSON ↗', apps:'aplikací', sources:'zdrojů',
    hosted:'Veřejný Mix je připraven', local:'Lokální Mix je připraven', experimental:'Experimentální Mix je připraven', localNote:'Tento PASS Mix vznikl lokálně. Akce instalátoru níže umí přidat vybrané zdroje jednotlivě; Stáhnout JSON zachová sloučený Mix s vyřešenými duplicitami.', tryNote:'Tento Mix obsahuje jeden nebo více zdrojů ZKUSIT. Akce instalátoru níže umí přidat vybrané zdroje jednotlivě, zatímco Stáhnout JSON zachová experimentální sloučený Mix pro testování.',
    conflicts:'duplicit vyřešeno', download:'Stáhnout JSON', preview:'Náhled JSON', building:'Testuji a spojuji zdroje…', failed:'Vybraný Mix se nepodařilo vytvořit.', copied:'URL zdroje zkopírována.', empty:'Aktuálním filtrům neodpovídá žádný zdroj.', directMixUnavailable:'Přímé přidání jednoho společného Mixu není dostupné.', notHostedRepos:'Nehostované pro Mix', tryRepos:'Zdroje ZKUSIT', mixLimit:'Limit hostovaného Mixu', selectedCount:'vybráno'
  },
  de: {
    title:'Custom Source Builder', desc:'Filtere geprüfte Online-Quellen, wähle eine beliebige Kombination und erstelle deinen eigenen Mix für unterstützte Classic-Source-Installer.',
    selectPass:'PASS wählen für', selectAll:'Alle sichtbaren wählen', clear:'Auswahl löschen', build:'Mix erstellen', selected:'ausgewählt', shown:'sichtbar', pass:'PASS', try:'TEST', passHelp:'Die Liste ist bereits auf das gewählte Ziel beschränkt. PASS bedeutet zusätzlich, dass die Quelle den automatischen iOS-Hub-Mix-Zusammenführungstest bestanden hat; nicht, dass jede App auf jedem iOS-Gerät läuft.',
    mixStatus:'Merge-Test', targetLabel:'Wo möchtest du den Mix hinzufügen?', targetHelpGeneric:'Classic-Mix im AltStore-kompatiblen Format. Dieser Installer kann dasselbe zusammengeführte Quellenformat verwenden.', targetHelpAlt:'Der fertige Mix wird eine Classic AltSource für AltStore Classic. SideStore-only- und PAL-Marketplace-Quellen werden ausgeblendet.', targetHelpSide:'SideStore ist vollständig mit AltStore Sources (AltSources) kompatibel. Hier zeigen wir Classic-IPA-Quellen und entfernen PAL-only Marketplace-Metadaten aus dem erzeugten Mix.', targetHelpLive:'LiveContainer kann AltStore-ähnliche Quellen durchsuchen und Apps über die Download-URL der neuesten Version installieren. Hier zeigen wir zusammenführbare Classic-IPA-Quellen.', targetHelpFlare:'FlareStore akzeptiert AltStore-kompatible Repositories. Der Mix bleibt eine Classic AltSource und wird direkt in FlareStore geöffnet.', targetHelpFeather:'Feather akzeptiert AltStore-kompatible Repositories. Der Mix bleibt eine Classic AltSource und wird direkt in Feather geöffnet.', palNote:'AltStore PAL ist kein Ziel für Custom Mix, da PAL notarized Marketplace-Pakete und andere Metadaten als Classic-IPA-Quellen verwendet.', targetPrefix:'Ziel', statusAll:'Alle', statusPass:'Nur PASS', statusTry:'Nur TEST', platform:'Plattform', platformAll:'Alle', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Automatisch geprüft',
    altPackage:'AltStore Source', sidePackage:'SideStore Source', livePackage:'LiveContainer Source', customMix:'Eigener Mix', filters:'⚙ Filter · 🔎 Suche · ☑ Auswahl',
    dedupeHelp:'Wenn mehrere App-Einträge dieselbe Bundle-ID verwenden, behält der erzeugte Mix nur einen Eintrag – normalerweise den neuesten nach Datum. Unterschiedliche Varianten derselben App können dadurch zusammengeführt werden.', dedupeResult:'Einige App-Varianten verwendeten dieselbe Bundle-ID und wurden zusammengeführt; im Mix bleibt nur ein Eintrag pro Bundle-ID.',
    addTo:'＋ Zu', copyUrl:'URL kopieren', json:'JSON ↗', apps:'Apps', sources:'Quellen',
    hosted:'Gehosteter Mix bereit', local:'Lokaler Mix bereit', experimental:'Experimenteller Mix bereit', localNote:'Dieser PASS-Mix wurde lokal erstellt. Die Installer-Aktion unten kann die ausgewählten Quellen einzeln hinzufügen; JSON herunterladen behält den zusammengeführten und bereinigten Mix.', tryNote:'Dieser Mix enthält TEST-Quellen. Die Installer-Aktion unten kann die ausgewählten Quellen einzeln hinzufügen; JSON herunterladen behält den experimentellen zusammengeführten Mix zum Testen.', conflicts:'Duplikate gelöst', download:'JSON laden', preview:'JSON ansehen', building:'Quellen werden getestet…', failed:'Der ausgewählte Mix konnte nicht erstellt werden.', copied:'URL kopiert.', empty:'Keine Quellen entsprechen den Filtern.', directMixUnavailable:'Das direkte Hinzufügen eines gemeinsamen Mixes ist nicht verfügbar.', notHostedRepos:'Nicht für Mix gehostet', tryRepos:'TEST-Quellen', mixLimit:'Hosted-Mix-Limit', selectedCount:'ausgewählt'
  },
  es: {
    title:'Custom Source Builder', desc:'Filtra fuentes online comprobadas, elige cualquier combinación y crea tu propio Mix para instaladores compatibles con fuentes Classic.',
    selectPass:'Seleccionar PASS para', selectAll:'Seleccionar visibles', clear:'Borrar selección', build:'Crear Mix', selected:'seleccionadas', shown:'visibles', pass:'PASS', try:'PROBAR', passHelp:'La lista ya está limitada al destino seleccionado. PASS además significa que la fuente superó la prueba automática de combinación de Mix; no garantiza que cada app funcione en todos los dispositivos iOS.',
    mixStatus:'Prueba de combinación', targetLabel:'¿Dónde quieres añadir el Mix?', targetHelpGeneric:'Mix Classic compatible con AltStore. Este instalador puede usar el mismo formato de fuente combinada.', targetHelpAlt:'El Mix final será una Classic AltSource para AltStore Classic. Se ocultan las fuentes exclusivas de SideStore y las de marketplace PAL.', targetHelpSide:'SideStore es totalmente compatible con AltStore Sources (AltSources). Aquí mostramos fuentes IPA Classic y eliminamos del Mix generado los metadatos exclusivos de PAL.', targetHelpLive:'LiveContainer puede navegar fuentes estilo AltStore e instalar apps desde la URL de descarga de su versión más reciente. Aquí mostramos fuentes IPA Classic combinables.', targetHelpFlare:'FlareStore acepta repositorios compatibles con AltStore. El Mix sigue siendo una Classic AltSource y se abre directamente en FlareStore.', targetHelpFeather:'Feather acepta repositorios compatibles con AltStore. El Mix sigue siendo una Classic AltSource y se abre directamente en Feather.', palNote:'AltStore PAL no es un destino de Custom Mix porque usa paquetes notarizados de marketplace y metadatos diferentes a las fuentes IPA Classic.', targetPrefix:'Destino', statusAll:'Todo', statusPass:'Solo PASS', statusTry:'Solo PROBAR', platform:'Plataforma', platformAll:'Todo', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Prueba automática',
    altPackage:'AltStore Source', sidePackage:'SideStore Source', livePackage:'LiveContainer Source', customMix:'Mix personalizado', filters:'⚙ Filtros · 🔎 Búsqueda · ☑ Selección',
    dedupeHelp:'Si varias entradas de una app usan el mismo bundle ID, el Mix generado conserva solo una — normalmente la más reciente por fecha. Por eso, distintas variantes de la misma app pueden fusionarse en una sola.', dedupeResult:'Algunas variantes compartían el mismo bundle ID y se fusionaron; en el Mix queda solo una entrada por bundle ID.',
    addTo:'＋ Añadir a', copyUrl:'Copiar URL', json:'JSON ↗', apps:'apps', sources:'fuentes',
    hosted:'Mix alojado listo', local:'Mix local listo', experimental:'Mix experimental listo', localNote:'Este Mix PASS se creó localmente. La acción del instalador puede añadir las fuentes seleccionadas una a una; Descargar JSON conserva el Mix combinado y sin duplicados.', tryNote:'Este Mix contiene fuentes PROBAR. La acción del instalador puede añadir las fuentes seleccionadas una a una; Descargar JSON conserva el Mix experimental combinado para probarlo.', conflicts:'duplicados resueltos', download:'Descargar JSON', preview:'Ver JSON', building:'Probando fuentes…', failed:'No se pudo crear el Mix.', copied:'URL copiada.', empty:'Ninguna fuente coincide con los filtros.', directMixUnavailable:'No está disponible añadir directamente un único Mix combinado.', notHostedRepos:'No alojados para Mix', tryRepos:'Fuentes PROBAR', mixLimit:'Límite del Mix alojado', selectedCount:'seleccionadas'
  },
  fr: {
    title:'Custom Source Builder', desc:'Filtrez les sources en ligne vérifiées, choisissez n’importe quelle combinaison et créez votre propre Mix pour les installateurs compatibles avec les sources Classic.',
    selectPass:'Sélectionner les PASS pour', selectAll:'Tout sélectionner affiché', clear:'Effacer la sélection', build:'Créer Mix', selected:'sélectionnées', shown:'affichées', pass:'PASS', try:'TEST', passHelp:'La liste est déjà limitée à la cible choisie. PASS signifie en plus que la source a réussi le test automatique de fusion Mix; cela ne garantit pas que chaque app fonctionne sur chaque appareil iOS.',
    mixStatus:'Test de fusion', targetLabel:'Où voulez-vous ajouter le Mix ?', targetHelpGeneric:'Mix Classic compatible avec AltStore. Cet installateur peut utiliser le même format de source fusionnée.', targetHelpAlt:'Le Mix final sera une Classic AltSource pour AltStore Classic. Les sources réservées à SideStore et les marketplaces PAL sont masquées.', targetHelpSide:'SideStore est entièrement compatible avec les AltStore Sources (AltSources). Nous affichons ici les sources IPA Classic et retirons du Mix généré les métadonnées réservées à PAL.', targetHelpLive:'LiveContainer peut parcourir les sources de style AltStore et installer les apps depuis l’URL de téléchargement de leur dernière version. Nous affichons ici les sources IPA Classic fusionnables.', targetHelpFlare:'FlareStore accepte les dépôts compatibles AltStore. Le Mix reste une Classic AltSource et s’ouvre directement dans FlareStore.', targetHelpFeather:'Feather accepte les dépôts compatibles AltStore. Le Mix reste une Classic AltSource et s’ouvre directement dans Feather.', palNote:'AltStore PAL n’est pas une cible du Custom Mix car PAL utilise des paquets marketplace notariés et des métadonnées différentes des sources IPA Classic.', targetPrefix:'Cible', statusAll:'Tout', statusPass:'PASS seulement', statusTry:'TEST seulement', platform:'Plateforme', platformAll:'Tout', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Test automatique',
    altPackage:'AltStore Source', sidePackage:'SideStore Source', livePackage:'LiveContainer Source', customMix:'Mix personnalisé', filters:'⚙ Filtres · 🔎 Recherche · ☑ Sélection',
    dedupeHelp:'Si plusieurs entrées d’une app utilisent le même bundle ID, le Mix généré n’en conserve qu’une — généralement la plus récente selon la date. Différentes variantes d’une même app peuvent donc être fusionnées.', dedupeResult:'Certaines variantes partageaient le même bundle ID et ont été fusionnées ; le Mix ne conserve qu’une entrée par bundle ID.',
    addTo:'＋ Ajouter à', copyUrl:'Copier URL', json:'JSON ↗', apps:'apps', sources:'sources',
    hosted:'Mix hébergé prêt', local:'Mix local prêt', experimental:'Mix expérimental prêt', localNote:'Ce Mix PASS a été créé localement. L’action de l’installateur peut ajouter les sources sélectionnées une par une ; Télécharger JSON conserve le Mix fusionné et dédupliqué.', tryNote:'Ce Mix contient des sources TEST. L’action de l’installateur peut ajouter les sources sélectionnées une par une ; Télécharger JSON conserve le Mix expérimental fusionné pour le test.', conflicts:'doublons résolus', download:'Télécharger JSON', preview:'Aperçu JSON', building:'Test des sources…', failed:'Impossible de créer le Mix.', copied:'URL copiée.', empty:'Aucune source ne correspond aux filtres.', directMixUnavailable:'L’ajout direct d’un Mix combiné unique n’est pas disponible.', notHostedRepos:'Non hébergés pour le Mix', tryRepos:'Sources TEST', mixLimit:'Limite du Mix hébergé', selectedCount:'sélectionnées'
  }
};

let registry = [];
let status = {};
let catalog = {};
let selected = new Set();
let blobUrl = null;
let category = 'all';
let genre = 'all';
let target = DEFAULT_BUILDER_INSTALLER_ID;
let compatibility = 'all';
let query = '';

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

function renderTargetButtons() {
  const host = $('#builderTargets');
  if (!host) return;
  host.innerHTML = BUILDER_INSTALLER_IDS.map(installerId => {
    const installer = INSTALLERS[installerId];
    return `<button class="builder-target${target === installerId ? ' active' : ''}" type="button" data-exp-target="${escapeHtml(installerId)}">
      ${installerIcon(installerId)}
      <span>${escapeHtml(installer.label)}</span>
    </button>`;
  }).join('');
}
function getStatus(id) { return status?.sources?.[id] || {}; }
function directSourceAvailable(sourceId, installerId = target) {
  return sourceInstallerDirectAvailable(getStatus(sourceId), installerId);
}
function catalogSource(id) { return catalog?.sources?.find(item => item.id === id) || null; }
function allCandidates() { return registry.filter(source => source.builder !== false && getStatus(source.id).online === true && getStatus(source.id).mixTest !== 'fail'); }
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
function targetName() {
  return INSTALLERS[target]?.label || 'AltStore';
}
function targetHelpKey() {
  return INSTALLERS[target]?.mixHelpKey || 'targetHelpGeneric';
}
function targetVariant() {
  return INSTALLERS[target]?.variant || null;
}
function matchesTarget(source) {
  const variant = targetVariant();
  return Boolean(variant && sourceVariantURL(source, variant)) && sourceInstallerIds(source).includes(target);
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
  return [source.name, source.mode, ...(source.tags || []), ...Object.values(source.description || {}), ...apps]
    .filter(Boolean).join(' ').toLowerCase();
}
function matchesQuery(source) {
  const q = query.trim().toLowerCase();
  return !q || sourceSearchText(source).includes(q);
}
function candidates() {
  return allCandidates().filter(source => matchesCategory(source) && matchesGenre(source) && matchesTarget(source) && matchesCompatibility(source) && matchesQuery(source));
}

function restoreSettings() {
  try {
    const data = JSON.parse(safeGet(STORAGE.selection) || '[]');
    if (Array.isArray(data)) selected = new Set(data.map(String));
  } catch (_) { selected = new Set(); }
  const savedCategory = safeGet(STORAGE.category);
  const savedGenre = safeGet(STORAGE.genre);
  const savedTarget = safeGet(STORAGE.target);
  const savedCompatibility = safeGet(STORAGE.compatibility);
  category = SOURCE_CATEGORIES.has(savedCategory) ? savedCategory : 'all';
  genre = GENRES.has(savedGenre) ? savedGenre : 'all';
  target = TARGETS.has(savedTarget) ? savedTarget : DEFAULT_BUILDER_INSTALLER_ID;
  compatibility = COMPATIBILITY.has(savedCompatibility) ? savedCompatibility : 'all';
  query = safeGet(STORAGE.query) || '';
}
function saveSelection() { safeSet(STORAGE.selection, JSON.stringify([...selected])); }
function saveFilters() {
  safeSet(STORAGE.category, category);
  safeSet(STORAGE.genre, genre);
  safeSet(STORAGE.target, target);
  safeSet(STORAGE.compatibility, compatibility);
  safeSet(STORAGE.query, query);
}
function hideResult() { $('#expResult')?.classList.remove('show'); }

function applyCopy() {
  const map = {expSelectAll:'selectAll', expClear:'clear', expBuild:'build'};
  Object.entries(map).forEach(([id,key]) => { const node = $('#' + id); if (node) node.textContent = tr(key); });
  const selectPass = $('#expSelectCompatible');
  if (selectPass) selectPass.textContent = `${tr('selectPass')} ${targetName()}`;
  if ($('#builderTitle')) $('#builderTitle').textContent = tr('title');
  if ($('#builderDesc')) $('#builderDesc').textContent = tr('desc');
  if ($('#customMixCardTitle')) $('#customMixCardTitle').textContent = tr('customMix');
  if ($('#customMixFiltersLabel')) $('#customMixFiltersLabel').textContent = tr('filters');
  if ($('#mixTargetLabel')) $('#mixTargetLabel').textContent = tr('targetLabel');
  if ($('#mixTargetHelp')) $('#mixTargetHelp').textContent = tr(targetHelpKey());
  if ($('#mixPalNote')) $('#mixPalNote').textContent = tr('palNote');
  if ($('#mixStatusLabel')) $('#mixStatusLabel').textContent = tr('mixStatus');
  if ($('#mixTestBadge')) $('#mixTestBadge').textContent = tr('autoTested');
  if ($('#mixPassHelp')) $('#mixPassHelp').textContent = tr('passHelp');
  if ($('#mixDedupeHelp')) $('#mixDedupeHelp').textContent = tr('dedupeHelp');
  const targetBadge = $('#mixTargetBadge');
  if (targetBadge) targetBadge.innerHTML = `${installerIcon(target)}${escapeHtml(tr('targetPrefix'))}: ${escapeHtml(targetName())}`;
  renderTargetButtons();

  const statusLabels = {all:'statusAll', pass:'statusPass', try:'statusTry'};
  $$('[data-exp-compat-filter]').forEach(button => { button.textContent = tr(statusLabels[button.dataset.expCompatFilter] || 'statusAll'); });
}

function syncFilterUi() {
  $$('[data-exp-category-filter]').forEach(button => button.classList.toggle('active', button.dataset.expCategoryFilter === category));
  $$('[data-exp-genre-filter]').forEach(button => button.classList.toggle('active', button.dataset.expGenreFilter === genre));
  $$('[data-exp-target]').forEach(button => button.classList.toggle('active', button.dataset.expTarget === target));
  $$('[data-exp-compat-filter]').forEach(button => button.classList.toggle('active', button.dataset.expCompatFilter === compatibility));
  const search = $('#expSourceSearch');
  if (search && search.value !== query) search.value = query;
}

function packageCard(name, url, meta, installerId) {
  if (!url || !INSTALLERS[installerId]) return '';
  const installer = INSTALLERS[installerId];
  const install = installer.buildLink(url);
  return `<article class="official-source-card">
    <span class="pill mode service-pill">${installerIcon(installerId)}${escapeHtml(installer.label)}</span>
    <h4>${escapeHtml(name)}</h4>
    <div class="muted">${escapeHtml(meta)}</div>
    <div class="official-source-actions">
      <a class="btn small primary installer-action" href="${escapeHtml(install)}">${installerIcon(installerId)}${escapeHtml(tr('addTo'))} ${escapeHtml(installer.label)}</a>
      <button class="btn small secondary" type="button" data-copy-source="${escapeHtml(url)}">${escapeHtml(tr('copyUrl'))}</button>
      <a class="btn small ghost" target="_blank" rel="noopener" href="${escapeHtml(url)}">${escapeHtml(tr('json'))}</a>
    </div>
  </article>`;
}

function renderOfficialPackages() {
  const node = $('#officialSourcePackages');
  if (!node) return;
  node.innerHTML = BUILDER_INSTALLER_IDS.map(installerId => {
    const data = installerMixPackageData(status, installerId);
    if (!data) return '';
    const sourceCount = data.sourceIDs.length;
    const meta = data.appCount
      ? `${sourceCount} ${tr('sources')} · ${data.appCount} ${tr('apps')}`
      : `${sourceCount} ${tr('sources')}`;
    const name = `${INSTALLERS[installerId].label} Source`;
    return packageCard(name, data.sourceURL, meta, installerId);
  }).join('');
}

function modeName(source) {
  return sourceFormatLabel(source);
}

function render() {
  applyCopy();
  syncFilterUi();
  renderOfficialPackages();
  const list = $('#experimentalBuilderList');
  if (!list) return;

  const available = candidates();
  const validIds = new Set(allCandidates().filter(source => matchesTarget(source)).map(source => source.id));
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
      <div><strong>${escapeHtml(source.name)}</strong><span>${escapeHtml(modeName(source))} · → ${escapeHtml(targetName())}</span></div>
      <div class="builder-count"><span class="pill online">● ONLINE</span> <span class="pill ${cls}">${escapeHtml(test)}</span> ${Number.isFinite(item.appCount) ? `${item.appCount} ${escapeHtml(tr('apps'))}` : ''}</div>
    </label>`;
  }).join('') : `<div class="notice">${escapeHtml(tr('empty'))}</div>`;

  const count = $('#expSelectedCount');
  if (count) count.textContent = `${selected.size} ${tr('selected')} · ${available.length} ${tr('shown')} · ${tr('targetPrefix')}: ${targetName()}`;
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
  const classicTargets = new Set(BUILDER_INSTALLER_IDS);
  const manual = hostedIds();
  const max = Number(status?.mixes?.maxSourcesPerMix || 0);
  if (sorted.length && sorted.length <= max && sorted.every(id => manual.has(id))) {
    return {
      url:new URL(`mix/${sorted.join('--')}.json`, window.location.href).href.split('#')[0],
      targets:classicTargets
    };
  }

  const auto = [...autoCompatibleIds()];
  if (auto.length && sameIds(sorted, auto)) {
    return {url:status?.mixes?.allCompatibleURL || null, targets:classicTargets};
  }

  for (const packageId of MIX_PACKAGE_IDS) {
    const data = mixPackageData(status, packageId, {fallbacks:false});
    if (data.sourceIDs.length && sameIds(sorted, data.sourceIDs)) {
      return {
        url:data.sourceURL || null,
        targets:new Set(mixPackageTargetIds(packageId))
      };
    }
  }

  return {url:null, targets:new Set()};
}

function localMixDiagnostic(ids, hasTry) {
  const parts = [tr('directMixUnavailable')];
  const manual = hostedIds();
  const max = Number(status?.mixes?.maxSourcesPerMix || 0);

  const unhosted = ids
    .filter(id => !manual.has(id))
    .map(id => registry.find(source => source.id === id)?.name || id);

  const trySources = hasTry
    ? ids
        .filter(id => getStatus(id).mixTest !== 'pass')
        .map(id => registry.find(source => source.id === id)?.name || id)
    : [];

  if (unhosted.length) {
    parts.push(`${tr('notHostedRepos')}: ${unhosted.join(', ')}.`);
  }
  if (max > 0 && ids.length > max) {
    parts.push(`${tr('mixLimit')}: ${max}; ${tr('selectedCount')}: ${ids.length}.`);
  }
  if (trySources.length) {
    parts.push(`${tr('tryRepos')}: ${trySources.join(', ')}.`);
  }

  parts.push(hasTry ? tr('tryNote') : tr('localNote'));
  return parts.join(' ');
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

    const hosted = hostedTarget(ids);
    const names = ids.map(id => registry.find(source => source.id === id)?.name || id);
    const hasTry = ids.some(id => getStatus(id).mixTest !== 'pass');
    const mix = {
      name:`Mix · ${names.join(' + ')}`,
      identifier:`com.caseycz.ios.mix.${hashIds(ids)}`,
      subtitle:hasTry ? 'Experimental combined source generated locally by iOS Hub' : 'Combined source generated by iOS Hub',
      website:'https://caseycz.github.io/iOS-Hub/',
      tintColor:'#38BDF8',
      apps,
      userInfo:{sourceIDs:ids, sourceURLs:ids.map(id => sourceVariantURL(registry.find(source => source.id === id), targetVariant()) || ''), experimental:hasTry}
    };

    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = URL.createObjectURL(new Blob([JSON.stringify(mix,null,2) + '\n'], {type:'application/json'}));

    $('#expResultTitle').textContent = hosted.url ? tr('hosted') : (hasTry ? tr('experimental') : tr('local'));
    $('#expResultInfo').textContent = `${apps.length} ${tr('apps')} · ${conflicts} ${tr('conflicts')}`;
    const resultNotes = [];
    if (!hosted.url) resultNotes.push(localMixDiagnostic(ids, hasTry));
    if (conflicts > 0) resultNotes.push(tr('dedupeResult'));
    $('#expResultNote').textContent = resultNotes.join(' ');
    $('#expDownload').href = blobUrl;
    $('#expDownload').download = `iOS-Hub-Mix-${hashIds(ids)}.json`;
    $('#expDownload').textContent = tr('download');
    $('#expPreview').href = blobUrl;
    $('#expPreview').textContent = tr('preview');

    const addTarget = $('#expAddTarget');
    const addSources = $('#expAddSources');
    const addSourcesSummary = $('#expAddSourcesSummary');
    const addSourcesMenu = $('#expAddSourcesMenu');
    const copyButton = $('#expCopyUrl');
    const installer = INSTALLERS[target];

    addTarget.hidden = true;
    addSources.hidden = true;
    addSources.removeAttribute('open');
    addSourcesMenu.innerHTML = '';

    if (hosted.url && hosted.targets.has(target) && installer) {
      addTarget.hidden = false;
      addTarget.href = installer.buildLink(hosted.url);
      addTarget.innerHTML = `${installerIcon(target)}${escapeHtml(tr('addTo'))} ${escapeHtml(targetName())}`;
    } else if (installer && ids.length === 1) {
      const source = registry.find(item => item.id === ids[0]);
      const sourceUrl = sourceVariantURL(source, targetVariant());
      if (sourceUrl && directSourceAvailable(ids[0], target)) {
        addTarget.hidden = false;
        addTarget.href = installer.buildLink(sourceUrl);
        addTarget.innerHTML = `${installerIcon(target)}${escapeHtml(tr('addTo'))} ${escapeHtml(targetName())}`;
      }
    } else if (installer && ids.length > 1) {
      const sourceActions = ids.map(id => {
        const source = registry.find(item => item.id === id);
        const sourceUrl = sourceVariantURL(source, targetVariant());
        if (!source || !sourceUrl || !directSourceAvailable(id, target)) return '';
        return `<a class="btn small secondary installer-action" href="${escapeHtml(installer.buildLink(sourceUrl))}">${installerIcon(target)}${escapeHtml(source.name || id)}</a>`;
      }).filter(Boolean);

      if (sourceActions.length) {
        addSources.hidden = false;
        addSourcesSummary.innerHTML = `${installerIcon(target)}${escapeHtml(tr('addTo'))} ${escapeHtml(targetName())} ▾`;
        addSourcesMenu.innerHTML = sourceActions.join('');
      }
    }

    if (hosted.url) {
      copyButton.hidden = false;
      copyButton.dataset.url = hosted.url;
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
  if (host) restoreSettings();

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

  // The homepage has the prepared source cards but not the standalone
  // Custom Builder controls. Render those cards even when the Builder host
  // is absent; previously the early return left "Ready sources" empty.
  if (!host) {
    renderOfficialPackages();
    $('#languageSelect')?.addEventListener('change', () => setTimeout(renderOfficialPackages,0));
    return;
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
  $$('[data-exp-target]').forEach(button => button.addEventListener('click', () => {
    const nextTarget = TARGETS.has(button.dataset.expTarget) ? button.dataset.expTarget : DEFAULT_BUILDER_INSTALLER_ID;
    if (nextTarget !== target) {
      target = nextTarget;
      selected.clear();
      saveSelection();
      hideResult();
    }
    saveFilters();
    render();
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
