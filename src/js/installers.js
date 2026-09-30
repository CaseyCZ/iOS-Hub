export const SOURCE_VARIANTS = Object.freeze({
  classic: {
    id: 'classic',
    label: 'Classic',
    shortLabel: 'Classic',
    modeLabel: 'AltStore Classic',
    utilityPriority: 10,
    fallbackURL: source => source?.mode === 'pal' ? null : (source?.url || null)
  },
  pal: {
    id: 'pal',
    label: 'AltStore PAL',
    shortLabel: 'PAL',
    modeLabel: 'AltStore PAL',
    utilityPriority: 20,
    fallbackURL: source => source?.mode === 'pal' ? (source?.url || null) : null
  }
});

export const SOURCE_VARIANT_IDS = Object.freeze(Object.keys(SOURCE_VARIANTS));

export const RESOURCE_BADGES = Object.freeze({
  freeVerified: Object.freeze({ key: 'freeVerified', className: 'online' }),
  resourceSideloading: Object.freeze({ key: 'resourceSideloading', className: 'mode' }),
  resourceAppleTV: Object.freeze({ key: 'resourceAppleTV', className: 'mode' }),
  Sources: Object.freeze({ label: 'Sources', className: 'mode' }),
  'iOS 27': Object.freeze({ label: 'iOS 27', className: 'mode' }),
  marketplace: Object.freeze({ label: 'Marketplace', className: 'mode' })
});

export const SOURCE_MODES = Object.freeze({
  classic: {
    id: 'classic',
    label: 'AltStore Classic',
    variant: 'classic',
    formatLabel: 'Classic AltSource'
  },
  sidestore: {
    id: 'sidestore',
    label: 'SideStore',
    variant: 'classic',
    formatLabel: 'SideStore Source',
    installerIds: Object.freeze(['sidestore'])
  },
  pal: {
    id: 'pal',
    label: 'AltStore PAL',
    variant: 'pal',
    formatLabel: 'AltStore PAL Source',
    installerIds: Object.freeze(['altstore-pal'])
  }
});

