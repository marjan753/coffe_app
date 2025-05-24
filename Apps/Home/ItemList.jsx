import { View, FlatList, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchItemsByCategory, fetchAllItems } from '../Server/getapi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ItemList = ({ selectedCategory }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
  const getItems = async () => {
    if (selectedCategory === null || selectedCategory === undefined) return;

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


  const handleAddToCart = async (item) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('خطا', 'کاربر شناسایی نشد');
        return;
      }

      const cartKey = `cart_${userId}`;
      const existingCart = await AsyncStorage.getItem(cartKey);
      const parsedCart = existingCart ? JSON.parse(existingCart) : { items: [], total_price: 0 };

      const cartItems = parsedCart.items;

      const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += 1;
      } else {
        cartItems.push({ ...item, quantity: 1 });
      }

      const total_price = cartItems.reduce((sum, item) => sum + (item.discounted_price * item.quantity), 0);

      const updatedCart = {
        items: cartItems,
        total_price
      };

      await AsyncStorage.setItem(cartKey, JSON.stringify(updatedCart));
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

  const renderItem = ({ item }) => (
    <View className="w-[48%] bg-customgrayL rounded-lg p-2 mb-4">
      <Image source={{ uri: item.image_url }} className="w-full h-36 rounded-lg mb-3" />
      <Text className="text-lg font-bold text-white mb-1 text-right">{item.title}</Text>
      <Text className="text-sm text-gray-300 mb-3 text-right">{item.description}</Text>
      <View className="flex-row justify-between items-center border-t border-gray-600 pt-2">
        <View>
          <Text className="text-base font-bold text-white line-through">{item.price} T</Text>
          <Text className="text-base font-bold text-white">{item.discounted_price} T</Text>
        </View>
        <TouchableOpacity
          className="w-8 h-8 rounded-full bg-customButton flex items-center justify-center"
          onPress={() => handleAddToCart(item)}
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
      columnWrapperStyle={{ flexDirection: 'row-reverse', justifyContent: 'space-between', flexWrap: 'wrap' }}
      contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1, justifyContent: 'flex-start' }}
    />
  );
};

export default ItemList;
