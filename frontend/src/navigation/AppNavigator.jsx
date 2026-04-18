import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/search/SearchScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import MapScreen from '../screens/map/MapScreen';
import BookmarkScreen from '../screens/bookmark/BookmarkScreen';
import MyPageScreen from '../screens/mypage/MyPageScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const ICONS = {
  Home: { on: 'home', off: 'home-outline' },
  History: { on: 'bag-handle', off: 'bag-handle-outline' },
  Map: { on: 'map', off: 'map-outline' },
  Bookmark: { on: 'heart', off: 'heart-outline' },
  MyPage: { on: 'person', off: 'person-outline' },
};

const LABELS = {
  Home: '홈',
  History: '사용내역',
  Map: '지도',
  Bookmark: '찜',
  MyPage: 'MY',
};

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="SearchScreen" component={SearchScreen} />
    </HomeStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icon = focused ? ICONS[route.name].on : ICONS[route.name].off;
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: Platform.OS === 'web' ? 72 : 62,
          paddingBottom: Platform.OS === 'web' ? 14 : 10,
          paddingTop: 6,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.07,
          shadowRadius: 10,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ tabBarLabel: LABELS.Home }}
      />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: LABELS.History }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: LABELS.Map }} />
      <Tab.Screen name="Bookmark" component={BookmarkScreen} options={{ tabBarLabel: LABELS.Bookmark }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ tabBarLabel: LABELS.MyPage }} />
    </Tab.Navigator>
  );
}