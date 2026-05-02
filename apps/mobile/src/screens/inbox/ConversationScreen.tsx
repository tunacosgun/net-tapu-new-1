/**
 * ConversationScreen — Bir konuşma içinde mesajları görüntüleme ve gönderme.
 *
 * Production-grade: optimistic send, retry on failure, dark/light theme,
 * keyboard-aware composer, message bubbles with timestamps, smart grouping.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import {
  getConversation,
  sendMessage,
  markConversationRead,
  MessagingUnavailableError,
} from '../../api/messages';
import type { Conversation, Message } from '../../types/messages';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatBubbleTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function MessageBubble({ message, showAvatar }: { message: Message; showAvatar: boolean }) {
  const { colors: c, isDark, typography: typo, borderRadius: br } = useTheme();
  const fromSelf = message.fromSelf;

  const bubbleColor = fromSelf
    ? c.primary
    : isDark
    ? c.elevated
    : c.card;
  const textColor = fromSelf ? '#FFFFFF' : c.text;
  const timeColor = fromSelf ? 'rgba(255,255,255,0.85)' : c.textMuted;

  return (
    <Animated.View
      entering={FadeInUp.duration(220)}
      style={[
        styles.bubbleRow,
        { justifyContent: fromSelf ? 'flex-end' : 'flex-start' },
      ]}
    >
      {!fromSelf && showAvatar ? (
        <View
          style={[
            styles.bubbleAvatar,
            { backgroundColor: c.primaryBg },
          ]}
        >
          <Ionicons name="person" size={14} color={c.primary} />
        </View>
      ) : (
        !fromSelf && <View style={{ width: 32 }} />
      )}

      <View
        style={[
          styles.bubble,
          {
            backgroundColor: bubbleColor,
            borderColor: fromSelf ? c.primary : c.borderLight,
            borderTopLeftRadius: !fromSelf && showAvatar ? 6 : br.lg,
            borderTopRightRadius: fromSelf ? 6 : br.lg,
          },
        ]}
      >
        <Text style={[typo.body, { color: textColor }]}>{message.body}</Text>
        <View style={styles.bubbleMeta}>
          <Text style={[typo.caption, { color: timeColor }]}>
            {formatBubbleTime(message.createdAt)}
          </Text>
          {fromSelf ? (
            <Ionicons
              name={
                message.state === 'failed'
                  ? 'alert-circle'
                  : message.state === 'sending'
                  ? 'time-outline'
                  : message.state === 'read'
                  ? 'checkmark-done'
                  : 'checkmark'
              }
              size={13}
              color={message.state === 'failed' ? c.error : timeColor}
              style={{ marginLeft: 4 }}
            />
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}

export default function ConversationScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Conversation'>>();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { colors: c, isDark, typography: typo, borderRadius: br } = useTheme();

  const conversationId = route.params.conversationId;
  const initialName = route.params.counterpartName || 'Mesajlar';

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList<Message>>(null);

  const load = useCallback(async () => {
    try {
      const detail = await getConversation(conversationId);
      setConversation(detail.conversation);
      setMessages(detail.messages);
      // Best-effort read receipt
      markConversationRead(conversationId).catch(() => {});
    } catch (err) {
      if (err instanceof MessagingUnavailableError) {
        setUnavailable(true);
      } else {
        Alert.alert('Hata', 'Mesajlar yüklenemedi.');
      }
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    load();
  }, [load]);

  const onSend = useCallback(async () => {
    const text = body.trim();
    if (!text) return;

    const tempId = `optimistic-${Date.now()}`;
    const optimistic: Message = {
      id: tempId,
      conversationId,
      senderId: 'self',
      fromSelf: true,
      body: text,
      createdAt: new Date().toISOString(),
      state: 'sending',
    };

    setMessages((prev) => [...prev, optimistic]);
    setBody('');
    setSending(true);

    try {
      const sent = await sendMessage({ conversationId, body: text });
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...sent, fromSelf: true } : m)),
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, state: 'failed' } : m)),
      );
      if (err instanceof MessagingUnavailableError) {
        Alert.alert('Mesaj Gönderilemedi', 'Mesajlaşma servisi şu anda kullanılamıyor.');
      } else {
        Alert.alert('Hata', 'Mesaj gönderilemedi. Lütfen tekrar deneyin.');
      }
    } finally {
      setSending(false);
    }
  }, [body, conversationId]);

  // Auto-scroll to bottom on new content
  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [messages.length]);

  // Group consecutive messages by sender for cleaner avatar rendering
  const renderItem = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      const prev = messages[index - 1];
      const showAvatar = !prev || prev.senderId !== item.senderId;
      return <MessageBubble message={item} showAvatar={showAvatar} />;
    },
    [messages],
  );

  const headerTitle = conversation?.counterpartName || initialName;
  const headerSub = conversation?.parcelTitle;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: c.borderLight }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.iconBtn, { backgroundColor: c.card, borderColor: c.borderLight }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          testID="conversation-back-btn"
        >
          <Ionicons name="chevron-back" size={22} color={c.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, paddingLeft: 14 }}>
          <Text style={[typo.h4, { color: c.text }]} numberOfLines={1}>
            {headerTitle}
          </Text>
          {headerSub ? (
            <Text style={[typo.caption, { color: c.textSecondary }]} numberOfLines={1}>
              {headerSub}
            </Text>
          ) : null}
        </View>
        {conversation?.parcelId ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('ParcelDetail', { id: conversation!.parcelId! })}
            style={[styles.iconBtn, { backgroundColor: c.primaryBg, borderColor: c.primaryMuted }]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            testID="conversation-open-parcel-btn"
          >
            <Ionicons name="map-outline" size={20} color={c.primary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {unavailable ? (
        <Animated.View entering={FadeIn.duration(300)} style={styles.empty}>
          <Ionicons name="construct-outline" size={48} color={c.primary} />
          <Text style={[typo.h3, { color: c.text, marginTop: 12 }]}>Yakında Aktif</Text>
          <Text style={[typo.body, { color: c.textSecondary, textAlign: 'center', marginTop: 8 }]}>
            Mesajlaşma servisi en kısa sürede aktif olacak.
          </Text>
        </Animated.View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 8 : 0}
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 16,
              flexGrow: 1,
            }}
            ListEmptyComponent={
              !loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 }}>
                  <Ionicons name="chatbubble-outline" size={36} color={c.textMuted} />
                  <Text style={[typo.body, { color: c.textSecondary, marginTop: 12 }]}>
                    İlk mesajınızı gönderin
                  </Text>
                </View>
              ) : null
            }
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          />

          {/* Composer */}
          <View
            style={[
              styles.composer,
              {
                backgroundColor: c.card,
                borderTopColor: c.borderLight,
                paddingBottom: Math.max(insets.bottom, 12),
              },
            ]}
          >
            <View
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? c.elevated : c.background,
                  borderColor: c.borderLight,
                  borderRadius: br.xl,
                },
              ]}
            >
              <TextInput
                value={body}
                onChangeText={setBody}
                placeholder="Bir mesaj yazın..."
                placeholderTextColor={c.textMuted}
                style={[styles.inputField, { color: c.text }]}
                multiline
                maxLength={1000}
                testID="conversation-input"
              />
            </View>
            <TouchableOpacity
              onPress={onSend}
              disabled={sending || body.trim().length === 0}
              style={[
                styles.sendBtn,
                {
                  backgroundColor: body.trim().length === 0 ? c.borderStrong : c.primary,
                  shadowColor: c.primary,
                  shadowOpacity: body.trim().length === 0 ? 0 : 0.3,
                },
              ]}
              activeOpacity={0.85}
              testID="conversation-send-btn"
            >
              <Ionicons
                name={sending ? 'time-outline' : 'send'}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },

  // Bubbles
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  bubbleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  // Composer
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  inputField: {
    fontSize: 15,
    lineHeight: 20,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
});
