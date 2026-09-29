import { SUPPORTED_LANGUAGES, applyTranslations, normalizeLanguage, t } from './i18n.js?v=1.1.5-20260918-fullaudit2';
import { SIDELOAD_TOOLS, sideloadToolURL } from './installers.js?v=1.1.5-20260929-installers6';

const root = document.documentElement;
const RESOURCE_EXTRA_COPY = {
  en: {
    resourceStacherDesc: 'Cross-platform desktop GUI for yt-dlp on Windows, macOS and Linux, with download queues, presets and support for sites handled by yt-dlp.',
    resourceApolloDesc: 'Free open-source Sunshine fork for low-latency game and desktop streaming. On Windows, its built-in virtual display can automatically match the client resolution and refresh rate, with HDR support for compatible setups.',
    resourceVLCDesc: 'Free open-source cross-platform media player that handles most audio and video formats plus network streams without requiring separate codec packs.',
    resourceTermiusDesc: 'Cross-platform SSH client with a free Starter plan that includes SSH, Mosh, Telnet, port forwarding and SFTP on mobile and desktop devices.'
  },
  cs: {
    resourceStacherDesc: 'Multiplatformní desktopové GUI pro yt-dlp pro Windows, macOS a Linux s frontou stahování, předvolbami a podporou webů, které umí yt-dlp.',
    resourceApolloDesc: 'Bezplatný open-source fork Sunshine pro streamování her a plochy s nízkou latencí. Ve Windows umí vestavěný virtuální displej automaticky přizpůsobit rozlišení a obnovovací frekvenci klientovi a podporuje HDR v kompatibilních sestavách.',
    resourceVLCDesc: 'Bezplatný open-source multiplatformní přehrávač, který zvládá většinu audio a video formátů i síťové streamy bez nutnosti instalovat samostatné balíčky kodeků.',
    resourceTermiusDesc: 'Multiplatformní SSH klient s bezplatným tarifem Starter, který na mobilu i desktopu zahrnuje SSH, Mosh, Telnet, port forwarding a SFTP.'
  },
  de: {
    resourceStacherDesc: 'Plattformübergreifende Desktop-Oberfläche für yt-dlp unter Windows, macOS und Linux mit Download-Warteschlange, Presets und Unterstützung für von yt-dlp unterstützte Websites.',
    resourceApolloDesc: 'Kostenloser Open-Source-Sunshine-Fork für Game- und Desktop-Streaming mit niedriger Latenz. Unter Windows kann das integrierte virtuelle Display Auflösung und Bildwiederholrate automatisch an den Client anpassen und unterstützt HDR in kompatiblen Setups.',
    resourceVLCDesc: 'Kostenloser Open-Source-Mediaplayer für mehrere Plattformen, der die meisten Audio- und Videoformate sowie Netzwerkstreams ohne separate Codec-Pakete abspielt.',
    resourceTermiusDesc: 'Plattformübergreifender SSH-Client mit kostenlosem Starter-Plan inklusive SSH, Mosh, Telnet, Port-Forwarding und SFTP auf Mobil- und Desktop-Geräten.'
  },
  es: {
    resourceStacherDesc: 'Interfaz gráfica de escritorio multiplataforma para yt-dlp en Windows, macOS y Linux, con cola de descargas, ajustes predefinidos y compatibilidad con los sitios admitidos por yt-dlp.',
    resourceApolloDesc: 'Fork gratuito y open source de Sunshine para streaming de juegos y escritorio con baja latencia. En Windows, su pantalla virtual integrada puede adaptar automáticamente la resolución y la frecuencia de refresco al cliente y admite HDR en configuraciones compatibles.',
    resourceVLCDesc: 'Reproductor multimedia gratuito, open source y multiplataforma que reproduce la mayoría de formatos de audio y vídeo y streams de red sin paquetes de códecs separados.',
    resourceTermiusDesc: 'Cliente SSH multiplataforma con un plan Starter gratuito que incluye SSH, Mosh, Telnet, reenvío de puertos y SFTP en dispositivos móviles y de escritorio.'
  },
  fr: {
    resourceStacherDesc: 'Interface graphique de bureau multiplateforme pour yt-dlp sous Windows, macOS et Linux, avec file de téléchargements, préréglages et prise en charge des sites gérés par yt-dlp.',
    resourceApolloDesc: 'Fork gratuit et open source de Sunshine pour le streaming de jeux et de bureau à faible latence. Sous Windows, son écran virtuel intégré peut adapter automatiquement la résolution et le taux de rafraîchissement au client et prend en charge le HDR avec les configurations compatibles.',
    resourceVLCDesc: 'Lecteur multimédia gratuit, open source et multiplateforme capable de lire la plupart des formats audio et vidéo ainsi que les flux réseau sans packs de codecs séparés.',
    resourceTermiusDesc: 'Client SSH multiplateforme avec un forfait Starter gratuit comprenant SSH, Mosh, Telnet, la redirection de ports et SFTP sur mobile et ordinateur.'
  }
};

function applyResourceExtraCopy(lang) {
  const copy = RESOURCE_EXTRA_COPY[lang] || RESOURCE_EXTRA_COPY.en;
  document.querySelectorAll('[data-resource-copy]').forEach(node => {
    const key = node.dataset.resourceCopy;
    if (copy[key]) node.textContent = copy[key];
  });
}

function hydrateSideloadToolCards() {
  document.querySelectorAll('[data-sideload-tool]').forEach(card => {
    const tool = SIDELOAD_TOOLS[card.dataset.sideloadTool];
    if (!tool) return;

    const title = card.querySelector('h3');
    if (title && tool.resourceName) title.textContent = tool.resourceName;

    const domain = card.querySelector('.resource-domain');
    if (domain && tool.domain) domain.textContent = tool.domain;

    const href = sideloadToolURL(tool.id);
    const link = card.querySelector('a.btn.primary');
    if (link && href) link.href = href;

    card.querySelectorAll('img.official-app-icon, img.brand-link-icon').forEach(img => {
      if (tool.icon) img.src = tool.icon;
      if (img.classList.contains('official-app-icon')) img.alt = tool.resourceName || tool.label || '';
    });
  });
}

const $ = selector => document.querySelector(selector);
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

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
  applyResourceExtraCopy(lang);
  const select = $('#languageSelect');
  if (select) select.value = lang;
  document.title = `${t(lang, 'resourcesPageTitle')} — iOS Hub`;
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

document.addEventListener('click', event => {
  if (event.target.closest('[data-support-open]')) return void openSupport();
  if (event.target.closest('[data-support-close]')) return void closeSupport();
  if (event.target.id === 'supportModal') closeSupport();
});

$('#themeToggle')?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#languageSelect')?.addEventListener('change', event => applyLanguage(event.target.value));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSupport(); });

hydrateSideloadToolCards();

const savedTheme = safeGet('caseycz-theme');
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemDark ? 'dark' : 'light'));

const savedLang = safeGet('caseycz-language');
applyLanguage(SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : 'en');

if ($('#year')) $('#year').textContent = new Date().getFullYear();


function enableImageFallbacks() {
  document.addEventListener('error', event => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    const fallback = img.dataset.fallback;
    if (!fallback || img.dataset.fallbackUsed === '1') return;
    img.dataset.fallbackUsed = '1';
    img.src = fallback;
  }, true);
}
enableImageFallbacks();