export const INSTALLERS = Object.freeze({
  altstore: {
    id: 'altstore',
    label: 'AltStore',
    resourceName: 'AltStore Classic',
    creditName: 'AltStore',
    toolType: 'source-installer',
    recommendationRoles: Object.freeze({
      'marketplace-fallback': 10
    }),
    targets: Object.freeze(['iphone', 'ipad']),
    hostPlatforms: Object.freeze(['windows', 'macos']),
    computerMode: 'required',
    openSource: true,
    sourceSupport: 'classic',
    resourceBadges: Object.freeze(['freeVerified', 'resourceSideloading']),
    capabilities: Object.freeze(['source', 'ipa-install', 'refresh']),
    website: 'https://altstore.io/',
    guideURL: 'https://altstore.io/',
    links: Object.freeze({
      website: 'https://altstore.io/',
      guide: 'https://altstore.io/',
      classicGuide: 'https://faq.altstore.io/altstore-classic',
      troubleshooting: 'https://faq.altstore.io/altstore-classic/troubleshooting-guide'
    }),
    domain: 'altstore.io',
    coreCredit: true,
    resourceCard: true,
    resourceOrder: 10,
    creditOrder: 10,
    resourceDescriptionKey: 'resourceAltStoreDesc',
    creditDescriptionKey: 'altstoreDesc',
    creditBadge: 'Project',
    creditLinkKey: 'officialWebsite',
    variant: 'classic',
    builderDefault: true,
    catalogPriority: 10,
    overflowPriority: 10,
    icon: 'assets/icons/altstore.svg',
    buildLink: url => `altstore://source?url=${encodeURIComponent(url)}`
  },
  sidestore: {
    id: 'sidestore',
    label: 'SideStore',
    resourceName: 'SideStore',
    creditName: 'SideStore',
    toolType: 'source-installer',
    recommendationRoles: Object.freeze({
      'iphone-refresh': 10,
      'setup-refresh': 20,
      'pairing-guide': 10
    }),
    targets: Object.freeze(['iphone', 'ipad']),
    hostPlatforms: Object.freeze(['ios', 'ipados']),
    computerMode: 'setup',
    openSource: true,
    sourceSupport: 'classic',
    resourceBadges: Object.freeze(['freeVerified', 'resourceSideloading']),
    capabilities: Object.freeze(['source', 'ipa-install', 'refresh', 'on-device']),
    website: 'https://sidestore.io/',
    guideURL: 'https://docs.sidestore.io/',
    links: Object.freeze({
      website: 'https://sidestore.io/',
      guide: 'https://docs.sidestore.io/',
      prerequisites: 'https://docs.sidestore.io/docs/installation/prerequisites',
      pairing: 'https://docs.sidestore.io/docs/advanced/pairing-file',
      troubleshooting: 'https://docs.sidestore.io/docs/troubleshooting'
    }),
    domain: 'sidestore.io',
    coreCredit: true,
    resourceCard: true,
    resourceOrder: 20,
    creditOrder: 20,
    resourceDescriptionKey: 'resourceSideStoreDesc',
    creditDescriptionKey: 'sidestoreDesc',
    creditBadge: 'Project',
    creditLinkKey: 'officialWebsite',
    variant: 'classic',
    catalogPriority: 20,
    overflowPriority: 20,
    icon: 'assets/icons/sidestore.svg?v=1.1.5-20260918-audit13',
    buildLink: url => `sidestore://source?url=${encodeURIComponent(url)}`
  },
  livecontainer: {
    id: 'livecontainer',
    label: 'LiveContainer',
    resourceName: 'LiveContainer',
    creditName: 'LiveContainer',
    toolType: 'source-installer',
    recommendationRoles: Object.freeze({
      'many-apps': 10,
      'many-apps-setup': 20
    }),
    targets: Object.freeze(['iphone', 'ipad']),
    hostPlatforms: Object.freeze(['ios', 'ipados']),
    computerMode: 'depends',
    openSource: true,
    sourceSupport: 'classic',
    resourceBadges: Object.freeze(['freeVerified', 'resourceSideloading']),
    capabilities: Object.freeze(['source', 'ipa-run', 'container']),
    website: 'https://github.com/LiveContainer/LiveContainer',
    guideURL: 'https://livecontainer.github.io/docs/installation/lc_sidestore',
    links: Object.freeze({
      website: 'https://github.com/LiveContainer/LiveContainer',
      guide: 'https://livecontainer.github.io/docs/installation/lc_sidestore',
      lcSideStore: 'https://livecontainer.github.io/docs/installation/lc_sidestore',
      troubleshooting: 'https://livecontainer.github.io/docs/faq'
    }),
    domain: 'github.com/LiveContainer/LiveContainer',
    coreCredit: true,
    resourceCard: true,
    resourceOrder: 40,
    creditOrder: 40,
    resourceDescriptionKey: 'resourceLiveContainerDesc',
    creditDescriptionKey: 'livecontainerDesc',
    creditBadge: 'Open source',
    creditLinkKey: 'officialRepository',
    variant: 'classic',
    catalogPriority: 30,
    overflowPriority: 30,
    icon: 'assets/icons/livecontainer.svg',
    buildLink: url => `livecontainer://source?url=${encodeURIComponent(url)}`
  },
  'altstore-pal': {
    id: 'altstore-pal',
    label: 'AltStore PAL',
    resourceName: 'AltStore PAL',
    creditName: 'AltStore PAL',
    toolType: 'marketplace-source',
    recommendationRoles: Object.freeze({
      'marketplace': 10
    }),
    targets: Object.freeze(['iphone', 'ipad']),
    hostPlatforms: Object.freeze(['ios', 'ipados']),
    computerMode: 'none',
    openSource: null,
    sourceSupport: 'pal',
    resourceBadges: Object.freeze(['marketplace']),
    capabilities: Object.freeze(['source', 'marketplace']),
    website: 'https://altstore.io/',
    guideURL: 'https://altstore.io/download',
    links: Object.freeze({
      website: 'https://altstore.io/',
      guide: 'https://altstore.io/download',
      download: 'https://altstore.io/download',
      requirements: 'https://altstore.io/download',
      troubleshooting: 'https://faq.altstore.io/altstore-pal/troubleshooting'
    }),
    domain: 'altstore.io',
    coreCredit: false,
    resourceCard: false,
    resourceOrder: null,
    creditOrder: null,
    resourceDescriptionKey: null,
    creditDescriptionKey: null,
    creditBadge: null,
    creditLinkKey: null,
    variant: 'pal',
    catalogPriority: 40,
    overflowPriority: 60,
    icon: 'assets/icons/altstore.svg',
    buildLink: url => `altstore-pal://source?url=${encodeURIComponent(url)}`
  },
  flarestore: {
    id: 'flarestore',
    label: 'FlareStore',
    resourceName: 'FlareStore',
    creditName: 'FlareStore',
    toolType: 'source-installer',
    recommendationRoles: Object.freeze({}),
    targets: Object.freeze(['iphone', 'ipad']),
    hostPlatforms: Object.freeze(['ios', 'ipados']),
    computerMode: 'varies',
    openSource: null,
    sourceSupport: 'classic',
    resourceBadges: Object.freeze(['freeVerified', 'resourceSideloading', 'Sources']),
    capabilities: Object.freeze(['source', 'ipa-install', 'signing']),
    website: 'https://flarestore.app/',
    guideURL: 'https://flarestore.app/',
    links: Object.freeze({
      website: 'https://flarestore.app/',
      guide: 'https://flarestore.app/guide/ios/',
      troubleshooting: 'https://flarestore.app/guide/ios/'
    }),
    domain: 'flarestore.app',
    coreCredit: true,
    resourceCard: true,
    resourceOrder: 50,
    creditOrder: 50,
    resourceDescriptionKey: 'resourceFlareStoreDesc',
    creditDescriptionKey: 'flarestoreDesc',
    creditBadge: 'Project',
    creditLinkKey: 'officialWebsite',
    variant: 'classic',
    catalogPriority: 50,
    overflowPriority: 40,
    icon: 'assets/icons/flarestore.webp',
    buildLink: url => `flarestore://addRepo=${encodeURIComponent(url)}`
  },
  feather: {
    id: 'feather',
    label: 'Feather',
    resourceName: 'Feather',
    creditName: 'Feather',
    toolType: 'source-installer',
    recommendationRoles: Object.freeze({}),
    targets: Object.freeze(['iphone', 'ipad']),
    hostPlatforms: Object.freeze(['ios', 'ipados']),
    computerMode: 'none',
    openSource: true,
    sourceSupport: 'classic',
    resourceBadges: Object.freeze(['freeVerified', 'resourceSideloading']),
    capabilities: Object.freeze(['source', 'ipa-install', 'signing']),
    website: 'https://github.com/claration/Feather',
    guideURL: 'https://github.com/claration/Feather',
    links: Object.freeze({
      website: 'https://github.com/claration/Feather',
      guide: 'https://github.com/claration/Feather',
      repository: 'https://github.com/claration/Feather',
      troubleshooting: 'https://github.com/claration/Feather/wiki/Troubleshooting'
    }),
    domain: 'github.com/claration/Feather',
    coreCredit: true,
    resourceCard: true,
    resourceOrder: 60,
    creditOrder: 60,
    resourceDescriptionKey: 'resourceFeatherDesc',
    creditDescriptionKey: 'featherDesc',
    creditBadge: 'Open source',
    creditLinkKey: 'officialRepository',
    variant: 'classic',
    catalogPriority: 60,
    overflowPriority: 50,
    icon: 'assets/icons/feather.png',
    buildLink: url => `feather://source/${url}`
  }
});

