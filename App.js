import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import "./global.css";

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Apps/Sign/Login';  
import Verification from './Apps/Sign/Verification'; 
import TabNavigations from './Apps/Navigations/Tabnavigation'; 
import paymentmethod from './Apps/Shoppingcard/paymentmethod';
import { I18nManager } from 'react-native';
import PaymentGateway from './Apps/Shoppingcard/paymentgateway';

// فعال‌سازی RTL
if (!I18nManager.isRTL) {
  I18nManager.forceRTL(true); // فعال‌سازی RTL
  I18nManager.allowRTL(true); // اجازه استفاده از RTL
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }}  // حذف نام صفحه از بالای صفحه Login
        />
        <Stack.Screen 
          name="Verification" 
          component={Verification} 
          options={{ headerShown: false }}  // حذف نام صفحه از بالای صفحه Verification
        />

        <Stack.Screen
          name="TabNavigations"
          component={TabNavigations}
          options={{ headerShown: false }} // حذف هدر پیش‌فرض
        />


<Stack.Screen 
          name="paymentmethod" 
          component={paymentmethod} 
          options={{ headerShown: false }}  // حذف نام صفحه از بالای صفحه Verification
        />


          <Stack.Screen
      name='PaymentGateway'
      component={PaymentGateway}
      options={{ headerShown: false }}/>

      </Stack.Navigator>

    
    </NavigationContainer>
  );
}

export default App;
