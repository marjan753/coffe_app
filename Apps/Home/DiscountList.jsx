import React, { useState, useEffect } from 'react';
import { ScrollView, Image, View, ActivityIndicator, Text } from 'react-native';
import { fetchDiscountImages } from '../Server/getapi';  // وارد کردن متد fetchDiscountImages از getapi.js

export default function DiscountList() {
  const [discountImages, setDiscountImages] = useState([]);  // برای ذخیره تصاویر تخفیف
  const [loading, setLoading] = useState(true);  // وضعیت بارگذاری

  // دریافت URL تصاویر از Supabase
  const loadDiscountImages = async () => {
    setLoading(true);  // شروع بارگذاری
    const result = await fetchDiscountImages();  // فراخوانی متد جدید از getapi.js
    
    setLoading(false);  // پایان بارگذاری
    if (result.success) {
      setDiscountImages(result.data);  // ذخیره تصاویر تخفیف در state
    } else {
      console.error('Failed to fetch discount images');
    }
  };

  // استفاده از useEffect برای بارگذاری داده‌ها هنگام شروع کامپوننت
  useEffect(() => {
    loadDiscountImages(); // فراخوانی تابع برای دریافت داده‌ها
  }, []);

  return (
    <View style={{ marginVertical: 8 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#F39C12" /> // نمایش در حال بارگذاری
      ) : discountImages.length === 0 ? (
        <Text>هیچ تصویری برای نمایش وجود ندارد.</Text> // در صورتی که داده‌ها خالی باشند
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {discountImages.map((imageUrl, index) => (
            <View key={index} style={{ marginRight: 16, borderRadius: 10, overflow: 'hidden' }}>
              <Image
                source={{ uri: imageUrl }} // استفاده از URL تصویر از جدول
                style={{ width: 210, height: 150 }}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
