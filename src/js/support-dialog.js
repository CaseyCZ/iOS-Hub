function setupSupportDialogFocusTrap() {
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  document.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const modal = document.querySelector('#supportModal.open[role="dialog"]');
    if (!modal || modal.getAttribute('aria-hidden') === 'true') return;

    const focusable = [...modal.querySelectorAll(focusableSelector)]
      .filter(node => !node.hidden && node.getAttribute('aria-hidden') !== 'true' && node.getClientRects().length);

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !modal.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !modal.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupSupportDialogFocusTrap, { once:true });
} else {
  setupSupportDialogFocusTrap();
}
