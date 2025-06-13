import { Product as ProductType } from '@/types';

export class Product implements ProductType {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  minimum_stock: number;
  barcode: string;
  image_path: string | null;
  category_id: number;
  category: any; // Using any for now since we don't need the full Category type
  created_at: string;
  updated_at: string;

  constructor(data: ProductType) {
    Object.assign(this, data);
  }

  isLowStock(): boolean {
    return this.stock_quantity <= this.minimum_stock;
  }
}
