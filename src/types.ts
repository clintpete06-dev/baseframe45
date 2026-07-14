/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  sizes: number[];
  colors: string[];
  colorsHex?: string[]; // Corresponding hex codes for the elegant dynamic palette switcher
  category: 'Sneakers' | 'Luxury' | 'Boots' | 'Casual'| 'New Arrivals' | 'Sale';
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isSale?: boolean;
  isFeatured?: boolean;
  discount?: number;
  shoeCode: string; // SKU e.g., "BF-NKE-AM90-01"
  specifications: Record<string, string>;
  reviews: Review[];
}

export interface CartItem {
  id: string; // Dynamic ID compound of productId + size + color
  product: Product;
  selectedSize: number;
  selectedColor: string;
  quantity: number;
}

export interface ProductFilter {
  brands: string[];
  sizes: number[];
  style: string[]; // ['Sneakers', 'Luxury', 'Boots', 'Casual']
  colors: string[];
  minPrice: number;
  maxPrice: number;
  age: string[]; // ['Classic', 'Modern', 'Futuristic']
}

export type SortOption = 'Recommended' | 'Newest' | 'Price: Low to High' | 'Price: High to Low' | 'Best Selling';

export interface AppState {
  currentPath: string; // E.g., "", "nike", "product/1"
  searchQuery: string;
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  selectedProduct: Product | null;
  filters: ProductFilter;
  sortBy: SortOption;
  isCartOpen: boolean;
  isAuthenticated: boolean;
  userEmail: string | null;
}
