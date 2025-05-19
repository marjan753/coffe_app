import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function PaymentMethod() {

const navigation = useNavigation();


const handleCashPayment =()=>{
navigation.navigate('PaymentGateway');

};
 const handleInstallment=()=>{
 Alert.alert('فعلاً امکان خرید اقساطی فعال نیست.');
 };





  return (
    <View className="flex-1 bg-customblack items-center justify-center px-4">
      <Text className="text-white text-xl mb-6">روش پرداخت را انتخاب کنید.</Text>

      {/* دکمه خرید نقدی */}
      <TouchableOpacity className="w-full h-12 bg-customButton justify-center items-center rounded-full mt-6" onPress={handleCashPayment}>
        <Text className="text-white text-lg font-semibold">💰 خرید نقدی</Text>
        
      </TouchableOpacity>

      {/* دکمه خرید اقساطی */}
      <TouchableOpacity className="w-full h-12 bg-customButton justify-center items-center rounded-full mt-6" onPress={handleInstallment}>
        <Text className="text-white text-lg font-semibold">📆 خرید اقساطی</Text>
      
      </TouchableOpacity>
    </View>
  );
}
