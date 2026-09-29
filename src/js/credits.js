import { SUPPORTED_LANGUAGES, applyTranslations, normalizeLanguage } from './i18n.js?v=1.1.5-20260918-fullaudit2';

const root = document.documentElement;
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
      sources
        .slice()
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
        .forEach(source => {
          const url = source.website || source.url;
          if (source.name && url) sourcesHost.appendChild(externalLink(source.name, url));
        });

      if (!sourcesHost.children.length) {
        const empty = document.createElement('span');
        empty.className = 'pill';
        empty.textContent = 'No source credits available.';
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
        icon.className = 'resource-icon';
        icon.textContent = 'REF';

        const badges = document.createElement('div');
        badges.className = 'resource-badges';
        const badge = document.createElement('span');
        badge.className = 'pill mode';
        badge.textContent = 'Reference';
        badges.appendChild(badge);

        const title = document.createElement('h3');
        title.textContent = ref.name || 'Reference';

        const note = document.createElement('p');
        note.textContent = ref.note || 'Source discovery or verification reference.';

        const domain = document.createElement('div');
        domain.className = 'resource-domain';
        try { domain.textContent = new URL(ref.url).hostname; } catch (_) { domain.textContent = ref.url || ''; }

        const link = document.createElement('a');
        link.className = 'btn primary';
        link.href = ref.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Open reference ↗';

        card.append(icon, badges, title, note, domain, link);
        refsHost.appendChild(card);
      });
    }
  } catch (_) {
    if (sourcesHost) {
      sourcesHost.replaceChildren();
      const msg = document.createElement('span');
      msg.className = 'pill';
      msg.textContent = 'Source credits are temporarily unavailable.';
      sourcesHost.appendChild(msg);
    }
    if (refsHost) {
      refsHost.innerHTML = '<article class="panel resource-card"><div class="resource-icon">!</div><h3>References unavailable</h3><p>Please try again later.</p></article>';
    }
  }
}

$('#themeToggle')?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#languageSelect')?.addEventListener('change', event => applyLanguage(event.target.value));

const savedTheme = safeGet('caseycz-theme');
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemDark ? 'dark' : 'light'));

const savedLang = safeGet('caseycz-language');
applyLanguage(SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : 'en');

if ($('#year')) $('#year').textContent = new Date().getFullYear();
loadCredits();
