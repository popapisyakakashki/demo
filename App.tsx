// src/App.tsx
import { useState } from 'react';
import mockData from './data/mockData.json';
import {
  isSale, getVariantPrice, formatPrice, getTotalStock, getStockLabel,
} from './utils/catalogLogic';
import type { MockData, Product } from './types';

const data = mockData as MockData;
const shop = data.variantA; // пока работаем с каталогом обуви

// уникальные категории для выпадающего списка
const categories = [...new Set(shop.products.map((p) => p.category_name))];

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);

  // фильтрация: поиск по названию + выбранная категория
  const q = query.trim().toLowerCase();
  let visible = shop.products.filter((p) => {
    const byQuery = !q || p.name.toLowerCase().includes(q);
    const byCategory = category === 'all' || p.category_name === category;
    return byQuery && byCategory;
  });

  // сортировка по цене (со скидкой)
  if (sortDir) {
    const sale = isSale('variantA');
    visible = [...visible].sort((a, b) => {
      const pa = getVariantPrice(a.base_price, sale);
      const pb = getVariantPrice(b.base_price, sale);
      return sortDir === 'asc' ? pa - pb : pb - pa;
    });
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f4f6f9', minHeight: '100vh' }}>
      {/* ШАПКА */}
      <header
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', padding: '12px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700 }}>{shop.companyName}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600 }}>Гость</div>
            <div style={{ fontSize: 13, color: '#666' }}>не авторизован</div>
          </div>
          <button style={btnBlue}>Заказы</button>
          <button style={btnDark}>Войти</button>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>
        <h1 style={{ fontSize: 22, margin: '0 0 16px' }}>{shop.catalogTitle}</h1>

        {/* ПАНЕЛЬ ФИЛЬТРОВ */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input
            placeholder="Поиск по названию..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={input}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
            <option value="all">Все категории</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={sortDir ?? ''}
            onChange={(e) => setSortDir(e.target.value === '' ? null : (e.target.value as 'asc' | 'desc'))}
            style={input}
          >
            <option value="">Без сортировки</option>
            <option value="asc">Цена: по возрастанию</option>
            <option value="desc">Цена: по убыванию</option>
          </select>
        </div>

        {/* СЕТКА КАРТОЧЕК */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {visible.length === 0 && <p>Ничего не найдено</p>}
        </div>
      </main>
    </div>
  );
}

// КАРТОЧКА ТОВАРА
function ProductCard({ product }: { product: Product }) {
  const sale = isSale('variantA');
  const finalPrice = getVariantPrice(product.base_price, sale);
  const total = getTotalStock(product);
  const label = getStockLabel(total);
  const isLow = label === 'Мало';

  return (
    <div
      style={{
        display: 'flex', gap: 16, alignItems: 'center',
        background: isLow ? '#fdecec' : '#fff',
        border: isLow ? '1px solid #f5b5b5' : '1px solid #e0e4ea',
        borderRadius: 8, padding: 16,
      }}
    >
      {/* Картинка или заглушка */}
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          style={{ width: 110, height: 90, objectFit: 'cover', borderRadius: 6, background: '#eef1f5' }}
        />
      ) : (
        <div
          style={{
            width: 110, height: 90, borderRadius: 6, border: '2px dashed #b9c2cf',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#8a94a3', fontSize: 13,
          }}
        >
          picture.png
        </div>
      )}

      {/* Текстовая часть */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>
          {product.manufacturer_name} | {product.name}
        </div>
        <div style={{ color: '#555', marginTop: 4 }}>Категория: {product.category_name}</div>
        <div style={{ color: isLow ? '#c0392b' : '#555', fontWeight: isLow ? 700 : 400 }}>
          Количество: {label} (всего {total})
        </div>
        <div style={{ color: '#555' }}>Состав: {product.composition}</div>
      </div>

      {/* Цены */}
      <div style={{ textAlign: 'right' }}>
        {sale && (
          <div style={{ textDecoration: 'line-through', color: '#999' }}>
            {formatPrice(product.base_price)}
          </div>
        )}
        <div style={{ fontWeight: 700, fontSize: 20 }}>{formatPrice(finalPrice)}</div>
        <div style={{ color: sale ? '#c0392b' : '#888', fontSize: 14 }}>
          {sale ? 'Скидка −25%' : 'Без скидки'}
        </div>
      </div>
    </div>
  );
}

// общие стили кнопок и полей (потом перенесём в app.css)
const btnBlue: React.CSSProperties = {
  padding: '8px 18px', borderRadius: 6, border: 'none',
  background: '#1a6ee0', color: '#fff', fontWeight: 600, cursor: 'pointer',
};
const btnDark: React.CSSProperties = {
  padding: '8px 18px', borderRadius: 6, border: 'none',
  background: '#2b3441', color: '#fff', cursor: 'pointer',
};
const input: React.CSSProperties = {
  flex: 1, padding: '9px 12px', borderRadius: 6,
  border: '1px solid #ccd3dd', background: '#fff', fontSize: 14,
};

export default App;
