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

const CLASSIC_DEFAULT_INSTALLERS = Object.freeze([
  'altstore',
  'sidestore',
  'livecontainer',
  'flarestore',
  'feather'
]);

export function sourceVariantURL(source, variant) {
  const configured = source?.urls?.[variant];
  if (typeof configured === 'string' && configured.trim()) return configured.trim();

  if (variant === 'classic') {
    return source?.mode === 'pal' ? null : (source?.url || null);
  }

  if (variant === 'pal') {
    return source?.mode === 'pal' ? (source?.url || null) : null;
  }

  return source?.url || null;
}

export function sourceInstallerIds(source) {
  if (Array.isArray(source?.installers)) {
    return [...new Set(source.installers.filter(id => INSTALLERS[id]))];
  }

  if (source?.mode === 'pal') return ['altstore-pal'];
  if (source?.mode === 'sidestore') return ['sidestore'];
  return sourceVariantURL(source, 'classic') ? [...CLASSIC_DEFAULT_INSTALLERS] : [];
}

export function sourceInstallerDeepLink(source, installerId) {
  const installer = INSTALLERS[installerId];
  if (!installer) return null;

  const sourceURL = sourceVariantURL(source, installer.variant);
  if (!sourceURL) return null;

  return installer.buildLink(sourceURL);
}

export function sourceUtilityURL(source) {
  return sourceVariantURL(source, 'classic')
    || sourceVariantURL(source, 'pal')
    || source?.url
    || '';
}
