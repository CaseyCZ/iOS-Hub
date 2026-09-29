import { SUPPORTED_LANGUAGES, applyTranslations, normalizeLanguage } from './i18n.js?v=1.1.5-20260918-fullaudit2';
import { SIDELOAD_TOOLS, CORE_SIDELOAD_RESOURCE_NAMES, sideloadToolURL } from './installers.js?v=1.1.5-20260929-installers10';

const root = document.documentElement;
const $ = selector => document.querySelector(selector);
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

const CREDITS_COPY = {
  en: {
    heroEyebrow: 'PROJECTS · DEVELOPERS · REFERENCES',
    heroTitle: 'Credits & Acknowledgements',
    heroDesc: 'iOS Hub brings together information and links from many independent projects. This page gives credit to the people and projects behind the tools, sources and references featured across the site.',
    thanksTitle: 'Thank you.',
    thanksDesc: 'iOS Hub does not claim ownership of third-party projects, names, logos, repositories or source content. Please support the original developers and use their official links.',
    coreTitle: 'Core sideloading projects',
    coreDesc: 'Projects that are directly featured in iOS Hub guides, tools and recommendations.',
    altstoreDesc: 'AltStore and AltServer ecosystem. Credit belongs to the AltStore project and its contributors.',
    sidestoreDesc: 'Open-source sideloading project maintained by the SideStore team and contributors.',
    sideinstallerDesc: 'On-device installer for SideStore and SideStore + LiveContainer by FrizzleM.',
    livecontainerDesc: 'Open-source project for running multiple iOS apps inside a container.',
    flarestoreDesc: 'FlareStore app and repository tooling for iOS app signing, installation and compatible source browsing.',
    featherDesc: 'Open-source on-device iOS application manager and signer by Samara and contributors.',
    trollstoreDesc: 'Permanent IPA installation project for supported iOS versions by opa334 and contributors.',
    atvloadlyDesc: 'Open-source Apple TV sideloading project by bitxeno and contributors.',
    iloaderDesc: 'Sideloading and pairing companion used with SideStore and LiveContainer workflows.',
    impactorDesc: 'Open-source cross-platform sideloading project by claration and contributors.',
    sideloadlyDesc: 'Sideloading tool for Apple platforms. iOS Hub links users to the official project website.',
    featuredTitle: 'Featured apps & services',
    featuredDesc: 'Other third-party apps, services and utilities featured on the Useful Resources page. This list is generated from that page so new additions are credited automatically.',
    loadingFeatured: 'Loading featured projects…',
    noFeatured: 'No additional featured projects found.',
    sourcesTitle: 'Source catalogue credits',
    sourcesDesc: 'The catalog below is generated from the same registry used by iOS Hub, so newly added sources automatically appear here. Each link points to the source\'s own website or public source URL.',
    loadingSources: 'Loading source credits…',
    noSources: 'No source credits available.',
    sourceUnavailable: 'Source credits are temporarily unavailable.',
    referencesTitle: 'Discovery & verification references',
    referencesDesc: 'Community lists and upstream references used to discover or verify public sources. Listings are independently checked before being added to iOS Hub.',
    loadingReferences: 'Loading references',
    referencesUnavailable: 'References unavailable',
    tryAgain: 'Please try again later.',
    referenceBadge: 'Reference',
    referenceFallback: 'Source discovery or verification reference.',
    openReference: 'Open reference ↗',
    librariesTitle: 'Third-party libraries',
    librariesDesc: 'Software used directly by browser tools on iOS Hub.',
    jszipDesc: 'JavaScript library used by the browser-based conversion tooling for ZIP archive handling.',
    libarchiveDesc: 'WebAssembly wrapper around libarchive used by the DEB → IPA converter to inspect Debian and tar archives. iOS Hub carries a small compatibility patch on the vendored runtime.',
    projectWebsite: 'Project website ↗',
    projectRepository: 'Project repository ↗',
    officialWebsite: 'Official website ↗',
    officialRepository: 'Official repository ↗',
    trademarkNotice: 'All third-party names, logos and trademarks belong to their respective owners. Inclusion on iOS Hub does not imply endorsement, sponsorship or affiliation unless explicitly stated by the original project.'
  },
  cs: {
    heroEyebrow: 'PROJEKTY · VÝVOJÁŘI · ZDROJE',
    heroTitle: 'Poděkování a autoři',
    heroDesc: 'iOS Hub spojuje informace a odkazy z mnoha nezávislých projektů. Tato stránka uvádí autory a projekty stojící za nástroji, zdroji a referencemi použitými na webu.',
    thanksTitle: 'Děkujeme.',
    thanksDesc: 'iOS Hub si nenárokuje vlastnictví projektů třetích stran, názvů, log, repozitářů ani obsahu zdrojů. Podpořte původní vývojáře a používejte jejich oficiální odkazy.',
    coreTitle: 'Hlavní projekty pro sideloading',
    coreDesc: 'Projekty přímo používané nebo zmiňované v návodech, nástrojích a doporučeních iOS Hubu.',
    altstoreDesc: 'Ekosystém AltStore a AltServer. Zásluhy patří projektu AltStore a jeho přispěvatelům.',
    sidestoreDesc: 'Open-source projekt pro sideloading spravovaný týmem SideStore a přispěvateli.',
    sideinstallerDesc: 'Instalátor SideStore a SideStore + LiveContainer přímo v zařízení od FrizzleM.',
    livecontainerDesc: 'Open-source projekt pro spouštění více iOS aplikací uvnitř jednoho kontejneru.',
    flarestoreDesc: 'FlareStore aplikace a nástroje pro repozitáře, podepisování, instalaci a procházení kompatibilních iOS zdrojů.',
    featherDesc: 'Open-source správce a podepisovač iOS aplikací přímo v zařízení od Samary a přispěvatelů.',
    trollstoreDesc: 'Projekt pro trvalou instalaci IPA na podporovaných verzích iOS od opa334 a přispěvatelů.',
    atvloadlyDesc: 'Open-source projekt pro sideloading na Apple TV od bitxeno a přispěvatelů.',
    iloaderDesc: 'Pomocník pro sideloading a párování používaný se SideStore a LiveContainer.',
    impactorDesc: 'Open-source multiplatformní projekt pro sideloading od claration a přispěvatelů.',
    sideloadlyDesc: 'Nástroj pro sideloading na platformách Apple. iOS Hub odkazuje na oficiální web projektu.',
    featuredTitle: 'Další uvedené aplikace a služby',
    featuredDesc: 'Další aplikace, služby a nástroje třetích stran uvedené na stránce Užitečné. Seznam se vytváří automaticky z této stránky, takže nové položky se připíšou samy.',
    loadingFeatured: 'Načítám další projekty…',
    noFeatured: 'Nebyly nalezeny žádné další projekty.',
    sourcesTitle: 'Autoři katalogu zdrojů',
    sourcesDesc: 'Níže uvedený katalog vzniká ze stejného registru jako iOS Hub, takže nově přidané zdroje se zde objeví automaticky. Každý odkaz vede na vlastní web zdroje nebo jeho veřejnou URL.',
    loadingSources: 'Načítám zdroje…',
    noSources: 'Nejsou dostupné žádné zdroje.',
    sourceUnavailable: 'Seznam zdrojů je dočasně nedostupný.',
    referencesTitle: 'Reference pro vyhledávání a ověřování',
    referencesDesc: 'Komunitní seznamy a upstream reference používané k vyhledávání nebo ověřování veřejných zdrojů. Před přidáním do iOS Hubu se položky ověřují samostatně.',
    loadingReferences: 'Načítám reference',
    referencesUnavailable: 'Reference nejsou dostupné',
    tryAgain: 'Zkuste to prosím později.',
    referenceBadge: 'Reference',
    referenceFallback: 'Reference pro vyhledávání nebo ověřování zdrojů.',
    openReference: 'Otevřít referenci ↗',
    librariesTitle: 'Knihovny třetích stran',
    librariesDesc: 'Software přímo používaný webovými nástroji iOS Hubu.',
    jszipDesc: 'JavaScriptová knihovna používaná webovým převodníkem pro práci se ZIP archivy.',
    libarchiveDesc: 'WebAssembly wrapper nad libarchive používaný převodníkem DEB → IPA pro čtení Debian a tar archivů. iOS Hub používá ve vendored runtime malý kompatibilitní patch.',
    projectWebsite: 'Web projektu ↗',
    projectRepository: 'Repozitář projektu ↗',
    officialWebsite: 'Oficiální web ↗',
    officialRepository: 'Oficiální repozitář ↗',
    trademarkNotice: 'Všechny názvy, loga a ochranné známky třetích stran patří jejich vlastníkům. Uvedení na iOS Hubu neznamená podporu, sponzorství ani oficiální spojení, pokud to původní projekt výslovně neuvádí.'
  },
  de: {
    heroEyebrow: 'PROJEKTE · ENTWICKLER · REFERENZEN',
    heroTitle: 'Danksagungen & Credits',
    heroDesc: 'iOS Hub bündelt Informationen und Links vieler unabhängiger Projekte. Diese Seite würdigt die Menschen und Projekte hinter den auf der Website verwendeten Tools, Quellen und Referenzen.',
    thanksTitle: 'Vielen Dank.',
    thanksDesc: 'iOS Hub erhebt keinen Eigentumsanspruch auf Projekte, Namen, Logos, Repositories oder Quellinhalte Dritter. Unterstütze die ursprünglichen Entwickler und nutze ihre offiziellen Links.',
    coreTitle: 'Zentrale Sideloading-Projekte',
    coreDesc: 'Projekte, die direkt in Guides, Tools und Empfehlungen von iOS Hub vorkommen.',
    altstoreDesc: 'AltStore- und AltServer-Ökosystem. Die Anerkennung gilt dem AltStore-Projekt und seinen Mitwirkenden.',
    sidestoreDesc: 'Open-Source-Sideloading-Projekt des SideStore-Teams und seiner Mitwirkenden.',
    sideinstallerDesc: 'On-Device-Installer für SideStore und SideStore + LiveContainer von FrizzleM.',
    livecontainerDesc: 'Open-Source-Projekt zum Ausführen mehrerer iOS-Apps in einem Container.',
    flarestoreDesc: 'FlareStore-App und Repository-Werkzeuge zum Signieren, Installieren und Durchsuchen kompatibler iOS-Quellen.',
    featherDesc: 'Open-Source-iOS-App-Manager und Signierer direkt auf dem Gerät von Samara und Mitwirkenden.',
    trollstoreDesc: 'Projekt zur permanenten IPA-Installation auf unterstützten iOS-Versionen von opa334 und Mitwirkenden.',
    atvloadlyDesc: 'Open-Source-Apple-TV-Sideloading-Projekt von bitxeno und Mitwirkenden.',
    iloaderDesc: 'Sideloading- und Pairing-Begleiter für SideStore- und LiveContainer-Abläufe.',
    impactorDesc: 'Open-Source-Cross-Platform-Sideloading-Projekt von claration und Mitwirkenden.',
    sideloadlyDesc: 'Sideloading-Tool für Apple-Plattformen. iOS Hub verweist auf die offizielle Projektwebsite.',
    featuredTitle: 'Weitere vorgestellte Apps & Dienste',
    featuredDesc: 'Weitere Apps, Dienste und Tools von Drittanbietern aus der Seite „Nützlich“. Die Liste wird automatisch daraus erzeugt, damit neue Einträge ebenfalls gutgeschrieben werden.',
    loadingFeatured: 'Weitere Projekte werden geladen…',
    noFeatured: 'Keine weiteren Projekte gefunden.',
    sourcesTitle: 'Credits des Quellenkatalogs',
    sourcesDesc: 'Der Katalog wird aus demselben Register wie iOS Hub erzeugt. Neu hinzugefügte Quellen erscheinen daher automatisch. Jeder Link führt zur Website oder öffentlichen Quellen-URL.',
    loadingSources: 'Quellen-Credits werden geladen…',
    noSources: 'Keine Quellen-Credits verfügbar.',
    sourceUnavailable: 'Quellen-Credits sind vorübergehend nicht verfügbar.',
    referencesTitle: 'Referenzen für Entdeckung & Prüfung',
    referencesDesc: 'Community-Listen und Upstream-Referenzen zum Finden oder Prüfen öffentlicher Quellen. Einträge werden vor der Aufnahme in iOS Hub unabhängig geprüft.',
    loadingReferences: 'Referenzen werden geladen',
    referencesUnavailable: 'Referenzen nicht verfügbar',
    tryAgain: 'Bitte später erneut versuchen.',
    referenceBadge: 'Referenz',
    referenceFallback: 'Referenz zur Entdeckung oder Prüfung von Quellen.',
    openReference: 'Referenz öffnen ↗',
    librariesTitle: 'Drittanbieter-Bibliotheken',
    librariesDesc: 'Software, die direkt von den Browser-Tools in iOS Hub verwendet wird.',
    jszipDesc: 'JavaScript-Bibliothek, die vom browserbasierten Konverter für ZIP-Archive verwendet wird.',
    libarchiveDesc: 'WebAssembly-Wrapper um libarchive, den der DEB → IPA-Konverter zum Lesen von Debian- und tar-Archiven verwendet. iOS Hub enthält einen kleinen Kompatibilitäts-Patch im eingebundenen Runtime-Code.',
    projectWebsite: 'Projektwebsite ↗',
    projectRepository: 'Projekt-Repository ↗',
    officialWebsite: 'Offizielle Website ↗',
    officialRepository: 'Offizielles Repository ↗',
    trademarkNotice: 'Alle Namen, Logos und Marken Dritter gehören ihren jeweiligen Eigentümern. Die Aufnahme in iOS Hub bedeutet keine Unterstützung, Sponsoring oder Zugehörigkeit, sofern das ursprüngliche Projekt dies nicht ausdrücklich angibt.'
  },
  es: {
    heroEyebrow: 'PROYECTOS · DESARROLLADORES · REFERENCIAS',
    heroTitle: 'Créditos y agradecimientos',
    heroDesc: 'iOS Hub reúne información y enlaces de muchos proyectos independientes. Esta página reconoce a las personas y proyectos detrás de las herramientas, fuentes y referencias utilizadas en el sitio.',
    thanksTitle: 'Gracias.',
    thanksDesc: 'iOS Hub no reclama la propiedad de proyectos, nombres, logotipos, repositorios ni contenido de fuentes de terceros. Apoya a los desarrolladores originales y usa sus enlaces oficiales.',
    coreTitle: 'Proyectos principales de sideloading',
    coreDesc: 'Proyectos destacados directamente en las guías, herramientas y recomendaciones de iOS Hub.',
    altstoreDesc: 'Ecosistema AltStore y AltServer. El crédito corresponde al proyecto AltStore y a sus colaboradores.',
    sidestoreDesc: 'Proyecto open source de sideloading mantenido por el equipo de SideStore y sus colaboradores.',
    sideinstallerDesc: 'Instalador en el dispositivo para SideStore y SideStore + LiveContainer de FrizzleM.',
    livecontainerDesc: 'Proyecto open source para ejecutar varias apps de iOS dentro de un contenedor.',
    flarestoreDesc: 'App FlareStore y herramientas de repositorio para firmar, instalar y explorar fuentes iOS compatibles.',
    featherDesc: 'Gestor y firmador open source de apps iOS en el propio dispositivo por Samara y colaboradores.',
    trollstoreDesc: 'Proyecto de instalación permanente de IPA para versiones compatibles de iOS de opa334 y colaboradores.',
    atvloadlyDesc: 'Proyecto open source de sideloading para Apple TV de bitxeno y colaboradores.',
    iloaderDesc: 'Herramienta complementaria de sideloading y emparejamiento para flujos con SideStore y LiveContainer.',
    impactorDesc: 'Proyecto open source y multiplataforma de sideloading de claration y colaboradores.',
    sideloadlyDesc: 'Herramienta de sideloading para plataformas Apple. iOS Hub enlaza al sitio oficial del proyecto.',
    featuredTitle: 'Otras apps y servicios destacados',
    featuredDesc: 'Otras apps, servicios y utilidades de terceros mostrados en la página de recursos útiles. La lista se genera automáticamente para que las nuevas incorporaciones también reciban crédito.',
    loadingFeatured: 'Cargando proyectos destacados…',
    noFeatured: 'No se encontraron proyectos adicionales.',
    sourcesTitle: 'Créditos del catálogo de fuentes',
    sourcesDesc: 'El catálogo se genera desde el mismo registro que usa iOS Hub, por lo que las nuevas fuentes aparecen aquí automáticamente. Cada enlace lleva al sitio de la fuente o a su URL pública.',
    loadingSources: 'Cargando créditos de fuentes…',
    noSources: 'No hay créditos de fuentes disponibles.',
    sourceUnavailable: 'Los créditos de fuentes no están disponibles temporalmente.',
    referencesTitle: 'Referencias de descubrimiento y verificación',
    referencesDesc: 'Listas comunitarias y referencias upstream utilizadas para descubrir o verificar fuentes públicas. Las entradas se comprueban de forma independiente antes de añadirse a iOS Hub.',
    loadingReferences: 'Cargando referencias',
    referencesUnavailable: 'Referencias no disponibles',
    tryAgain: 'Inténtalo de nuevo más tarde.',
    referenceBadge: 'Referencia',
    referenceFallback: 'Referencia para descubrir o verificar fuentes.',
    openReference: 'Abrir referencia ↗',
    librariesTitle: 'Bibliotecas de terceros',
    librariesDesc: 'Software utilizado directamente por las herramientas web de iOS Hub.',
    jszipDesc: 'Biblioteca JavaScript utilizada por la herramienta de conversión web para manejar archivos ZIP.',
    libarchiveDesc: 'Wrapper WebAssembly de libarchive utilizado por el convertidor DEB → IPA para leer archivos Debian y tar. iOS Hub mantiene un pequeño parche de compatibilidad en el runtime incluido.',
    projectWebsite: 'Sitio del proyecto ↗',
    projectRepository: 'Repositorio del proyecto ↗',
    officialWebsite: 'Sitio oficial ↗',
    officialRepository: 'Repositorio oficial ↗',
    trademarkNotice: 'Todos los nombres, logotipos y marcas de terceros pertenecen a sus respectivos propietarios. La inclusión en iOS Hub no implica respaldo, patrocinio ni afiliación salvo que el proyecto original lo indique expresamente.'
  },
  fr: {
    heroEyebrow: 'PROJETS · DÉVELOPPEURS · RÉFÉRENCES',
    heroTitle: 'Crédits et remerciements',
    heroDesc: 'iOS Hub rassemble des informations et des liens provenant de nombreux projets indépendants. Cette page crédite les personnes et projets derrière les outils, sources et références présentés sur le site.',
    thanksTitle: 'Merci.',
    thanksDesc: 'iOS Hub ne revendique pas la propriété des projets, noms, logos, dépôts ou contenus de sources tiers. Soutenez les développeurs d’origine et utilisez leurs liens officiels.',
    coreTitle: 'Principaux projets de sideloading',
    coreDesc: 'Projets directement présentés dans les guides, outils et recommandations d’iOS Hub.',
    altstoreDesc: 'Écosystème AltStore et AltServer. Le mérite revient au projet AltStore et à ses contributeurs.',
    sidestoreDesc: 'Projet open source de sideloading maintenu par l’équipe SideStore et ses contributeurs.',
    sideinstallerDesc: 'Installateur sur appareil pour SideStore et SideStore + LiveContainer par FrizzleM.',
    livecontainerDesc: 'Projet open source permettant d’exécuter plusieurs apps iOS dans un seul conteneur.',
    flarestoreDesc: 'Application FlareStore et outils de dépôt pour signer, installer et parcourir des sources iOS compatibles.',
    featherDesc: 'Gestionnaire et outil de signature iOS open source sur l’appareil par Samara et les contributeurs.',
    trollstoreDesc: 'Projet d’installation permanente d’IPA pour les versions iOS compatibles par opa334 et ses contributeurs.',
    atvloadlyDesc: 'Projet open source de sideloading Apple TV par bitxeno et ses contributeurs.',
    iloaderDesc: 'Outil d’accompagnement pour le sideloading et l’appairage avec SideStore et LiveContainer.',
    impactorDesc: 'Projet open source multiplateforme de sideloading par claration et ses contributeurs.',
    sideloadlyDesc: 'Outil de sideloading pour les plateformes Apple. iOS Hub renvoie vers le site officiel du projet.',
    featuredTitle: 'Autres apps et services présentés',
    featuredDesc: 'Autres apps, services et utilitaires tiers présentés dans la page des ressources utiles. La liste est générée automatiquement afin que les nouveaux ajouts soient également crédités.',
    loadingFeatured: 'Chargement des projets présentés…',
    noFeatured: 'Aucun autre projet trouvé.',
    sourcesTitle: 'Crédits du catalogue de sources',
    sourcesDesc: 'Le catalogue ci-dessous est généré depuis le même registre qu’iOS Hub : les nouvelles sources y apparaissent donc automatiquement. Chaque lien mène au site de la source ou à son URL publique.',
    loadingSources: 'Chargement des crédits des sources…',
    noSources: 'Aucun crédit de source disponible.',
    sourceUnavailable: 'Les crédits des sources sont temporairement indisponibles.',
    referencesTitle: 'Références de découverte et de vérification',
    referencesDesc: 'Listes communautaires et références amont utilisées pour découvrir ou vérifier les sources publiques. Les entrées sont vérifiées indépendamment avant leur ajout à iOS Hub.',
    loadingReferences: 'Chargement des références',
    referencesUnavailable: 'Références indisponibles',
    tryAgain: 'Veuillez réessayer plus tard.',
    referenceBadge: 'Référence',
    referenceFallback: 'Référence pour la découverte ou la vérification des sources.',
    openReference: 'Ouvrir la référence ↗',
    librariesTitle: 'Bibliothèques tierces',
    librariesDesc: 'Logiciels utilisés directement par les outils web d’iOS Hub.',
    jszipDesc: 'Bibliothèque JavaScript utilisée par l’outil de conversion dans le navigateur pour gérer les archives ZIP.',
    libarchiveDesc: 'Wrapper WebAssembly autour de libarchive utilisé par le convertisseur DEB → IPA pour lire les archives Debian et tar. iOS Hub applique un petit correctif de compatibilité au runtime embarqué.',
    projectWebsite: 'Site du projet ↗',
    projectRepository: 'Dépôt du projet ↗',
    officialWebsite: 'Site officiel ↗',
    officialRepository: 'Dépôt officiel ↗',
    trademarkNotice: 'Tous les noms, logos et marques de tiers appartiennent à leurs propriétaires respectifs. Leur présence sur iOS Hub n’implique ni approbation, ni sponsoring, ni affiliation, sauf indication explicite du projet d’origine.'
  }
};

