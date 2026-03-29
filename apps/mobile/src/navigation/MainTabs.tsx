import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';

import HomeScreen from '../screens/home/HomeScreen';
import ParcelsListScreen from '../screens/parcels/ParcelsListScreen';
import AuctionsListScreen from '../screens/auctions/AuctionsListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  { name: 'Home', label: 'Ana Sayfa', icon: 'home', iconOutline: 'home-outline' },
  { name: 'Parcels', label: 'İlanlar', icon: 'map', iconOutline: 'map-outline' },
  { name: 'Auctions', label: 'İhaleler', icon: 'flash', iconOutline: 'flash-outline' },
  { name: 'Profile', label: 'Profil', icon: 'person', iconOutline: 'person-outline' },
];

/* ─── Glass Tab Bar (iOS 26 liquid glass style) ─── */
function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors: c, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const tabCount = state.routes.length;

  const bubbleAnim = useRef(new Animated.Value(state.index)).current;
  const scaleAnims = useRef(state.routes.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    Animated.spring(bubbleAnim, {
      toValue: state.index,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
      mass: 0.7,
    }).start();

    scaleAnims.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === state.index ? 1.08 : 1,
        useNativeDriver: true,
        damping: 15,
        stiffness: 200,
      }).start();
    });
  }, [state.index]);

  const screenWidth = Dimensions.get('window').width;
  const barHorizontalMargin = 20;
  const barWidth = screenWidth - barHorizontalMargin * 2;
  const tabWidth = barWidth / tabCount;
  const bubblePadding = 6;
  const bubbleWidth = tabWidth - bubblePadding * 2;
  const barHeight = Platform.OS === 'ios' ? 62 : 58;
  const bottomMargin = Platform.OS === 'ios' ? Math.max(insets.bottom - 4, 12) : 14;
  const bubbleHeight = barHeight - 12;

  const translateX = bubbleAnim.interpolate({
    inputRange: Array.from({ length: tabCount }, (_, i) => i),
    outputRange: Array.from({ length: tabCount }, (_, i) => i * tabWidth + bubblePadding),
  });

  return (
    <View
      style={[
        styles.barContainer,
        {
          bottom: bottomMargin,
          left: barHorizontalMargin,
          right: barHorizontalMargin,
          height: barHeight,
          borderRadius: barHeight / 2,
        },
      ]}
    >
      {/* Glass background */}
      <View style={[styles.blurContainer, { borderRadius: barHeight / 2 }]}>
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={isDark ? 'chromeMaterialDark' : 'chromeMaterial'}
            blurAmount={80}
            reducedTransparencyFallbackColor={isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)'}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(28,28,30,0.97)' : 'rgba(248,248,250,0.97)' }]} />
        )}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(40,40,40,0.2)' : 'rgba(255,255,255,0.4)' }]} />
      </View>

      {/* Animated glass bubble indicator */}
      <Animated.View
        style={[
          styles.bubble,
          {
            width: bubbleWidth,
            height: bubbleHeight,
            borderRadius: bubbleHeight / 2,
            transform: [{ translateX }],
            top: 6,
          },
        ]}
      >
        {Platform.OS === 'ios' ? (
          <View style={[StyleSheet.absoluteFill, { borderRadius: bubbleHeight / 2, overflow: 'hidden' }]}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={isDark ? 'ultraThinMaterialDark' : 'ultraThinMaterial'}
              blurAmount={40}
              reducedTransparencyFallbackColor={isDark ? 'rgba(60,60,60,0.4)' : 'rgba(200,200,200,0.3)'}
            />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.6)' }]} />
          </View>
        ) : (
          <View style={[StyleSheet.absoluteFill, { borderRadius: bubbleHeight / 2, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]} />
        )}
      </Animated.View>

      {/* Tab items */}
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG.find(t => t.name === route.name) || TAB_CONFIG[0];
          const iconName = isFocused ? config.icon : config.iconOutline;
          const color = isFocused
            ? (isDark ? '#ffffff' : '#000000')
            : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)');

          return (
            <Animated.View key={route.key} style={[styles.tabItem, { transform: [{ scale: scaleAnims[index] }] }]}>
              <TouchableOpacity
                onPress={() => {
                  const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                  if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                }}
                activeOpacity={0.7}
                style={styles.tabItemInner}
                accessibilityRole="tab"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={config.label}
              >
                <Ionicons name={iconName} size={21} color={color} />
                <Text style={[styles.tabLabel, { color, fontWeight: isFocused ? '600' : '400' }]} numberOfLines={1}>
                  {config.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Parcels" component={ParcelsListScreen} />
      <Tab.Screen name="Auctions" component={AuctionsListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    position: 'absolute',
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24 },
      android: { elevation: 16 },
    }),
  },
  blurContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  bubble: { position: 'absolute', left: 0, overflow: 'hidden' },
  tabRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabItemInner: { alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  tabLabel: { fontSize: 10, marginTop: 2, letterSpacing: 0.1 },
});