export const SOURCE_BUILDER_INSTALLER_IDS = Object.freeze(
  Object.values(INSTALLERS)
    .filter(installer => installer.capabilities?.includes('source'))
    .map(installer => installer.id)
);

export const DEFAULT_SOURCE_BUILDER_INSTALLER_ID =
  SOURCE_BUILDER_INSTALLER_IDS.find(id => INSTALLERS[id]?.builderDefault)
  || SOURCE_BUILDER_INSTALLER_IDS[0]
  || '';

const AUXILIARY_SIDELOAD_TOOLS = Object.freeze({
  sideinstaller: Object.freeze({
    id: 'sideinstaller',
    label: 'SideInstaller',
    resourceName: 'SideInstaller',
    creditName: 'SideInstaller',
    toolType: 'setup-installer',
    recommendationRoles: Object.freeze({
      'iphone-refresh': 20,
      'on-device-setup': 10,
      'many-apps-setup': 10
    }),
    targets: Object.freeze(['iphone', 'ipad']),
    hostPlatforms: Object.freeze(['ios', 'ipados']),
    computerMode: 'none-ios27-pairing-legacy',
    openSource: true,
    sourceSupport: 'none',
    compatibility: Object.freeze({
      ios27: 'on-device',
      ios17to26: 'pairing-file-required'
    }),
    resourceBadges: Object.freeze(['freeVerified', 'iOS 27']),
    capabilities: Object.freeze(['bootstrap', 'pairing', 'on-device-setup']),
    website: 'https://sideinstaller.net/',
    repository: 'https://github.com/FrizzleM/SideInstaller',
    guideURL: 'https://sideinstaller.net/',
    links: Object.freeze({
      website: 'https://sideinstaller.net/',
      guide: 'https://sideinstaller.net/',
      repository: 'https://github.com/FrizzleM/SideInstaller',
      release: 'https://github.com/FrizzleM/SideInstaller/releases/tag/v1.0.0',
      troubleshooting: 'https://github.com/FrizzleM/SideInstaller/releases/tag/v1.0.0'
    }),
    domain: 'sideinstaller.net',
    creditDomain: 'github.com/FrizzleM/SideInstaller',
    icon: 'https://raw.githubusercontent.com/FrizzleM/SideInstaller/main/app-icon.png',
    coreCredit: true,
    resourceCard: true,
    resourceOrder: 30,
    creditOrder: 30,
    resourceDescriptionKey: 'resourceSideInstallerDesc',
    creditDescriptionKey: 'sideinstallerDesc',
    creditBadge: 'FrizzleM',
    creditLinkKey: 'officialRepository',
  }),
  sideloadly: Object.freeze({
    id: 'sideloadly',
    label: 'Sideloadly',
    resourceName: 'Sideloadly',
    creditName: 'Sideloadly',
    toolType: 'ipa-installer',
    recommendationRoles: Object.freeze({
      'desktop-install': 10,
      'apple-tv': 10
    }),
    targets: Object.freeze(['iphone', 'ipad', 'apple-tv', 'apple-silicon-mac']),
    hostPlatforms: Object.freeze(['windows', 'macos']),
    computerMode: 'required',
    openSource: null,
    sourceSupport: 'none',
    resourceBadges: Object.freeze(['freeVerified', 'resourceSideloading']),
    capabilities: Object.freeze(['ipa-install', 'desktop', 'tv', 'refresh']),
    website: 'https://sideloadly.io/',
    guideURL: 'https://sideloadly.io/',
    links: Object.freeze({
      website: 'https://sideloadly.io/',
      guide: 'https://sideloadly.io/',
      troubleshooting: 'https://sideloadly.io/faq'
    }),
    domain: 'sideloadly.io',
    icon: 'https://sideloadly.io/favicon.ico',
    coreCredit: true,
    resourceCard: true,
    resourceOrder: 70,
    creditOrder: 110,
    resourceDescriptionKey: 'resourceSideloadlyDesc',
    creditDescriptionKey: 'sideloadlyDesc',
    creditBadge: 'Project',
    creditLinkKey: 'officialWebsite',
  }),
  atvloadly: Object.freeze({
    id: 'atvloadly',
    label: 'atvloadly',
    resourceName: 'atvloadly',
    creditName: 'atvloadly',
    toolType: 'ipa-installer',
    recommendationRoles: Object.freeze({
      'apple-tv': 20
    }),
    targets: Object.freeze(['apple-tv']),
    hostPlatforms: Object.freeze(['linux', 'openwrt', 'docker']),
    computerMode: 'self-hosted',
    openSource: true,
    sourceSupport: 'none',
    resourceBadges: Object.freeze(['freeVerified', 'resourceAppleTV']),
    capabilities: Object.freeze(['ipa-install', 'pairing', 'tv', 'self-hosted']),
    website: 'https://github.com/bitxeno/atvloadly',
    repository: 'https://github.com/bitxeno/atvloadly',
    guideURL: 'https://github.com/bitxeno/atvloadly',
    links: Object.freeze({
      website: 'https://github.com/bitxeno/atvloadly',
      guide: 'https://github.com/bitxeno/atvloadly',
      repository: 'https://github.com/bitxeno/atvloadly',
      troubleshooting: 'https://github.com/bitxeno/atvloadly/wiki/FAQ'
    }),
    domain: 'github.com/bitxeno/atvloadly',
    icon: 'assets/icons/atvloadly.svg',
    coreCredit: true,
    resourceCard: true,
    resourceOrder: 80,
    creditOrder: 80,
    resourceDescriptionKey: 'resourceAtvloadlyDesc',
    creditDescriptionKey: 'atvloadlyDesc',
    creditBadge: 'bitxeno',
    creditLinkKey: 'officialRepository',
  }),
  iloader: Object.freeze({
    id: 'iloader',
    label: 'iloader',
    resourceName: 'iloader',
    creditName: 'iloader',
    toolType: 'pairing-tool',
    recommendationRoles: Object.freeze({
      'pairing-bootstrap': 10
    }),
    targets: Object.freeze(['iphone', 'ipad']),
    hostPlatforms: Object.freeze(['desktop']),
    computerMode: 'required',
    openSource: true,
    sourceSupport: 'none',
    resourceBadges: Object.freeze(['freeVerified', 'resourceSideloading']),
    capabilities: Object.freeze(['bootstrap', 'pairing', 'desktop']),
    website: 'https://iloader.app/',
    guideURL: 'https://iloader.app/',
    links: Object.freeze({
      website: 'https://iloader.app/',
      guide: 'https://iloader.app/',
      troubleshooting: 'https://iloader.app/'
    }),
    domain: 'iloader.app',
    icon: 'assets/icons/iloader.svg',
    coreCredit: true,
    resourceCard: true,
    resourceOrder: 90,
    creditOrder: 90,
    resourceDescriptionKey: 'resourceIloaderDesc',
    creditDescriptionKey: 'iloaderDesc',
    creditBadge: 'Project',
    creditLinkKey: 'officialWebsite',
  }),
  impactor: Object.freeze({
    id: 'impactor',
    label: 'Impactor',
    resourceName: 'Impactor',
    creditName: 'Impactor',
    toolType: 'ipa-installer',
    recommendationRoles: Object.freeze({
      'pairing-bootstrap': 20
    }),
    targets: Object.freeze(['iphone', 'ipad']),
    hostPlatforms: Object.freeze(['windows', 'macos', 'linux']),
    computerMode: 'required',
    openSource: true,
    sourceSupport: 'none',
    resourceBadges: Object.freeze(['freeVerified', 'resourceSideloading']),
    capabilities: Object.freeze(['ipa-install', 'bootstrap', 'pairing', 'desktop']),
    website: 'https://github.com/claration/Impactor',
    repository: 'https://github.com/claration/Impactor',
    guideURL: 'https://github.com/claration/Impactor',
    links: Object.freeze({
      website: 'https://github.com/claration/Impactor',
      guide: 'https://github.com/claration/Impactor',
      repository: 'https://github.com/claration/Impactor',
      troubleshooting: 'https://github.com/claration/Impactor/issues'
    }),
    domain: 'github.com/claration/Impactor',
    icon: 'https://raw.githubusercontent.com/claration/Impactor/main/package/linux/icons/hicolor/512x512/apps/dev.khcrysalis.PlumeImpactor.png',
    coreCredit: true,
    resourceCard: true,
    resourceOrder: 100,
    creditOrder: 100,
    resourceDescriptionKey: 'resourceImpactorDesc',
    creditDescriptionKey: 'impactorDesc',
    creditBadge: 'claration',
    creditLinkKey: 'officialRepository',
  }),
  trollstore: Object.freeze({
    id: 'trollstore',
    label: 'TrollStore',
    resourceName: 'TrollStore',
    creditName: 'TrollStore',
    toolType: 'permanent-installer',
    recommendationRoles: Object.freeze({
      'permanent': 10
    }),
    targets: Object.freeze(['iphone', 'ipad']),
    hostPlatforms: Object.freeze(['ios', 'ipados']),
    computerMode: 'varies',
    openSource: true,
    sourceSupport: 'none',
    resourceBadges: Object.freeze(['freeVerified', 'resourceSideloading']),
    capabilities: Object.freeze(['ipa-install', 'permanent']),
    website: 'https://github.com/opa334/TrollStore',
    repository: 'https://github.com/opa334/TrollStore',
    guideURL: 'https://github.com/opa334/TrollStore',
    links: Object.freeze({
      website: 'https://github.com/opa334/TrollStore',
      guide: 'https://github.com/opa334/TrollStore',
      repository: 'https://github.com/opa334/TrollStore',
      troubleshooting: 'https://github.com/opa334/TrollStore/issues'
    }),
    domain: 'github.com/opa334/TrollStore',
    icon: 'assets/icons/trollstore.svg',
    coreCredit: true,
    resourceCard: true,
    resourceOrder: 110,
    creditOrder: 70,
    resourceDescriptionKey: 'resourceTrollStoreDesc',
    creditDescriptionKey: 'trollstoreDesc',
    creditBadge: 'opa334',
    creditLinkKey: 'officialRepository',
  })
});

