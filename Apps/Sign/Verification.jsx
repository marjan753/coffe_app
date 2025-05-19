import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react'; // وارد کردن useState و useEffect
import { getUidByPhoneNumber } from '../Server/getapi'; // متد جدید را وارد کنید
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native'; // برای استفاده از route

export default function Verification({ navigation }) {
  const [verificationCode, setVerificationCode] = useState(''); // برای ذخیره کد تایید
  const [errorMessage, setErrorMessage] = useState(''); // برای ذخیره پیام خطا
  const [loading, setLoading] = useState(false); // برای حالت بارگذاری

  const route = useRoute(); // دریافت پارامترها از route
  const phoneNumber = route.params?.phoneNumber; // گرفتن شماره تلفن از پارامترهای مسیر

  // متد برای دریافت UID از شماره موبایل
  const fetchUid = async () => {
    if (!phoneNumber) {
      Alert.alert('خطا', 'شماره موبایل موجود نیست.');
      return;
    }
    setLoading(true);

    try {
      const uid = await getUidByPhoneNumber(phoneNumber); // فراخوانی متد برای دریافت UID
      if (uid) {
        // ذخیره UID و شماره موبایل در AsyncStorage
        await AsyncStorage.setItem('userId', uid.toString()); // ذخیره UID در AsyncStorage
        await AsyncStorage.setItem('phoneNumber', phoneNumber); // ذخیره شماره موبایل
      } else {
        Alert.alert('خطا', 'کاربری با این شماره یافت نشد.');
      }
    } catch (error) {
      console.error('خطا در دریافت UID:', error.message);
      Alert.alert('خطا', error.message);
    } finally {
      setLoading(false);
    }
  };

  // فراخوانی متد در useEffect
  useEffect(() => {
    fetchUid(); // فراخوانی متد
  }, [phoneNumber]); // فقط در صورت تغییر phoneNumber، فراخوانی می‌شود

  // متد برای تایید کد وارد شده
  const handleVerify = async () => {
    setErrorMessage(''); // پاک کردن خطا
    if (verificationCode.length === 6) {
      setLoading(true);
      try {
        // ذخیره کد تایید و شماره موبایل در AsyncStorage
        await AsyncStorage.setItem('verificationCode', verificationCode); // ذخیره کد تایید
        setErrorMessage(''); // پاک کردن خطا در صورت تایید

        // هدایت به صفحه بعدی پس از ذخیره کردن اطلاعات
        navigation.navigate('TabNavigations'); // هدایت به صفحه TabNavigations
      } catch (error) {
        setErrorMessage('مشکلی پیش آمد. لطفاً دوباره تلاش کنید.');
        console.error('خطا در ذخیره داده‌ها:', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage('کد وارد شده اشتباه است. لطفاً دوباره تلاش کنید.'); // نمایش پیام خطا
    }
  };

  return (
    <View className="flex-1 bg-customblack">
      <Image
        source={require('../../assets/images/signIn.png')}
        className="w-full h-[400px] object-cover rounded-b-3xl"
      />

      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-[30px] text-white font-bold mb-6">کد تایید را وارد کنید!</Text>

        {/* ورودی کد تایید */}
        <TextInput
          placeholder="کد تایید"
          placeholderTextColor="#B0B0B0"
          keyboardType="number-pad"
          className="w-full h-14 border border-customgrayS rounded-full px-4 text-white shadow-lg bg-customgrayL"
          value={verificationCode}
          onChangeText={(text) => setVerificationCode(text)} // ذخیره کد وارد شده
        />

        {/* نمایش پیام خطا */}
        {errorMessage ? (
          <Text className="text-red-500 mt-2">{errorMessage}</Text>
        ) : null}

        {/* دکمه تایید */}
        <TouchableOpacity
          className="w-full h-12 bg-customButton justify-center items-center rounded-full mt-6"
          onPress={handleVerify}
          disabled={loading} // غیرفعال کردن دکمه در حالت بارگذاری
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" /> // نمایش آیکن بارگذاری
          ) : (
            <Text className="text-white font-semibold text-lg">تایید</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
