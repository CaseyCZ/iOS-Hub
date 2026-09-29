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
    resourceName: 'SideStore',
    creditName: 'SideStore',
    toolType: 'source-installer',
    capabilities: Object.freeze(['source', 'ipa-install', 'refresh', 'on-device']),
    website: 'https://sidestore.io/',
    guideURL: 'https://docs.sidestore.io/',
    links: Object.freeze({
      website: 'https://sidestore.io/',
      guide: 'https://docs.sidestore.io/',
      prerequisites: 'https://docs.sidestore.io/docs/installation/prerequisites',
      pairing: 'https://docs.sidestore.io/docs/advanced/pairing-file'
    }),
    domain: 'sidestore.io',
    coreCredit: true,
    resourceCard: true,
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
    capabilities: Object.freeze(['source', 'ipa-install', 'refresh']),
    website: 'https://altstore.io/',
    guideURL: 'https://altstore.io/',
    links: Object.freeze({
      website: 'https://altstore.io/',
      guide: 'https://altstore.io/',
      classicGuide: 'https://faq.altstore.io/altstore-classic'
    }),
    domain: 'altstore.io',
    coreCredit: true,
    resourceCard: true,
    variant: 'classic',
    mixTarget: true,
    mixHelpKey: 'targetHelpAlt',
    catalogPriority: 10,
    overflowPriority: 10,
    icon: 'assets/icons/altstore.svg',
    buildLink: url => `altstore://source?url=${encodeURIComponent(url)}`
  },
  sidestore: {
    id: 'sidestore',
    label: 'SideStore',
    variant: 'classic',
    mixTarget: true,
    mixHelpKey: 'targetHelpSide',
    mixPackage: 'sidestore',
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
    capabilities: Object.freeze(['source', 'ipa-run', 'container']),
    website: 'https://github.com/LiveContainer/LiveContainer',
    guideURL: 'https://livecontainer.github.io/docs/installation/lc_sidestore',
    links: Object.freeze({
      website: 'https://github.com/LiveContainer/LiveContainer',
      guide: 'https://livecontainer.github.io/docs/installation/lc_sidestore',
      lcSideStore: 'https://livecontainer.github.io/docs/installation/lc_sidestore'
    }),
    domain: 'github.com/LiveContainer/LiveContainer',
    coreCredit: true,
    resourceCard: true,
    variant: 'classic',
    mixTarget: true,
    mixHelpKey: 'targetHelpLive',
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
    capabilities: Object.freeze(['source', 'marketplace']),
    website: 'https://altstore.io/',
    guideURL: 'https://altstore.io/download',
    links: Object.freeze({
      website: 'https://altstore.io/',
      guide: 'https://altstore.io/download',
      download: 'https://altstore.io/download',
      requirements: 'https://altstore.io/download'
    }),
    domain: 'altstore.io',
    coreCredit: false,
    resourceCard: false,
    variant: 'pal',
    mixTarget: false,
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
    capabilities: Object.freeze(['source', 'ipa-install', 'signing']),
    website: 'https://flarestore.app/',
    guideURL: 'https://flarestore.app/',
    domain: 'flarestore.app',
    coreCredit: true,
    resourceCard: true,
    variant: 'classic',
    mixTarget: true,
    mixHelpKey: 'targetHelpFlare',
    catalogPriority: 50,
    overflowPriority: 40,
    icon: 'https://flarestore.app/favicon.ico',
    buildLink: url => `flarestore://source?url=${encodeURIComponent(url)}`
  },
  feather: {
    id: 'feather',
    label: 'Feather',
    resourceName: 'Feather',
    creditName: 'Feather',
    toolType: 'source-installer',
    capabilities: Object.freeze(['source', 'ipa-install', 'signing']),
    website: 'https://github.com/claration/Feather',
    guideURL: 'https://github.com/claration/Feather',
    domain: 'github.com/claration/Feather',
    coreCredit: true,
    resourceCard: true,
    variant: 'classic',
    mixTarget: true,
    mixHelpKey: 'targetHelpFeather',
    catalogPriority: 60,
    overflowPriority: 50,
    icon: 'https://raw.githubusercontent.com/claration/Feather/v1.x/iOS/Resources/Icons/Main/Mac@3x.png',
    buildLink: url => `feather://source/${url}`
  }
});

export const BUILDER_INSTALLER_IDS = Object.freeze(
  Object.values(INSTALLERS).filter(installer => installer.mixTarget).map(installer => installer.id)
);