export const SIDELOAD_TOOLS = Object.freeze({
  ...INSTALLERS,
  ...AUXILIARY_SIDELOAD_TOOLS
});

export const CORE_SIDELOAD_TOOL_IDS = Object.freeze(
  Object.values(SIDELOAD_TOOLS).filter(tool => tool.coreCredit).map(tool => tool.id)
);

export const CORE_SIDELOAD_RESOURCE_NAMES = Object.freeze(
  CORE_SIDELOAD_TOOL_IDS.map(id => SIDELOAD_TOOLS[id]?.resourceName).filter(Boolean)
);

export function sideloadTool(toolId) {
  return SIDELOAD_TOOLS[toolId] || null;
}

export function sideloadToolURL(toolId, purpose = 'website') {
  const tool = sideloadTool(toolId);
  if (!tool) return '';

  const explicit = tool.links?.[purpose];
  if (typeof explicit === 'string' && explicit) return explicit;

  if (purpose === 'guide') return tool.guideURL || tool.website || tool.repository || '';
  if (purpose === 'credit') return tool.repository || tool.website || '';
  if (purpose === 'repository') return tool.repository || tool.website || '';
  return tool.website || tool.repository || '';
}

export function sideloadToolSupports(toolId, capability) {
  return Boolean(sideloadTool(toolId)?.capabilities?.includes(capability));
}

