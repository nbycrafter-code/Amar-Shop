export interface Product {
  id: string;
  name: string;
  nameBn?: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  description: string;
  descriptionBn?: string;
  image: string;
  multiImages?: string[];
  video?: string;
  sales: number;
  status?: 'Active' | 'Inactive';
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  itemCount: number;
  status?: 'Active' | 'Inactive';
}

export interface Brand {
  id: string;
  name: string;
  nameBn: string;
  country: string;
  status?: 'Active' | 'Inactive';
}

export interface Size {
  id: string;
  name: string;
  status?: 'Active' | 'Inactive';
}

export interface Color {
  id: string;
  name: string;
  nameBn: string;
  hex: string;
  status?: 'Active' | 'Inactive';
}

export interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: 'Delivered' | 'Processing' | 'Cancelled';
  date: string;
}

export const initialCategories: Category[] = [
  { id: '1', name: 'Men\'s Clothing', nameBn: 'ছেলেদের পোশাক', itemCount: 45, status: 'Active' },
  { id: '2', name: 'Women\'s Fashion', nameBn: 'মেয়েদের পোশাক', itemCount: 68, status: 'Active' },
  { id: '3', name: 'Footwear', nameBn: 'জুতো', itemCount: 24, status: 'Active' },
  { id: '4', name: 'Electronics & Gadgets', nameBn: 'ইলেকট্রনিক্স ও গ্যাজেটস', itemCount: 32, status: 'Active' },
  { id: '5', name: 'Traditional Wear', nameBn: 'ঐতিহ্যবাহী পোশাক', itemCount: 18, status: 'Active' },
];

export const initialBrands: Brand[] = [
  { id: '1', name: 'Aarong', nameBn: 'আড়ং', country: 'Bangladesh', status: 'Active' },
  { id: '2', name: 'Apex', nameBn: 'এপেক্স', country: 'Bangladesh', status: 'Active' },
  { id: '3', name: 'Le Reve', nameBn: 'লা রিভ', country: 'Bangladesh', status: 'Active' },
  { id: '4', name: 'Nike', nameBn: 'নাইকি', country: 'USA', status: 'Active' },
  { id: '5', name: 'Sony', nameBn: 'সনি', country: 'Japan', status: 'Active' },
];

export const initialSizes: Size[] = [
  { id: '1', name: 'S', status: 'Active' },
  { id: '2', name: 'M', status: 'Active' },
  { id: '3', name: 'L', status: 'Active' },
  { id: '4', name: 'XL', status: 'Active' },
  { id: '5', name: 'XXL', status: 'Active' },
  { id: '6', name: '40 (Shoe)', status: 'Active' },
  { id: '7', name: '42 (Shoe)', status: 'Active' },
];

export const initialColors: Color[] = [
  { id: '1', name: 'Crimson Red', nameBn: 'ক্রিমসন লাল', hex: '#DC2626', status: 'Active' },
  { id: '2', name: 'Navy Blue', nameBn: 'নেভি ব্লু', hex: '#1E3A8A', status: 'Active' },
  { id: '3', name: 'Forest Green', nameBn: 'ফরেস্ট সবুজ', hex: '#047857', status: 'Active' },
  { id: '4', name: 'Charcoal Black', nameBn: 'চারকোল কালো', hex: '#111827', status: 'Active' },
  { id: '5', name: 'Royal Gold', nameBn: 'রয়্যাল সোনালী', hex: '#D97706', status: 'Active' },
];

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Panjabi - Navy Blue',
    price: 2450,
    stock: 120,
    category: 'Traditional Wear',
    brand: 'Aarong',
    sizes: ['M', 'L', 'XL'],
    colors: ['#1E3A8A', '#111827'],
    description: 'Beautifully embroidered cotton panjabi perfect for Eid festivals.',
    image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&q=80&w=600',
    sales: 85,
    status: 'Active'
  },
  {
    id: '2',
    name: 'Elegant Georgette Saree',
    price: 4800,
    stock: 45,
    category: 'Women\'s Fashion',
    brand: 'Le Reve',
    sizes: ['L'],
    colors: ['#DC2626', '#D97706'],
    description: 'Classic crimson red georgette saree with golden border design.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
    sales: 32,
    status: 'Active'
  },
  {
    id: '3',
    name: 'Men\'s Running Sneakers',
    price: 3600,
    stock: 80,
    category: 'Footwear',
    brand: 'Nike',
    sizes: ['40 (Shoe)', '42 (Shoe)'],
    colors: ['#111827'],
    description: 'High performance breathable sneakers with advanced sole tech.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    sales: 110,
    status: 'Active'
  },
  {
    id: '4',
    name: 'Wireless Noise-Cancelling Headphones',
    price: 8500,
    stock: 25,
    category: 'Electronics & Gadgets',
    brand: 'Sony',
    sizes: ['S'],
    colors: ['#111827'],
    description: 'Premium over-ear wireless headphones with incredible bass.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    sales: 42,
    status: 'Active'
  }
];

export const initialOrders: Order[] = [
  { id: 'ORD-8921', customer: 'Karim Ahmed', items: 2, total: 4900, status: 'Delivered', date: '2026-03-01' },
  { id: 'ORD-8922', customer: 'Nusrat Jahan', items: 1, total: 4800, status: 'Processing', date: '2026-03-02' },
  { id: 'ORD-8923', customer: 'Rafiqul Islam', items: 3, total: 8200, status: 'Delivered', date: '2026-03-03' },
  { id: 'ORD-8924', customer: 'Farzana Rimi', items: 1, total: 3600, status: 'Cancelled', date: '2026-03-04' },
];
