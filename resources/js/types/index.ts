export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  purchase_price: number;
  sale_price: number;
  stock_quantity: number;
  minimum_stock: number;
  barcode: string;
  image_path: string | null;
  image_url: string | null;
  category_id: number;
  category: Category;
  created_at: string;
  updated_at: string;
  isLowStock(): boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  products_count?: number;
}

export interface Transaction {
  id: number;
  product_id: number;
  user_id: number;
  type: 'in' | 'out';
  quantity: number;
  unit_price: number;
  total_price: number;
  purchase_price: number;
  sale_price: number;
  profit: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  product: Product;
  user: User;
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}
