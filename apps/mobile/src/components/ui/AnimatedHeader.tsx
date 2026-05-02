/**
 * AnimatedHeader — Reusable animated screen header with back button.
 * Uses brand olive/champagne gradient and theme-aware tokens.
 */
import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  /** When true uses brand emerald-olive gradient. Defaults to true. */
  gradient?: boolean;
  /** Optional right-side actions */
  rightAction?: React.ReactNode;
  testID?: string;
}

export function AnimatedHeader({
  title,
  subtitle,
  showBack = true,
  gradient = true,
  rightAction,
  testID,
}: AnimatedHeaderProps) {
  const navigation = useNavigation();
  const { colors: c, isDark, typography: typo } = useTheme();
  const insets = useSafeAreaInsets();

  const gradientColors = gradient
    ? (c.gradientHero as unknown as string[])
    : [c.surface, c.surface];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + 12 }]}
      testID={testID ?? 'animated-header'}
    >
      <View style={styles.inner}>
        <View style={styles.topRow}>
          {showBack ? (
            <Animated.View entering={FadeInLeft.delay(80).springify()}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[styles.iconBtn, { backgroundColor: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.22)' }]}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                testID="header-back-btn"
                accessibilityRole="button"
                accessibilityLabel="Geri"
              >
                <Ionicons name="chevron-back" size={22} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View style={{ width: 40 }} />
          )}
          {rightAction ? (
            <Animated.View entering={FadeInLeft.delay(120).springify()}>{rightAction}</Animated.View>
          ) : null}
        </View>

        <Animated.Text
          entering={FadeInDown.delay(160).springify()}
          style={[
            typo.h1,
            styles.title,
            { color: '#FFFFFF' },
          ]}
          numberOfLines={2}
        >
          {title}
        </Animated.Text>

        {subtitle ? (
          <Animated.Text
            entering={FadeInDown.delay(220).springify()}
            style={[typo.bodySmall, styles.subtitle]}
            numberOfLines={2}
          >
            {subtitle}
          </Animated.Text>
        ) : null}

        {/* Decorative softening orbs (very low opacity) */}
        <View pointerEvents="none" style={[styles.orb, styles.orbA]} />
        <View pointerEvents="none" style={[styles.orb, styles.orbB]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 36,
    overflow: 'hidden',
    position: 'relative',
  },
  inner: {
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.78)',
    marginTop: 6,
    lineHeight: 20,
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  orbA: {
    width: 220,
    height: 220,
    top: -90,
    right: -70,
  },
  orbB: {
    width: 110,
    height: 110,
    bottom: -45,
    left: -25,
    backgroundColor: 'rgba(201, 165, 94, 0.10)',
  },
});
