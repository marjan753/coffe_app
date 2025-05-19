import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchProductSizesExample } from '../Server/getapi';

const Shopping = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // دریافت سبد خرید از AsyncStorage
  const fetchCartData = async () => {
    try {
      setLoading(true);
      const cart = await AsyncStorage.getItem('cart');
      const parsedCart = cart ? JSON.parse(cart) : [];

      const updatedCart = await Promise.all(parsedCart.map(async (item) => {
        const fetchedSizes = await loadSizes(item.id);
        const mergedSizes = fetchedSizes.map((size) => {
          const existingSize = item.sizes?.find((s) => s.id === size.id);
          return existingSize ? { ...size, quantity: existingSize.quantity || 0 } : { ...size, quantity: 0 };
        });
        return { ...item, sizes: mergedSizes };
      }));

      setCartData(updatedCart);
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setCartData([]);
    } finally {
      setLoading(false);
    }
  };

  // بارگذاری سایزهای محصولات از سرور
  const loadSizes = async (productId) => {
    try {
      const fetchedSizes = await fetchProductSizesExample(productId);
      return fetchedSizes;
    } catch (error) {
      console.error('خطا در دریافت سایزها:', error.message);
      return [];
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCartData();
    }, [])
  );

  // ذخیره سبد خرید در AsyncStorage
  const saveCartData = async (updatedCart) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartData(updatedCart);
    } catch (error) {
      console.error('Error saving cart data:', error);
    }
  };

  // تغییر تعداد بسته‌ها
  const handleQuantityChange = async (itemId, sizeId, newQuantity) => {
    if (newQuantity < 0) {
      Alert.alert('خطا', 'تعداد نمی‌تواند کمتر از ۱ باشد.');
      return;
    }

    const updatedCart = cartData.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          sizes: item.sizes.map((size) =>
            size.id === sizeId ? { ...size, quantity: newQuantity } : size
          ),
        };
      }
      return item;
    });

    await saveCartData(updatedCart);
  };

  // محاسبه جمع کل قیمت
  const calculateTotalPrice = () => {
    if (!cartData || cartData.length === 0) return 0;

    return cartData.reduce((total, item) => {
      if (!item.sizes || item.sizes.length === 0) return total;
      return total + item.sizes.reduce((subTotal, size) => {
        return subTotal + (size.price * (size.quantity || 0));
      }, 0);
    }, 0);
  };

  // حذف محصول از سبد خرید
  const handleRemoveItem = async (itemId) => {
    const updatedCart = cartData.filter((item) => item.id !== itemId);
    await saveCartData(updatedCart);
  };

  // چک کردن اینکه از هر محصول حداقل از یک سایز یک بسته انتخاب شده باشد
  const validateCart = () => {
    for (const item of cartData) {
      const selectedSize = item.sizes.some((size) => size.quantity > 0);
      if (!selectedSize) {
        Alert.alert('خطا', `لطفاً برای محصول "${item.title}" حداقل یک سایز را انتخاب کنید.`);
        return false;
      }
    }
    return true;
  };

  const handleConfirm = () => {
    const isValid = validateCart();
    if (isValid) {
      navigation.navigate('paymentmethod');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-customblack">
        <ActivityIndicator size="large" color="#f57c00" />
        <Text className="text-white mt-2">در حال بارگذاری...</Text>
      </View>
    );
  }

  if (cartData.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-customblack">
        <Text className="text-white">هیچ سفارشی در سبد خرید شما نیست.</Text>
      </View>
    );
  }

  // کامپوننت آیتم سبد خرید
  const CartItem = ({ item }) => {
    const handleQuantityChangeLocal = (sizeId, newQuantity) => {
      if (newQuantity < 0) return;

      const updatedSizes = item.sizes.map((size) =>
        size.id === sizeId ? { ...size, quantity: newQuantity } : size
      );

      item.sizes = updatedSizes;
      handleQuantityChange(item.id, sizeId, newQuantity);
    };

    return (
      <View className="bg-customgrayL p-4 rounded-lg mb-5 mt-5">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 }}>
          <View style={{ marginRight: 10 }}>
            <Text className="text-lg font-bold text-white">{item.title}</Text>
            <Text className="text-sm text-gray-300">{item.description}</Text>
          </View>
          <Image source={{ uri: item.image_url }} className="w-20 h-20 rounded-lg" />
        </View>

        {item.sizes.map((size) => (
          <View key={size.id} className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => handleQuantityChangeLocal(size.id, size.quantity - 1)} className="w-8 h-8 bg-customButton justify-center items-center rounded-lg">
                <Text className="text-white text-lg">-</Text>
              </TouchableOpacity>

              <TextInput
                value={String(size.quantity)}
                editable={false}
                className="w-10 h-8 bg-customblack mx-1 text-center text-white rounded-lg"
                style={{
                  borderColor: '#D17842',
                  borderWidth: 2,
                  fontSize: 16,
                  paddingVertical: 2,
                }}
              />

              <TouchableOpacity onPress={() => handleQuantityChangeLocal(size.id, size.quantity + 1)} className="w-8 h-8 bg-customButton justify-center items-center rounded-lg">
                <Text className="text-white text-lg">+</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-white">
              {size.size_name} ({size.weight} kg): {size.price} تومان
            </Text>
          </View>
        ))}

        {/* دکمه حذف */}
        <TouchableOpacity 
          onPress={() => handleRemoveItem(item.id)} 
          className="absolute top-2 left-2 w-8 h-8 bg-red-500 justify-center items-center rounded-full"
        >
          <Text className="text-customblack text-xl">×</Text>
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <View className="flex-1 bg-customblack px-4 mt-6">
      <FlatList
        data={cartData}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          جمع کل: {calculateTotalPrice()} تومان
        </Text>
        <TouchableOpacity
          className="w-32 h-12 bg-customButton justify-center items-center rounded-full"
          onPress={handleConfirm} // تایید
        >
          <Text className="text-white font-semibold text-lg">تایید</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Shopping;
