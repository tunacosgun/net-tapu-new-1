import React, { useRef, useEffect, useCallback } from 'react';
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

/* ─── FabBar Constants (matching native Swift FabBar) ─── */
const BAR_HEIGHT = 62;
const FAB_SPACING = 8;
const HORIZONTAL_PADDING = 21;
const BOTTOM_PADDING = 21;
const CONTENT_PADDING = 2;
const TAB_ICON_SIZE = 20;
const FAB_ICON_SIZE = 22;
const TAB_TITLE_SIZE = 10;
const FAB_ACCENT = '#007AFF'; // iOS system blue

const TAB_CONFIG = [
  { name: 'Home', label: 'Ana Sayfa', icon: 'home', iconOutline: 'home-outline' },
  { name: 'Parcels', label: 'Ke\u015ffet', icon: 'compass', iconOutline: 'compass-outline' },
  { name: 'Profile', label: 'Profil', icon: 'person', iconOutline: 'person-outline' },
];

const SCREEN_MAP: Record<string, React.ComponentType<any>> = {
  Home: HomeScreen,
  Parcels: ParcelsListScreen,
  Auctions: AuctionsListScreen,
  Profile: ProfileScreen,
};

/* ─── Glass Background Component ─── */
function GlassBackground({
  isDark,
  tinted,
}: {
  isDark: boolean;
  tinted?: boolean;
}) {
  if (Platform.OS === 'ios') {
    return (
      <>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={isDark ? 'chromeMaterialDark' : 'chromeMaterial'}
          blurAmount={80}
          reducedTransparencyFallbackColor={
            isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)'
          }
        />
        {/* Tint overlay */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: tinted
                ? isDark
                  ? 'rgba(0,100,255,0.25)'
                  : 'rgba(0,100,255,0.15)'
                : isDark
                  ? 'rgba(40,40,40,0.25)'
                  : 'rgba(255,255,255,0.45)',
            },
          ]}
        />
      </>
    );
  }

  // Android fallback: solid background
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: tinted
            ? isDark
              ? 'rgba(30,60,120,0.95)'
              : 'rgba(220,232,255,0.97)'
            : isDark
              ? 'rgba(28,28,30,0.97)'
              : 'rgba(248,248,250,0.97)',
        },
      ]}
    />
  );
}

