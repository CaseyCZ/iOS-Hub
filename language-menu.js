const LANGUAGE_META = {
  en: { flag: 'assets/flags/gb.svg', name: 'English' },
  cs: { flag: 'assets/flags/cz.svg', name: 'Čeština' },
  de: { flag: 'assets/flags/de.svg', name: 'Deutsch' },
  es: { flag: 'assets/flags/es.svg', name: 'Español' },
  fr: { flag: 'assets/flags/fr.svg', name: 'Français' }
};

function setupLanguageMenu() {
  const select = document.getElementById('languageSelect');
  const menu = document.querySelector('[data-language-menu]');
  const trigger = document.getElementById('languageMenuButton');
  if (!select || !menu || !trigger) return;

  const panel = menu.querySelector('.language-menu-panel');
  const flag = trigger.querySelector('.language-current-flag');
  const name = trigger.querySelector('.language-current-name');
  const options = [...menu.querySelectorAll('[data-language]')];

  const close = () => {
    menu.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  };

  const sync = () => {
    const lang = LANGUAGE_META[select.value] ? select.value : 'en';
    const meta = LANGUAGE_META[lang];
    if (flag) flag.src = meta.flag;
    if (flag) flag.alt = '';
    if (name) name.textContent = meta.name;
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
