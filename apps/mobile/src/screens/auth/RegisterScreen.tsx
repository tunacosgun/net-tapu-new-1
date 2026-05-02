import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  StatusBar,
  Switch,
  ActivityIndicator,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LinearGradient from 'react-native-linear-gradient';
import { registerSchema } from '../../lib/validators';
import { useAuthStore } from '../../stores/auth-store';
import { useSettingsStore } from '../../stores/settings-store';
import apiClient, { RateLimitError } from '../../api/client';
import { Input } from '../../components/ui';
import { useTheme } from '../../theme';
import { SPRING } from '../../lib/animations';
import type { LoginResponse } from '../../types';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Google Sign-In — lazy load
let GoogleSignin: any = null;
try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
  GoogleSignin.configure({
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });
} catch {}

// Apple Sign-In — lazy load
let appleAuth: any = null;
try {
  appleAuth = require('@invertase/react-native-apple-authentication').appleAuth;
} catch {}

type FormData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  acceptTerms: boolean;
  acceptKvkk: boolean;
};

export default function RegisterScreen() {
  const navigation = useNavigation();
  const setTokens = useAuthStore((s) => s.setTokens);
  const settings = useSettingsStore((s) => s.settings);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const buttonScale = useSharedValue(1);
  const googleBtnScale = useSharedValue(1);
  const appleBtnScale = useSharedValue(1);

  // Decorative circle drift
  const circleDrift = useSharedValue(0);
  React.useEffect(() => {
    circleDrift.value = withRepeat(
      withTiming(1, { duration: 6000 }),
      -1,
      true,
    );
  }, []);

  const circleAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: circleDrift.value * 12 },
      { translateY: circleDrift.value * 8 },
    ],
  }));

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const googleBtnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: googleBtnScale.value }],
  }));

  const appleBtnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: appleBtnScale.value }],
  }));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      acceptTerms: false,
      acceptKvkk: false,
    },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    buttonScale.value = withSpring(0.96, SPRING.snappy, () => {
      buttonScale.value = withSpring(1, SPRING.snappy);
    });
    try {
      const { acceptTerms, acceptKvkk, ...body } = data;
      const { data: res } = await apiClient.post<LoginResponse>('/auth/register', body);
      await setTokens(res.accessToken, res.refreshToken);
    } catch (err: any) {
      if (err instanceof RateLimitError) {
        Alert.alert('Çok fazla deneme', `Lütfen ${err.retryAfter} saniye bekleyin.`);
      } else {
        const msg = err?.response?.data?.message || 'Kayıt başarısız';
        Alert.alert('Hata', Array.isArray(msg) ? msg[0] : msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    if (!GoogleSignin) {
      Alert.alert('Google ile Kayıt', 'Google OAuth entegrasyonu yakında aktif olacak.');
      return;
    }
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;
      if (!idToken) throw new Error('Google ID token alınamadı');

      const { data: res } = await apiClient.post<LoginResponse>('/auth/google/one-tap', {
        credential: idToken,
        deviceInfo: Platform.OS,
      });
      await setTokens(res.accessToken, res.refreshToken);
    } catch (err: any) {
      if (err?.code === 'SIGN_IN_CANCELLED') return;
      const msg = err?.response?.data?.message || err?.message || 'Google ile kayıt başarısız';
      Alert.alert('Hata', msg);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleAppleRegister() {
    if (!appleAuth || !appleAuth.isSupported) {
      Alert.alert('Hata', 'Apple ile Kayıt bu cihazda desteklenmiyor.');
      return;
    }
    setAppleLoading(true);
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      
      const { identityToken, email, fullName } = appleAuthRequestResponse;
      if (!identityToken) throw new Error('Apple identity token alınamadı');
      
      const { data: res } = await apiClient.post<LoginResponse>('/auth/apple/identity-token', {
        identityToken,
        email,
        firstName: fullName?.givenName,
        lastName: fullName?.familyName,
      });
      await setTokens(res.accessToken, res.refreshToken);
    } catch (err: any) {
      if (err.code === appleAuth.Error.CANCELED) return;
      const msg = err?.response?.data?.message || err?.message || 'Apple ile kayıt başarısız';
      Alert.alert('Hata', Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setAppleLoading(false);
    }
  }

  const isDark = theme.isDark;

  // Form field index for stagger
  let fieldIndex = 0;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Compact Header */}
          <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={styles.heroCenter}>
              {settings?.site_logo ? (
                <Image
                  source={{ uri: settings.site_logo }}
                  style={{ width: 140, height: 40, resizeMode: 'contain', marginBottom: 16 }}
                />
              ) : (
                <View style={styles.brandWordmark}>
                  <View style={[styles.brandNetBox, { borderColor: theme.colors.text }]}>
                    <Text style={[styles.brandNetText, { color: theme.colors.primary }]}>NET</Text>
                  </View>
                  <Text style={[styles.brandTapuText, { color: theme.colors.text }]}>TAPU</Text>
                </View>
              )}

              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Aramıza Katılın</Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}>
                Ücretsiz üye olun, ihalelere katılın
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <Animated.View
            entering={FadeInDown.springify()}
            style={[styles.formCard, {
              backgroundColor: theme.colors.card,
              shadowColor: theme.colors.primary,
            }]}
          >
            {/* Social Signup */}
            <Animated.View
              entering={FadeInDown.delay((fieldIndex++) * 60)}
              style={{ flexDirection: 'row', gap: 12, marginBottom: 18 }}
            >
              <Animated.View style={[googleBtnAnimStyle, { flex: 1 }]}>
                <TouchableOpacity
                  style={[styles.socialBtn, {
                    borderColor: isDark ? theme.colors.border : '#e5e7eb',
                    backgroundColor: theme.colors.card,
                  }]}
                  onPress={handleGoogleRegister}
                  onPressIn={() => { googleBtnScale.value = withTiming(0.97, { duration: 100 }); }}
                  onPressOut={() => { googleBtnScale.value = withSpring(1, SPRING.snappy); }}
                  activeOpacity={0.9}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.text} />
                  ) : (
                    <>
                      <Ionicons name="logo-google" size={18} color="#4285F4" style={{ marginRight: 8 }} />
                      <Text style={[styles.socialLabel, { color: theme.colors.text }]}>Google</Text>
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>

              {(Platform.OS === 'ios' || appleAuth?.isSupported) && (
                <Animated.View style={[appleBtnAnimStyle, { flex: 1 }]}>
                  <TouchableOpacity
                    style={[styles.socialBtn, {
                      borderColor: isDark ? theme.colors.border : theme.colors.text,
                      backgroundColor: isDark ? theme.colors.text : theme.colors.text,
                    }]}
                    onPress={handleAppleRegister}
                    onPressIn={() => { appleBtnScale.value = withTiming(0.97, { duration: 100 }); }}
                    onPressOut={() => { appleBtnScale.value = withSpring(1, SPRING.snappy); }}
                    activeOpacity={0.9}
                    disabled={appleLoading}
                  >
                    {appleLoading ? (
                      <ActivityIndicator size="small" color={theme.colors.surface} />
                    ) : (
                      <>
                        <Ionicons name="logo-apple" size={18} color={theme.colors.surface} style={{ marginRight: 8 }} />
                        <Text style={[styles.socialLabel, { color: theme.colors.surface }]}>Apple</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              )}
            </Animated.View>

            {/* Divider */}
            <Animated.View entering={FadeInDown.delay((fieldIndex++) * 60)} style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              <View style={[styles.dividerBadge, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.dividerText, { color: theme.colors.textMuted }]}>veya</Text>
              </View>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            </Animated.View>

            {/* Username */}
            <Animated.View entering={FadeInDown.delay((fieldIndex++) * 60)}>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Kullanıcı Adı"
                    placeholder="ornek_kullanici"
                    leftIcon="at-outline"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    error={errors.username?.message}
                  />
                )}
              />
            </Animated.View>

            {/* Name Row */}
            <Animated.View entering={FadeInDown.delay((fieldIndex++) * 60)} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, value } }) => (
                    <Input label="Ad" placeholder="Adınız" value={value} onChangeText={onChange} error={errors.firstName?.message} />
                  )}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, value } }) => (
                    <Input label="Soyad" placeholder="Soyadınız" value={value} onChangeText={onChange} error={errors.lastName?.message} />
                  )}
                />
              </View>
            </Animated.View>

            {/* Email */}
            <Animated.View entering={FadeInDown.delay((fieldIndex++) * 60)}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="E-posta"
                    placeholder="ornek@email.com"
                    leftIcon="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    error={errors.email?.message}
                  />
                )}
              />
            </Animated.View>

            {/* Phone */}
            <Animated.View entering={FadeInDown.delay((fieldIndex++) * 60)}>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Telefon (opsiyonel)"
                    placeholder="05XX XXX XX XX"
                    leftIcon="call-outline"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    error={errors.phone?.message}
                  />
                )}
              />
            </Animated.View>

            {/* Password */}
            <Animated.View entering={FadeInDown.delay((fieldIndex++) * 60)}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Şifre"
                    placeholder="En az 8 karakter"
                    leftIcon="lock-closed-outline"
                    isPassword
                    value={value}
                    onChangeText={onChange}
                    error={errors.password?.message}
                  />
                )}
              />
            </Animated.View>

            {/* Combined Legal Consent */}
            <Animated.View entering={FadeInDown.delay((fieldIndex++) * 60)}>
              <Controller
                control={control}
                name="acceptTerms"
                render={({ field: { onChange: onChangeTerms, value: valueTerms } }) => (
                  <Controller
                    control={control}
                    name="acceptKvkk"
                    render={({ field: { onChange: onChangeKvkk, value: valueKvkk } }) => {
                      const both = valueTerms && valueKvkk;
                      const toggle = (next: boolean) => {
                        onChangeTerms(next);
                        onChangeKvkk(next);
                      };
                      return (
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => toggle(!both)}
                          style={[styles.consentRow, {
                            backgroundColor: both ? theme.colors.primaryBg : theme.colors.surface,
                            borderColor: both ? theme.colors.primary : theme.colors.border,
                          }]}
                        >
                          <View style={[styles.consentBox, {
                            backgroundColor: both ? theme.colors.primary : 'transparent',
                            borderColor: both ? theme.colors.primary : theme.colors.borderStrong,
                          }]}>
                            {both && <Ionicons name="checkmark" size={16} color="#fff" />}
                          </View>
                          <Text style={[styles.consentText, { color: theme.colors.text }]}>
                            <Text style={[styles.linkText, { color: theme.colors.primary }]}>Kullanım Koşulları</Text>
                            {', '}
                            <Text style={[styles.linkText, { color: theme.colors.primary }]}>Mesafeli Satış Sözleşmesi</Text>
                            {' ve '}
                            <Text style={[styles.linkText, { color: theme.colors.primary }]}>KVKK Aydınlatma Metni</Text>
                            {"'ni okudum, kabul ediyorum."}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                )}
              />
              {(errors.acceptTerms || errors.acceptKvkk) && (
                <Text style={styles.errorText}>Lütfen sözleşmeleri kabul edin</Text>
              )}
            </Animated.View>

            {/* Submit */}
            <Animated.View style={buttonAnimStyle}>
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                activeOpacity={0.85}
                disabled={loading}
                style={{ borderRadius: 14, overflow: 'hidden' }}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButton}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.submitText}>Üye Ol</Text>
                      <View style={styles.submitArrow}>
                        <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
                      </View>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeIn.delay(400)} style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              Zaten bir hesabınız var mı?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Giriş Yap</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 48,
  },
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
    marginBottom: 4,
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  formCard: {
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 22,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  socialLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerBadge: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: 10,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: -6,
    marginBottom: 12,
    gap: 6,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 20,
  },
  consentBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  consentText: {
    fontSize: 12.5,
    lineHeight: 18,
    flex: 1,
  },
  linkText: {
    fontWeight: '700',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 50,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 10,
    marginTop: 4,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  submitArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '700',
  },
});