const CORE_RESOURCE_NAMES = new Set(CORE_SIDELOAD_RESOURCE_NAMES);

let currentLang = 'en';

function creditText(key) {
  return CREDITS_COPY[currentLang]?.[key] || CREDITS_COPY.en[key] || key;
}

function applyCreditCopy(lang) {
  currentLang = CREDITS_COPY[lang] ? lang : 'en';
  document.querySelectorAll('[data-credit-copy]').forEach(node => {
    const value = creditText(node.dataset.creditCopy);
    if (value) node.textContent = value;
  });
  document.title = creditText('heroTitle') + ' — iOS Hub';
}

function hydrateSideloadCreditCards() {
  document.querySelectorAll('[data-sideload-tool]').forEach(card => {
    const tool = SIDELOAD_TOOLS[card.dataset.sideloadTool];
    if (!tool) return;

    card.dataset.toolType = tool.toolType || '';
    card.dataset.capabilities = (tool.capabilities || []).join(' ');
    card.dataset.targets = (tool.targets || []).join(' ');
    card.dataset.hostPlatforms = (tool.hostPlatforms || []).join(' ');
    card.dataset.computerMode = tool.computerMode || 'unknown';
    card.dataset.sourceSupport = tool.sourceSupport || 'none';
    card.dataset.openSource = tool.openSource === true ? 'true' : (tool.openSource === false ? 'false' : 'unknown');
    card.dataset.resourceBadges = (tool.resourceBadges || []).join(' ');

    const title = card.querySelector('h3');
    if (title && tool.creditName) title.textContent = tool.creditName;

    const domain = card.querySelector('.resource-domain');
    const creditDomain = tool.creditDomain || tool.domain;
    if (domain && creditDomain) domain.textContent = creditDomain;

    const href = sideloadToolURL(tool.id, 'credit');
    const link = card.querySelector('a.btn.primary');
    if (link && href) link.href = href;

    card.querySelectorAll('img.official-app-icon, img.brand-link-icon').forEach(img => {
      if (tool.icon) img.src = tool.icon;
      if (img.classList.contains('official-app-icon')) img.alt = tool.creditName || tool.label || '';
    });
  });
}