export function resourceBadgeSpecs(toolId) {
  const tool = sideloadTool(toolId);
  return (tool?.resourceBadges || [])
    .map(id => RESOURCE_BADGES[id])
    .filter(Boolean);
}

export function orderedSideloadTools(orderKey, predicate = () => true) {
  return Object.values(SIDELOAD_TOOLS)
    .filter(tool => Number.isFinite(Number(tool?.[orderKey])) && predicate(tool))
    .sort((a, b) => Number(a[orderKey]) - Number(b[orderKey]));
}

export function resourceSideloadTools() {
  return orderedSideloadTools('resourceOrder', tool => tool.resourceCard === true);
}

export function creditSideloadTools() {
  return orderedSideloadTools('creditOrder', tool => tool.coreCredit === true);
}

export function troubleshootingSideloadTools() {
  return Object.values(SIDELOAD_TOOLS)
    .filter(tool => Boolean(tool.links?.troubleshooting))
    .sort((a, b) => {
      const aOrder = Number.isFinite(Number(a.resourceOrder)) ? Number(a.resourceOrder) : Number.MAX_SAFE_INTEGER;
      const bOrder = Number.isFinite(Number(b.resourceOrder)) ? Number(b.resourceOrder) : Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return String(a.label || a.id).localeCompare(String(b.label || b.id));
    });
}

