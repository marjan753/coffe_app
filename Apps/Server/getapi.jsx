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
    throw new Error('مشکلی پیش آمده است. لطفا اینترنت خود را چک کنید و  دوباره تلاش کنید.');
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
  const id = parseInt(categoryId, 10);

  if (isNaN(id)) {
    console.error('Invalid categoryId:', categoryId);
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', id);

  if (error) {
    console.error('Error fetching items:', error);
    return [];
  }

  return data;
};


export const fetchAllItems = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*'); // همه فیلدها شامل image_url

    if (error) {
      console.error('Error fetching all items:', error);
      return [];
    }

    
    return data;

  } catch (error) {
    console.error('Unexpected error fetching items:', error);
    return [];
  }
};


// تابع برای دریافت آیتم‌ها به همراه قیمت تخفیف‌خورده
/*export const fetchAllItems = async () => {
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
};*/



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


// فرستادن سبد خرید به سفارشات سمت سرور
export const createOrderFromCart = async (userId) => {
  try {
    const cartKey = `cart_${userId}`;
    console.log("Cart key for reading:", cartKey);

    const cart = await AsyncStorage.getItem(cartKey);
    if (!cart) throw new Error('سبد خرید یافت نشد');

    const parsed = JSON.parse(cart);
    const cartItems = parsed.items || [];
    const total_price = parsed.total_price || 0;

    if (cartItems.length === 0) throw new Error('سبد خرید خالی است');

    // ایجاد سفارش در جدول orders
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          status: 'paid', // فرض بر این است که پرداخت انجام شده
          total_price,
        },
      ])
      .select()
      .single();

    if (orderError) throw new Error('خطا در ایجاد سفارش: ' + orderError.message);

    // ساخت آرایه order_items فقط برای سایزهای دارای quantity > 0
    const orderItems = cartItems.flatMap((item) =>
      item.sizes
        .filter((size) => size.quantity > 0)
        .map((size) => ({
          order_id: orderData.id,
          product_id: item.id,
          size_id: size.id,
          quantity: size.quantity,
          price: size.price,
        }))
    );

    if (orderItems.length === 0) {
      throw new Error('هیچ آیتمی برای ثبت در سفارش وجود ندارد.');
    }

    // ثبت آیتم‌ها در جدول order_items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw new Error('خطا در ذخیره آیتم‌های سفارش: ' + itemsError.message);

    // حذف سبد خرید از AsyncStorage بعد از موفقیت
    await AsyncStorage.removeItem(cartKey);

    return orderData;

  } catch (error) {
    console.error('خطا در ایجاد سفارش:', error);
    throw error;
  }
};

//دریافت فاکتور سفارشاتاز سرور
export const getUserOrders = async (user_id) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) throw new Error('دریافت اطلاعات ناموفق');
  return data;
};


// گرفتن آیتم‌های مربوط به یک فاکتور خاص
export const getOrderItems = async (orderId) => {
  const { data, error } = await supabase
    .from('order_items')
    .select(`
      id,
      quantity,
      price,
      total_price,
      product:products (
        id,
        title,
        description,
        image_url
      ),
      size:sizes (
        id,
        size_name,
        weight,
        price
      )
    `)
    .eq('order_id', orderId);

  if (error) throw new Error(error.message);
  return data;
};