const AUXILIARY_SIDELOAD_TOOLS = Object.freeze({
  sideinstaller: Object.freeze({
    id: 'sideinstaller',
    label: 'SideInstaller',
    resourceName: 'SideInstaller',
    creditName: 'SideInstaller',
    toolType: 'setup-installer',
    capabilities: Object.freeze(['bootstrap', 'pairing', 'on-device-setup']),
    website: 'https://sideinstaller.net/',
    repository: 'https://github.com/FrizzleM/SideInstaller',
    guideURL: 'https://sideinstaller.net/',
    links: Object.freeze({
      website: 'https://sideinstaller.net/',
      guide: 'https://sideinstaller.net/',
      repository: 'https://github.com/FrizzleM/SideInstaller',
      release: 'https://github.com/FrizzleM/SideInstaller/releases/tag/v1.0.0'
    }),
    domain: 'sideinstaller.net',
    creditDomain: 'github.com/FrizzleM/SideInstaller',
    icon: 'https://raw.githubusercontent.com/FrizzleM/SideInstaller/main/app-icon.png',
    coreCredit: true,
    resourceCard: true
  }),
  sideloadly: Object.freeze({
    id: 'sideloadly',
    label: 'Sideloadly',
    resourceName: 'Sideloadly',
    creditName: 'Sideloadly',
    toolType: 'ipa-installer',
    capabilities: Object.freeze(['ipa-install', 'desktop', 'tv', 'refresh']),
    website: 'https://sideloadly.io/',
    guideURL: 'https://sideloadly.io/',
    links: Object.freeze({
      website: 'https://sideloadly.io/',
      guide: 'https://sideloadly.io/'
    }),
    domain: 'sideloadly.io',
    icon: 'https://sideloadly.io/favicon.ico',
    coreCredit: true,
    resourceCard: true
  }),
  atvloadly: Object.freeze({
    id: 'atvloadly',
    label: 'atvloadly',
    resourceName: 'atvloadly',
    creditName: 'atvloadly',
    toolType: 'ipa-installer',
    capabilities: Object.freeze(['ipa-install', 'pairing', 'tv', 'self-hosted']),
    website: 'https://github.com/bitxeno/atvloadly',
    repository: 'https://github.com/bitxeno/atvloadly',
    guideURL: 'https://github.com/bitxeno/atvloadly',
    links: Object.freeze({
      website: 'https://github.com/bitxeno/atvloadly',
      guide: 'https://github.com/bitxeno/atvloadly',
      repository: 'https://github.com/bitxeno/atvloadly'
    }),
    domain: 'github.com/bitxeno/atvloadly',
    icon: 'assets/icons/atvloadly.svg',
    coreCredit: true,
    resourceCard: true
  }),
  iloader: Object.freeze({
    id: 'iloader',
    label: 'iloader',
    resourceName: 'iloader',
    creditName: 'iloader',
    toolType: 'pairing-tool',
    capabilities: Object.freeze(['bootstrap', 'pairing', 'desktop']),
    website: 'https://iloader.app/',
    guideURL: 'https://iloader.app/',
    links: Object.freeze({
      website: 'https://iloader.app/',
      guide: 'https://iloader.app/'
    }),
    domain: 'iloader.app',
    icon: 'assets/icons/iloader.svg',
    coreCredit: true,
    resourceCard: true
  }),
  impactor: Object.freeze({
    id: 'impactor',
    label: 'Impactor',
    resourceName: 'Impactor',
    creditName: 'Impactor',
    toolType: 'ipa-installer',
    capabilities: Object.freeze(['ipa-install', 'bootstrap', 'pairing', 'desktop']),
    website: 'https://github.com/claration/Impactor',
    repository: 'https://github.com/claration/Impactor',
    guideURL: 'https://github.com/claration/Impactor',
    links: Object.freeze({
      website: 'https://github.com/claration/Impactor',
      guide: 'https://github.com/claration/Impactor',
      repository: 'https://github.com/claration/Impactor'
    }),
    domain: 'github.com/claration/Impactor',
    icon: 'https://raw.githubusercontent.com/claration/Impactor/main/package/linux/icons/hicolor/512x512/apps/dev.khcrysalis.PlumeImpactor.png',
    coreCredit: true,
    resourceCard: true
  }),
  trollstore: Object.freeze({
    id: 'trollstore',
    label: 'TrollStore',
    resourceName: 'TrollStore',
    creditName: 'TrollStore',
    toolType: 'permanent-installer',
    capabilities: Object.freeze(['ipa-install', 'permanent']),
    website: 'https://github.com/opa334/TrollStore',
    repository: 'https://github.com/opa334/TrollStore',
    guideURL: 'https://github.com/opa334/TrollStore',
    links: Object.freeze({
      website: 'https://github.com/opa334/TrollStore',
      guide: 'https://github.com/opa334/TrollStore',
      repository: 'https://github.com/opa334/TrollStore'
    }),
    domain: 'github.com/opa334/TrollStore',
    icon: 'assets/icons/trollstore.svg',
    coreCredit: true,
    resourceCard: true
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
  if (Array.isArray(mode.installerIds)) {
    return mode.installerIds.filter(id => INSTALLERS[id]);
  }

  return sourceVariantURL(source, mode.variant)
    ? Object.values(INSTALLERS).filter(installer => installer.variant === mode.variant).map(installer => installer.id)
    : [];
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