export function sideloadToolsWithCapability(capability) {
  return Object.values(SIDELOAD_TOOLS).filter(tool => tool.capabilities?.includes(capability));
}

export function sideloadToolsForTarget(target) {
  return Object.values(SIDELOAD_TOOLS).filter(tool => tool.targets?.includes(target));
}

export function sideloadToolsForRole(role) {
  return Object.values(SIDELOAD_TOOLS)
    .filter(tool => Number.isFinite(Number(tool.recommendationRoles?.[role])))
    .sort((a, b) =>
      Number(a.recommendationRoles[role]) - Number(b.recommendationRoles[role])
    );
}

export function sideloadToolForRole(role, index = 0) {
  return sideloadToolsForRole(role)[Math.max(0, index)] || null;
}

export function sideloadToolProfile(toolId) {
  const tool = sideloadTool(toolId);
  if (!tool) return null;
  return {
    id: tool.id,
    type: tool.toolType,
    capabilities: [...(tool.capabilities || [])],
    targets: [...(tool.targets || [])],
    hostPlatforms: [...(tool.hostPlatforms || [])],
    computerMode: tool.computerMode || 'unknown',
    openSource: tool.openSource ?? null,
    sourceSupport: tool.sourceSupport || 'none',
    recommendationRoles: {...(tool.recommendationRoles || {})},
    resourceOrder: tool.resourceOrder ?? null,
    creditOrder: tool.creditOrder ?? null,
    resourceDescriptionKey: tool.resourceDescriptionKey || null,
    creditDescriptionKey: tool.creditDescriptionKey || null,
    creditBadge: tool.creditBadge || null,
    creditLinkKey: tool.creditLinkKey || null
  };
}

