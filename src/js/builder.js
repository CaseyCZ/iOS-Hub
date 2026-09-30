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
} from './installers.js?v=1.1.5-20260930-mix-profiles1';

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
    selectPass:'Select PASS for', selectAll:'Select all shown', clear:'Clear selection', build:'Build Mix', selected:'selected', shown:'shown', pass:'PASS', try:'TRY', passHelp:'PASS means the source is compatible with the selected installer and passed the automated Mix merge test. It does not guarantee every app will run on every iOS device.', compatLogic:'PASS = compatible with the selected installer and passed the automated Mix merge test. TRY = compatible format but not fully verified; you can still select it for testing. INCOMPATIBLE = cannot be used with the installer selected above and is disabled. Changing installer removes incompatible selected Sources. Build Mix combines the selected Sources into one Source. Direct “Add to …” opens the selected app only when the combined Mix has a public HTTPS URL; otherwise Download / Preview remain available.', incompatible:'INCOMPATIBLE', incompatibleReason:'Not compatible with the selected installer.', removedIncompatible:'{n} previously selected source(s) were removed because they are not compatible with {tool}.',
    mixStatus:'Merge test', targetLabel:'Where do you want to add the Mix?', targetHelpGeneric:'Classic AltStore-compatible Mix. This installer can use the same merged source format.', targetHelpAlt:'The finished Mix will be a Classic AltSource for AltStore Classic. Sources that cannot be used with AltStore remain visible but disabled.', targetHelpSide:'SideStore is fully compatible with AltStore Sources (AltSources). We show Classic IPA-style sources here and remove PAL-only marketplace metadata from the generated Mix.', targetHelpLive:'LiveContainer can browse AltStore-style sources and install apps from their latest version download URL. We show mergeable Classic IPA-style sources here.', targetHelpFlare:'FlareStore accepts AltStore-compatible repositories. The Mix stays a Classic AltSource and opens directly in FlareStore.', targetHelpFeather:'Feather accepts AltStore-compatible repositories. The Mix stays a Classic AltSource and opens directly in Feather.', palNote:'AltStore PAL is not a Custom Mix target because PAL uses notarized marketplace packages and different source metadata than Classic IPA sources.', targetPrefix:'Target', statusAll:'All', statusPass:'PASS only', statusTry:'TRY only', platform:'Platform', platformAll:'All', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Auto tested',
    altPackage:'AltStore Source', sidePackage:'SideStore Source', livePackage:'LiveContainer Source', customMix:'Custom Mix', filters:'⚙ Filters · 🔎 Search · ☑ Selection',
    dedupeHelp:'When multiple app entries use the same bundle ID, the generated Mix keeps only one entry — normally the newest by date. Different variants of the same app can therefore be merged into one.', dedupeResult:'Some app variants shared the same bundle ID and were merged; only one entry per bundle ID remains in the Mix.',
    addTo:'＋ Add to', copyUrl:'Copy URL', json:'JSON ↗', apps:'apps', sources:'sources',
    hosted:'Hosted Mix ready', local:'Mix built locally — not installable yet', experimental:'Experimental Mix built locally', localNote:'The Mix was created successfully, but it currently exists only inside this browser. To open it directly in the selected installer, the combined JSON must first have a public HTTPS URL. Download / Preview remain available.', tryNote:'This Mix contains one or more TRY sources and was created locally. Direct Add requires a public HTTPS URL for the combined JSON; Download / Preview remain available for testing.',
    conflicts:'duplicates resolved', download:'Download JSON', preview:'Preview JSON', building:'Testing and combining sources…', failed:'The selected Mix could not be built.', copied:'Source URL copied.', empty:'No sources match the current filters.', rightsEmpty:'Custom Mix hosting is temporarily limited to Sources with explicit aggregation approval. Individual Sources remain available from the main catalog.', directMixUnavailable:'Direct add of one combined Mix is not available.', notHostedRepos:'Not hosted for Mix', tryRepos:'TRY sources', mixLimit:'Hosted Mix limit', selectedCount:'selected'
  },
  cs: {
    title:'Custom Source Builder', desc:'Filtruj kontrolované online zdroje, vyber libovolnou kombinaci a vytvoř vlastní Mix pro podporované instalátory Classic zdrojů.',
    selectPass:'Vybrat PASS pro', selectAll:'Vybrat vše zobrazené', clear:'Zrušit výběr', build:'Vytvořit Mix', selected:'vybráno', shown:'zobrazeno', pass:'PASS', try:'ZKUSIT', passHelp:'PASS znamená, že Source je kompatibilní se zvoleným instalátorem a prošel automatickým testem sloučení do Mixu; neznamená to, že každá aplikace poběží na každém iOS zařízení.', compatLogic:'PASS = kompatibilní se zvoleným instalátorem a prošel automatickým testem sloučení. ZKUSIT = formát je kompatibilní, ale není plně ověřený; pro testování ho lze vybrat. NEKOMPATIBILNÍ = se zvoleným instalátorem nejde použít a nelze ho zaškrtnout. Při změně instalátoru se nekompatibilní vybrané Sources automaticky odeberou. Vytvořit Mix spojí vybrané Sources do jednoho Source. Přímé „Přidat do …“ otevře zvolenou aplikaci jen tehdy, když má sloučený Mix veřejnou HTTPS URL; jinak zůstane Stáhnout / Náhled.', incompatible:'NEKOMPATIBILNÍ', incompatibleReason:'Není kompatibilní se zvoleným instalátorem.', removedIncompatible:'Kvůli nekompatibilitě s {tool} bylo z výběru odebráno Sources: {n}.',
    mixStatus:'Test sloučení', targetLabel:'Kam chceš výsledný Mix přidat?', targetHelpGeneric:'Classic Mix kompatibilní s AltStore. Tento instalátor může použít stejný formát sloučeného zdroje.', targetHelpAlt:'Výsledný Mix bude Classic AltSource pro AltStore Classic. Sources, které s AltStore nejdou použít, zůstanou viditelné, ale nepůjdou vybrat.', targetHelpSide:'SideStore je plně kompatibilní s AltStore Sources (AltSources). Zobrazujeme zde Classic IPA zdroje a z výsledného Mixu odstraňujeme metadata určená jen pro PAL marketplace.', targetHelpLive:'LiveContainer umí procházet AltStore-style zdroje a instalovat aplikace z download URL jejich nejnovější verze. Zobrazujeme zde sloučitelné Classic IPA zdroje.', targetHelpFlare:'FlareStore přijímá AltStore-kompatibilní repozitáře. Mix zůstává Classic AltSource a otevře se přímo ve FlareStore.', targetHelpFeather:'Feather přijímá AltStore-kompatibilní repozitáře. Mix zůstává Classic AltSource a otevře se přímo ve Feather.', palNote:'AltStore PAL není cílem pro Vlastní Mix, protože PAL používá notarizované marketplace balíčky a jiná metadata než Classic IPA zdroje.', targetPrefix:'Cíl', statusAll:'Vše', statusPass:'Jen PASS', statusTry:'Jen ZKUSIT', platform:'Platforma', platformAll:'Vše', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Automaticky testováno',
    altPackage:'AltStore Source', sidePackage:'SideStore Source', livePackage:'LiveContainer Source', customMix:'Vlastní Mix', filters:'⚙ Filtry · 🔎 Hledání · ☑ Výběr',
    dedupeHelp:'Pokud má více položek aplikace stejné bundle ID, vygenerovaný Mix ponechá jen jednu — zpravidla nejnovější podle data. Různé varianty stejné aplikace se tím mohou sloučit do jedné.', dedupeResult:'Některé varianty aplikací měly stejné bundle ID a byly sloučeny; v Mixu zůstává jen jedna položka pro každé bundle ID.',
    addTo:'＋ Přidat do', copyUrl:'Kopírovat URL', json:'JSON ↗', apps:'aplikací', sources:'zdrojů',
    hosted:'Veřejný Mix je připraven', local:'Mix vytvořen lokálně — zatím nejde přímo nainstalovat', experimental:'Experimentální Mix vytvořen lokálně', localNote:'Mix se vytvořil správně, ale zatím existuje jen v tomto prohlížeči. Aby šel otevřít přímo ve zvoleném instalátoru, musí mít sloučený JSON veřejnou HTTPS adresu. Stáhnout / Náhled zůstává dostupný.', tryNote:'Mix obsahuje jeden nebo více Sources ZKUSIT a byl vytvořen lokálně. Přímé Přidat do… vyžaduje veřejnou HTTPS adresu sloučeného JSONu; Stáhnout / Náhled zůstává dostupný pro test.',
    conflicts:'duplicit vyřešeno', download:'Stáhnout JSON', preview:'Náhled JSON', building:'Testuji a spojuji zdroje…', failed:'Vybraný Mix se nepodařilo vytvořit.', copied:'URL zdroje zkopírována.', empty:'Aktuálním filtrům neodpovídá žádný zdroj.', rightsEmpty:'Hostovaný Custom Mix je dočasně omezen jen na Sources s výslovně ověřeným právem k agregaci. Jednotlivé Sources zůstávají dostupné v hlavním katalogu.', directMixUnavailable:'Přímé přidání jednoho společného Mixu není dostupné.', notHostedRepos:'Nehostované pro Mix', tryRepos:'Zdroje ZKUSIT', mixLimit:'Limit hostovaného Mixu', selectedCount:'vybráno'
  },
  de: {
    title:'Custom Source Builder', desc:'Filtere geprüfte Online-Quellen, wähle eine beliebige Kombination und erstelle deinen eigenen Mix für unterstützte Classic-Source-Installer.',
    selectPass:'PASS wählen für', selectAll:'Alle sichtbaren wählen', clear:'Auswahl löschen', build:'Mix erstellen', selected:'ausgewählt', shown:'sichtbar', pass:'PASS', try:'TEST', passHelp:'PASS bedeutet, dass die Quelle mit dem gewählten Installer kompatibel ist und den automatischen Mix-Test bestanden hat; nicht, dass jede App auf jedem iOS-Gerät läuft.', compatLogic:'PASS = kompatibel und automatisch für den Mix geprüft. TEST = kompatibles Format, aber nicht vollständig verifiziert; die Quelle kann zum Testen ausgewählt werden. NICHT KOMPATIBEL = kann mit dem oben gewählten Installer nicht verwendet werden und ist deaktiviert. Beim Wechsel des Installers werden inkompatible ausgewählte Quellen entfernt. Mix erstellen kombiniert die ausgewählten Quellen zu einer Source. Direktes „Zu … hinzufügen“ öffnet die gewählte App nur, wenn der kombinierte Mix eine öffentliche HTTPS-URL hat; sonst bleiben Download / Vorschau verfügbar.', incompatible:'NICHT KOMPATIBEL', incompatibleReason:'Nicht mit dem ausgewählten Installer kompatibel.', removedIncompatible:'{n} zuvor ausgewählte Quelle(n) wurden entfernt, weil sie nicht mit {tool} kompatibel sind.',
    mixStatus:'Merge-Test', targetLabel:'Wo möchtest du den Mix hinzufügen?', targetHelpGeneric:'Classic-Mix im AltStore-kompatiblen Format. Dieser Installer kann dasselbe zusammengeführte Quellenformat verwenden.', targetHelpAlt:'Der fertige Mix wird eine Classic AltSource für AltStore Classic. Nicht kompatible Quellen bleiben sichtbar, sind aber deaktiviert.', targetHelpSide:'SideStore ist vollständig mit AltStore Sources (AltSources) kompatibel. Hier zeigen wir Classic-IPA-Quellen und entfernen PAL-only Marketplace-Metadaten aus dem erzeugten Mix.', targetHelpLive:'LiveContainer kann AltStore-ähnliche Quellen durchsuchen und Apps über die Download-URL der neuesten Version installieren. Hier zeigen wir zusammenführbare Classic-IPA-Quellen.', targetHelpFlare:'FlareStore akzeptiert AltStore-kompatible Repositories. Der Mix bleibt eine Classic AltSource und wird direkt in FlareStore geöffnet.', targetHelpFeather:'Feather akzeptiert AltStore-kompatible Repositories. Der Mix bleibt eine Classic AltSource und wird direkt in Feather geöffnet.', palNote:'AltStore PAL ist kein Ziel für Custom Mix, da PAL notarized Marketplace-Pakete und andere Metadaten als Classic-IPA-Quellen verwendet.', targetPrefix:'Ziel', statusAll:'Alle', statusPass:'Nur PASS', statusTry:'Nur TEST', platform:'Plattform', platformAll:'Alle', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Automatisch geprüft',
    altPackage:'AltStore Source', sidePackage:'SideStore Source', livePackage:'LiveContainer Source', customMix:'Eigener Mix', filters:'⚙ Filter · 🔎 Suche · ☑ Auswahl',
    dedupeHelp:'Wenn mehrere App-Einträge dieselbe Bundle-ID verwenden, behält der erzeugte Mix nur einen Eintrag – normalerweise den neuesten nach Datum. Unterschiedliche Varianten derselben App können dadurch zusammengeführt werden.', dedupeResult:'Einige App-Varianten verwendeten dieselbe Bundle-ID und wurden zusammengeführt; im Mix bleibt nur ein Eintrag pro Bundle-ID.',
    addTo:'＋ Zu', copyUrl:'URL kopieren', json:'JSON ↗', apps:'Apps', sources:'Quellen',
    hosted:'Gehosteter Mix bereit', local:'Mix lokal erstellt — noch nicht direkt installierbar', experimental:'Experimenteller Mix lokal erstellt', localNote:'Der Mix wurde erfolgreich erstellt, existiert aber nur in diesem Browser. Direktes Öffnen im gewählten Installer benötigt eine öffentliche HTTPS-URL für das kombinierte JSON. Download / Vorschau bleiben verfügbar.', tryNote:'Dieser Mix enthält TEST-Quellen und wurde lokal erstellt. Direktes Hinzufügen benötigt eine öffentliche HTTPS-URL für das kombinierte JSON; Download / Vorschau bleiben verfügbar.', conflicts:'Duplikate gelöst', download:'JSON laden', preview:'JSON ansehen', building:'Quellen werden getestet…', failed:'Der ausgewählte Mix konnte nicht erstellt werden.', copied:'URL kopiert.', empty:'Keine Quellen entsprechen den Filtern.', rightsEmpty:'Custom-Mix-Hosting ist vorübergehend auf Sources mit ausdrücklich geprüfter Aggregationsfreigabe beschränkt. Einzelne Sources bleiben im Hauptkatalog verfügbar.', directMixUnavailable:'Das direkte Hinzufügen eines gemeinsamen Mixes ist nicht verfügbar.', notHostedRepos:'Nicht für Mix gehostet', tryRepos:'TEST-Quellen', mixLimit:'Hosted-Mix-Limit', selectedCount:'ausgewählt'
  },
  es: {
    title:'Custom Source Builder', desc:'Filtra fuentes online comprobadas, elige cualquier combinación y crea tu propio Mix para instaladores compatibles con fuentes Classic.',
    selectPass:'Seleccionar PASS para', selectAll:'Seleccionar visibles', clear:'Borrar selección', build:'Crear Mix', selected:'seleccionadas', shown:'visibles', pass:'PASS', try:'PROBAR', passHelp:'PASS significa que la fuente es compatible con el instalador seleccionado y superó la prueba automática de Mix; no garantiza que cada app funcione en todos los dispositivos iOS.', compatLogic:'PASS = compatible y verificada automáticamente para el Mix. PROBAR = formato compatible pero no verificado por completo; puede seleccionarse para pruebas. INCOMPATIBLE = no puede usarse con el instalador elegido y queda desactivada. Al cambiar de instalador se eliminan las Sources seleccionadas incompatibles. Crear Mix combina las Sources elegidas en una sola Source. “Añadir a …” abre directamente la app elegida solo cuando el Mix combinado tiene una URL HTTPS pública; de lo contrario quedan disponibles Descargar / Vista previa.', incompatible:'INCOMPATIBLE', incompatibleReason:'No es compatible con el instalador seleccionado.', removedIncompatible:'Se eliminaron {n} fuente(s) seleccionadas porque no son compatibles con {tool}.',
    mixStatus:'Prueba de combinación', targetLabel:'¿Dónde quieres añadir el Mix?', targetHelpGeneric:'Mix Classic compatible con AltStore. Este instalador puede usar el mismo formato de fuente combinada.', targetHelpAlt:'El Mix final será una Classic AltSource para AltStore Classic. Las Sources incompatibles permanecen visibles, pero desactivadas.', targetHelpSide:'SideStore es totalmente compatible con AltStore Sources (AltSources). Aquí mostramos fuentes IPA Classic y eliminamos del Mix generado los metadatos exclusivos de PAL.', targetHelpLive:'LiveContainer puede navegar fuentes estilo AltStore e instalar apps desde la URL de descarga de su versión más reciente. Aquí mostramos fuentes IPA Classic combinables.', targetHelpFlare:'FlareStore acepta repositorios compatibles con AltStore. El Mix sigue siendo una Classic AltSource y se abre directamente en FlareStore.', targetHelpFeather:'Feather acepta repositorios compatibles con AltStore. El Mix sigue siendo una Classic AltSource y se abre directamente en Feather.', palNote:'AltStore PAL no es un destino de Custom Mix porque usa paquetes notarizados de marketplace y metadatos diferentes a las fuentes IPA Classic.', targetPrefix:'Destino', statusAll:'Todo', statusPass:'Solo PASS', statusTry:'Solo PROBAR', platform:'Plataforma', platformAll:'Todo', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Prueba automática',
    altPackage:'AltStore Source', sidePackage:'SideStore Source', livePackage:'LiveContainer Source', customMix:'Mix personalizado', filters:'⚙ Filtros · 🔎 Búsqueda · ☑ Selección',
    dedupeHelp:'Si varias entradas de una app usan el mismo bundle ID, el Mix generado conserva solo una — normalmente la más reciente por fecha. Por eso, distintas variantes de la misma app pueden fusionarse en una sola.', dedupeResult:'Algunas variantes compartían el mismo bundle ID y se fusionaron; en el Mix queda solo una entrada por bundle ID.',
    addTo:'＋ Añadir a', copyUrl:'Copiar URL', json:'JSON ↗', apps:'apps', sources:'fuentes',
    hosted:'Mix alojado listo', local:'Mix creado localmente — aún no se puede instalar directamente', experimental:'Mix experimental creado localmente', localNote:'El Mix se creó correctamente, pero por ahora solo existe en este navegador. Para abrirlo directamente en el instalador seleccionado, el JSON combinado necesita una URL HTTPS pública. Descargar / Vista previa siguen disponibles.', tryNote:'Este Mix contiene Sources PROBAR y se creó localmente. Añadir directamente requiere una URL HTTPS pública del JSON combinado; Descargar / Vista previa siguen disponibles.', conflicts:'duplicados resueltos', download:'Descargar JSON', preview:'Ver JSON', building:'Probando fuentes…', failed:'No se pudo crear el Mix.', copied:'URL copiada.', empty:'Ninguna fuente coincide con los filtros.', rightsEmpty:'El alojamiento de Custom Mix está temporalmente limitado a Sources con autorización de agregación verificada. Las Sources individuales siguen disponibles en el catálogo principal.', directMixUnavailable:'No está disponible añadir directamente un único Mix combinado.', notHostedRepos:'No alojados para Mix', tryRepos:'Fuentes PROBAR', mixLimit:'Límite del Mix alojado', selectedCount:'seleccionadas'
  },
  fr: {
    title:'Custom Source Builder', desc:'Filtrez les sources en ligne vérifiées, choisissez n’importe quelle combinaison et créez votre propre Mix pour les installateurs compatibles avec les sources Classic.',
    selectPass:'Sélectionner les PASS pour', selectAll:'Tout sélectionner affiché', clear:'Effacer la sélection', build:'Créer Mix', selected:'sélectionnées', shown:'affichées', pass:'PASS', try:'TEST', passHelp:'PASS signifie que la source est compatible avec l’installateur sélectionné et a réussi le test automatique de Mix ; cela ne garantit pas que chaque app fonctionne sur chaque appareil iOS.', compatLogic:'PASS = compatible et vérifié automatiquement pour le Mix. TEST = format compatible mais pas entièrement vérifié ; la source peut être sélectionnée pour tester. INCOMPATIBLE = ne peut pas être utilisée avec l’installateur choisi et reste désactivée. Changer d’installateur retire les Sources sélectionnées incompatibles. Créer Mix combine les Sources choisies en une seule Source. « Ajouter à … » ouvre directement l’app choisie seulement si le Mix combiné possède une URL HTTPS publique ; sinon Télécharger / Aperçu restent disponibles.', incompatible:'INCOMPATIBLE', incompatibleReason:'Non compatible avec l’installateur sélectionné.', removedIncompatible:'{n} source(s) sélectionnée(s) ont été retirées car elles ne sont pas compatibles avec {tool}.',
    mixStatus:'Test de fusion', targetLabel:'Où voulez-vous ajouter le Mix ?', targetHelpGeneric:'Mix Classic compatible avec AltStore. Cet installateur peut utiliser le même format de source fusionnée.', targetHelpAlt:'Le Mix final sera une Classic AltSource pour AltStore Classic. Les Sources incompatibles restent visibles mais désactivées.', targetHelpSide:'SideStore est entièrement compatible avec les AltStore Sources (AltSources). Nous affichons ici les sources IPA Classic et retirons du Mix généré les métadonnées réservées à PAL.', targetHelpLive:'LiveContainer peut parcourir les sources de style AltStore et installer les apps depuis l’URL de téléchargement de leur dernière version. Nous affichons ici les sources IPA Classic fusionnables.', targetHelpFlare:'FlareStore accepte les dépôts compatibles AltStore. Le Mix reste une Classic AltSource et s’ouvre directement dans FlareStore.', targetHelpFeather:'Feather accepte les dépôts compatibles AltStore. Le Mix reste une Classic AltSource et s’ouvre directement dans Feather.', palNote:'AltStore PAL n’est pas une cible du Custom Mix car PAL utilise des paquets marketplace notariés et des métadonnées différentes des sources IPA Classic.', targetPrefix:'Cible', statusAll:'Tout', statusPass:'PASS seulement', statusTry:'TEST seulement', platform:'Plateforme', platformAll:'Tout', classic:'AltStore Classic', pal:'AltStore PAL', sidestore:'SideStore', livecontainer:'LiveContainer', autoTested:'Test automatique',
    altPackage:'AltStore Source', sidePackage:'SideStore Source', livePackage:'LiveContainer Source', customMix:'Mix personnalisé', filters:'⚙ Filtres · 🔎 Recherche · ☑ Sélection',
    dedupeHelp:'Si plusieurs entrées d’une app utilisent le même bundle ID, le Mix généré n’en conserve qu’une — généralement la plus récente selon la date. Différentes variantes d’une même app peuvent donc être fusionnées.', dedupeResult:'Certaines variantes partageaient le même bundle ID et ont été fusionnées ; le Mix ne conserve qu’une entrée par bundle ID.',
    addTo:'＋ Ajouter à', copyUrl:'Copier URL', json:'JSON ↗', apps:'apps', sources:'sources',
    hosted:'Mix hébergé prêt', local:'Mix créé localement — pas encore installable directement', experimental:'Mix expérimental créé localement', localNote:'Le Mix a été créé correctement, mais il existe seulement dans ce navigateur. Pour l’ouvrir directement dans l’installateur choisi, le JSON combiné doit avoir une URL HTTPS publique. Télécharger / Aperçu restent disponibles.', tryNote:'Ce Mix contient des Sources TEST et a été créé localement. L’ajout direct nécessite une URL HTTPS publique pour le JSON combiné ; Télécharger / Aperçu restent disponibles.', conflicts:'doublons résolus', download:'Télécharger JSON', preview:'Aperçu JSON', building:'Test des sources…', failed:'Impossible de créer le Mix.', copied:'URL copiée.', empty:'Aucune source ne correspond aux filtres.', rightsEmpty:'L’hébergement Custom Mix est temporairement limité aux Sources dont l’autorisation d’agrégation a été vérifiée. Les Sources individuelles restent disponibles dans le catalogue principal.', directMixUnavailable:'L’ajout direct d’un Mix combiné unique n’est pas disponible.', notHostedRepos:'Non hébergés pour le Mix', tryRepos:'Sources TEST', mixLimit:'Limite du Mix hébergé', selectedCount:'sélectionnées'
  }
};

