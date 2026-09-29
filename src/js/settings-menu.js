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
  let returnFocus = null;

  // Safari iOS creates a containing block around the blurred sticky header.
  // Move the panel to <body> so fixed positioning and scrolling use the real viewport.
  if (panel.parentElement !== document.body) document.body.appendChild(panel);

  const positionPanel = () => {
    if (!panel.classList.contains('open')) return;

    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edge = 10;
    const gap = 8;
    const compact = viewportWidth <= 640;

    const width = Math.min(compact ? 360 : 310, viewportWidth - edge * 2);
    let left = rect.right - width;
    left = Math.max(edge, Math.min(left, viewportWidth - width - edge));

    let top = rect.bottom + gap;
    let available = viewportHeight - top - edge;

    // On short landscape screens use almost the full viewport and scroll inside it.
    if (available < 220) {
      top = edge;
      available = viewportHeight - edge * 2;
    }

    panel.style.width = `${width}px`;
    panel.style.left = `${Math.round(left)}px`;
    panel.style.right = 'auto';
    panel.style.top = `${Math.round(top)}px`;
    panel.style.bottom = 'auto';
    panel.style.maxHeight = `${Math.max(120, Math.floor(available))}px`;
  };

  const close = (restoreFocus = false) => {
    const wasOpen = panel.classList.contains('open');
    menu.classList.remove('open');
    panel.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    if (wasOpen && restoreFocus) {
      const target = returnFocus || button;
      requestAnimationFrame(() => target.focus?.());
    }
    returnFocus = null;
  };

  const open = () => {
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : button;
    document.querySelector('.topbar')?.classList.remove('mobile-menu-open');
    document.body.classList.remove('mobile-menu-visible');
    document.getElementById('mobileNavPanel')?.setAttribute('aria-hidden', 'true');
    document.getElementById('mobileMenuButton')?.setAttribute('aria-expanded', 'false');

    menu.classList.add('open');
    panel.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    panel.scrollTop = 0;
    positionPanel();
    requestAnimationFrame(() => {
      const active = panel.querySelector('[data-settings-theme].active, [data-settings-language].active');
      (active || themeButtons[0] || langButtons[0] || panel.querySelector('.settings-report-link'))?.focus();
    });
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
    panel.classList.contains('open') ? close(true) : open();
  });

  panel.addEventListener('click', event => event.stopPropagation());
  panel.querySelector('.settings-report-link')?.addEventListener('click', () => close(false));

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
    if (!menu.contains(event.target) && !panel.contains(event.target)) close(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('open')) {
      event.preventDefault();
      close(true);
    }
  });

  window.addEventListener('resize', positionPanel, { passive:true });
  window.addEventListener('orientationchange', () => setTimeout(positionPanel, 120), { passive:true });
  window.visualViewport?.addEventListener('resize', positionPanel, { passive:true });
  window.visualViewport?.addEventListener('scroll', positionPanel, { passive:true });

  syncLanguage();
  syncTheme();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupSettingsMenu, { once:true });
} else {
  setupSettingsMenu();
}
