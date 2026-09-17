const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const COPY = {
  en: {show:'Show list', hide:'Hide list', sources:'Included sources', apps:'Included apps', mix:'Mix contents', sourceList:'Source list', loading:'Loading list…', empty:'No items to show.'},
  cs: {show:'Zobrazit seznam', hide:'Skrýt seznam', sources:'Zahrnuté zdroje', apps:'Zahrnuté aplikace', mix:'Obsah Mixu', sourceList:'Seznam zdrojů', loading:'Načítám seznam…', empty:'Není co zobrazit.'},
  de: {show:'Liste anzeigen', hide:'Liste ausblenden', sources:'Enthaltene Quellen', apps:'Enthaltene Apps', mix:'Mix-Inhalt', sourceList:'Quellenliste', loading:'Liste wird geladen…', empty:'Keine Einträge.'},
  es: {show:'Mostrar lista', hide:'Ocultar lista', sources:'Fuentes incluidas', apps:'Apps incluidas', mix:'Contenido del Mix', sourceList:'Lista de fuentes', loading:'Cargando lista…', empty:'No hay elementos.'},
  fr: {show:'Afficher la liste', hide:'Masquer la liste', sources:'Sources incluses', apps:'Apps incluses', mix:'Contenu du Mix', sourceList:'Liste des sources', loading:'Chargement de la liste…', empty:'Aucun élément.'}
};

const OPEN_KEYS = {
  alt: 'ioshub-open-alt-package',
  side: 'ioshub-open-side-package',
  builder: 'ioshub-open-builder-list',
  mix: 'ioshub-open-mix-list'
};

let registry = [];
let status = {};
let altPackage = {apps: []};
let sidePackage = {apps: []};
let mixRenderToken = 0;

function lang() {
  const value = safeGet('caseycz-language') || document.documentElement.lang || 'en';
  return COPY[value] ? value : 'en';
}
function tr(key) { return COPY[lang()][key] || COPY.en[key] || key; }
function isOpen(key) { return safeGet(OPEN_KEYS[key]) === '1'; }
function saveOpen(key, open) { safeSet(OPEN_KEYS[key], open ? '1' : '0'); }

function disclosureSummary(label, countText = '') {
  return `<span class="disclosure-title"><span class="show-text">${escapeHtml(tr('show'))}</span><span class="hide-text">${escapeHtml(tr('hide'))}</span> · ${escapeHtml(label)}</span>${countText ? `<span class="disclosure-count">${escapeHtml(countText)}</span>` : ''}`;
}

function sourceName(id) {
  return registry.find(source => source.id === id)?.name || id;
}

function rows(items, kind) {
  if (!items.length) return `<div class="disclosure-empty">${escapeHtml(tr('empty'))}</div>`;
  return `<div class="disclosure-list">${items.map(item => {
    if (kind === 'source') return `<div class="disclosure-row"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.mode || '')}</span></div>`;
    return `<div class="disclosure-row"><strong>${escapeHtml(item.name || 'Unknown app')}</strong><span>${escapeHtml(item.developerName || item.bundleIdentifier || '')}</span></div>`;
  }).join('')}</div>`;
}

function packageDetails(type) {
  const side = type === 'side';
  const ids = side ? (status?.sidestore?.sourceIDs || []) : (status?.altstore?.sourceIDs || status?.mixes?.autoCompatibleSourceIDs || []);
  const payload = side ? sidePackage : altPackage;
  const sources = ids.map(id => {
    const source = registry.find(item => item.id === id);
    return {name: source?.name || id, mode: source?.mode === 'pal' ? 'AltStore PAL' : source?.mode === 'sidestore' ? 'SideStore' : 'AltStore Classic'};
  });
  const apps = Array.isArray(payload?.apps) ? [...payload.apps].sort((a,b) => String(a?.name || '').localeCompare(String(b?.name || ''))) : [];
  return {sources, apps};
}

function injectPackageDisclosure(card, type) {
  if (card.querySelector('.package-disclosure')) return;
  const {sources, apps} = packageDetails(type);
  const details = document.createElement('details');
  details.className = 'content-disclosure package-disclosure';
  details.dataset.disclosureType = type;
  details.open = isOpen(type);
  details.innerHTML = `<summary>${disclosureSummary(`${tr('sources')} + ${tr('apps')}`, `${sources.length} · ${apps.length}`)}</summary>
    <div class="disclosure-body collapsible-scroll">
      <div class="disclosure-section"><h5>${escapeHtml(tr('sources'))} · ${sources.length}</h5>${rows(sources, 'source')}</div>
      <div class="disclosure-section"><h5>${escapeHtml(tr('apps'))} · ${apps.length}</h5>${rows(apps, 'app')}</div>
    </div>`;
  details.addEventListener('toggle', () => saveOpen(type, details.open));
  card.appendChild(details);
}

function renderPackageDisclosures() {
  const host = $('#officialSourcePackages');
  if (!host) return;
  $$('.official-source-card').forEach(card => {
    if (!host.contains(card)) return;
    const badge = card.querySelector('.pill')?.textContent?.trim();
    injectPackageDisclosure(card, badge === 'SideStore' ? 'side' : 'alt');
  });
}