function applyTheme(theme) {
  const value = theme === 'light' ? 'light' : 'dark';
  root.dataset.theme = value;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#070b14' : '#eef3f8');
  const button = $('#themeToggle');
  if (button) button.textContent = value === 'dark' ? '☀' : '☾';
  safeSet('caseycz-theme', value);
}

function applyLanguage(value) {
  const lang = normalizeLanguage(value);
  root.lang = lang;
  applyTranslations(lang);
  applyCreditCopy(lang);
  const select = $('#languageSelect');
  if (select) select.value = lang;
  safeSet('caseycz-language', lang);
}

function externalLink(name, url) {
  const a = document.createElement('a');
  a.className = 'pill mode';
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = name + ' ↗';
  return a;
}

function sourceCreditGroup(developer, sources) {
  const group = document.createElement('span');
  group.className = 'pill mode source-credit-group';

  const maintainer = document.createElement('strong');
  maintainer.textContent = developer;
  group.appendChild(maintainer);

  const separator = document.createElement('span');
  separator.textContent = ' · ';
  separator.setAttribute('aria-hidden', 'true');
  group.appendChild(separator);

  sources.forEach((source, index) => {
    if (index) group.appendChild(document.createTextNode(', '));
    const link = document.createElement('a');
    link.className = 'source-credit-link';
    link.href = source.website || source.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = source.name;
    group.appendChild(link);
  });

  return group;
}

