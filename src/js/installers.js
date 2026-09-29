export const INSTALLERS = Object.freeze({
  altstore: {
    id: 'altstore',
    label: 'AltStore',
    variant: 'classic',
    icon: 'assets/icons/altstore.svg',
    buildLink: url => `altstore://source?url=${encodeURIComponent(url)}`
  },
  sidestore: {
    id: 'sidestore',
    label: 'SideStore',
    variant: 'classic',
    icon: 'assets/icons/sidestore.svg?v=1.1.5-20260918-audit13',
    buildLink: url => `sidestore://source?url=${encodeURIComponent(url)}`
  },
  livecontainer: {
    id: 'livecontainer',
    label: 'LiveContainer',
    variant: 'classic',
    icon: 'assets/icons/livecontainer.svg',
    buildLink: url => `livecontainer://source?url=${encodeURIComponent(url)}`
  },
  'altstore-pal': {
    id: 'altstore-pal',
    label: 'AltStore PAL',
    variant: 'pal',
    icon: 'assets/icons/altstore.svg',
    buildLink: url => `altstore-pal://source?url=${encodeURIComponent(url)}`
  },
  flarestore: {
    id: 'flarestore',
    label: 'FlareStore',
    variant: 'classic',
    icon: 'https://flarestore.app/favicon.ico',
    buildLink: url => `flarestore://source?url=${encodeURIComponent(url)}`
  },
  feather: {
    id: 'feather',
    label: 'Feather',
    variant: 'classic',
    icon: 'https://github.com/khcrysalis/Feather/blob/v1.x/iOS/Resources/Icons/Main/Mac@3x.png?raw=true',
    buildLink: url => `feather://source/${url}`
  }
});

export const PRIMARY_INSTALLER_IDS = Object.freeze([
  'altstore',
  'sidestore',
  'livecontainer',
  'altstore-pal'
]);

export const MORE_INSTALLER_IDS = Object.freeze([
  'flarestore',
  'feather'
]);

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
