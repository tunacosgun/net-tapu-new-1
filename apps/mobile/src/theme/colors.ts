/**
 * NetTapu Design System — Color Tokens
 *
 * Visual language: deep emerald + warm ivory + obsidian + champagne gold.
 * Premium real-estate / auction house feel.
 */
export const Colors = {
  light: {
    primary: '#687A26',
    primaryDark: '#4F5D1B',
    primaryLight: '#8FA340',
    primaryBg: '#F4F6EC',
    primaryMuted: '#D9E0BF',

    accent: '#9C7A3D',
    accentDark: '#6F5524',
    accentLight: '#C9A55E',
    accentBg: '#FBF6EA',

    background: '#FAF8F4',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    scrim: 'rgba(15,20,18,0.04)',

    text: '#0E1714',
    textSecondary: '#3F4A45',
    textMuted: '#76837C',
    textInverse: '#FFFFFF',

    border: '#E3DDD0',
    borderLight: '#EFEBE0',
    borderStrong: '#C9C0AD',

    error: '#B3261E',
    errorBg: '#FBEEEC',
    warning: '#A1631A',
    warningBg: '#FCF4E4',
    success: '#1F6F4A',
    successBg: '#E8F2EB',
    info: '#3F4A45',
    infoBg: '#F0EEE7',

    overlay: 'rgba(14,23,20,0.55)',
    overlayLight: 'rgba(14,23,20,0.25)',

    tabBar: 'rgba(255,255,255,0.85)',
    tabBarBorder: 'rgba(14,23,20,0.06)',

    skeleton: '#EFEBE0',
    skeletonHighlight: '#F8F4EA',

    statusActive: '#4F5D1B',
    statusSold: '#B3261E',
    statusDeposit: '#9C7A3D',
    statusReserved: '#5B3A8E',
    statusDraft: '#76837C',
    statusLive: '#D14343',

    gradientHero: ['#4F5D1B', '#687A26', '#8FA340'] as const,
    gradientGold: ['#C9A55E', '#9C7A3D'] as const,
    gradientSoft: ['#FAF8F4', '#F4F6EC'] as const,
    gradientLive: ['#7A1F1F', '#D14343'] as const,
    gradientGlass: ['rgba(255,255,255,0.65)', 'rgba(255,255,255,0.35)'] as const,
  },
  dark: {
    primary: '#9BB04A',
    primaryDark: '#687A26',
    primaryLight: '#B8C96C',
    primaryBg: 'rgba(155,176,74,0.10)',
    primaryMuted: 'rgba(155,176,74,0.18)',

    accent: '#D4B477',
    accentDark: '#9C7A3D',
    accentLight: '#E6CC95',
    accentBg: 'rgba(212,180,119,0.10)',

    background: '#0B100E',
    surface: '#121915',
    card: '#161E1A',
    elevated: '#1B2520',
    scrim: 'rgba(255,255,255,0.04)',

    text: '#F1EDE2',
    textSecondary: '#B7B2A4',
    textMuted: '#7E8780',
    textInverse: '#0B100E',

    border: '#1E2A24',
    borderLight: 'rgba(255,255,255,0.06)',
    borderStrong: '#2A3832',

    error: '#F08D86',
    errorBg: 'rgba(240,141,134,0.10)',
    warning: '#E6CC95',
    warningBg: 'rgba(230,204,149,0.10)',
    success: '#8FCBAE',
    successBg: 'rgba(143,203,174,0.10)',
    info: '#B7B2A4',
    infoBg: 'rgba(183,178,164,0.08)',

    overlay: 'rgba(0,0,0,0.65)',
    overlayLight: 'rgba(0,0,0,0.35)',

    tabBar: 'rgba(11,16,14,0.82)',
    tabBarBorder: 'rgba(255,255,255,0.06)',

    skeleton: '#1B2520',
    skeletonHighlight: '#243029',

    statusActive: '#B8C96C',
    statusSold: '#F08D86',
    statusDeposit: '#E6CC95',
    statusReserved: '#C7AEEB',
    statusDraft: '#7E8780',
    statusLive: '#F08D86',

    gradientHero: ['#0B100E', '#3B4710', '#687A26'] as const,
    gradientGold: ['#E6CC95', '#9C7A3D'] as const,
    gradientSoft: ['#0B100E', '#161E1A'] as const,
    gradientLive: ['#5A1717', '#D14343'] as const,
    gradientGlass: ['rgba(22,30,26,0.75)', 'rgba(22,30,26,0.45)'] as const,
  },
};

export type ThemeColors = typeof Colors.light;
