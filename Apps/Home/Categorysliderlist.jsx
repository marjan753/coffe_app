import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../Server/getapi'; // تابع برای دریافت دسته‌بندی‌ها
import ItemList from './ItemList'; // کامپوننت آیتم‌ها

export default function CategorySliderList() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // دسته انتخاب شده
  const [loading, setLoading] = useState(false);

   // دریافت دسته‌بندی‌ها از سرور
   useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const data = await fetchCategories();

      // مرتب‌سازی: ابتدا گزینه "همه" با id=5، سپس بقیه دسته‌بندی‌ها به ترتیب id
      const sortedCategories = [
        ...data.filter((category) => category.id === 5), // "همه"
        ...data.filter((category) => category.id !== 5).sort((a, b) => a.id - b.id), // باقی دسته‌ها به ترتیب id
      ];

      setCategories(sortedCategories);
      setSelectedCategory(5); // انتخاب پیش‌فرض "همه"
      setLoading(false);
    };

    getCategories();
  }, []);

  return (
    <View style={{ flex: 1, padding: 8 }}>
      {/* دسته‌بندی‌ها */}
      <FlatList
        data={categories}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id?.toString() ?? 'null'}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(item.id)}
            style={{ alignItems: 'center', marginHorizontal: 10 }}
          >
            <Text
              style={{
                fontSize: 16, 
                color: selectedCategory === item.id ? '#D17842' : '#AEAEAE',
              }}
            >
              {item.name}
            </Text>
            {selectedCategory === item.id && (
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#D17842',
                  marginTop: 4,
                }}
              />
            )}
          </TouchableOpacity>
        )}
        // تغییر ترتیب نمایش برای راست‌چین
        inverted={true} // این ویژگی باعث می‌شود که دسته‌بندی‌ها از راست به چپ نمایش داده شوند
      />

      {/* Loader */}
      {loading && <ActivityIndicator size="large" color="#D17842" style={{ marginTop: 20 }} />}

      {/* لیست آیتم‌ها */}
  
        <ItemList selectedCategory={selectedCategory} />
      
    </View>
  );
}
