import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthLoading({ navigation }) {
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const phone = await AsyncStorage.getItem('phoneNumber');
      if (phone) {
        // اگر قبلا وارد شده بود مستقیم به صفحه اصلی
        navigation.reset({
          index: 0,
          routes: [{ name: 'TabNavigations' }],
        });
      } else {
        // اگر قبلا وارد نشده بود به صفحه ورود می‌ریم
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };

    checkUserLoggedIn();
  }, []);

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}
