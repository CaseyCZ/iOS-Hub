(() => {
  const SELECTOR = [
    '.filter-tabs',
    '.trouble-quick',
    '.assistant-trouble-chips',
    '.assistant-tried-options',
    '.guide-jumpbar',
    '.compat-table-wrap'
  ].join(',');

  const FILTER_COPY = {
    en: {active:'active', clear:'Clear filters', guideTitle:'⚙ Filters · 🔎 Search'},
    cs: {active:'aktivní', clear:'Smazat filtry', guideTitle:'⚙ Filtry · 🔎 Hledání'},
    de: {active:'aktiv', clear:'Filter löschen', guideTitle:'⚙ Filter · 🔎 Suche'},
    es: {active:'activos', clear:'Borrar filtros', guideTitle:'⚙ Filtros · 🔎 Buscar'},
    fr: {active:'actifs', clear:'Effacer les filtres', guideTitle:'⚙ Filtres · 🔎 Recherche'}
  };

  const filterControllers = [];

  function getScroller(target) {
    return target instanceof Element ? target.closest(SELECTOR) : null;
  }

  function canScroll(scroller) {
    return Boolean(scroller && scroller.scrollWidth > scroller.clientWidth + 1);
  }

  function currentLanguage() {
    let saved = '';
    try { saved = localStorage.getItem('caseycz-language') || ''; } catch (_) {}
    const value = document.documentElement.lang || saved || 'en';
    return FILTER_COPY[value] ? value : (FILTER_COPY[saved] ? saved : 'en');
  }

  function filterCopy() {
    return FILTER_COPY[currentLanguage()] || FILTER_COPY.en;
  }

  function injectFilterSummaryStyles() {
    if (document.getElementById('sharedFilterSummaryStyles')) return;
    const style = document.createElement('style');
    style.id = 'sharedFilterSummaryStyles';
    style.textContent = `
      .filter-summary-host>summary{display:flex!important;align-items:center;gap:10px;position:relative}
      .filter-summary-host>summary>.disclosure-title{flex:1;min-width:0}
      .filter-summary-actions{margin-left:auto;margin-right:20px;display:inline-flex;align-items:center;justify-content:flex-end;gap:9px;white-space:nowrap}
      .filter-summary-actions[hidden]{display:none!important}
      .filter-summary-count{color:var(--muted);font-size:9px;font-weight:900;letter-spacing:.02em}
      .filter-summary-clear{appearance:none;border:0;background:transparent;padding:4px 2px;color:var(--bad);font-size:10px;font-weight:950;cursor:pointer;line-height:1}
      .filter-summary-clear:hover,.filter-summary-clear:focus-visible{color:var(--bad);text-decoration:underline;text-underline-offset:3px;outline:none}
      .guide-filter-disclosure{margin:0 auto 14px;max-width:1180px}
      .guide-filter-disclosure>.disclosure-body{padding:12px}
      .guide-filter-disclosure .trouble-quick{margin-top:0}
      .guide-filter-disclosure .trouble-toolbar{margin-bottom:0}
      @media(max-width:640px){
        .filter-summary-actions{margin-right:14px;gap:6px}
        .filter-summary-count{display:none}
        .filter-summary-clear{font-size:9px}
      }
    `;
    document.head.appendChild(style);
  }

  function createFilterSummary(details, getActiveCount, resetFilters, options = {}) {
    if (!(details instanceof HTMLDetailsElement)) return null;
    const summary = details.querySelector(':scope > summary');
    if (!summary) return null;

    details.classList.add('filter-summary-host');

    let actions = summary.querySelector(':scope > .filter-summary-actions');
    if (!actions) {
      actions = document.createElement('span');
      actions.className = 'filter-summary-actions';
      actions.hidden = true;

      const count = document.createElement('span');
      count.className = 'filter-summary-count';

      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'filter-summary-clear';

      clear.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        resetFilters();
        requestAnimationFrame(refresh);
      });

      actions.append(count, clear);
      summary.appendChild(actions);
    }

    const countNode = actions.querySelector('.filter-summary-count');
    const clearButton = actions.querySelector('.filter-summary-clear');
    const titleNode = options.titleNode || null;

    function refresh() {
      const activeCount = Math.max(0, Number(getActiveCount()) || 0);
      const copy = filterCopy();
      if (titleNode) titleNode.textContent = copy.guideTitle;
      if (countNode) countNode.textContent = `${activeCount} ${copy.active}`;
      if (clearButton) {
        clearButton.textContent = `${copy.clear} ×`;
        clearButton.setAttribute('aria-label', copy.clear);
        clearButton.title = copy.clear;
      }
      actions.hidden = details.open || activeCount === 0;
    }

    details.addEventListener('toggle', refresh);
    const observer = new MutationObserver(refresh);
    observer.observe(details, {subtree:true, attributes:true, attributeFilter:['class']});

    const controller = {refresh};
    filterControllers.push(controller);
    refresh();
    return controller;
  }

  function setSearchValue(input, value = '') {
    if (!input || input.value === value) return;
    input.value = value;
    input.dispatchEvent(new Event('input', {bubbles:true}));
  }

  function setupCatalogFilterSummary() {
    const details = document.querySelector('details.filter-disclosure');
    if (!details) return;

    createFilterSummary(
      details,
      () => {
        let count = 0;
        const category = document.querySelector('[data-category-filter].active')?.dataset.categoryFilter || 'all';
        const genre = document.querySelector('[data-genre-filter].active')?.dataset.genreFilter || 'all';
        const sort = document.querySelector('[data-sort-filter].active')?.dataset.sortFilter || 'name';
        if (category !== 'all') count += 1;
        if (genre !== 'all') count += 1;
        if (sort !== 'name') count += 1;
        if ((document.querySelector('#sourceSearch')?.value || '').trim()) count += 1;
        return count;
      },
      () => {
        const categoryAll = document.querySelector('[data-category-filter="all"]');
        const genreAll = document.querySelector('[data-genre-filter="all"]');
        const sortName = document.querySelector('[data-sort-filter="name"]');
        if (categoryAll && !categoryAll.classList.contains('active')) categoryAll.click();
        if (genreAll && !genreAll.classList.contains('active')) genreAll.click();
        if (sortName && !sortName.classList.contains('active')) sortName.click();
        setSearchValue(document.querySelector('#sourceSearch'));
      }
    );
  }

  function setupBuilderFilterSummary() {
    const details = document.querySelector('details.builder-filter-disclosure');
    if (!details) return;

    createFilterSummary(
      details,
      () => {
        let count = 0;
        const category = document.querySelector('[data-exp-category-filter].active')?.dataset.expCategoryFilter || 'all';
        const genre = document.querySelector('[data-exp-genre-filter].active')?.dataset.expGenreFilter || 'all';
        if (category !== 'all') count += 1;
        if (genre !== 'all') count += 1;
        if ((document.querySelector('#expSourceSearch')?.value || '').trim()) count += 1;
        return count;
      },
      () => {
        const categoryAll = document.querySelector('[data-exp-category-filter="all"]');
        const genreAll = document.querySelector('[data-exp-genre-filter="all"]');
        if (categoryAll && !categoryAll.classList.contains('active')) categoryAll.click();
        if (genreAll && !genreAll.classList.contains('active')) genreAll.click();
        setSearchValue(document.querySelector('#expSourceSearch'));
      }
    );
  }

  function setupGuideFilterSummary() {
    const quick = document.querySelector('.trouble-quick');
    const toolbar = document.querySelector('.trouble-toolbar');
    if (!quick || !toolbar || quick.closest('.guide-filter-disclosure')) return;

    const details = document.createElement('details');
    details.className = 'content-disclosure filter-disclosure guide-filter-disclosure';
    details.open = true;

    const summary = document.createElement('summary');
    const title = document.createElement('span');
    title.className = 'disclosure-title';
    title.dataset.sharedFilterTitle = 'guide';
    summary.appendChild(title);

    const body = document.createElement('div');
    body.className = 'disclosure-body';

    quick.parentNode.insertBefore(details, quick);
    details.append(summary, body);
    body.append(quick, toolbar);

    createFilterSummary(
      details,
      () => ((document.querySelector('#troubleSearch')?.value || '').trim() ? 1 : 0),
      () => setSearchValue(document.querySelector('#troubleSearch')),
      {titleNode:title}
    );
  }

  function refreshFilterSummaries() {
    filterControllers.forEach(controller => controller.refresh());
  }

  function initSharedFilterUi() {
    injectFilterSummaryStyles();
    setupCatalogFilterSummary();
    setupBuilderFilterSummary();
    setupGuideFilterSummary();
    requestAnimationFrame(refreshFilterSummaries);
    setTimeout(refreshFilterSummaries, 250);
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
    if (scroller) {
      const item = event.target.closest('button,a,[role="option"],[role="tab"]');
      if (item && scroller.contains(item)) {
        requestAnimationFrame(() => item.scrollIntoView({
          block:'nearest',
          inline:'nearest',
          behavior:'smooth'
        }));
      }
    }
    requestAnimationFrame(refreshFilterSummaries);
  });

  document.addEventListener('input', () => requestAnimationFrame(refreshFilterSummaries));
  document.addEventListener('change', () => requestAnimationFrame(refreshFilterSummaries));
  window.addEventListener('load', refreshFilterSummaries);

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedFilterUi, {once:true});
  } else {
    initSharedFilterUi();
  }
})();
