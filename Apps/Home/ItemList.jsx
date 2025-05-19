import { View, FlatList, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchItemsByCategory, fetchAllItems } from '../Server/getapi';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ItemList = ({ selectedCategory }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]); // مدیریت لیست سبد خرید محلی

  // دریافت آیتم‌ها بر اساس دسته‌بندی انتخاب‌شده
  useEffect(() => {
    const getItems = async () => {
      setLoading(true);

      let data;
      if (selectedCategory === 5) {
        data = await fetchAllItems();
      } else {
        data = await fetchItemsByCategory(selectedCategory);
      }

      setItems(data);
      setLoading(false);
    };

    getItems();
  }, [selectedCategory]);

 // افزودن آیتم به سبد خرید و ذخیره در AsyncStorage
const handleAddToCart = async (item) => {
  try {
    // دریافت سبد خرید فعلی از AsyncStorage
    const existingCart = await AsyncStorage.getItem('cart');
    const cartItems = existingCart ? JSON.parse(existingCart) : [];

    // بررسی اینکه آیا آیتم از قبل در سبد خرید هست
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    if (existingItemIndex !== -1) {
      // اگر آیتم وجود داشت، مقدار quantity را افزایش می‌دهیم
      cartItems[existingItemIndex].quantity += 1;
    } else {
      // اگر آیتم جدید بود، به سبد خرید اضافه می‌شود
      cartItems.push({ ...item, quantity: 1 });
    }

    // ذخیره مجدد لیست جدید در AsyncStorage
    await AsyncStorage.setItem('cart', JSON.stringify(cartItems));

    // بروز رسانی state سبد خرید در اپ
    setCart(cartItems);

    Alert.alert('موفقیت', 'آیتم به سبد خرید اضافه شد.');
  } catch (error) {
    console.error('خطا در افزودن به سبد خرید:', error);
    Alert.alert('خطا', 'مشکلی پیش آمد، لطفاً دوباره تلاش کنید.');
  }
};

  if (loading) {
    return <ActivityIndicator size="large" color="#f57c00" style={{ marginTop: 20 }} />;
  }

  if (items.length === 0) {
    return (
      <Text className="text-center text-lg mt-5 text-white">
        هیچ آیتمی برای این دسته‌بندی وجود ندارد.
      </Text>
    );
  }

  // کارت آیتم
  const renderItem = ({ item }) => (
    <View className="w-[48%] bg-customgrayL rounded-lg p-2 mb-4">
      {/* عکس آیتم */}
      <Image source={{ uri: item.image_url }} className="w-full h-36 rounded-lg mb-3" />
  
      {/* متن‌ها */}
      <Text className="text-lg font-bold text-white mb-1">{item.title}</Text>
      <Text className="text-sm text-gray-300 mb-3">{item.description}</Text>
  
      {/* قیمت و دکمه افزودن */}
      <View className="flex-row justify-between items-center border-t border-gray-600 pt-2">
        <View>
         
          <Text className="text-base font-bold text-white line-through">{item.price} T</Text> {/* قیمت اصلی با خط خورده */}
          <Text className="text-base font-bold text-white">{item.discounted_price} T</Text> {/* قیمت تخفیف‌خورده */}
        </View>
        <TouchableOpacity
          className="w-8 h-8 rounded-full bg-customButton flex items-center justify-center"
          onPress={() => handleAddToCart(item)} // اضافه کردن آیتم
        >
          <Text className="text-white text-xl font-bold">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        flexWrap: 'wrap', // جلوگیری از تجمع در وسط
      }}
      contentContainerStyle={{
        direction: 'rtl',
        paddingHorizontal: 10,
        flexGrow: 1, // فضای باقی‌مانده پایین لیست
        justifyContent: 'flex-start', // آیتم‌ها به بالای صفحه می‌چسبند
      }}
    />
  );
};

export default ItemList;
