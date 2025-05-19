import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { loginOrSignUp } from '../Server/getapi'; // وارد کردن متد loginOrSignUp از getapi.js

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // وضعیت بارگذاری
  const navigation = useNavigation(); // برای هدایت به صفحه جدید

  const handleSubmit = async () => {
    setErrorMessage(''); // پاک کردن پیام خطا قبل از ارسال
    setLoading(true); // فعال کردن بارگذاری

    try {
      // استفاده از متد loginOrSignUp برای بررسی و ثبت شماره موبایل
      const result = await loginOrSignUp(phoneNumber);

      setLoading(false); // غیرفعال کردن بارگذاری

      if (result.success) {
        // اگر شماره موبایل با موفقیت ثبت شد
        Alert.alert('موفقیت', result.message);
        setPhoneNumber(''); // پاک کردن فرم
        navigation.navigate('Verification', { phoneNumber });
      } else {
        // اگر شماره قبلاً ثبت شده است، بدون نمایش پیام و فقط هدایت به صفحه تایید کد
        navigation.navigate('Verification', { phoneNumber });
      }
    } catch (err) {
      setLoading(false); // غیرفعال کردن بارگذاری
      console.error('خطا:', err.message);
      Alert.alert('خطا', err.message);
    }
  };

  return (
    <View className="flex-1 bg-customblack">
      <Image
        source={require('../../assets/images/signIn.png')}
        className="w-full h-[400px] object-cover rounded-b-3xl"
      />

      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-[30px] text-white font-bold mb-6">شماره موبایل خود را وارد کنید!</Text>

        <TextInput
  placeholder="شماره موبایل"
  placeholderTextColor="#B0B0B0"
  keyboardType="number-pad"
  autoFocus={true} // کیبورد به طور خودکار باز می‌شود
  className="w-full h-14 border border-customgrayS rounded-full px-4 text-white shadow-lg bg-customgrayL"
  value={phoneNumber}
  onChangeText={(text) => setPhoneNumber(text)} // ذخیره کردن شماره وارد شده
/>

        {/* نمایش پیام خطا */}
        {errorMessage ? (
          <Text className="text-red-500 mt-2">{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          className="w-full h-12 bg-customButton justify-center items-center rounded-full mt-6"
          onPress={handleSubmit}
          disabled={loading} // غیرفعال کردن دکمه در هنگام بارگذاری
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