async function loadFeaturedCredits() {
  const host = $('#featuredCredits');
  if (!host) return;
  try {
    const response = await fetch('resources.html', { cache: 'no-store' });
    if (!response.ok) throw new Error('Resources request failed');
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    const found = [];
    doc.querySelectorAll('article.resource-card').forEach(card => {
      const name = card.querySelector('h3')?.textContent?.trim();
      const domain = card.querySelector('.resource-domain')?.textContent?.trim();
      const link = card.querySelector('a.btn.primary')?.href;
      if (!name || !link || CORE_RESOURCE_NAMES.has(name)) return;
      found.push({ name, domain, link });
    });
    host.replaceChildren();
    found.forEach(item => host.appendChild(externalLink(item.domain ? `${item.name} · ${item.domain}` : item.name, item.link)));
    if (!host.children.length) {
      const empty = document.createElement('span');
      empty.className = 'pill';
      empty.textContent = creditText('noFeatured');
      host.appendChild(empty);
    }
  } catch (_) {
    host.replaceChildren();
    const msg = document.createElement('span');
    msg.className = 'pill';
    msg.textContent = creditText('noFeatured');
    host.appendChild(msg);
  }
}

async function loadCredits() {
  const sourcesHost = $('#sourceCredits');
  const refsHost = $('#referenceCredits');

  try {
    const response = await fetch('sources/registry.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Registry request failed');
    const registry = await response.json();

    if (sourcesHost) {
      sourcesHost.replaceChildren();
      const sources = Array.isArray(registry.sources) ? registry.sources : [];
      const maintainerGroups = new Map();
      sources.forEach(source => {
        const url = source.website || source.url;
        const developer = String(source.developer || '').trim();
        if (!source.name || !url || !developer) return;

        const key = developer.toLocaleLowerCase();
        if (!maintainerGroups.has(key)) {
          maintainerGroups.set(key, { developer, sources: [] });
        }
        maintainerGroups.get(key).sources.push(source);
      });

      [...maintainerGroups.values()]
        .sort((a, b) => a.developer.localeCompare(b.developer))
        .forEach(group => {
          group.sources.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
          sourcesHost.appendChild(sourceCreditGroup(group.developer, group.sources));
        });

      if (!sourcesHost.children.length) {
        const empty = document.createElement('span');
        empty.className = 'pill';
        empty.textContent = creditText('noSources');
        sourcesHost.appendChild(empty);
      }
    }

    if (refsHost) {
      refsHost.replaceChildren();
      const refs = Array.isArray(registry.attribution?.references) ? registry.attribution.references : [];
      refs.forEach(ref => {
        const card = document.createElement('article');
        card.className = 'panel resource-card';

        const icon = document.createElement('div');
        icon.className = 'resource-icon resource-icon-image';
        const iconImage = document.createElement('img');
        iconImage.className = 'official-app-icon';
        iconImage.alt = '';
        iconImage.loading = 'lazy';
        iconImage.referrerPolicy = 'no-referrer';
        try {
          iconImage.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(ref.url).hostname)}&sz=128`;
        } catch (_) {
          iconImage.src = 'https://www.google.com/s2/favicons?domain=github.com&sz=128';
        }
        icon.appendChild(iconImage);

        const badges = document.createElement('div');
        badges.className = 'resource-badges';
        const badge = document.createElement('span');
        badge.className = 'pill mode';
        badge.textContent = creditText('referenceBadge');
        badges.appendChild(badge);

        const title = document.createElement('h3');
        title.textContent = ref.name || creditText('referenceBadge');

        const note = document.createElement('p');
        note.textContent = ref.note || creditText('referenceFallback');

        const domain = document.createElement('div');
        domain.className = 'resource-domain';
        try { domain.textContent = new URL(ref.url).hostname; } catch (_) { domain.textContent = ref.url || ''; }

        const link = document.createElement('a');
        link.className = 'btn primary brand-link';
        link.href = ref.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const linkIcon = iconImage.cloneNode(true);
        linkIcon.className = 'brand-link-icon';
        const linkText = document.createElement('span');
        linkText.textContent = creditText('openReference');
        link.append(linkIcon, linkText);

        card.append(icon, badges, title, note, domain, link);
        refsHost.appendChild(card);
      });
    }
  } catch (_) {
    if (sourcesHost) {
      sourcesHost.replaceChildren();
      const msg = document.createElement('span');
      msg.className = 'pill';
      msg.textContent = creditText('sourceUnavailable');
      sourcesHost.appendChild(msg);
    }
    if (refsHost) {
      refsHost.replaceChildren();
      const card = document.createElement('article');
      card.className = 'panel resource-card';
      const icon = document.createElement('div');
      icon.className = 'resource-icon';
      icon.textContent = '!';
      const title = document.createElement('h3');
      title.textContent = creditText('referencesUnavailable');
      const p = document.createElement('p');
      p.textContent = creditText('tryAgain');
      card.append(icon, title, p);
      refsHost.appendChild(card);
    }
  }
}

$('#themeToggle')?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#languageSelect')?.addEventListener('change', event => {
  applyLanguage(event.target.value);
  loadFeaturedCredits();
  loadCredits();
});

hydrateSideloadCreditCards();

const savedTheme = safeGet('caseycz-theme');
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemDark ? 'dark' : 'light'));

const savedLang = safeGet('caseycz-language');
applyLanguage(SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : 'en');

if ($('#year')) $('#year').textContent = new Date().getFullYear();
loadFeaturedCredits();
loadCredits();
