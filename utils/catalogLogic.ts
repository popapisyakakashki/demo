// src/utils/catalogLogic.ts
import type { Product } from '../types';

export const SALE_DISCOUNT = 0.25; // скидка 25%
export const LOW_STOCK_LIMIT = 5;  // остаток 1–5 шт. считаем «мало»

export type ShopVariantName = 'variantA' | 'variantB';

/** Скидка 25% (пока эмулируем: variantA — со скидкой) */
export function isSale(shopVariant: ShopVariantName): boolean {
  return shopVariant === 'variantA';
}

/** Финальная цена: базовая цена со скидкой или без */
export function getVariantPrice(basePrice: number, sale: boolean): number {
  return sale ? Math.round(basePrice * (1 - SALE_DISCOUNT)) : basePrice;
}

export type StockLevel = 'many' | 'few' | 'out';

export function getStockLevel(quantity: number): StockLevel {
  if (quantity <= 0) return 'out';
  if (quantity <= LOW_STOCK_LIMIT) return 'few';
  return 'many';
}

export function getStockLabel(quantity: number): string {
  const level = getStockLevel(quantity);
  if (level === 'out') return 'Нет в наличии';
  return level === 'few' ? 'Мало' : 'Много';
}

/** Суммарный остаток товара по всем размерам */
export function getTotalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.quantity, 0);
}

/** Возвращает текст ошибки или null, если всё ок */
export function validateQuantity(stock: number, qty: number): string | null {
  if (!Number.isInteger(qty) || qty < 1) {
    return 'Количество должно быть целым числом не меньше 1';
  }
  if (qty > stock) {
    return `Доступно только ${stock} шт.`;
  }
  return null;
}

/** 5600 → "5 600 ₽" */
export function formatPrice(price: number): string {
  return `${price.toLocaleString('ru-RU')} ₽`;
}
