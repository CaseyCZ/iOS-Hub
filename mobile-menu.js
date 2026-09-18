function setupMobileMenu() {
  const header = document.querySelector('.topbar');
  const nav = header?.querySelector('.nav');
  const actions = header?.querySelector('.nav-actions');
  if (!header || !nav || !actions || document.getElementById('mobileMenuButton')) return;

  const button = document.createElement('button');
  button.id = 'mobileMenuButton';
  button.className = 'icon-btn mobile-menu-button';
  button.type = 'button';
  button.setAttribute('aria-label', 'Menu');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'mobileNavPanel');
  button.innerHTML = '<span class="mobile-menu-icon" aria-hidden="true"></span>';
  actions.appendChild(button);

  const panel = document.createElement('div');
  panel.id = 'mobileNavPanel';
  panel.className = 'mobile-nav-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = '<div class="wrap mobile-nav-inner"><nav class="mobile-nav-links" aria-label="Mobile navigation">' + nav.innerHTML + '</nav></div>';
  header.appendChild(panel);

  const setOpen = open => {
    header.classList.toggle('mobile-menu-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    button.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('mobile-menu-visible', open);
  };

  button.addEventListener('click', event => {
    event.stopPropagation();
    setOpen(!header.classList.contains('mobile-menu-open'));
  });

  panel.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setOpen(false);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupMobileMenu, { once: true });
} else {
  setupMobileMenu();
}
