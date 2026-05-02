import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, type ThemeColors } from './colors';
import { Typography } from './typography';
import { Spacing, BorderRadius, Shadows, Motion, Hairline } from './spacing';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  colors: ThemeColors;
  typography: typeof Typography;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  shadows: typeof Shadows;
  motion: typeof Motion;
  hairline: typeof Hairline;
  isDark: boolean;
}

export function createTheme(mode: ThemeMode): Theme {
  return {
    colors: Colors[mode],
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    motion: Motion,
    hairline: Hairline,
    isDark: mode === 'dark',
  };
}

export const ThemeContext = createContext<Theme>(createTheme('light'));

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => createTheme(colorScheme === 'dark' ? 'dark' : 'light'), [colorScheme]);
  return React.createElement(ThemeContext.Provider, { value: theme }, children);
}

export { Colors, Typography, Spacing, BorderRadius, Shadows, Motion, Hairline };
