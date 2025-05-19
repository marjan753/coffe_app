import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { updateUserProfile, getUserProfile } from '../Server/getapi'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    email: '',
  });

  const [userId, setUserId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');

        if (storedUserId && storedPhoneNumber) {
          setUserId(storedUserId);
          setPhoneNumber(storedPhoneNumber);
          fetchUserProfile(storedUserId);
        } else {
          console.error('اطلاعات کاربر موجود نیست');
        }
      } catch (error) {
        console.error('خطا در بارگیری اطلاعات کاربر:', error);
      }
    };

    loadUserData();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      setIsLoading(true);
      const response = await getUserProfile(userId);

      if (response.success) {
        setFormData({
          firstName: response.data.name || '',
          lastName: response.data.lastname || '',
          address: response.data.address || '',
          postalCode: response.data.postalcode || '',
          email: response.data.email || '',
        });
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('خطا در دریافت پروفایل:', error.message);
      alert('خطا در بارگیری اطلاعات پروفایل');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!userId) {
      Alert.alert('خطا', 'شناسه کاربری یافت نشد.');
      return;
    }

    try {
      setIsLoading(true);
      const profileData = {
        name: formData.firstName,
        lastname: formData.lastName,
        address: formData.address,
        postalcode: formData.postalCode,
        email: formData.email,
      };

      const response = await updateUserProfile(userId, profileData);

      if (response.success) {
        alert(response.message);
        fetchUserProfile(userId);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-customblack">
      <View className="bg-[#D17842] p-20 items-center rounded-b-3xl">
        <View className="items-center">
          <Ionicons name="person-circle" size={100} color="#AEAEAE" />
          <Text className="text-white text-base mt-2">{phoneNumber}</Text>
        </View>
      </View>

      <View className="flex-1 justify-center items-center px-5">
        <View className="w-full">
          <TextInput
            className="w-full h-14 border border-customgrayS rounded-full px-4 text-white shadow-lg bg-customgrayL"
            placeholder="نام"
            placeholderTextColor="#B0B0B0"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
          />

          <TextInput
            className="w-full h-14 border border-customgrayS rounded-full px-4 text-white shadow-lg bg-customgrayL mt-4"
            placeholder="نام خانوادگی"
            placeholderTextColor="#B0B0B0"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
          />

          <TextInput
            className="w-full h-14 border border-customgrayS rounded-full px-4 text-white shadow-lg bg-customgrayL mt-4"
            placeholder="آدرس"
            placeholderTextColor="#B0B0B0"
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
          />

          <TextInput
            className="w-full h-14 border border-customgrayS rounded-full px-4 text-white shadow-lg bg-customgrayL mt-4"
            placeholder="کد پستی"
            placeholderTextColor="#B0B0B0"
            value={formData.postalCode}
            onChangeText={(value) => handleInputChange('postalCode', value)}
            keyboardType="numeric"
          />

          <TextInput
            className="w-full h-14 border border-customgrayS rounded-full px-4 text-white shadow-lg bg-customgrayL mt-4"
            placeholder="ایمیل"
            placeholderTextColor="#B0B0B0"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
          />

          <TouchableOpacity
            className="w-full h-12 bg-customButton justify-center items-center rounded-full mt-6"
            onPress={handleSave}
          >
            <Text className="text-white font-semibold text-lg">
              {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;
