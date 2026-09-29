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
