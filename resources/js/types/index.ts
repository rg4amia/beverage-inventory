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
  stock_quantity: number;
  minimum_stock: number;
  barcode: string;
  image_path: string | null;
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
  type: 'in' | 'out';
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
  product_id: number;
  product: Product;
  user_id: number;
  user: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}
