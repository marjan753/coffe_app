import supabase from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';


// ورود کاربر
export const loginOrSignUp = async (phoneNumber) => {
  const phoneRegex = /^(09)[0-9]{9}$/; // الگوی معتبر برای شماره موبایل ایرانی

  if (!phoneRegex.test(phoneNumber)) {
    throw new Error('.لطفا یک شماره موبایل معتبر وارد کنید');
  }

  try {
    // بررسی وجود شماره در جدول
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phoneNumber)
      .single(); // دریافت یک نتیجه اگر موجود باشد

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error('مشکلی در بررسی شماره تلفن پیش آمده است.');
    }

    if (existingUser) {
      // اگر شماره تلفن موجود باشد، دیگر هدایت به صفحه تایید را انجام ندهید
      return { success: false, message: 'این شماره قبلاً ثبت شده است.' };
    }

    // اگر شماره تلفن موجود نیست، اضافه کردن شماره
    const { data, error } = await supabase
      .from('users')
      .insert([{ phone: phoneNumber }]);

    if (error) {
      throw new Error('مشکلی در ذخیره شماره موبایل پیش آمده است.');
    }

    return { success: true, message: 'شماره موبایل با موفقیت ثبت شد!' };

  } catch (err) {
    throw new Error('مشکلی پیش آمده است. لطفا دوباره تلاش کنید.');
  }
};


// تابع برای دریافت uid بر اساس شماره موبایل
export const getUidByPhoneNumber = async (phoneNumber) => {
  const phoneRegex = /^(09)[0-9]{9}$/; // الگوی معتبر برای شماره موبایل ایرانی

  if (!phoneRegex.test(phoneNumber)) {
    throw new Error('.لطفا یک شماره موبایل معتبر وارد کنید');
  }

  try {
    // بررسی وجود شماره در جدول کاربران
    const { data: user, error } = await supabase
      .from('users') // جدول کاربران
      .select('uid') // فقط دریافت uid کاربر
      .eq('phone', phoneNumber) // شرط برای جستجوی شماره موبایل
      .single(); // دریافت یک نتیجه اگر موجود باشد

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // اگر کاربری با این شماره یافت نشد، مقدار null بر می‌گرداند
      }
      throw new Error('مشکلی در دریافت اطلاعات کاربر پیش آمده است.');
    }

    // اگر کاربر با شماره موبایل یافت شود، uid را باز می‌گرداند
    return user?.uid;
  } catch (err) {
    console.error('خطا در دریافت uid:', err.message);
    throw new Error('خطایی پیش آمده است. لطفاً دوباره تلاش کنید.');
  }
};

// تابع برای دریافت تصاویر تخفیف از سرور
export const fetchDiscountImages = async () => {
  try {
    const { data, error } = await supabase
      .from('discounts')  // نام جدول
      .select('image_url');  // دریافت فقط ستون URL تصاویر
  
    if (error) {
      console.error('Error fetching discount images:', error.message);
      return { success: false, data: [] };
    }
  
    const imageUrls = data.map((item) => item.image_url);  // استخراج URL تصاویر
    return { success: true, data: imageUrls };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { success: false, data: [] };
  }
};


export const fetchCategories = async () => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
};

export const fetchItemsByCategory = async (categoryId) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId);
  if (error) {
    console.error('Error fetching items:', error);
    return [];
  }
  return data;
};

// تابع برای دریافت آیتم‌ها به همراه قیمت تخفیف‌خورده
export const fetchAllItems = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId'); // فرض می‌کنیم که user_id در AsyncStorage ذخیره شده است
    const { data, error } = await supabase.rpc('get_products_with_discount', { user_id: userId }); // استفاده از تابع SQL که ایجاد کرده‌ایم
    if (error) {
      console.error('Error fetching all items:', error);
      return [];
    }
    console.log('Fetched items:', data); 
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};



  // متد برای به‌روزرسانی اطلاعات پروفایل
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('users') // نام جدول پروفایل
      .update(profileData) // اطلاعات پروفایل
      .eq('uid', userId); // شرط برای شناسایی کاربر

    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: 'خطا در به‌روزرسانی اطلاعات پروفایل' };
    }

    return { success: true, message: 'اطلاعات پروفایل با موفقیت به‌روزرسانی شد' };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, message: 'خطایی پیش آمد، لطفاً دوباره تلاش کنید' };
  }
};


// تابع برای دریافت پروفایل کاربر بر اساس userId
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users') // نام جدول کاربران
      .select('*') // دریافت تمامی اطلاعات پروفایل
      .eq('uid', userId) // جستجو بر اساس uid
      .single(); // دریافت یک نتیجه فقط

    if (error) {
      console.error('Error fetching user profile:', error.message);
      return { success: false, message: 'مشکلی در دریافت اطلاعات پروفایل پیش آمده است.' };
    }

    // اگر اطلاعات پروفایل موجود باشد
    return { success: true, data };
  } catch (err) {
    console.error('خطا در دریافت پروفایل:', err.message);
    return { success: false, message: 'خطایی پیش آمده است. لطفاً دوباره تلاش کنید.' };
  }
};


// استفاده از تابع برای دریافت سایزهای یک محصول
export const fetchProductSizesExample = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('sizes')
      .select('id, size_name, weight, price')
      .eq('product_id', productId);

  //  console.log('Fetched product sizes:', data);  // چاپ سایزهای دریافتی
    if (error) {
      console.error('Error fetching sizes:', error.message);
      throw new Error('خطا در دریافت سایزهای محصول.');
    }

    return data;  // بازگشت داده‌ها
  } catch (err) {
    console.error('Error in fetchProductSizesExample:', err.message);
    throw new Error('مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.');
  }
};