function installerOrder(installerId, key) {
  const value = Number(INSTALLERS[installerId]?.[key]);
  return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
}

export function groupInstallerIds(installerIds, maxMain = 3) {
  const unique = [...new Set((installerIds || []).filter(id => INSTALLERS[id]))];
  const ordered = [...unique].sort((a, b) =>
    installerOrder(a, 'catalogPriority') - installerOrder(b, 'catalogPriority')
  );
  const main = ordered.slice(0, Math.max(0, maxMain));
  const mainSet = new Set(main);
  const more = ordered
    .filter(id => !mainSet.has(id))
    .sort((a, b) =>
      installerOrder(a, 'overflowPriority') - installerOrder(b, 'overflowPriority')
    );
  return { main, more };
}

export function sourceVariantURL(source, variantId) {
  const variant = SOURCE_VARIANTS[variantId];
  if (!variant) return source?.url || null;

  const configured = source?.urls?.[variantId];
  if (typeof configured === 'string' && configured.trim()) return configured.trim();

  return variant.fallbackURL(source);
}

export function sourceVariantIds(source) {
  return SOURCE_VARIANT_IDS.filter(variantId => Boolean(sourceVariantURL(source, variantId)));
}

export function sourceVariantLabel(variantId) {
  return SOURCE_VARIANTS[variantId]?.label || variantId;
}

export function sourceModeLabel(source) {
  const variants = sourceVariantIds(source);
  if (variants.length > 1) {
    return variants.map(variantId => SOURCE_VARIANTS[variantId]?.shortLabel || variantId).join(' + ');
  }

  const mode = SOURCE_MODES[source?.mode];
  if (mode?.label) return mode.label;

  const variantId = variants[0];
  return SOURCE_VARIANTS[variantId]?.modeLabel || SOURCE_MODES.classic.label;
}

export function sourceFormatLabel(source) {
  return SOURCE_MODES[source?.mode]?.formatLabel || SOURCE_MODES.classic.formatLabel;
}

export function sourceInstallerIds(source) {
  if (Array.isArray(source?.installers)) {
    return [...new Set(source.installers.filter(id => INSTALLERS[id]))];
  }

  const mode = SOURCE_MODES[source?.mode] || SOURCE_MODES.classic;
  if (Array.isArray(mode.installerIds) && sourceVariantIds(source).length <= 1) {
    return mode.installerIds.filter(id => INSTALLERS[id]);
  }

  const availableVariants = new Set(sourceVariantIds(source));
  return Object.values(INSTALLERS)
    .filter(installer => availableVariants.has(installer.variant))
    .map(installer => installer.id);
}

export function sourceInstallerCompatibility(sourceStatus, installerId) {
  return sourceStatus?.installerCompatibility?.[installerId] || null;
}

export function sourceInstallerDirectAvailable(sourceStatus, installerId) {
  return sourceInstallerCompatibility(sourceStatus, installerId)?.directSource !== 'fail';
}

export function sourceInstallerDeepLink(source, installerId) {
  const installer = INSTALLERS[installerId];
  if (!installer) return null;

  const sourceURL = sourceVariantURL(source, installer.variant);
  if (!sourceURL) return null;

  return installer.buildLink(sourceURL);
}

export function sourceUtilityURL(source) {
  const ordered = [...SOURCE_VARIANT_IDS].sort((a, b) =>
    (SOURCE_VARIANTS[a]?.utilityPriority || Number.MAX_SAFE_INTEGER)
    - (SOURCE_VARIANTS[b]?.utilityPriority || Number.MAX_SAFE_INTEGER)
  );
  for (const variantId of ordered) {
    const url = sourceVariantURL(source, variantId);
    if (url) return url;
  }
  return source?.url || '';
}
