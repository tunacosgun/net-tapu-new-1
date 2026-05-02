/**
 * StatusBadge — theme-aware, dark-mode-safe pill badge.
 * Uses Colors.status* tokens so dark/light variants behave consistently.
 */
import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

type StatusKey =
  | 'active'
  | 'sold'
  | 'deposit_taken'
  | 'reserved'
  | 'draft'
  | 'withdrawn'
  | 'live'
  | 'scheduled'
  | 'deposit_open'
  | 'ended'
  | 'settled'
  | 'ending';

interface BadgeProps {
  status: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
  testID?: string;
}

interface StatusVisual {
  label: string;
  /** Hue token from theme.colors */
  tone: 'primary' | 'gold' | 'live' | 'reserved' | 'muted' | 'success' | 'sold';
}

const STATUS_VISUAL: Record<StatusKey, StatusVisual> = {
  active:        { label: 'Satışta',      tone: 'primary' },
  sold:          { label: 'Satıldı',      tone: 'sold'    },
  deposit_taken: { label: 'Kaparo Alındı',tone: 'gold'    },
  reserved:      { label: 'Ayırtıldı',    tone: 'reserved'},
  draft:         { label: 'Taslak',       tone: 'muted'   },
  withdrawn:     { label: 'Geri Çekildi', tone: 'muted'   },
  live:          { label: 'Canlı',        tone: 'live'    },
  scheduled:     { label: 'Planlandı',    tone: 'primary' },
  deposit_open:  { label: 'Kaparo Açık',  tone: 'gold'    },
  ended:         { label: 'Bitti',        tone: 'muted'   },
  settled:       { label: 'Tamamlandı',   tone: 'success' },
  ending:        { label: 'Bitiyor',      tone: 'live'    },
};

function resolveTone(tone: StatusVisual['tone'], colors: ReturnType<typeof useTheme>['colors']) {
  switch (tone) {
    case 'primary':  return { fg: colors.primary,        bg: colors.primaryBg,  dot: colors.primary };
    case 'gold':     return { fg: colors.accent,         bg: colors.accentBg,   dot: colors.accent };
    case 'live':     return { fg: colors.statusLive,     bg: 'rgba(209,67,67,0.10)', dot: colors.statusLive };
    case 'reserved': return { fg: colors.statusReserved, bg: 'rgba(91,58,142,0.12)', dot: colors.statusReserved };
    case 'success':  return { fg: colors.success,        bg: colors.successBg,  dot: colors.success };
    case 'sold':     return { fg: colors.error,          bg: colors.errorBg,    dot: colors.error };
    case 'muted':
    default:         return { fg: colors.textMuted,      bg: colors.scrim,      dot: colors.textMuted };
  }
}

export function StatusBadge({ status, size = 'sm', style, testID }: BadgeProps) {
  const { colors } = useTheme();
  const visual = STATUS_VISUAL[status as StatusKey] ?? STATUS_VISUAL.draft;
  const palette = resolveTone(visual.tone, colors);
  const isSmall = size === 'sm';

  return (
    <View
      style={[styles.badge, { backgroundColor: palette.bg }, isSmall && styles.small, style]}
      testID={testID ?? `status-badge-${status}`}
    >
      <View style={[styles.dot, { backgroundColor: palette.dot }, isSmall && styles.dotSmall]} />
      <Text style={[styles.text, { color: palette.fg }, isSmall && styles.smallText]} numberOfLines={1}>
        {visual.label}
      </Text>
    </View>
  );
}

export function parcelStatusColor(status: string, colors?: ReturnType<typeof useTheme>['colors']): string {
  if (!colors) return '#76837C';
  const v = STATUS_VISUAL[status as StatusKey] ?? STATUS_VISUAL.draft;
  return resolveTone(v.tone, colors).fg;
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
    gap: 6,
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotSmall: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  smallText: {
    fontSize: 10.5,
  },
});
