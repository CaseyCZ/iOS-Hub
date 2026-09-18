import { SUPPORTED_LANGUAGES, applyTranslations, normalizeLanguage, t } from './i18n.js?v=1.1.5-20260918-audit1';

const root = document.documentElement;
const $ = selector => document.querySelector(selector);
const STORAGE = { theme: 'caseycz-theme', language: 'caseycz-language' };
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

function applyTheme(theme) {
  const value = theme === 'light' ? 'light' : 'dark';
  root.dataset.theme = value;
  const button = $('#themeToggle');
  if (button) button.textContent = value === 'dark' ? '☀' : '☾';
  safeSet(STORAGE.theme, value);
}

function applyLanguage(value) {
  const lang = normalizeLanguage(value);
  root.lang = lang;
  applyTranslations(lang);
  const select = $('#languageSelect');
  if (select) select.value = lang;
  safeSet(STORAGE.language, lang);
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

const savedTheme = safeGet(STORAGE.theme);
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemDark ? 'dark' : 'light'));

const savedLang = safeGet(STORAGE.language);
applyLanguage(SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : 'en');

if ($('#year')) $('#year').textContent = new Date().getFullYear();
