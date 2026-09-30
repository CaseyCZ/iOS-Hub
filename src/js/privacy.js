import { SUPPORTED_LANGUAGES, applyTranslations, normalizeLanguage } from './i18n.js?v=1.1.5-20260930-source-import8';

const root = document.documentElement;
const $ = selector => document.querySelector(selector);
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

const COPY = {
  en: {
    metaDescription:'Privacy and cookie information for iOS Hub.',
    eyebrow:'PRIVACY · COOKIES · THIRD-PARTY CONTENT',
    title:'Privacy & Cookies',
    intro:'iOS Hub is an independent project. It is not affiliated with, sponsored by or endorsed by AltStore, SideStore, LiveContainer, Feather, FlareStore, Apple or the maintainers of third-party Sources unless explicitly stated by the original project.',
    cookieSettings:'Cookie settings',
    creditsAcknowledgements:'Credits & acknowledgements',
    analyticsTitle:'Analytics',
    analyticsP1:'Google Analytics is optional. The Google Analytics tag is not loaded until you explicitly choose Accept analytics. If you reject analytics, iOS Hub does not load the Google Analytics script.',
    analyticsP2:'Your analytics choice is stored locally in your browser so the site can remember it. You can change that choice at any time with the Cookie settings button on this page or in the site footer.',
    thirdPartyTitle:'Third-party Sources and downloads',
    thirdPartyP1:"iOS Hub does not rehost third-party IPA binaries. Third-party Sources used by the Builder are treated as link-only: iOS Hub may check whether a public endpoint is available and structurally valid, but the Builder does not copy, merge or rehost that Source's full payload, app descriptions, artwork, version lists or other app metadata.",
    thirdPartyP2:"For bulk import, the Source Builder passes original public Source URLs to the iOS Hub Source Import Shortcut on the user's device; the Shortcut then opens those original URLs in the selected installer. The manual fallback can open them one by one. iOS Hub does not create a combined Source feed. App names, artwork, descriptions, trademarks and other third-party content remain the responsibility and property of their respective owners.",
    thirdPartyP3:"External Sources can change at any time. When you open a third-party website, installer or download URL, that service's own privacy policy and terms apply.",
    localToolsTitle:'Local browser tools',
    localToolsP:'The DEB → IPA Converter is designed to process selected files locally in your browser. The selected package is not uploaded to the iOS Hub server by the converter.',
    localPreferencesTitle:'Local preferences',
    localPreferencesP:'iOS Hub may use browser storage for settings such as language, appearance, Builder selections and your analytics choice. These preferences are used to keep the site working the way you selected.',
    contactTitle:'Contact and corrections',
    contactP:'If you maintain a Source or project shown on iOS Hub and want attribution corrected, content removed or a link changed, open an issue in the project repository.',
    contactGithub:'Contact via GitHub ↗',
    lastUpdated:'Last updated: 30 September 2026.',
    website:'Website',
    creditsNav:'Credits',
    privacyLink:'Privacy & Cookies',
    consentTitle:'Analytics cookies',
    consentText:'iOS Hub uses Google Analytics only if you choose Accept. Rejecting keeps analytics disabled.',
    consentAccept:'Accept analytics',
    consentReject:'Reject',
    consentPrivacy:'Privacy & Cookies'
  },
  cs: {
    metaDescription:'Informace o soukromí a cookies pro iOS Hub.',
    eyebrow:'SOUKROMÍ · COOKIES · OBSAH TŘETÍCH STRAN',
    title:'Soukromí a cookies',
    intro:'iOS Hub je nezávislý projekt. Není propojený s AltStore, SideStore, LiveContainer, Feather, FlareStore, Apple ani se správci Sources třetích stran, není jimi sponzorovaný ani podporovaný, pokud původní projekt výslovně neuvádí jinak.',
    cookieSettings:'Nastavení cookies',
    creditsAcknowledgements:'Poděkování a uvedení autorů',
    analyticsTitle:'Analytika',
    analyticsP1:'Google Analytics je volitelné. Kód Google Analytics se nenačte, dokud výslovně nezvolíte Přijmout analytiku. Pokud analytiku odmítnete, iOS Hub skript Google Analytics nenačte.',
    analyticsP2:'Vaše volba analytiky se ukládá pouze lokálně v prohlížeči, aby si ji web pamatoval. Kdykoli ji můžete změnit tlačítkem Nastavení cookies na této stránce nebo v patičce webu.',
    thirdPartyTitle:'Sources a stahování třetích stran',
    thirdPartyP1:'iOS Hub nerehostuje IPA soubory třetích stran. Sources třetích stran používané Builderem fungují pouze jako odkazy: iOS Hub může ověřit dostupnost a základní strukturu veřejného endpointu, ale Builder nekopíruje, neslučuje ani nerehostuje celý obsah Source, popisy aplikací, grafiku, seznamy verzí ani další metadata aplikací.',
    thirdPartyP2:'Při hromadném importu předá Source Builder původní veřejné URL Sources zkratce iOS Hub Source Import v zařízení uživatele; zkratka potom tyto původní URL otevře ve zvoleném instalátoru. Ruční záloha je může otevřít po jedné. iOS Hub nevytváří sloučený Source feed. Názvy aplikací, grafika, popisy, ochranné známky a další obsah třetích stran zůstávají odpovědností a majetkem příslušných vlastníků.',
    thirdPartyP3:'Externí Sources se mohou kdykoli změnit. Když otevřete web třetí strany, instalátor nebo URL ke stažení, platí pravidla ochrany soukromí a podmínky dané služby.',
    localToolsTitle:'Lokální nástroje v prohlížeči',
    localToolsP:'DEB → IPA Converter zpracovává vybrané soubory lokálně v prohlížeči. Vybraný balíček Converter na server iOS Hub nenahrává.',
    localPreferencesTitle:'Lokální nastavení',
    localPreferencesP:'iOS Hub může používat úložiště prohlížeče pro nastavení jazyka, vzhledu, výběru v Builderu a volby analytiky. Tyto údaje slouží jen k zachování vámi zvoleného nastavení webu.',
    contactTitle:'Kontakt a opravy',
    contactP:'Pokud spravujete Source nebo projekt uvedený na iOS Hub a chcete opravit uvedení autora, odstranit obsah nebo změnit odkaz, otevřete issue v repozitáři projektu.',
    contactGithub:'Kontakt přes GitHub ↗',
    lastUpdated:'Poslední aktualizace: 30. září 2026.',
    website:'Web',
    creditsNav:'Poděkování',
    privacyLink:'Soukromí a cookies',
    consentTitle:'Analytické cookies',
    consentText:'iOS Hub používá Google Analytics pouze pokud zvolíte Přijmout. Odmítnutím zůstane analytika vypnutá.',
    consentAccept:'Přijmout analytiku',
    consentReject:'Odmítnout',
    consentPrivacy:'Soukromí a cookies'
  },
  de: {
    metaDescription:'Datenschutz- und Cookie-Informationen für iOS Hub.',
    eyebrow:'DATENSCHUTZ · COOKIES · INHALTE DRITTER',
    title:'Datenschutz & Cookies',
    intro:'iOS Hub ist ein unabhängiges Projekt. Es ist weder mit AltStore, SideStore, LiveContainer, Feather, FlareStore, Apple noch mit den Betreibern von Sources Dritter verbunden, noch wird es von ihnen gesponsert oder unterstützt, sofern das jeweilige Originalprojekt nichts anderes ausdrücklich angibt.',
    cookieSettings:'Cookie-Einstellungen',
    creditsAcknowledgements:'Danksagungen & Quellen',
    analyticsTitle:'Analyse',
    analyticsP1:'Google Analytics ist optional. Der Google-Analytics-Code wird erst geladen, wenn Sie der Analyse ausdrücklich zustimmen. Bei Ablehnung lädt iOS Hub das Google-Analytics-Skript nicht.',
    analyticsP2:'Ihre Analyse-Auswahl wird lokal im Browser gespeichert, damit die Website sie sich merken kann. Sie können sie jederzeit über die Cookie-Einstellungen auf dieser Seite oder im Footer ändern.',
    thirdPartyTitle:'Sources und Downloads Dritter',
    thirdPartyP1:'iOS Hub hostet keine IPA-Dateien Dritter erneut. Sources Dritter werden im Builder nur als Links behandelt: iOS Hub kann die Erreichbarkeit und grundlegende Struktur eines öffentlichen Endpunkts prüfen, kopiert, kombiniert oder hostet aber weder den vollständigen Source-Inhalt noch App-Beschreibungen, Grafiken, Versionslisten oder andere App-Metadaten erneut.',
    thirdPartyP2:'Beim Massenimport übergibt der Source Builder die ursprünglichen öffentlichen Source-URLs an den Kurzbefehl iOS Hub Source Import auf dem Gerät. Der Kurzbefehl öffnet diese Original-URLs anschließend im gewählten Installer. Der manuelle Fallback kann sie einzeln öffnen. iOS Hub erstellt keinen kombinierten Source-Feed. App-Namen, Grafiken, Beschreibungen, Marken und andere Inhalte Dritter bleiben Eigentum und Verantwortung der jeweiligen Rechteinhaber.',
    thirdPartyP3:'Externe Sources können sich jederzeit ändern. Beim Öffnen einer Website, eines Installers oder einer Download-URL eines Drittanbieters gelten dessen eigene Datenschutzbestimmungen und Bedingungen.',
    localToolsTitle:'Lokale Browser-Werkzeuge',
    localToolsP:'Der DEB → IPA Converter verarbeitet ausgewählte Dateien lokal im Browser. Das ausgewählte Paket wird vom Converter nicht auf den iOS-Hub-Server hochgeladen.',
    localPreferencesTitle:'Lokale Einstellungen',
    localPreferencesP:'iOS Hub kann Browser-Speicher für Sprache, Darstellung, Builder-Auswahl und Ihre Analyse-Einstellung verwenden. Diese Daten dienen dazu, die Website entsprechend Ihrer Auswahl zu betreiben.',
    contactTitle:'Kontakt und Korrekturen',
    contactP:'Wenn Sie eine auf iOS Hub aufgeführte Source oder ein Projekt betreuen und eine Zuordnung korrigieren, Inhalte entfernen oder einen Link ändern lassen möchten, öffnen Sie ein Issue im Projekt-Repository.',
    contactGithub:'Kontakt über GitHub ↗',
    lastUpdated:'Zuletzt aktualisiert: 30. September 2026.',
    website:'Website',
    creditsNav:'Danksagungen',
    privacyLink:'Datenschutz & Cookies',
    consentTitle:'Analyse-Cookies',
    consentText:'iOS Hub verwendet Google Analytics nur mit Ihrer Zustimmung. Bei Ablehnung bleibt die Analyse deaktiviert.',
    consentAccept:'Analyse akzeptieren',
    consentReject:'Ablehnen',
    consentPrivacy:'Datenschutz & Cookies'
  },
  es: {
    metaDescription:'Información de privacidad y cookies de iOS Hub.',
    eyebrow:'PRIVACIDAD · COOKIES · CONTENIDO DE TERCEROS',
    title:'Privacidad y cookies',
    intro:'iOS Hub es un proyecto independiente. No está afiliado, patrocinado ni respaldado por AltStore, SideStore, LiveContainer, Feather, FlareStore, Apple ni por los responsables de Sources de terceros, salvo que el proyecto original indique expresamente lo contrario.',
    cookieSettings:'Configuración de cookies',
    creditsAcknowledgements:'Créditos y agradecimientos',
    analyticsTitle:'Analítica',
    analyticsP1:'Google Analytics es opcional. El código de Google Analytics no se carga hasta que eliges expresamente Aceptar análisis. Si lo rechazas, iOS Hub no carga el script de Google Analytics.',
    analyticsP2:'Tu elección de analítica se guarda localmente en el navegador para que el sitio pueda recordarla. Puedes cambiarla en cualquier momento con el botón de configuración de cookies de esta página o del pie de página.',
    thirdPartyTitle:'Sources y descargas de terceros',
    thirdPartyP1:'iOS Hub no vuelve a alojar archivos IPA de terceros. Las Sources de terceros usadas por el Builder se tratan únicamente como enlaces: iOS Hub puede comprobar si un endpoint público está disponible y tiene una estructura válida, pero el Builder no copia, combina ni vuelve a alojar el contenido completo de la Source, descripciones de apps, ilustraciones, listas de versiones ni otros metadatos de aplicaciones.',
    thirdPartyP2:'Para la importación masiva, Source Builder pasa las URL públicas originales al atajo iOS Hub Source Import del dispositivo del usuario; el atajo abre esas URL originales en el instalador elegido. La alternativa manual puede abrirlas una por una. iOS Hub no crea un feed de Source combinado. Los nombres de apps, ilustraciones, descripciones, marcas y demás contenido de terceros siguen siendo responsabilidad y propiedad de sus respectivos titulares.',
    thirdPartyP3:'Las Sources externas pueden cambiar en cualquier momento. Al abrir un sitio, instalador o URL de descarga de un tercero, se aplican su política de privacidad y sus condiciones.',
    localToolsTitle:'Herramientas locales del navegador',
    localToolsP:'DEB → IPA Converter procesa los archivos seleccionados localmente en el navegador. El paquete seleccionado no se sube al servidor de iOS Hub.',
    localPreferencesTitle:'Preferencias locales',
    localPreferencesP:'iOS Hub puede usar el almacenamiento del navegador para el idioma, la apariencia, las selecciones del Builder y tu elección de analítica. Estas preferencias se usan para mantener el sitio según tu configuración.',
    contactTitle:'Contacto y correcciones',
    contactP:'Si mantienes una Source o un proyecto mostrado en iOS Hub y quieres corregir la atribución, eliminar contenido o cambiar un enlace, abre un issue en el repositorio del proyecto.',
    contactGithub:'Contactar por GitHub ↗',
    lastUpdated:'Última actualización: 30 de septiembre de 2026.',
    website:'Sitio web',
    creditsNav:'Créditos',
    privacyLink:'Privacidad y cookies',
    consentTitle:'Cookies de análisis',
    consentText:'iOS Hub usa Google Analytics solo si eliges Aceptar. Si rechazas, el análisis permanece desactivado.',
    consentAccept:'Aceptar análisis',
    consentReject:'Rechazar',
    consentPrivacy:'Privacidad y cookies'
  },
  fr: {
    metaDescription:'Informations de confidentialité et de cookies pour iOS Hub.',
    eyebrow:'CONFIDENTIALITÉ · COOKIES · CONTENU TIERS',
    title:'Confidentialité et cookies',
    intro:'iOS Hub est un projet indépendant. Il n’est ni affilié, ni sponsorisé, ni approuvé par AltStore, SideStore, LiveContainer, Feather, FlareStore, Apple ou les responsables de Sources tierces, sauf indication explicite contraire du projet d’origine.',
    cookieSettings:'Réglages des cookies',
    creditsAcknowledgements:'Crédits et remerciements',
    analyticsTitle:'Mesure d’audience',
    analyticsP1:'Google Analytics est facultatif. Le code Google Analytics n’est chargé que si vous choisissez explicitement d’accepter la mesure d’audience. En cas de refus, iOS Hub ne charge pas le script Google Analytics.',
    analyticsP2:'Votre choix est enregistré localement dans le navigateur afin que le site puisse s’en souvenir. Vous pouvez le modifier à tout moment avec le bouton de réglage des cookies sur cette page ou dans le pied de page.',
    thirdPartyTitle:'Sources et téléchargements tiers',
    thirdPartyP1:'iOS Hub ne réhéberge pas les fichiers IPA de tiers. Les Sources tierces utilisées par le Builder sont traitées uniquement comme des liens : iOS Hub peut vérifier qu’un endpoint public est disponible et structurellement valide, mais le Builder ne copie, ne fusionne et ne réhéberge ni le contenu complet de la Source, ni les descriptions d’apps, illustrations, listes de versions ou autres métadonnées.',
    thirdPartyP2:'Pour l’import groupé, Source Builder transmet les URL publiques d’origine au raccourci iOS Hub Source Import sur l’appareil de l’utilisateur ; le raccourci ouvre ensuite ces URL d’origine dans l’installateur choisi. Le mode manuel peut les ouvrir une par une. iOS Hub ne crée pas de feed Source fusionné. Les noms d’apps, illustrations, descriptions, marques et autres contenus tiers restent sous la responsabilité et la propriété de leurs détenteurs respectifs.',
    thirdPartyP3:'Les Sources externes peuvent changer à tout moment. Lorsque vous ouvrez un site, un installateur ou une URL de téléchargement tiers, la politique de confidentialité et les conditions de ce service s’appliquent.',
    localToolsTitle:'Outils locaux du navigateur',
    localToolsP:'DEB → IPA Converter traite les fichiers sélectionnés localement dans votre navigateur. Le paquet sélectionné n’est pas envoyé au serveur iOS Hub.',
    localPreferencesTitle:'Préférences locales',
    localPreferencesP:'iOS Hub peut utiliser le stockage du navigateur pour la langue, l’apparence, les sélections du Builder et votre choix de mesure d’audience. Ces préférences servent à conserver le fonctionnement du site selon vos choix.',
    contactTitle:'Contact et corrections',
    contactP:'Si vous maintenez une Source ou un projet affiché sur iOS Hub et souhaitez corriger une attribution, retirer du contenu ou modifier un lien, ouvrez une issue dans le dépôt du projet.',
    contactGithub:'Contacter via GitHub ↗',
    lastUpdated:'Dernière mise à jour : 30 septembre 2026.',
    website:'Site web',
    creditsNav:'Crédits',
    privacyLink:'Confidentialité et cookies',
    consentTitle:'Cookies de mesure',
    consentText:'iOS Hub utilise Google Analytics uniquement si vous l’acceptez. En cas de refus, la mesure reste désactivée.',
    consentAccept:'Accepter la mesure',
    consentReject:'Refuser',
    consentPrivacy:'Confidentialité et cookies'
  }
};

