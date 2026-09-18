const LANGUAGE_META = {
  en: { code: 'EN', flag: 'EN', name: 'English' },
  cs: { code: 'CZ', flag: '🇨🇿', name: 'Čeština' },
  de: { code: 'DE', flag: '🇩🇪', name: 'Deutsch' },
  es: { code: 'ES', flag: '🇪🇸', name: 'Español' },
  fr: { code: 'FR', flag: '🇫🇷', name: 'Français' }
};

function setupLanguageMenu() {
  const select = document.getElementById('languageSelect');
  const menu = document.querySelector('[data-language-menu]');
  const trigger = document.getElementById('languageMenuButton');
  if (!select || !menu || !trigger) return;

  const panel = menu.querySelector('.language-menu-panel');
  const flag = trigger.querySelector('.language-current-flag');
  const code = trigger.querySelector('.language-current-code');
  const options = [...menu.querySelectorAll('[data-language]')];

  const close = () => {
    menu.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  };

  const sync = () => {
    const lang = LANGUAGE_META[select.value] ? select.value : 'en';
    const meta = LANGUAGE_META[lang];
    if (flag) flag.textContent = meta.flag;
    if (code) code.textContent = meta.code;
    trigger.setAttribute('aria-label', `Language: ${meta.name}`);
    options.forEach(option => {
      const active = option.dataset.language === lang;
      option.classList.toggle('active', active);
      option.setAttribute('aria-checked', String(active));
    });
  };

  trigger.addEventListener('click', event => {
    event.stopPropagation();
    const open = !menu.classList.contains('open');
    document.querySelectorAll('[data-language-menu].open').forEach(node => node.classList.remove('open'));
    menu.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', String(open));
  });

  panel?.addEventListener('click', event => event.stopPropagation());

  options.forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.dataset.language;
      if (!LANGUAGE_META[lang]) return;
      select.value = lang;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
      close();
    });
  });

  select.addEventListener('change', sync);
  document.addEventListener('click', close);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
  });

  sync();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupLanguageMenu, { once: true });
} else {
  setupLanguageMenu();
}
