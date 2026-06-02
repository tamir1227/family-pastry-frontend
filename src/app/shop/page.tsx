'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useCartStore } from '@/store/cart.store';
import type { Product } from '@/types';

const cardStyle = {
  background: 'var(--fp-surface)',
  border: '0.5px solid var(--fp-border)',
  borderRadius: '12px',
  overflow: 'hidden',
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { addItem } = useCartStore();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get<Product[]>('/products');
      setProducts(res.data);
      const initial: Record<string, number> = {};
      res.data.forEach((p) => { initial[p.id] = 1; });
      setQuantities(initial);
    } catch {
      toast.error('Бүтээгдэхүүн ачааллахад алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts().catch(() => null);
  }, [fetchProducts]);

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] ?? 1;
    addItem({ productId: product.id, name: product.name, price: product.price, quantity: qty, unit: product.unit });
    toast.success(`${product.name} сагсанд нэмэгдлээ`);
  };

  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '240px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--fp-primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ display: 'flex', height: '240px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--fp-text-muted)' }}>
        <span style={{ fontSize: '40px' }}>🍞</span>
        <p>Бүтээгдэхүүн байхгүй байна</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', color: 'var(--fp-text)', marginBottom: '4px' }}>
          Бүтээгдэхүүнүүд
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--fp-text-muted)' }}>
          Захиалахыг хүссэн бүтээгдэхүүнээ сагсанд нэмнэ үү
        </p>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '500', color: 'var(--fp-text)' }}>{category}</h2>
            <div style={{ flex: 1, height: '0.5px', background: 'var(--fp-border)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {items.map((product) => (
              <div key={product.id} style={cardStyle}>
                {/* Зураг / emoji area */}
                <div
                  style={{
                    height: '100px',
                    background: 'var(--fp-primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '40px',
                  }}
                >
                  {product.category === 'Талх' ? '🍞' : product.category === 'Круассан' ? '🥐' : '🧁'}
                </div>

                <div style={{ padding: '12px 14px' }}>
                  {product.priceType !== 'retail' && (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '500',
                        background: 'var(--fp-badge-bg)',
                        color: 'var(--fp-badge-text)',
                        marginBottom: '6px',
                      }}
                    >
                      {product.priceType === 'custom' ? 'Тусгай үнэ' : 'Бөөний үнэ'}
                    </span>
                  )}
                  <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--fp-text)', marginBottom: '6px' }}>
                    {product.name}
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '500', color: 'var(--fp-primary-dark)', marginBottom: '2px' }}>
                    {product.price.toLocaleString()}₮
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--fp-text-muted)' }}>
                    {product.unit} бүр{product.dailyCapacity ? ` • лимит: ${product.dailyCapacity}` : ''}
                  </p>
                </div>

                <div
                  style={{
                    borderTop: '0.5px solid var(--fp-border)',
                    padding: '10px 14px',
                    background: 'var(--fp-cream)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <button
                    onClick={() => setQuantities((p) => ({ ...p, [product.id]: Math.max(1, (p[product.id] ?? 1) - 1) }))}
                    style={{ width: '28px', height: '28px', border: '0.5px solid var(--fp-border)', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fp-text-muted)' }}
                  >
                    −
                  </button>
                  <span style={{ width: '24px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: 'var(--fp-text)' }}>
                    {quantities[product.id] ?? 1}
                  </span>
                  <button
                    onClick={() => setQuantities((p) => ({ ...p, [product.id]: (p[product.id] ?? 1) + 1 }))}
                    style={{ width: '28px', height: '28px', border: '0.5px solid var(--fp-border)', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fp-text-muted)' }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    style={{ flex: 1, padding: '7px 10px', background: 'var(--fp-primary)', color: 'white', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                  >
                    Сагсанд нэмэх
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}