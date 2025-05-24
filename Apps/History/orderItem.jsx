import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { getOrderItems } from '../Server/getapi';

export default function OrderItem() {
  const [ordersItem, setOrdersItem] = useState([]);
  const route = useRoute();
  const orderId = route?.params?.orderId;

  useEffect(() => {
    const fetchOrderItem = async () => {
      try {
        if (!orderId) return;
        const result = await getOrderItems(orderId);
        setOrdersItem(result);
      } catch (error) {
        console.error('خطا در دریافت آیتم‌های سفارش:', error.message);
      }
    };

    fetchOrderItem();
  }, [orderId]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
     <Image source={{uri:item.product?.image_url}} className="w-full h-36 rounded-lg mb-3"></Image>
    <Text className="text-white font-bold">محصول: {item.product?.title}</Text>
    <Text className="text-white">توضیح: {item.product?.description}</Text>
    <Text className="text-white">سایز: {item.size?.size_name} - {item.size?.weight} گرم</Text>
    <Text className="text-white">تعداد: {item.quantity}</Text>
    <Text className="text-white">قیمت واحد: {item.price.toLocaleString()} تومان</Text>
    <Text className="text-white">قیمت کل: {item.total_price.toLocaleString()} تومان</Text>
    </View>
  );

  return (
    <View style={styles.page}>
      <FlatList
        data={ordersItem}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.container}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0C0F14', // پس‌زمینه مشکی برای کل صفحه
    padding: 10,
  },
  container: {
    paddingBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#252A32',
    borderRadius: 12,
    padding: 10,
    flex: 0.48,
    alignItems: 'center',
  },
 
});
