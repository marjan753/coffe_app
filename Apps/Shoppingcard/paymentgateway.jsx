import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

export default function PaymentGateway() {




    
  return (
    <View className="flex-1 bg-customblack justify-center items-center px-4">
      <Text className="text-white text-xl mb-6">💳 شبیه‌سازی درگاه پرداخت</Text>
<TouchableOpacity className="w-full h-12 bg-customButton justify-center items-center rounded-full mt-6" onPress={handlepay} >
<Text className="text-white text-lg font-semibold">تایید</Text>
</TouchableOpacity>
    </View>
  );
}


