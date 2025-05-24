import { View, Text, ScrollView, TouchableOpacity  } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserOrders } from '../Server/getapi';
import jalaali from 'jalaali-js';
import { useNavigation } from '@react-navigation/native';

export default function History() {


  const [orders, setOrders] = useState([]);
 const navigation = useNavigation();


  const toJalali = (dateString) => {
    const date = new Date(dateString);
    const j = jalaali.toJalaali(date);
    return `${j.jy}/${j.jm.toString().padStart(2, '0')}/${j.jd.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        const result = await getUserOrders(userId);
        setOrders(result);
      } catch (error) {
        console.error('خطا در دریافت سفارشات:', error.message);
      }
    };

    fetchOrders();
  }, []);


  return (
    <View className="flex-1 bg-customblack px-4 py-4">
      {/* کارت وضعیت کاربر */}
      <View className="flex-[0.3] bg-customgrayL rounded-2xl shadow-md p-4 mb-4 mt-5">
        <Text className="text-lg font-semibold text-customButton text-right">وضعیت کاربر</Text>
        <ScrollView>
        
        </ScrollView>
      </View>

      {/* کارت سفارشات */}
      <View className="flex-[0.7] bg-customgrayL rounded-2xl shadow-md p-4">
        <Text className="text-lg font-semibold text-customButton text-right">سفارشات</Text>
        <ScrollView className="mt-4">
          {orders.map((order) => (
  <TouchableOpacity
    key={order.id}
    className="bg-customgrayM rounded-xl p-4 mb-3"
    onPress={() => navigation.navigate('OrderItem', { orderId: order.id })}
  >
    <Text className="text-customButton text-right font-bold mb-3">سفارش {order.id}</Text>
    <Text className="text-base font-bold text-white text-right mb-3">
      مبلغ : {order.total_price.toLocaleString()} تومان
    </Text>
    <Text className="text-base font-bold text-white text-right mb-3">
      تاریخ : {toJalali(order.created_at)}
    </Text>
  </TouchableOpacity>
))}
        </ScrollView>
      </View>
    </View>
  );
}