function ensureBuilderDisclosure() {
  const list = $('#experimentalBuilderList');
  if (!list || list.closest('.builder-list-disclosure')) return;
  const details = document.createElement('details');
  details.className = 'content-disclosure builder-list-disclosure';
  details.open = isOpen('builder');
  const summary = document.createElement('summary');
  summary.id = 'builderListSummary';
  details.appendChild(summary);
  list.parentNode.insertBefore(details, list);
  details.appendChild(list);
  details.addEventListener('toggle', () => saveOpen('builder', details.open));
  updateBuilderSummary();
}

function updateBuilderSummary() {
  const summary = $('#builderListSummary');
  if (!summary) return;
  const count = $('#expSelectedCount')?.textContent?.trim() || '';
  summary.innerHTML = disclosureSummary(tr('sourceList'), count);
}

function selectedIds() {
  try {
    const parsed = JSON.parse(safeGet('ioshub-mix-selection') || '[]');
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch (_) { return []; }
}

async function uniqueAppsForSources(ids) {
  const payloads = await Promise.all(ids.map(async id => {
    try {
      const response = await fetch(`data/source-cache/${encodeURIComponent(id)}.json`, {cache:'no-store'});
      if (!response.ok) return null;
      return await response.json();
    } catch (_) { return null; }
  }));
  const unique = new Map();
  payloads.forEach(payload => {
    (Array.isArray(payload?.apps) ? payload.apps : []).forEach(app => {
      if (!app || typeof app !== 'object') return;
      const key = app.bundleIdentifier || app.bundleID || `${app.name || 'app'}|${app.developerName || ''}`;
      if (!unique.has(key)) unique.set(key, app);
    });
  });
  return [...unique.values()].sort((a,b) => String(a?.name || '').localeCompare(String(b?.name || '')));
}

function ensureMixDisclosure() {
  const result = $('#expResult');
  if (!result) return null;
  let details = $('#mixContentsDisclosure');
  if (details) return details;
  details = document.createElement('details');
  details.id = 'mixContentsDisclosure';
  details.className = 'content-disclosure mix-contents-disclosure';
  details.open = isOpen('mix');
  details.innerHTML = `<summary>${disclosureSummary(tr('mix'))}</summary><div class="disclosure-body collapsible-scroll"><div class="disclosure-empty">${escapeHtml(tr('loading'))}</div></div>`;
  details.addEventListener('toggle', () => saveOpen('mix', details.open));
  const actions = result.querySelector('.builder-actions');
  result.insertBefore(details, actions || null);
  return details;
}

async function renderMixDisclosure() {
  const result = $('#expResult');
  if (!result?.classList.contains('show')) return;
  const token = ++mixRenderToken;
  const ids = selectedIds();
  const details = ensureMixDisclosure();
  if (!details) return;
  details.querySelector('summary').innerHTML = disclosureSummary(tr('mix'), `${ids.length} ${tr('sources')}`);
  details.querySelector('.disclosure-body').innerHTML = `<div class="disclosure-empty">${escapeHtml(tr('loading'))}</div>`;
  const apps = await uniqueAppsForSources(ids);
  if (token !== mixRenderToken) return;
  const sources = ids.map(id => {
    const source = registry.find(item => item.id === id);
    return {name: source?.name || id, mode: source?.mode === 'pal' ? 'AltStore PAL' : source?.mode === 'sidestore' ? 'SideStore' : 'AltStore Classic'};
  });
  details.querySelector('summary').innerHTML = disclosureSummary(tr('mix'), `${sources.length} · ${apps.length}`);
  details.querySelector('.disclosure-body').innerHTML = `
    <div class="disclosure-section"><h5>${escapeHtml(tr('sources'))} · ${sources.length}</h5>${rows(sources, 'source')}</div>
    <div class="disclosure-section"><h5>${escapeHtml(tr('apps'))} · ${apps.length}</h5>${rows(apps, 'app')}</div>`;
}

function refreshLanguage() {
  updateBuilderSummary();
  renderPackageDisclosures();
  if ($('#expResult')?.classList.contains('show')) renderMixDisclosure();
}

async function initCollapsibles() {
  ensureBuilderDisclosure();

  const packageHost = $('#officialSourcePackages');
  const countNode = $('#expSelectedCount');
  const result = $('#expResult');

  packageHost && new MutationObserver(renderPackageDisclosures).observe(packageHost, {childList:true, subtree:true});
  countNode && new MutationObserver(updateBuilderSummary).observe(countNode, {childList:true, characterData:true, subtree:true});
  result && new MutationObserver(() => {
    if (result.classList.contains('show')) renderMixDisclosure();
  }).observe(result, {attributes:true, attributeFilter:['class']});

  try {
    const [registryResponse, statusResponse, altResponse, sideResponse] = await Promise.all([
      fetch('sources/registry.json', {cache:'no-store'}),
      fetch('data/status.json', {cache:'no-store'}),
      fetch('altstore/source.json', {cache:'no-store'}),
      fetch('sidestore/source.json', {cache:'no-store'})
    ]);
    registry = (await registryResponse.json()).sources || [];
    status = await statusResponse.json();
    if (altResponse.ok) altPackage = await altResponse.json();
    if (sideResponse.ok) sidePackage = await sideResponse.json();
  } catch (error) {
    console.warn('Collapsible list data could not be loaded.', error);
  }

  renderPackageDisclosures();
  updateBuilderSummary();
  if (result?.classList.contains('show')) renderMixDisclosure();

  $('#languageSelect')?.addEventListener('change', () => setTimeout(refreshLanguage, 0));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCollapsibles, {once:true});
} else {
  initCollapsibles();
}
