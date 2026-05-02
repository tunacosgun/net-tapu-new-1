/**
 * NetTapu Spacing, Radius, Shadow & Motion tokens.
 * 4pt grid. Generous whitespace = premium.
 */
export const Spacing = {
  zero: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
  '7xl': 96,

  screenPadding: 20,
  screenPaddingLg: 24,
  sectionGap: 36,
  cardPadding: 18,
  cardGap: 14,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  pill: 999,
  full: 9999,
};

/**
 * Elevation tiers — layered, soft, never harsh.
 * iOS uses shadowColor + offset/radius/opacity; Android uses elevation.
 */
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#0E1714',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0E1714',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0E1714',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0E1714',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: '#0E1714',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 36,
    elevation: 14,
  },
  glowGold: {
    shadowColor: '#9C7A3D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
    elevation: 10,
  },
  glowEmerald: {
    shadowColor: '#687A26',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 10,
  },
  glowLive: {
    shadowColor: '#D14343',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.40,
    shadowRadius: 18,
    elevation: 10,
  },
};

/**
 * Motion tokens — duration & easing.
 * Use `Motion.spring.*` with reanimated `withSpring`,
 * `Motion.timing.*` with `withTiming({ duration, easing })`.
 */
export const Motion = {
  duration: {
    instant: 80,
    fast: 150,
    base: 240,
    slow: 360,
    deliberate: 520,
  },
  spring: {
    snappy:  { damping: 18, stiffness: 240, mass: 0.9 },
    gentle:  { damping: 22, stiffness: 180, mass: 1.0 },
    bouncy:  { damping: 12, stiffness: 220, mass: 1.0 },
    silky:   { damping: 26, stiffness: 140, mass: 1.0 },
  },
  easing: {
    standard: [0.2, 0.0, 0, 1] as const,
    emphasized: [0.2, 0.0, 0, 1] as const,
    decel: [0.0, 0.0, 0.2, 1] as const,
    accel: [0.4, 0.0, 1, 1] as const,
  },
};

/**
 * Hairline border width consistent across densities.
 */
export const Hairline = 0.5;
