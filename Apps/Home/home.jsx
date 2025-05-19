import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // استفاده از useNavigation برای دسترسی به navigation
import DiscountList from './DiscountList';
import Categorysliderlist from './Categorysliderlist';

export default function Home() {
  // تعداد ستاره‌های روشن، این مقدار باید از فعالیت‌های کاربر یا از سرور گرفته شود
  const [activeStars, setActiveStars] = useState(4); // فرض کنیم کاربر 4 ستاره فعال دارد

  // تعداد کل ستاره‌ها
  const totalStars = 5;

  // ایجاد آرایه از ستاره‌های روشن و خام
  const stars = Array.from({ length: totalStars }, (_, index) => index < activeStars);

  // دسترسی به navigation از طریق useNavigation
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-customblack px-4">
      {/* نوار بالایی */}
      <View className="flex-row justify-between items-center mt-4 mb-4">
        {/* ستاره‌ها در سمت چپ */}
        <View className="flex-row">
          {stars.map((isActive, index) => (
            <Ionicons
              key={index}
              name={isActive ? "star" : "star-outline"}  // نمایش ستاره روشن یا خام
              size={24}
              color={isActive ? '#D17842' : '#AEAEAE'}  // رنگ طلایی برای ستاره‌های روشن و خاکی برای خام
              className="mr-1"  // فاصله بین ستاره‌ها
            />
          ))}
        </View>

        {/* آیکون پروفایل در سمت راست */}
        <Ionicons
          name="person-circle"
          size={50}
          color="#AEAEAE"
          onPress={() => navigation.navigate('TabNavigations', { screen: 'profile' })} // هدایت به صفحه پروفایل
        />
      </View>

      {/* لیست تخفیفات */}
      <DiscountList />  

      {/* دسته بندی */}
      <Categorysliderlist />
    </View>
  );
}