/* ─── FabBar Style Glass Tab Bar ─── */
function FabTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors: c, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Animated values
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  const screenWidth = Dimensions.get('window').width;
  const fabSize = BAR_HEIGHT; // FAB is a perfect circle: same as bar height
  const segmentWidth = screenWidth - HORIZONTAL_PADDING * 2 - fabSize - FAB_SPACING;
  const bottomMargin =
    Platform.OS === 'ios' ? Math.max(insets.bottom - 4, BOTTOM_PADDING) : BOTTOM_PADDING;

  // Only 3 tabs in segment (Home, Explore, Profile) -- Auctions is FAB
  const segmentTabs = state.routes.filter((r) => r.name !== 'Auctions');
  const segmentTabWidth = segmentWidth / segmentTabs.length;
  const bubblePadding = CONTENT_PADDING + 4;
  const bubbleW = segmentTabWidth - bubblePadding * 2;

  const segmentIndex = segmentTabs.findIndex(
    (r) => r.name === state.routes[state.index]?.name,
  );
  const isAuctionActive = state.routes[state.index]?.name === 'Auctions';

  useEffect(() => {
    if (segmentIndex >= 0) {
      Animated.spring(bubbleAnim, {
        toValue: segmentIndex,
        useNativeDriver: true,
        damping: 22,
        stiffness: 260,
        mass: 0.6,
      }).start();
    }
  }, [segmentIndex]);

  const translateX = bubbleAnim.interpolate({
    inputRange: segmentTabs.map((_, i) => i),
    outputRange: segmentTabs.map((_, i) => i * segmentTabWidth + bubblePadding),
    extrapolate: 'clamp',
  });

  const onFabPress = useCallback(() => {
    Animated.sequence([
      Animated.spring(fabScale, {
        toValue: 0.88,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(fabScale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 14,
        stiffness: 200,
      }),
    ]).start();

    const auctionRoute = state.routes.find((r) => r.name === 'Auctions');
    if (auctionRoute) {
      navigation.navigate('Auctions');
    }
  }, [state.routes, navigation, fabScale]);

  return (
    <View
      style={[
        styles.fabBarContainer,
        {
          bottom: bottomMargin,
          left: HORIZONTAL_PADDING,
          right: HORIZONTAL_PADDING,
        },
      ]}
    >
      {/* ─── Segmented Control (Glass Capsule) ─── */}
      <View
        style={[
          styles.segmentContainer,
          {
            width: segmentWidth,
            height: BAR_HEIGHT,
            borderRadius: BAR_HEIGHT / 2,
          },
        ]}
      >
        <GlassBackground isDark={isDark} />

        {/* Animated selection pill/capsule indicator */}
        {segmentIndex >= 0 && (
          <Animated.View
            style={[
              styles.segmentBubble,
              {
                width: bubbleW,
                height: BAR_HEIGHT - (bubblePadding * 2),
                borderRadius: (BAR_HEIGHT - bubblePadding * 2) / 2,
                transform: [{ translateX }],
                top: bubblePadding,
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.18)'
                  : 'rgba(0,0,0,0.08)',
              },
            ]}
          />
        )}

        {/* Tab items */}
        <View style={styles.segmentRow}>
          {segmentTabs.map((route) => {
            const isFocused = state.routes[state.index]?.name === route.name;
            const config =
              TAB_CONFIG.find((t) => t.name === route.name) || TAB_CONFIG[0];
            const iconName = isFocused ? config.icon : config.iconOutline;
            const color = isFocused
              ? isDark
                ? '#ffffff'
                : '#000000'
              : isDark
                ? 'rgba(255,255,255,0.45)'
                : 'rgba(0,0,0,0.35)';

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
                activeOpacity={0.7}
                style={styles.segmentItem}
                accessibilityRole="tab"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={config.label}
              >
                <Ionicons name={iconName} size={TAB_ICON_SIZE} color={color} />
                <Text
                  style={[
                    styles.segmentLabel,
                    {
                      color,
                      fontWeight: isFocused ? '600' : '500',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ─── FAB Button (Auctions / İhaleler) ─── */}
      <Animated.View
        style={[styles.fabOuter, { transform: [{ scale: fabScale }] }]}
      >
        <View
          style={[
            styles.fabGlassWrap,
            {
              width: fabSize,
              height: fabSize,
              borderRadius: fabSize / 2,
            },
          ]}
        >
          <GlassBackground isDark={isDark} tinted />
          {/* Accent tint overlay for the FAB */}
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isAuctionActive
                  ? Platform.OS === 'ios'
                    ? 'rgba(0,122,255,0.55)'
                    : 'rgba(0,122,255,0.85)'
                  : Platform.OS === 'ios'
                    ? 'rgba(0,122,255,0.45)'
                    : 'rgba(0,122,255,0.8)',
                borderRadius: fabSize / 2,
              },
            ]}
          />
          <TouchableOpacity
            onPress={onFabPress}
            activeOpacity={0.75}
            style={[
              styles.fabButton,
              {
                width: fabSize,
                height: fabSize,
                borderRadius: fabSize / 2,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="İhaleler"
          >
            <Ionicons
              name={isAuctionActive ? 'flash' : 'flash-outline'}
              size={FAB_ICON_SIZE}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

/* ─── Main Tabs Navigator ─── */
export default function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FabTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Parcels" component={ParcelsListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Auctions" component={AuctionsListScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  fabBarContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: FAB_SPACING,
  },
  segmentContainer: {
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  segmentBubble: {
    position: 'absolute',
    left: 0,
  },
  segmentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  segmentLabel: {
    fontSize: TAB_TITLE_SIZE,
    marginTop: 2,
    letterSpacing: 0.1,
  },
  fabOuter: {
    ...Platform.select({
      ios: {
        shadowColor: FAB_ACCENT,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  fabGlassWrap: {
    overflow: 'hidden',
  },
  fabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
