// src/types/types.ts
export interface Variant {
  id: string;
  name: string;    // «Красный», «Размер 42»
  price: number;   // цена в рублях
  stock: number;   // сколько осталось на складе
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;   // путь к картинке в public/
  addedAt: string; // дата добавления, формат "2025-10-15"
  variants: Variant[];
}

export interface DraftItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: DraftItem[];
}