let registry = [];
let status = {};
let catalog = {};
let selected = new Set();
let blobUrl = null;
let mixApiConfig = null;
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
  const current = INSTALLERS[target] || INSTALLERS[DEFAULT_BUILDER_INSTALLER_ID];
  const options = BUILDER_INSTALLER_IDS.map(installerId => {
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
function directSourceAvailable(sourceId, installerId = target) {
  return sourceInstallerDirectAvailable(getStatus(sourceId), installerId);
}
function catalogSource(id) { return catalog?.sources?.find(item => item.id === id) || null; }
function onlineBuilderSources() {
  return registry.filter(source =>
    source.builder !== false
    && source.compliance?.aggregationApproved === true
    && ['licensed','permission'].includes(source.compliance?.reviewStatus)
    && source.compliance?.usage === 'metadata-and-original-links'
    && source.compliance?.binaryRehost === false
    && getStatus(source.id).online === true
  );
}
function targetCompatibility(source) {
  const installer = INSTALLERS[target];
  const variant = installer?.variant || null;
  const hasVariant = Boolean(variant && sourceVariantURL(source, variant));
  const supportsInstaller = sourceInstallerIds(source).includes(target);
  const statusInfo = getStatus(source.id)?.installerCompatibility?.[target];
  const directSupported = statusInfo?.directSource !== 'fail';
  const supported = Boolean(installer && hasVariant && supportsInstaller && directSupported);
  return {
    supported,
    reason: supported ? (statusInfo?.reason || '') : (statusInfo?.reason || tr('incompatibleReason'))
  };
}
function selectableForTarget(source) {
  return targetCompatibility(source).supported && getStatus(source.id).mixTest !== 'fail';
}
function allCandidates() { return onlineBuilderSources().filter(source => selectableForTarget(source)); }
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
  return INSTALLERS[target]?.label
    || INSTALLERS[DEFAULT_BUILDER_INSTALLER_ID]?.label
    || 'Installer';
}
function targetHelpKey() {
  return INSTALLERS[target]?.mixHelpKey || 'targetHelpGeneric';
}
function targetVariant() {
  return INSTALLERS[target]?.variant || null;
}
function targetMixProfile() {
  return INSTALLERS[target]?.mixProfile || 'altstore-classic';
}
function matchesTarget(source) {
  return targetCompatibility(source).supported;
}
function matchesCompatibility(source) {
  if (compatibility === 'all') return true;
  const test = getStatus(source.id).mixTest;
  return compatibility === 'pass' ? test === 'pass' : (test !== 'pass' && test !== 'fail');
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
  return onlineBuilderSources().filter(source => {
    if (!matchesCategory(source) || !matchesGenre(source) || !matchesQuery(source)) return false;
    const targetInfo = targetCompatibility(source);
    if (compatibility === 'all') return true;
    if (!targetInfo.supported || getStatus(source.id).mixTest === 'fail') return false;
    return matchesCompatibility(source);
  });
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
  if ($('#mixCompatibilityHelp')) $('#mixCompatibilityHelp').textContent = tr('compatLogic');
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
  const validIds = new Set(onlineBuilderSources().filter(source => selectableForTarget(source)).map(source => source.id));
  [...selected].forEach(id => { if (!validIds.has(id)) selected.delete(id); });
  saveSelection();

  const noApprovedSources = onlineBuilderSources().length === 0;
  list.innerHTML = available.length ? available.map(source => {
    const item = getStatus(source.id);
    const checked = selected.has(source.id);
    const targetInfo = targetCompatibility(source);
    const selectable = targetInfo.supported && item.mixTest !== 'fail';
    const passed = item.mixTest === 'pass';
    const test = selectable ? (passed ? tr('pass') : tr('try')) : tr('incompatible');
    const cls = selectable ? (passed ? 'online' : 'mode') : 'offline';
    const reason = selectable
      ? (item.mixReason || '')
      : (item.mixTest === 'fail' ? (item.mixReason || targetInfo.reason) : (targetInfo.reason || tr('incompatibleReason')));
    return `<label class="builder-item${selectable ? '' : ' builder-item-disabled'}" title="${escapeHtml(reason)}">
      <input type="checkbox" data-exp-source="${escapeHtml(source.id)}" ${checked ? 'checked' : ''} ${selectable ? '' : 'disabled'}>
      <div><strong>${escapeHtml(source.name)}</strong><span>${escapeHtml(modeName(source))} · → ${escapeHtml(targetName())}${selectable ? '' : ` · ${escapeHtml(tr('incompatibleReason'))}`}</span></div>
      <div class="builder-count"><span class="pill online">● ONLINE</span> <span class="pill ${cls}">${escapeHtml(test)}</span> ${Number.isFinite(item.appCount) ? `${item.appCount} ${escapeHtml(tr('apps'))}` : ''}</div>
    </label>`;
  }).join('') : `<div class="notice">${escapeHtml(tr(noApprovedSources ? 'rightsEmpty' : 'empty'))}</div>`;

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
function normalizeVersionSize(version) {
  const item = {...version};
  if (typeof item.size === 'string') {
    const raw = item.size.trim();
    if (/^\\d+$/.test(raw)) item.size = Number(raw);
    else delete item.size;
  } else if (item.size != null && !Number.isFinite(item.size)) {
    delete item.size;
  }
  return item;
}

function sanitizeClassicApp(app) {
  const cleaned = {...app};
  delete cleaned.marketplaceID;
  delete cleaned.Build;
  delete cleaned.build;

  if (Array.isArray(cleaned.versions)) {
    cleaned.versions = cleaned.versions.map(version => {
      if (!version || typeof version !== 'object' || Array.isArray(version)) return version;
      const item = normalizeVersionSize(version);
      delete item.Build;
      delete item.build;
      return item;
    });
  }

  return cleaned;
}

function sanitizeAppForTarget(app) {
  const profile = targetMixProfile();
  const cleaned = sanitizeClassicApp(app);

  if (profile === 'livecontainer' && Array.isArray(cleaned.versions)) {
    cleaned.versions = cleaned.versions.map(version => {
      if (!version || typeof version !== 'object' || Array.isArray(version)) return version;
      const item = {...version};
      if (!item.buildNumber && typeof item.buildVersion === 'string' && item.buildVersion.trim()) {
        item.buildNumber = item.buildVersion;
      }
      return item;
    });
  }

  return cleaned;
}

function dedupe(payloads) {
  const merged = new Map();
  let conflicts = 0;
  for (const {source,payload} of payloads) {
    for (const app of (Array.isArray(payload.apps) ? payload.apps : [])) {
      if (!app || typeof app !== 'object') continue;
      const bundle = String(app.bundleIdentifier || app.bundleID || '').trim();
      if (!bundle) continue;
      const bundleKey = bundle.toLowerCase();
      if (!merged.has(bundleKey)) {
        merged.set(bundleKey, {source,app});
      } else {
        conflicts += 1;
        const old = merged.get(bundleKey);
        if (appDate(app) > appDate(old.app)) merged.set(bundleKey, {source,app});
      }
    }
  }
  return {
    apps:[...merged.values()]
      .map(item => sanitizeAppForTarget(item.app))
      .sort((a,b) => String(a.name || '').localeCompare(String(b.name || ''))),
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

async function loadMixApiConfig() {
  if (mixApiConfig) return mixApiConfig;
  try {
    const response = await fetch('data/mix-api.json', {cache:'no-store'});
    if (!response.ok) throw new Error(`Mix API config: HTTP ${response.status}`);
    const payload = await response.json();
    mixApiConfig = payload && typeof payload === 'object' ? payload : {};
  } catch (error) {
    console.warn('Mix API config unavailable; using local fallback.', error);
    mixApiConfig = {};
  }
  return mixApiConfig;
}

async function hostCustomMix(mix) {
  const config = await loadMixApiConfig();
  const apiURL = String(config?.apiURL || '').trim();
  if (!apiURL) return null;

  const response = await fetch(apiURL, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(mix)
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch (_) {}

  if (!response.ok) {
    throw new Error(payload?.error || `Mix API: HTTP ${response.status}`);
  }

  const url = String(payload?.url || '').trim();
  if (!url.startsWith('https://')) throw new Error('Mix API did not return a public HTTPS URL.');
  return {...payload, url};
}

function localMixDiagnostic(ids, hasTry) {
  const parts = [tr('directMixUnavailable')];
  const trySources = hasTry
    ? ids
        .filter(id => getStatus(id).mixTest !== 'pass')
        .map(id => registry.find(source => source.id === id)?.name || id)
    : [];

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

    let hosted = {url:null, targets:new Set()};
    const names = ids.map(id => registry.find(source => source.id === id)?.name || id);
    const hasTry = ids.some(id => getStatus(id).mixTest !== 'pass');
    const mix = {
      name:`Mix · ${names.join(' + ')}`,
      identifier:`com.caseycz.ios.mix.${hashIds(ids)}`,
      subtitle:hasTry ? 'Experimental combined source generated locally by iOS Hub' : 'Combined source generated by iOS Hub',
      website:'https://caseycz.github.io/iOS-Hub/',
      tintColor:'#38BDF8',
      apps,
      ...(targetMixProfile() === 'altstore-classic' ? {
        userInfo:{
          sourceIDs:ids.join(','),
          sourceURLs:ids.map(id => sourceVariantURL(registry.find(source => source.id === id), targetVariant()) || '').join('\n'),
          experimental:String(hasTry)
        }
      } : {})
    };

    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = URL.createObjectURL(new Blob([JSON.stringify(mix,null,2) + '\n'], {type:'application/json'}));

    try {
      const hostedMix = await hostCustomMix(mix);
      if (hostedMix?.url) {
        hosted = {
          url: hostedMix.url,
          targets: new Set([target]),
          expiresAt: hostedMix.expiresAt || null
        };
      }
    } catch (hostError) {
      console.warn('Target-specific Mix hosting failed; trying static fallback.', hostError);
    }

    if (!hosted.url) {
      hosted = hostedTarget(ids);
    }

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
    const copyButton = $('#expCopyUrl');
    const installer = INSTALLERS[target];

    addTarget.hidden = true;

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
    selected = new Set(candidates().filter(source => selectableForTarget(source) && getStatus(source.id).mixTest === 'pass').map(source => source.id));
    saveSelection();
    hideResult();
    render();
  });
  $('#expSelectAll')?.addEventListener('click', () => {
    selected = new Set(candidates().filter(source => selectableForTarget(source)).map(source => source.id));
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
    const source = registry.find(item => item.id === id);
    if (!source || !selectableForTarget(source)) {
      event.target.checked = false;
      selected.delete(id);
      saveSelection();
      return;
    }
    if (event.target.checked) selected.add(id); else selected.delete(id);
    saveSelection();
    hideResult();
    render();
  });

  $$('[data-exp-category-filter]').forEach(button => button.addEventListener('click', () => {
    const requested = SOURCE_CATEGORIES.has(button.dataset.expCategoryFilter) ? button.dataset.expCategoryFilter : 'all';
    category = requested !== 'all' && requested === category ? 'all' : requested;
    saveFilters(); render();
  }));
  $$('[data-exp-genre-filter]').forEach(button => button.addEventListener('click', () => {
    const requested = GENRES.has(button.dataset.expGenreFilter) ? button.dataset.expGenreFilter : 'all';
    genre = requested !== 'all' && requested === genre ? 'all' : requested;
    saveFilters(); render();
  }));
  $('#builderTargets')?.addEventListener('click', event => {
    const button = event.target.closest('[data-exp-target]');
    if (!button) return;
    const nextTarget = TARGETS.has(button.dataset.expTarget) ? button.dataset.expTarget : DEFAULT_BUILDER_INSTALLER_ID;
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
      hideResult();
    }
    saveFilters();
    render();
    if (removed) {
      const message = $('#expMessage');
      if (message) message.textContent = tr('removedIncompatible').replace('{n}', String(removed)).replace('{tool}', targetName());
    }
  });
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
