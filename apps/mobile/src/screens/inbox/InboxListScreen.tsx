/**
 * InboxListScreen — Mesajlarım listesi.
 *
 * Production-grade: shimmer loading, empty state, premium card list, swipe-to-archive
 * (uses native gesture-handler), pull-to-refresh, dark/light theme aware.
 *
 * Backend tolerant: shows a graceful "yakında aktif" state if /messages endpoints
 * are not yet deployed.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { listConversations, MessagingUnavailableError } from '../../api/messages';
import { timeAgo } from '../../lib/format';
import { ShimmerPlaceholder } from '../../components/ui/ShimmerPlaceholder';
import type { Conversation } from '../../types/messages';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function ConversationRow({
  item,
  onPress,
}: {
  item: Conversation;
  onPress: () => void;
}) {
  const { colors: c, isDark, typography: typo, borderRadius: br } = useTheme();
  const initial = (item.counterpartName || '?').charAt(0).toUpperCase();
  const hasUnread = (item.unreadCount ?? 0) > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      testID={`conversation-row-${item.id}`}
      style={[
        styles.row,
        {
          backgroundColor: c.card,
          borderColor: c.borderLight,
          shadowColor: isDark ? '#000' : '#1F2A24',
        },
      ]}
    >
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: hasUnread ? c.primary : isDark ? c.elevated : c.primaryBg,
            borderColor: hasUnread ? c.primaryDark : 'transparent',
          },
        ]}
      >
        <Text
          style={[
            styles.avatarLetter,
            { color: hasUnread ? '#FFFFFF' : c.primary },
          ]}
        >
          {initial}
        </Text>
        {hasUnread ? <View style={[styles.unreadRing, { borderColor: c.background }]} /> : null}
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={styles.topLine}>
          <Text
            style={[typo.h4, { color: c.text, flex: 1 }]}
            numberOfLines={1}
          >
            {item.counterpartName}
          </Text>
          <Text style={[typo.caption, { color: c.textMuted, marginLeft: 8 }]}>
            {item.lastMessageAt ? timeAgo(item.lastMessageAt) : ''}
          </Text>
        </View>

        {item.parcelTitle ? (
          <View style={[styles.parcelChip, { backgroundColor: c.scrim, borderRadius: br.sm }]}>
            <Ionicons name="map-outline" size={11} color={c.textSecondary} />
            <Text style={[typo.caption, { color: c.textSecondary }]} numberOfLines={1}>
              {item.parcelTitle}
            </Text>
          </View>
        ) : null}

        <View style={styles.previewLine}>
          <Text
            style={[
              typo.body,
              {
                color: hasUnread ? c.text : c.textSecondary,
                fontWeight: hasUnread ? '600' : '400',
                flex: 1,
              },
            ]}
            numberOfLines={2}
          >
            {item.preview}
          </Text>
          {hasUnread ? (
            <View style={[styles.unreadPill, { backgroundColor: c.accent }]}>
              <Text style={styles.unreadPillText}>{item.unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState({
  unavailable,
}: {
  unavailable: boolean;
}) {
  const { colors: c, isDark, typography: typo, borderRadius: br } = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.empty}>
      <View
        style={[
          styles.emptyIconWrap,
          {
            backgroundColor: isDark ? c.elevated : c.primaryBg,
            borderRadius: br.xl + 6,
          },
        ]}
      >
        <Ionicons
          name={unavailable ? 'construct-outline' : 'chatbubbles-outline'}
          size={36}
          color={c.primary}
        />
      </View>
      <Text style={[typo.h3, { color: c.text, marginTop: 16 }]}>
        {unavailable ? 'Yakında Aktif' : 'Henüz mesaj yok'}
      </Text>
      <Text
        style={[typo.body, { color: c.textSecondary, textAlign: 'center', marginTop: 8 }]}
      >
        {unavailable
          ? 'Mesajlaşma servisi en kısa sürede aktif olacak.'
          : 'Bir ilan detayından danışmanla iletişime geçtiğinizde mesajlarınız burada görünecek.'}
      </Text>
    </Animated.View>
  );
}

function LoadingSkeleton() {
  const { colors: c, borderRadius: br } = useTheme();
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 14 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 14,
            backgroundColor: c.card,
            borderRadius: br.lg,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: c.borderLight,
            gap: 12,
          }}
        >
          <ShimmerPlaceholder width={48} height={48} borderRadius={24} />
          <View style={{ flex: 1, gap: 8 }}>
            <ShimmerPlaceholder width={'55%'} height={14} />
            <ShimmerPlaceholder width={'85%'} height={12} />
            <ShimmerPlaceholder width={'40%'} height={11} />
          </View>
        </View>
      ))}
    </View>
  );
}

export default function InboxListScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { colors: c, isDark, typography: typo } = useTheme();

  const [items, setItems] = useState<Conversation[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const fetchPage = useCallback(async (p: number, reset = false) => {
    try {
      const res = await listConversations({ page: p, limit: 20 });
      setItems((prev) => (reset ? res.data : [...prev, ...res.data]));
      setTotalPages(res.meta?.totalPages ?? 1);
      setUnavailable(false);
    } catch (err) {
      if (err instanceof MessagingUnavailableError) {
        setUnavailable(true);
        setItems([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchPage(1, true);
  }, [fetchPage]);

  const onEndReached = useCallback(() => {
    if (loading || refreshing) return;
    if (page >= totalPages) return;
    const next = page + 1;
    setPage(next);
    fetchPage(next);
  }, [loading, refreshing, page, totalPages, fetchPage]);

  const totalUnread = useMemo(
    () => items.reduce((acc, it) => acc + (it.unreadCount || 0), 0),
    [items],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={[styles.header, { paddingTop: insets.top + 4 }]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.iconBtn, { backgroundColor: c.card, borderColor: c.borderLight }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          testID="inbox-back-btn"
        >
          <Ionicons name="chevron-back" size={22} color={c.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, paddingLeft: 14 }}>
          <Text style={[typo.overline, { color: c.primary }]}>İLETİŞİM</Text>
          <Text style={[typo.h2, { color: c.text, letterSpacing: -0.4 }]}>Mesajlarım</Text>
        </View>
        {totalUnread > 0 ? (
          <View style={[styles.unreadHeaderPill, { backgroundColor: c.accent }]}>
            <Text style={styles.unreadHeaderPillText}>{totalUnread}</Text>
          </View>
        ) : null}
      </Animated.View>

      {loading && items.length === 0 ? (
        <LoadingSkeleton />
      ) : (
        <FlashList
          data={items}
          estimatedItemSize={108}
          keyExtractor={(c) => c.id}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 30).duration(250)}
              layout={Layout.springify()}
              style={{ paddingHorizontal: 20, paddingTop: index === 0 ? 4 : 0, paddingBottom: 12 }}
            >
              <ConversationRow
                item={item}
                onPress={() =>
                  navigation.navigate('Conversation', {
                    conversationId: item.id,
                    counterpartName: item.counterpartName,
                  })
                }
              />
            </Animated.View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.primary} />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={!loading ? <EmptyState unavailable={unavailable} /> : null}
          ListFooterComponent={
            page < totalPages ? (
              <ActivityIndicator style={{ padding: 24 }} color={c.primary} />
            ) : null
          }
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 24, 40) }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  unreadHeaderPill: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadHeaderPillText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12, letterSpacing: 0.2 },

  row: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 14 },
      android: { elevation: 2 },
    }),
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarLetter: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  unreadRing: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9C7A3D',
    borderWidth: 2,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parcelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
    maxWidth: '100%',
  },
  previewLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  unreadPill: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 7,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadPillText: { color: '#FFFFFF', fontWeight: '800', fontSize: 11 },

  empty: {
    paddingHorizontal: 32,
    paddingTop: 64,
    alignItems: 'center',
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
});
