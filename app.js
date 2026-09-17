(() => {
  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const state = {
    registry: [], status: {}, catalog: {}, selected: new Set(),
    sourceCategory: 'all', genre: 'all', query: '', lang: 'cs'
  };
  const MIX_LIMIT = 4;

  const GENRE_RULES = {
    games: ['games','pokemon','mmo','geometry-dash','game'],
    emulators: ['emulator','retro','dreamcast','dolphinios','virtualization'],
    video: ['video','streaming','youtube','media','stremio','kodi'],
    music: ['music','audio'],
    anime: ['anime','manga','comics'],
    social: ['social','mastodon','fediverse'],
    downloads: ['torrent','download','qbittorrent','network'],
    sideload: ['sideload','signing','livecontainer','debug'],
    utilities: ['utility','developer','terminal','linux','privacy','app','ios']
  };

  const text = (cs, en) => state.lang === 'en' ? en : cs;
  const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const escapeHtml = value => String(value ?? '').replace(/[&<>'\"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[char]));

  function applyTheme(theme) {
    const value = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = value;
    const button = $('#themeToggle');
    if (button) button.textContent = value === 'dark' ? '☀' : '☾';
    safeSet('caseycz-theme', value);
  }

  function applyLanguage(lang) {
    state.lang = lang === 'en' ? 'en' : 'cs';
    root.lang = state.lang;
    $$('[data-cs][data-en]').forEach(node => { node.textContent = node.dataset[state.lang]; });
    $$('[data-cs-placeholder][data-en-placeholder]').forEach(node => { node.placeholder = node.dataset[`${state.lang}Placeholder`]; });
    $$('[data-lang]').forEach(button => button.classList.toggle('active', button.dataset.lang === state.lang));
    document.title = state.lang === 'en'
      ? 'CaseyCZ iOS Hub — Sources, Catalog & Tools'
      : 'CaseyCZ iOS Hub — Zdroje, katalog & nástroje';
    safeSet('caseycz-language', state.lang);
    renderSources();
    renderBuilder();
    updateStats();
  }

  function modeLabel(mode) {
    if (mode === 'pal') return 'AltStore PAL';
    if (mode === 'sidestore') return 'SideStore';
    return 'AltStore Classic';
  }

  function getStatus(id) {
    return state.status?.sources?.[id] || {};
  }

  function sourceIcon(source) {
    const status = getStatus(source.id);
    const icon = status.iconURL || state.catalog?.sources?.find(item => item.id === source.id)?.iconURL;
    return icon ? `<img src="${escapeHtml(icon)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : escapeHtml(source.name.slice(0,2).toUpperCase());
  }

  function sourceDirectLink(source) {
    return `altstore://source?url=${encodeURIComponent(source.url)}`;
  }

  function matchesSourceCategory(source) {
    if (state.sourceCategory === 'all') return true;
    if (state.sourceCategory === 'official') return source.official === true;
    if (state.sourceCategory === 'trusted') return source.trusted === true;
    if (state.sourceCategory === 'community') return source.official !== true;
    if (state.sourceCategory === 'modified') return source.modified === true;
    return true;
  }

  function matchesGenre(source) {
    if (state.genre === 'all') return true;
    const tags = (source.tags || []).map(tag => String(tag).toLowerCase());
    const rules = GENRE_RULES[state.genre] || [];
    return rules.some(rule => tags.includes(rule));
  }

  function sourceCategoryBadges(source) {
    const badges = [];
    if (source.official) badges.push(`<span class="pill">✓ ${text('Official','Official')}</span>`);
    if (source.trusted) badges.push(`<span class="pill online">✓ ${text('Trusted','Trusted')}</span>`);
    if (!source.official) badges.push(`<span class="pill">${text('Community','Community')}</span>`);
    if (source.modified) badges.push(`<span class="pill">${text('Modified','Modified')}</span>`);
    return badges.join('');
  }

  function renderSources() {
    const grid = $('#sourceGrid');
    if (!grid) return;
    const q = state.query.trim().toLowerCase();
    const filtered = state.registry.filter(source => {
      if (getStatus(source.id).online !== true) return false;
      if (!matchesSourceCategory(source) || !matchesGenre(source)) return false;
      if (!q) return true;
      return [source.name, source.mode, ...(source.tags || []), source.description?.cs, source.description?.en]
        .filter(Boolean).join(' ').toLowerCase().includes(q);
    });

    if (!filtered.length) {
      grid.innerHTML = `<div class="panel empty" style="grid-column:1/-1"><div class="empty-icon">⌕</div><h3>${text('Nic nenalezeno','Nothing found')}</h3><p>${text('Zkus jinou kategorii, žánr nebo hledaný výraz.','Try another category, genre or search term.')}</p></div>`;
      return;
    }

    grid.innerHTML = filtered.map(source => {
      const status = getStatus(source.id);
      const appCount = Number.isFinite(status.appCount) ? status.appCount : '—';
      const selectable = source.mergeable && source.mode === 'classic';
      const checked = state.selected.has(source.id);
      const desc = source.description?.[state.lang] || source.description?.cs || '';
      return `<article class="source-card" data-source-id="${escapeHtml(source.id)}">
        <div class="source-top">
          <div class="source-icon">${sourceIcon(source)}</div>
          <div class="source-title">
            <h3>${escapeHtml(source.name)}</h3>
            <div class="source-meta">
              <span class="pill mode">${escapeHtml(modeLabel(source.mode))}</span>
              <span class="pill online">● ${text('Online','Online')}</span>
              ${sourceCategoryBadges(source)}
            </div>
          </div>
        </div>
        <p>${escapeHtml(desc)}</p>
        <div class="source-stats"><span><strong>${escapeHtml(appCount)}</strong> ${text('aplikací','apps')}</span>${status.checkedAt ? `<span>${text('Kontrola','Checked')}: ${escapeHtml(formatDate(status.checkedAt))}</span>` : ''}</div>
        <div class="source-actions">
          <a class="btn small primary" href="${escapeHtml(sourceDirectLink(source))}">${text('＋ Přidat','＋ Add')}</a>
          <button class="btn small secondary" type="button" data-copy-source="${escapeHtml(source.url)}">${text('Kopírovat URL','Copy URL')}</button>
          <a class="btn small ghost" href="${escapeHtml(source.url)}" target="_blank" rel="noopener">JSON ↗</a>
          ${source.website ? `<a class="btn small ghost" href="${escapeHtml(source.website)}" target="_blank" rel="noopener">Web ↗</a>` : ''}
          <label class="select-source ${selectable ? '' : 'disabled'}" title="${selectable ? text('Přidat do CaseyCZ Mixu','Add to CaseyCZ Mix') : text('Tento typ se do mixu nepřidává','This source type is not merged')}">
            <input type="checkbox" data-source-check="${escapeHtml(source.id)}" ${checked ? 'checked' : ''} ${selectable ? '' : 'disabled'}>
            <span>Mix</span>
          </label>
        </div>
      </article>`;
    }).join('');
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(state.lang === 'en' ? 'en-GB' : 'cs-CZ', {day:'2-digit', month:'2-digit', year:'numeric'}).format(date);
  }

  function builderSources() {
    return state.registry.filter(source => source.mergeable && source.mode === 'classic' && getStatus(source.id).online === true);
  }

  function renderBuilder() {
    const list = $('#builderList');
    if (!list) return;
    const available = builderSources();
    list.innerHTML = available.map(source => {
      const status = getStatus(source.id);
      const checked = state.selected.has(source.id);
      return `<label class="builder-item">
        <input type="checkbox" data-builder-check="${escapeHtml(source.id)}" ${checked ? 'checked' : ''}>
        <div><strong>${escapeHtml(source.name)}</strong><span>${escapeHtml(modeLabel(source.mode))}</span></div>
        <div class="builder-count">${Number.isFinite(status.appCount) ? `${status.appCount} ${text('aplikací','apps')}` : ''}</div>
      </label>`;
    }).join('');

    const count = $('#selectedCount');
    if (count) count.textContent = String(state.selected.size);
    const buildButton = $('#buildMix');
    if (buildButton) buildButton.disabled = state.selected.size === 0 || state.selected.size > MIX_LIMIT;
    const warning = $('#mixWarning');
    if (warning) warning.hidden = state.selected.size <= MIX_LIMIT;
    if (!state.selected.size) $('#builderResult')?.classList.remove('show');
  }

  function syncSelection(id, checked) {
    if (checked) {
      if (state.selected.size >= MIX_LIMIT && !state.selected.has(id)) {
        toast(text(`Do jednoho mixu lze vybrat maximálně ${MIX_LIMIT} zdroje.`,`A mix can contain up to ${MIX_LIMIT} sources.`));
        renderSources();
        renderBuilder();
        return;
      }
      state.selected.add(id);
    } else state.selected.delete(id);
    renderSources();
    renderBuilder();
  }

  function buildMix() {
    const ids = [...state.selected].sort();
    if (!ids.length || ids.length > MIX_LIMIT) return;
    const slug = ids.join('--');
    const url = new URL(`mix/${slug}.json`, window.location.href).href.split('#')[0];
    const names = ids.map(id => state.registry.find(source => source.id === id)?.name || id);
    $('#mixName').textContent = names.join(' + ');
    $('#mixUrl').textContent = url;
    $('#mixOpen').href = `altstore://source?url=${encodeURIComponent(url)}`;
    $('#mixPreview').href = url;
    $('#builderResult').classList.add('show');
  }

  async function copyText(value, successMessage) {
    try {
      await navigator.clipboard.writeText(value);
      toast(successMessage || text('Zkopírováno.','Copied.'));
    } catch (_) {
      const input = document.createElement('textarea');
      input.value = value; document.body.appendChild(input); input.select(); document.execCommand('copy'); input.remove();
      toast(successMessage || text('Zkopírováno.','Copied.'));
    }
  }

  let toastTimer;
  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { node.hidden = true; }, 2600);
  }

  function updateStats() {
    const statuses = state.status?.sources || {};
    const online = state.registry.filter(source => statuses[source.id]?.online === true).length;
    const mergeable = builderSources().length;
    const apps = state.registry.reduce((sum, source) => {
      const item = statuses[source.id];
      return sum + (item?.online === true && Number.isFinite(item.appCount) ? item.appCount : 0);
    }, 0);
    if ($('#statSources')) $('#statSources').textContent = online || '—';
    if ($('#statMix')) $('#statMix').textContent = mergeable || '—';
    if ($('#statApps')) $('#statApps').textContent = apps || '—';
  }

  async function loadData() {
    try {
      const [registryResponse, statusResponse, catalogResponse] = await Promise.all([
        fetch('sources/registry.json', {cache:'no-store'}),
        fetch('data/status.json', {cache:'no-store'}).catch(() => null),
        fetch('data/catalog.json', {cache:'no-store'}).catch(() => null)
      ]);
      const registry = await registryResponse.json();
      state.registry = registry.sources || [];
      if (statusResponse?.ok) state.status = await statusResponse.json();
      if (catalogResponse?.ok) state.catalog = await catalogResponse.json();
    } catch (error) {
      console.error(error);
      toast(text('Nepodařilo se načíst katalog zdrojů.','Could not load the source catalog.'));
    }
    renderSources(); renderBuilder(); updateStats();
  }

  function openSupport() {
    const modal = $('#supportModal');
    modal?.classList.add('open');
    document.body.classList.add('modal-open');
    modal?.setAttribute('aria-hidden','false');
  }
  function closeSupport() {
    const modal = $('#supportModal');
    modal?.classList.remove('open');
    document.body.classList.remove('modal-open');
    modal?.setAttribute('aria-hidden','true');
  }

  document.addEventListener('click', event => {
    const category = event.target.closest('[data-category-filter]');
    if (category) {
      state.sourceCategory = category.dataset.categoryFilter;
      $$('[data-category-filter]').forEach(btn => btn.classList.toggle('active', btn === category));
      renderSources();
      return;
    }
    const genre = event.target.closest('[data-genre-filter]');
    if (genre) {
      state.genre = genre.dataset.genreFilter;
      $$('[data-genre-filter]').forEach(btn => btn.classList.toggle('active', btn === genre));
      renderSources();
      return;
    }
    const copy = event.target.closest('[data-copy-source]');
    if (copy) return void copyText(copy.dataset.copySource, text('URL zdroje zkopírována.','Source URL copied.'));
    if (event.target.closest('[data-support-open]')) return void openSupport();
    if (event.target.closest('[data-support-close]')) return void closeSupport();
    if (event.target.id === 'supportModal') closeSupport();
    if (event.target.closest('#copyMix')) copyText($('#mixUrl').textContent, text('URL mixu zkopírována.','Mix URL copied.'));
    if (event.target.closest('#selectRecommended')) {
      state.selected.clear();
      builderSources().filter(source => source.recommended).slice(0,MIX_LIMIT).forEach(source => state.selected.add(source.id));
      renderSources(); renderBuilder();
    }
    if (event.target.closest('#clearSelection')) {
      state.selected.clear(); renderSources(); renderBuilder();
    }
  });

  document.addEventListener('change', event => {
    const id = event.target.dataset.sourceCheck || event.target.dataset.builderCheck;
    if (id) syncSelection(id, event.target.checked);
  });

  $('#sourceSearch')?.addEventListener('input', event => { state.query = event.target.value; renderSources(); });
  $('#buildMix')?.addEventListener('click', buildMix);
  $('#themeToggle')?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  $$('[data-lang]').forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSupport(); });

  const savedTheme = safeGet('caseycz-theme');
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemDark ? 'dark' : 'light'));
  const savedLang = safeGet('caseycz-language');
  const browserEn = (navigator.language || '').toLowerCase().startsWith('en');
  applyLanguage(savedLang === 'en' || savedLang === 'cs' ? savedLang : (browserEn ? 'en' : 'cs'));
  $('#year').textContent = new Date().getFullYear();
  loadData();
})();
