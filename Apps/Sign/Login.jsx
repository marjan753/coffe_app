import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginOrSignUp } from '../Server/getapi'; // متد ورود یا ثبت‌نام

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedPhone = await AsyncStorage.getItem('phoneNumber');
        if (storedPhone) {
          // کاربر قبلا وارد شده، مستقیم میریم صفحه اصلی
          navigation.reset({
            index: 0,
            routes: [{ name: 'TabNavigations' }],
          });
        }
      } catch (error) {
        console.error('خطا در بررسی وضعیت ورود:', error);
      }
    };

    checkUser();
  }, []);

  const handleSubmit = async () => {
    setErrorMessage('');
    setLoading(true);

    try {
      const result = await loginOrSignUp(phoneNumber);

      setLoading(false);

      if (result.success) {
        Alert.alert('موفقیت', result.message);
        setPhoneNumber('');
        navigation.navigate('Verification', { phoneNumber });
      } else {
        navigation.navigate('Verification', { phoneNumber });
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('خطا', err.message);
    }
  };

  return (
    <View className="flex-1 bg-customblack">
      <Image
        source={require('../../assets/images/signIn.jpg')}
        className="w-full h-[400px] object-cover rounded-b-3xl"
      />

      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-[30px] text-white font-bold mb-6">شماره موبایل خود را وارد کنید!</Text>

        <TextInput
          placeholder="شماره موبایل"
          placeholderTextColor="#B0B0B0"
          keyboardType="number-pad"
          autoFocus={true}
          className="w-full h-14 border border-customgrayS rounded-full px-4 text-white shadow-lg bg-customgrayL"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />

        {errorMessage ? (
          <Text className="text-red-500 mt-2">{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          className="w-full h-12 bg-customButton justify-center items-center rounded-full mt-6"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-lg">تایید</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
