import { View, Text, TouchableOpacity,Alert } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createOrderFromCart} from '../Server/getapi';
import {  useNavigation } from '@react-navigation/native';

export default function PaymentGateway() {

    const navigation = useNavigation();

const handleConfirmPayment=async()=>{
   

  try {
    

const userId = await AsyncStorage.getItem('userId');
console.log("userId:", userId); // بررسی مقدار
if(!userId){
   
   Alert.alert('خطا', 'شناسه کاربر یافت نشد');
  return;

}

const order=await createOrderFromCart(userId);

 Alert.alert('موفقیت', '.سفارش شما با موفقیت ثبت شد');
    navigation.navigate('history', { orderId: order.id });

  } catch (error) {
     Alert.alert('خطا', error.message || 'ثبت سفارش با مشکل مواجه شد');
  }





};


    
  return (
    <View className="flex-1 bg-customblack justify-center items-center px-4">
      <Text className="text-white text-xl mb-6">💳 شبیه‌سازی درگاه پرداخت</Text>
<TouchableOpacity className="w-full h-12 bg-customButton justify-center items-center rounded-full mt-6"onPress={handleConfirmPayment}  >
<Text className="text-white text-lg font-semibold">تایید</Text>
</TouchableOpacity>
    </View>
  );
}