function applyTheme(theme) {
  const value = theme === 'light' ? 'light' : 'dark';
  root.dataset.theme = value;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#070b14' : '#eef3f8');
  const button = $('#themeToggle');
  if (button) button.textContent = value === 'dark' ? '☀' : '☾';
  safeSet('caseycz-theme', value);
}

function applyPrivacyCopy(lang) {
  const copy = COPY[lang] || COPY.en;
  document.querySelectorAll('[data-privacy-copy]').forEach(node => {
    const key = node.dataset.privacyCopy;
    if (copy[key]) node.textContent = copy[key];
  });
  document.title = `${copy.title} — iOS Hub`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', copy.metaDescription);
}

function syncConsentBanner(lang) {
  const copy = COPY[lang] || COPY.en;
  const banner = document.querySelector('.privacy-consent');
  if (!banner) return;
  const title = banner.querySelector('#privacyConsentTitle');
  const text = banner.querySelector('.privacy-consent-copy span');
  const accept = banner.querySelector('[data-consent-accept]');
  const reject = banner.querySelector('[data-consent-reject]');
  const privacy = banner.querySelector('.privacy-consent-actions a[href="privacy.html"]');
  if (title) title.textContent = copy.consentTitle;
  if (text) text.textContent = copy.consentText;
  if (accept) accept.textContent = copy.consentAccept;
  if (reject) reject.textContent = copy.consentReject;
  if (privacy) privacy.textContent = copy.consentPrivacy;
}

function applyLanguage(value) {
  const lang = normalizeLanguage(value);
  root.lang = lang;
  applyTranslations(lang);
  applyPrivacyCopy(lang);
  syncConsentBanner(lang);
  const select = $('#languageSelect');
  if (select) select.value = lang;
  safeSet('caseycz-language', lang);
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

$('#themeToggle')?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#languageSelect')?.addEventListener('change', event => applyLanguage(event.target.value));

document.addEventListener('click', event => {
  if (event.target.closest('[data-support-open]')) return void openSupport();
  if (event.target.closest('[data-support-close]')) return void closeSupport();
  if (event.target.id === 'supportModal') closeSupport();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeSupport();
});

const savedTheme = safeGet('caseycz-theme');
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemDark ? 'dark' : 'light'));

const savedLang = safeGet('caseycz-language');
applyLanguage(SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : 'en');

if ($('#year')) $('#year').textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => syncConsentBanner(root.lang), { once:true });
