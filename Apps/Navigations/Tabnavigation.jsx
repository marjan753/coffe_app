import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // آیکون‌ها از کتابخانه Expo
import Home from '../Home/home'; // توجه: نام فایل‌ها با حروف کوچک
import Profile from '../Profile/profile'; 
import Shopping from '../Shoppingcard/shopping';
import History from '../History/history';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="home" // صفحه پیش‌فرض Home
      screenOptions={{
        headerShown: false, // غیرفعال کردن هدر پیش‌فرض
        tabBarShowLabel: false, // مخفی کردن عناوین تب‌ها
        tabBarStyle: {
          backgroundColor: '#0C0F14', // رنگ پس‌زمینه نوار تب‌ها
          borderTopWidth: 0, // حذف خط بالای تب‌ها
          transform: [{ scaleX: -1 }], // معکوس کردن جهت نوار تب‌ها
        },
        tabBarActiveTintColor: '#D17842', // رنگ آیکون انتخاب شده
        tabBarInactiveTintColor: '#52555A', // رنگ آیکون غیر انتخاب شده
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size = 24 }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color, size = 24 }) => (
            <Ionicons name="cafe" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="shopping"
        component={Shopping}
        options={{
          tabBarIcon: ({ color, size = 24 }) => (
            <Ionicons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size = 24 }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
