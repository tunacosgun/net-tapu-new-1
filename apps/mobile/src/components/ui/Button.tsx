import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
  View,
  type ViewStyle,
  type TextStyle,
  type PressableProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import HapticFeedback from 'react-native-haptic-feedback';
import { useTheme } from '../../theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold' | 'glass';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  haptic?: boolean | 'soft' | 'medium' | 'heavy';
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
  accessibilityLabel?: string;
}

const SIZE: Record<Size, { h: number; px: number; r: number; fs: number; gap: number }> = {
  sm: { h: 36, px: 14, r: 10, fs: 13, gap: 6 },
  md: { h: 46, px: 18, r: 14, fs: 15, gap: 8 },
  lg: { h: 54, px: 22, r: 16, fs: 16, gap: 10 },
  xl: { h: 60, px: 26, r: 18, fs: 17, gap: 12 },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  haptic = 'soft',
  style,
  textStyle,
  testID,
  accessibilityLabel,
}: ButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const press = useSharedValue(0);

  const isDisabled = disabled || loading;

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, theme.motion.spring.snappy);
    press.value = withTiming(1, { duration: 120 });
  }, [scale, press, theme]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, theme.motion.spring.gentle);
    press.value = withTiming(0, { duration: 180 });
  }, [scale, press, theme]);

  const handlePress = useCallback(() => {
    if (haptic && Platform.OS !== 'web') {
      const type = haptic === true ? 'soft' : haptic;
      const map = { soft: 'impactLight', medium: 'impactMedium', heavy: 'impactHeavy' } as const;
      try {
        HapticFeedback.trigger(map[type], { enableVibrateFallback: false, ignoreAndroidSystemSettings: false });
      } catch {}
    }
    onPress();
  }, [onPress, haptic]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sz = SIZE[size];

  // Variant resolution
  const v = resolveVariant(variant, theme);

  // Text color
  const fg = v.fg;

  const Body = (
    <View style={[styles.row, { gap: sz.gap }]}>
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <>
          {icon}
          <Text
            numberOfLines={1}
            style={[
              theme.typography.button,
              { color: fg, fontSize: sz.fs },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconRight}
        </>
      )}
    </View>
  );

  const containerCommon: ViewStyle = {
    height: sz.h,
    paddingHorizontal: sz.px,
    borderRadius: sz.r,
    width: fullWidth ? '100%' : undefined,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (v.kind === 'gradient') {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        testID={testID}
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={[containerCommon, isDisabled && styles.disabled, animStyle, v.shadow as ViewStyle, style]}
      >
        <LinearGradient
          colors={v.gradient as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {Body}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        containerCommon,
        { backgroundColor: v.bg },
        v.borderColor && { borderWidth: v.borderWidth ?? 1, borderColor: v.borderColor },
        v.shadow as ViewStyle,
        isDisabled && styles.disabled,
        animStyle,
        style,
      ]}
    >
      {Body}
    </AnimatedPressable>
  );
}

interface ResolvedVariant {
  kind: 'solid' | 'gradient';
  bg?: string;
  fg: string;
  borderColor?: string;
  borderWidth?: number;
  shadow?: ViewStyle;
  gradient?: readonly string[];
}

function resolveVariant(variant: Variant, theme: ReturnType<typeof useTheme>): ResolvedVariant {
  switch (variant) {
    case 'primary':
      return {
        kind: 'gradient',
        gradient: theme.isDark
          ? [theme.colors.primary, theme.colors.primaryDark]
          : [theme.colors.primary, theme.colors.primaryDark],
        fg: '#FFFFFF',
        shadow: theme.shadows.glowEmerald,
      };
    case 'gold':
      return {
        kind: 'gradient',
        gradient: theme.colors.gradientGold,
        fg: '#1B1308',
        shadow: theme.shadows.glowGold,
      };
    case 'danger':
      return {
        kind: 'gradient',
        gradient: theme.colors.gradientLive,
        fg: '#FFFFFF',
        shadow: theme.shadows.glowLive,
      };
    case 'secondary':
      return {
        kind: 'solid',
        bg: theme.colors.surface,
        fg: theme.colors.text,
        borderColor: theme.colors.border,
        borderWidth: theme.hairline * 2,
        shadow: theme.shadows.xs,
      };
    case 'outline':
      return {
        kind: 'solid',
        bg: 'transparent',
        fg: theme.colors.primary,
        borderColor: theme.colors.primary,
        borderWidth: 1.5,
      };
    case 'ghost':
      return {
        kind: 'solid',
        bg: 'transparent',
        fg: theme.colors.primary,
      };
    case 'glass':
      return {
        kind: 'solid',
        bg: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)',
        fg: theme.colors.text,
        borderColor: theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)',
        borderWidth: theme.hairline * 2,
      };
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
});
