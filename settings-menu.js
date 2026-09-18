const SETTINGS_COPY = {
  en: { title:'Settings', appearance:'APPEARANCE', dark:'Dark', light:'Light', language:'LANGUAGE', report:'REPORT ISSUE' },
  cs: { title:'Nastavení', appearance:'VZHLED', dark:'Tmavý', light:'Světlý', language:'JAZYK', report:'NAHLÁSIT PROBLÉM' },
  de: { title:'Einstellungen', appearance:'DARSTELLUNG', dark:'Dunkel', light:'Hell', language:'SPRACHE', report:'PROBLEM MELDEN' },
  es: { title:'Ajustes', appearance:'APARIENCIA', dark:'Oscuro', light:'Claro', language:'IDIOMA', report:'REPORTAR UN ERROR' },
  fr: { title:'Réglages', appearance:'APPARENCE', dark:'Sombre', light:'Clair', language:'LANGUE', report:'SIGNALER UN BUG' }
};

function setupSettingsMenu() {
  const root = document.documentElement;
  const menu = document.querySelector('[data-settings-menu]');
  const button = document.getElementById('settingsButton');
  const panel = document.getElementById('settingsPanel');
  const select = document.getElementById('languageSelect');
  const themeProxy = document.getElementById('themeToggle');
  if (!menu || !button || !panel || !select || !themeProxy) return;

  const langButtons = [...panel.querySelectorAll('[data-settings-language]')];
  const themeButtons = [...panel.querySelectorAll('[data-settings-theme]')];

  const close = () => {
    menu.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  };

  const syncLanguage = () => {
    const lang = SETTINGS_COPY[select.value] ? select.value : 'en';
    const copy = SETTINGS_COPY[lang];
    const title = panel.querySelector('[data-settings-copy="title"]');
    const appearance = panel.querySelector('[data-settings-copy="appearance"]');
    const dark = panel.querySelector('[data-settings-copy="dark"]');
    const light = panel.querySelector('[data-settings-copy="light"]');
    const language = panel.querySelector('[data-settings-copy="language"]');
    const report = panel.querySelector('[data-settings-copy="report"]');
    if (title) title.textContent = copy.title;
    if (appearance) appearance.textContent = copy.appearance;
    if (dark) dark.textContent = copy.dark;
    if (light) light.textContent = copy.light;
    if (language) language.textContent = copy.language;
    if (report) report.textContent = copy.report;
    button.setAttribute('aria-label', copy.title);
    button.title = copy.title;
    langButtons.forEach(item => {
      const active = item.dataset.settingsLanguage === lang;
      item.classList.toggle('active', active);
      item.setAttribute('aria-checked', String(active));
    });
  };

  const syncTheme = () => {
    const theme = root.dataset.theme === 'light' ? 'light' : 'dark';
    themeButtons.forEach(item => {
      const active = item.dataset.settingsTheme === theme;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  };

  button.addEventListener('click', event => {
    event.stopPropagation();
    const open = !menu.classList.contains('open');
    document.querySelector('.topbar')?.classList.remove('mobile-menu-open');
    document.getElementById('mobileNavPanel')?.setAttribute('aria-hidden', 'true');
    document.getElementById('mobileMenuButton')?.setAttribute('aria-expanded', 'false');
    menu.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
  });

  panel.addEventListener('click', event => event.stopPropagation());
  panel.querySelector('.settings-report-link')?.addEventListener('click', close);

  langButtons.forEach(item => {
    item.addEventListener('click', () => {
      const lang = item.dataset.settingsLanguage;
      if (!SETTINGS_COPY[lang]) return;
      select.value = lang;
      select.dispatchEvent(new Event('change', { bubbles:true }));
      syncLanguage();
    });
  });

  themeButtons.forEach(item => {
    item.addEventListener('click', () => {
      const wanted = item.dataset.settingsTheme === 'light' ? 'light' : 'dark';
      const current = root.dataset.theme === 'light' ? 'light' : 'dark';
      if (wanted !== current) themeProxy.click();
      requestAnimationFrame(syncTheme);
    });
  });

  select.addEventListener('change', syncLanguage);
  themeProxy.addEventListener('click', () => requestAnimationFrame(syncTheme));

  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
  });

  syncLanguage();
  syncTheme();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupSettingsMenu, { once:true });
} else {
  setupSettingsMenu();
}
