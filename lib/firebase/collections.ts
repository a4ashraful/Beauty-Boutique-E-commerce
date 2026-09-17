import { collection } from 'firebase/firestore';
import { db } from './client';

export const usersCol          = collection(db, 'users');
export const productsCol       = collection(db, 'products');
export const categoriesCol     = collection(db, 'categories');
export const brandsCol         = collection(db, 'brands');
export const ordersCol         = collection(db, 'orders');
export const couponsCol        = collection(db, 'coupons');
export const bannersCol        = collection(db, 'banners');
export const reviewsCol        = collection(db, 'reviews');
export const deliveryZonesCol  = collection(db, 'deliveryZones');
export const notificationsCol  = collection(db, 'notifications');
export const settingsCol       = collection(db, 'settings');