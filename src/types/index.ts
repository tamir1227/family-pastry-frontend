// src/types/index.ts

export type UserRole = 'B2C' | 'B2B' | 'ADMIN' | 'DELIVERY';

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  b2bProfile: B2BProfile | null;
}

export interface B2BProfile {
  businessName: string;
  creditLimit: string;
  creditAvailable: string;
  moqAmount: string;
  route: {
    name: string;
    deliveryTime: string;
  } | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  category: string;
  price: number;
  retailPrice?: number;
  priceType: 'retail' | 'wholesale' | 'custom';
  unit: string;
  dailyCapacity: number | null;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product?: {
    name: string;
    unit: string;
  };
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PRODUCTION'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  orderType: 'B2C' | 'B2B';
  status: OrderStatus;
  deliveryDate: string;
  deliveryAddress: string | null;
  subtotal: string;
  totalAmount: string;
  paymentStatus: 'UNPAID' | 'PAID' | 'CREDIT';
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}