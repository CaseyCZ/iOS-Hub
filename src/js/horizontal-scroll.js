(() => {
  const SELECTOR = [
    '.filter-tabs',
    '.trouble-quick',
    '.assistant-trouble-chips',
    '.assistant-tried-options',
    '.guide-jumpbar',
    '.compat-table-wrap'
  ].join(',');

  function getScroller(target) {
    return target instanceof Element ? target.closest(SELECTOR) : null;
  }

  function canScroll(scroller) {
    return Boolean(scroller && scroller.scrollWidth > scroller.clientWidth + 1);
  }

  document.addEventListener('wheel', event => {
    const scroller = getScroller(event.target);
    if (!canScroll(scroller)) return;

    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;
    if (!delta) return;

    const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const atStart = scroller.scrollLeft <= 0;
    const atEnd = scroller.scrollLeft >= max - 1;
    if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;

    scroller.scrollLeft += delta;
    event.preventDefault();
  }, {passive:false});

  document.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const scroller = getScroller(event.target);
    if (!canScroll(scroller)) return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

    scroller.scrollBy({
      left: event.key === 'ArrowLeft' ? -120 : 120,
      behavior: 'smooth'
    });
  });

  document.addEventListener('click', event => {
    const scroller = getScroller(event.target);
    if (!scroller) return;
    const item = event.target.closest('button,a,[role="option"],[role="tab"]');
    if (!item || !scroller.contains(item)) return;
    requestAnimationFrame(() => item.scrollIntoView({
      block:'nearest',
      inline:'nearest',
      behavior:'smooth'
    }));
  });

  let touchDrag = null;

  document.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) return;
    const scroller = getScroller(event.target);
    if (!canScroll(scroller)) return;

    const touch = event.touches[0];
    touchDrag = {
      scroller,
      startX: touch.clientX,
      startY: touch.clientY,
      startScrollLeft: scroller.scrollLeft,
      horizontal: false
    };
  }, {passive:true});

  document.addEventListener('touchmove', event => {
    if (!touchDrag || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const dx = touch.clientX - touchDrag.startX;
    const dy = touch.clientY - touchDrag.startY;

    if (!touchDrag.horizontal) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        touchDrag = null;
        return;
      }
      touchDrag.horizontal = true;
    }

    touchDrag.scroller.scrollLeft = touchDrag.startScrollLeft - dx;
    event.preventDefault();
  }, {passive:false});

  const clearTouchDrag = () => { touchDrag = null; };
  document.addEventListener('touchend', clearTouchDrag, {passive:true});
  document.addEventListener('touchcancel', clearTouchDrag, {passive:true});
})();
