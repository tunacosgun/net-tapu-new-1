# NetTapu Mobile — Production Setup Guide

> Bu dokümantasyon `apps/mobile` React Native uygulamasının App Store ve Google
> Play yayınına hazırlanması için gereken tüm adımları içerir.

İçerik

1. [Mimari Özet](#1-mimari-özet)
2. [Geliştirme Ortamı](#2-geliştirme-ortamı)
3. [Bundle ID & Branding](#3-bundle-id--branding)
4. [iOS — App Store Connect](#4-ios--app-store-connect)
5. [Android — Google Play Console](#5-android--google-play-console)
6. [Push Notifications (FCM + APNs)](#6-push-notifications-fcm--apns)
7. [Ortam Değişkenleri & API Yapılandırması](#7-ortam-değişkenleri--api-yapılandırması)
8. [Code Signing & Fastlane](#8-code-signing--fastlane)
9. [GitHub Actions CI](#9-github-actions-ci)
10. [Mağaza Submission Checklist](#10-mağaza-submission-checklist)
11. [KVKK / Privacy](#11-kvkk--privacy)
12. [Sorun Giderme](#12-sorun-giderme)

---

## 1. Mimari Özet

| Katman      | Teknoloji                                          |
|-------------|----------------------------------------------------|
| UI          | React Native 0.84 (bare), Reanimated 3, Gesture Handler |
| Navigasyon  | @react-navigation/native v7                        |
| State       | Zustand + MMKV / Keychain                          |
| Network     | axios + RateLimitError + 401 refresh queue         |
| Realtime    | socket.io-client (canlı ihale)                     |
| Push        | @react-native-firebase/messaging                   |
| Maps        | react-native-maps                                  |
| Tasarım     | Custom design system: olive (#687A26) + champagne gold (#9C7A3D) |

**Backend:** TypeORM/NestJS, REST `/api/v1`, demo: `https://nettapu-2.tunasoft.tech`.
Mobil uygulama backend'i değiştirmez, yalnızca tüketir.

---

## 2. Geliştirme Ortamı

```bash
# 1. Bağımlılıklar
cd apps/mobile
npm install

# 2. iOS pods
cd ios && bundle install && bundle exec pod install && cd ..

# 3. Metro bundler
npm start

# 4. Çalıştırma
npm run ios       # Xcode + Simulator
npm run android   # Android Emulator / connected device
```

> **Önemli:** Hermes etkin (`hermesEnabled=true`), yeni mimari (Fabric/TurboModules) etkin.

### Önerilen araçlar

* Xcode 16.2+ (iOS)
* Android Studio Hedgehog veya üzeri
* JDK 17 (Temurin)
* Ruby 3.2 (CocoaPods + Fastlane için)
* Node 20

---

## 3. Bundle ID & Branding

Şu anki dev bundle ID'si placeholder: `org.reactjs.native.example.NetTapu`
Production öncesi şuna çevirilmeli:

| Platform | Production identifier        |
|----------|------------------------------|
| iOS      | `tech.tunasoft.nettapu`      |
| Android  | `tech.tunasoft.nettapu`      |

### iOS — bundle ID değiştirme

Xcode → `NetTapu` target → **Signing & Capabilities**
* Bundle Identifier: `tech.tunasoft.nettapu`
* Team: gerçek Apple Developer Team
* Provisioning: Automatic (development) / Manual (release ile match)

`ios/NetTapu.xcodeproj/project.pbxproj` içinde `PRODUCT_BUNDLE_IDENTIFIER`
satırı aynı değere çevrilmeli (her config için).

### Android — package değiştirme

`android/app/build.gradle`:

```gradle
android {
    namespace "tech.tunasoft.nettapu"
    defaultConfig {
        applicationId "tech.tunasoft.nettapu"
        // ...
    }
}
```

Java/Kotlin paket yolları da güncellenmeli (`MainActivity`, `MainApplication`).

### App Icons & Launch

* iOS: `ios/NetTapu/Images.xcassets/AppIcon.appiconset/` — 1024×1024 başta tüm boyutlar.
* Android: `android/app/src/main/res/mipmap-*` — adaptive icon (foreground + background).
* Launch screen: `ios/NetTapu/LaunchScreen.storyboard`

> İkon üretimi için `npx react-native-asset` veya [icon.kitchen](https://icon.kitchen) önerilir.

---

## 4. iOS — App Store Connect

### 4.1. Apple Developer hesabı

1. https://developer.apple.com → **Membership Active**
2. **Certificates, Identifiers & Profiles** bölümünden:
    * App ID: `tech.tunasoft.nettapu` (Push, Sign in with Apple, Associated Domains capability'leri açık)
    * Distribution Certificate
    * App Store Provisioning Profile

### 4.2. App Store Connect uygulaması

1. https://appstoreconnect.apple.com → **My Apps → +** → **New App**
2. Bundle ID `tech.tunasoft.nettapu` seç
3. SKU: `nettapu-mobile-001`
4. Primary Language: Turkish
5. Categories: Business / Lifestyle (Real Estate yoksa)

### 4.3. App Store Connect API Key

CI'dan TestFlight'a yükleme için:

1. App Store Connect → **Users and Access → Keys** → **+** (Admin role)
2. `.p8` dosyası bir kez indirilebilir, kaybolursa yenisini oluştur
3. GitHub Secrets'a ekle:
    * `APP_STORE_CONNECT_API_KEY_ID`
    * `APP_STORE_CONNECT_API_KEY_ISSUER_ID`
    * `APP_STORE_CONNECT_API_KEY_CONTENT` → `base64 -i AuthKey_XXXX.p8 | pbcopy`

### 4.4. iOS gereken capability'ler

`ios/NetTapu/NetTapu.entitlements`:

```xml
<dict>
    <key>aps-environment</key>
    <string>production</string>
    <key>com.apple.developer.applesignin</key>
    <array>
        <string>Default</string>
    </array>
</dict>
```

### 4.5. Privacy Manifest

`ios/NetTapu/PrivacyInfo.xcprivacy` zaten oluşturulmuş.
`Info.plist` içerisindeki tüm `NS*UsageDescription` anahtarları doldurulmuş durumda
(camera, photo library, location, microphone, FaceID).

---

## 5. Android — Google Play Console

### 5.1. Hesap

1. https://play.google.com/console — Geliştirici hesabı (25$ tek seferlik)
2. Yeni uygulama oluştur:
    * App name: **NetTapu**
    * Default language: Turkish (tr-TR)
    * App or game: App
    * Free or paid: Free
3. Declarations: Ads (No), App access (Restricted with login)

### 5.2. Signing key

```bash
keytool -genkey -v \
  -keystore release.keystore \
  -alias nettapu-upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

Şifreleri **bir parola yöneticisinde** sakla.
Anahtarın base64'ünü CI için al:

```bash
base64 -w0 release.keystore | pbcopy
```

GitHub Secrets:

* `ANDROID_KEYSTORE_BASE64`
* `ANDROID_KEYSTORE_PASSWORD`
* `ANDROID_KEY_ALIAS` (= `nettapu-upload`)
* `ANDROID_KEY_PASSWORD`

### 5.3. Service account (CI publish için)

1. https://console.cloud.google.com → yeni service account
2. Play Console → Setup → API access → service account'ı bağla, **Release manager** rolü
3. JSON anahtarı indir → GitHub Secret: `GOOGLE_PLAY_JSON_KEY` (içerik tamamı)

### 5.4. release build.gradle yapılandırması

`android/app/build.gradle` `signingConfigs` bloğu, CI'da env vars üzerinden enjekte
edilir (Fastlane `gradle.properties` üzerine bindirir). Lokal release için:

```bash
cd apps/mobile
./gradlew :app:bundleRelease \
  -Pandroid.injected.signing.store.file=$PWD/release.keystore \
  -Pandroid.injected.signing.store.password=... \
  -Pandroid.injected.signing.key.alias=nettapu-upload \
  -Pandroid.injected.signing.key.password=...
```

---

## 6. Push Notifications (FCM + APNs)

### 6.1. Firebase projesi

1. https://console.firebase.google.com → Add project: **NetTapu**
2. iOS uygulaması ekle: bundle id = `tech.tunasoft.nettapu` → `GoogleService-Info.plist` indir → `apps/mobile/ios/NetTapu/` içine ekle
3. Android uygulaması ekle: package = `tech.tunasoft.nettapu` → `google-services.json` indir → `apps/mobile/android/app/` içine ekle

### 6.2. APNs key

Apple Developer → **Keys → +** → APNs (single key). `.p8` dosyasını Firebase
Console → Cloud Messaging → APNs Authentication Key alanına yükle.

### 6.3. Backend ayarları

Backend'in dispatcher modülü (`SendGrid/NetGSM/Firebase` adapter'ları) için:

* `FIREBASE_SERVICE_ACCOUNT_JSON` env vars
* `FCM_PROJECT_ID`

Bu mobile tarafından **bağımsız**, mobil yalnızca cihaz token'ını kayıt eder
(`@react-native-firebase/messaging` aracılığıyla, `services/push-notifications.ts`).

---

## 7. Ortam Değişkenleri & API Yapılandırması

`apps/mobile/src/config/env.ts`:

```ts
const DEV_USE_DEMO = true;        // Simulator/Emulator → demo backend kullan
const DEMO_URL = 'https://nettapu-2.tunasoft.tech';
const LOCAL_API = 'http://localhost:8080';
```

* `__DEV__` true ise → DEV_USE_DEMO toggle’ına göre demo veya local
* `__DEV__` false (release) → otomatik DEMO_URL (production değiştirildiğinde update)

Production öncesi DEMO_URL'yi prod URL ile güncelle:

```ts
const PROD_URL = 'https://api.nettapu.com';
export const Config = {
  API_BASE_URL: __DEV__ ? (DEV_USE_DEMO ? DEMO_URL : LOCAL_API) : PROD_URL,
  WS_URL:       __DEV__ ? (DEV_USE_DEMO ? DEMO_URL : LOCAL_WS) : PROD_URL,
  API_PREFIX:   '/api/v1',
};
```

Endpoint sözleşmesi: `/api/v1/parcels`, `/api/v1/auctions`, `/api/v1/auth/*`,
`/api/v1/messages`, `/api/v1/favorites`, vs.

---

## 8. Code Signing & Fastlane

### 8.1. Yerel kullanım

```bash
cd apps/mobile
bundle install                # Fastlane + CocoaPods
bundle exec fastlane install_plugins
```

### 8.2. iOS — Match (önerilen)

Match, code-signing assets'i şifreli bir git repo'sunda saklar.

```bash
cd apps/mobile
bundle exec fastlane match init
bundle exec fastlane match appstore --app_identifier tech.tunasoft.nettapu
```

CI'da `match readonly: true` modunda çalışır, dev makinede yeni cert
oluşturulurken `--readonly false`.

### 8.3. Lane'leri çalıştırma

```bash
# iOS TestFlight
bundle exec fastlane ios beta

# Android Play Internal track
bundle exec fastlane android beta

# Internal -> Production promotion
bundle exec fastlane android promote_to_production
```

---

## 9. GitHub Actions CI

Üç workflow `.github/workflows/`:

* **`mobile-ci.yml`** → push ve PR'da TS, ESLint, Jest
* **`mobile-ios-beta.yml`** → manuel `workflow_dispatch` veya `mobile-ios-v*` tag
* **`mobile-android-beta.yml`** → manuel veya `mobile-android-v*` tag

### 9.1. Required GitHub Secrets

| Secret                                  | Açıklama                              |
|-----------------------------------------|----------------------------------------|
| `APPLE_TEAM_ID`                         | 10 karakter Apple team id              |
| `APP_STORE_CONNECT_API_KEY_ID`          | API key id                             |
| `APP_STORE_CONNECT_API_KEY_ISSUER_ID`   | Issuer id                              |
| `APP_STORE_CONNECT_API_KEY_CONTENT`     | Base64 of `.p8`                        |
| `MATCH_GIT_URL`                         | Şifreli match repo url                 |
| `MATCH_PASSWORD`                        | Match şifreleme parolası               |
| `KEYCHAIN_PASSWORD`                     | CI keychain için herhangi bir güçlü şifre |
| `ANDROID_KEYSTORE_BASE64`               | Base64 of `release.keystore`           |
| `ANDROID_KEYSTORE_PASSWORD`             |                                        |
| `ANDROID_KEY_ALIAS`                     | `nettapu-upload`                       |
| `ANDROID_KEY_PASSWORD`                  |                                        |
| `GOOGLE_PLAY_JSON_KEY`                  | Service-account JSON içeriği            |

### 9.2. Required GitHub Variables (vars)

| Var                | Default                   |
|--------------------|----------------------------|
| `APPLE_BUNDLE_ID`  | `tech.tunasoft.nettapu`    |
| `ANDROID_PACKAGE`  | `tech.tunasoft.nettapu`    |

### 9.3. Tag-driven release

```bash
git tag mobile-ios-v1.0.0
git push origin mobile-ios-v1.0.0   # → TestFlight build

git tag mobile-android-v1.0.0
git push origin mobile-android-v1.0.0  # → Play Internal Testing
```

---

## 10. Mağaza Submission Checklist

### iOS App Store

- [ ] App Icon (1024×1024 PNG, no alpha)
- [ ] 6.7" iPhone screenshots (1290×2796) — minimum 3
- [ ] iPad Pro screenshots opsiyonel
- [ ] App Preview videosu (önerilir)
- [ ] Privacy Policy URL
- [ ] Support URL & Marketing URL
- [ ] Description (TR + EN), keywords (max 100 char)
- [ ] Age rating (4+ önerilir; gambling değil, ihale ticari)
- [ ] Export Compliance: standart şifreleme
- [ ] Sign in with Apple (Apple OAuth zorunlu, kodu mevcut)

### Google Play

- [ ] App Icon 512×512 (PNG)
- [ ] Feature graphic 1024×500
- [ ] Phone screenshots (en az 2)
- [ ] Description: short (80) + full (4000)
- [ ] Privacy Policy URL
- [ ] Content rating questionnaire
- [ ] Data safety form (KVKK uyumlu)
- [ ] Target audience: 18+

### Mağaza Listing Önerileri

**Kısa açıklama (TR):**
> NetTapu — Türkiye'nin profesyonel arsa & açık artırma platformu. Canlı ihale, güvenli kaparo, akıllı arama.

**Uzun açıklama (kısa giriş):**
> NetTapu, gayrimenkul yatırımcıları için tasarlanmış kurumsal bir mobil platformdur. Binlerce arsa ilanını harita üzerinde keşfedin, gerçek zamanlı online ihalelere katılın, danışmanlarımızla doğrudan iletişime geçin. Her işlem 3D Secure ile korunur, KVKK uyumlu ve resmi tapu garantilidir.

---

## 11. KVKK / Privacy

### Privacy Policy zorunlu içerikler

* Toplanan veriler: e-posta, telefon, konum (opsiyonel), kullanım istatistikleri
* Saklama süresi: hesap aktif olduğu sürece + 5 yıl
* Üçüncü taraflar: Firebase Analytics, Sentry, ödeme sağlayıcı (POS)
* Kullanıcı hakları: silme, indirme, düzeltme talepleri için iletişim

### App içi işaretleme

* Login/Register ekranlarında SSL Güvenli, KVKK Uyumlu, 3D Secure rozetleri (✅ var)
* `Settings → Hesabımı Sil` uçtan uca implementation gerekli (Apple Guideline 5.1.1(v))

---

## 12. Sorun Giderme

| Belirti                                              | Olası neden / çözüm                                |
|------------------------------------------------------|----------------------------------------------------|
| `pod install` `Specs` hatası                          | `gem install cocoapods --version ~> 1.15`          |
| Hermes crash (release)                                | `./gradlew clean` + `npm start --reset-cache`      |
| TestFlight: "Missing Privacy Manifest"                | `PrivacyInfo.xcprivacy` Xcode target'a eklendi mi  |
| Android: "App not installed"                          | versionCode aynı, bump et                          |
| 401 sonsuz refresh                                    | `auth-store` keychain temizle                      |
| Push gelmiyor (iOS sandbox)                           | `aps-environment` = development; APNs key aktif?   |
| Maps gri ekran                                        | Google Maps API key Android için ekli mi          |
| WhatsApp açılmıyor                                    | `LSApplicationQueriesSchemes` whatsapp ekli (✅)    |

---

## Son Notlar

* **Hot reload:** dev sırasında `__DEV__ = true` → otomatik demo URL'ye bağlanır.
* **Edge cases:** Backend down → ekranlar shimmer'da kalmaz, empty state gösterir
* **Erişilebilirlik:** Tüm interaktif elementler `accessibilityRole`, `accessibilityLabel` ve `testID` taşır.
* **i18n:** Şu an sadece TR. Production'da `react-native-localize` + `i18next` eklenebilir.
