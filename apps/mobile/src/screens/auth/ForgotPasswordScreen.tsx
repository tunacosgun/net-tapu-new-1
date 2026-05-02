import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Alert, TouchableOpacity, Platform,
  KeyboardAvoidingView, ScrollView, StatusBar, ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeInDown, FadeIn, useSharedValue, useAnimatedStyle,
  withSpring, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../../api/client';
import { Input } from '../../components/ui';
import { useTheme } from '../../theme';
import { SPRING } from '../../lib/animations';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const isDark = theme.isDark;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const iconScale = useSharedValue(0);

  useEffect(() => {
    if (sent) {
      iconScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1.15, SPRING.bouncy),
        withSpring(1, SPRING.snappy),
      );
    }
  }, [sent]);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  async function handleSubmit() {
    if (!email) return;
    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      Alert.alert('Hata', err?.response?.data?.message || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" bounces={false}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={styles.heroCenter}>
              <View style={styles.brandWordmark}>
                <View style={[styles.brandNetBox, { borderColor: theme.colors.text }]}>
                  <Text style={[styles.brandNetText, { color: theme.colors.primary }]}>NET</Text>
                </View>
                <Text style={[styles.brandTapuText, { color: theme.colors.text }]}>TAPU</Text>
              </View>
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Şifremi Unuttum</Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}>
                Kayıtlı e-posta adresinize sıfırlama bağlantısı gönderelim
              </Text>
            </View>
          </View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(500).springify()}
            style={[styles.card, {
              backgroundColor: theme.colors.card,
              shadowColor: theme.colors.primary,
              borderColor: theme.colors.borderLight,
            }]}
          >
            {sent ? (
              <View style={styles.successBox}>
                <Animated.View style={[styles.successIcon, { backgroundColor: theme.colors.primaryBg }, iconAnimStyle]}>
                  <Ionicons name="mail-outline" size={40} color={theme.colors.primary} />
                </Animated.View>
                <Animated.Text entering={FadeIn.delay(300).duration(400)} style={[styles.successTitle, { color: theme.colors.text }]}>E-posta Gönderildi</Animated.Text>
                <Animated.Text entering={FadeIn.delay(450).duration(400)} style={[styles.successDesc, { color: theme.colors.textSecondary }]}>
                  Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.
                </Animated.Text>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ borderRadius: 14, overflow: 'hidden', alignSelf: 'stretch', marginTop: 20 }}
                >
                  <LinearGradient colors={[theme.colors.primary, theme.colors.primaryDark]} style={styles.submitBtn}>
                    <Text style={styles.submitText}>Giriş Sayfasına Dön</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Input
                  label="E-posta Adresi"
                  placeholder="ornek@email.com"
                  leftIcon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading || !email}
                  activeOpacity={0.9}
                  style={{ borderRadius: 14, overflow: 'hidden', opacity: !email ? 0.5 : 1, marginTop: 8 }}
                >
                  <LinearGradient colors={[theme.colors.primary, theme.colors.primaryDark]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.submitBtn}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.submitText}>Sıfırlama Bağlantısı Gönder</Text>
                        <Ionicons name="send" size={16} color="#fff" />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 32 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  heroCenter: {
    alignItems: 'center',
    marginTop: 28,
  },
  brandWordmark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  brandNetBox: {
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  brandNetText: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
    lineHeight: 30,
  },
  brandTapuText: {
    fontSize: 26,
    fontWeight: '300',
    letterSpacing: 1,
    lineHeight: 30,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 6,
    marginTop: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    letterSpacing: 0.2,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  card: {
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
  },
  infoText: { fontSize: 13, fontWeight: '500', flex: 1 },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 8,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  successBox: { alignItems: 'center', paddingVertical: 16 },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  successDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
