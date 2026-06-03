// src/app/shop/layout.tsx
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import api from '@/lib/api';

interface Category {
  id: string;
  name: string;
  imageEmoji: string;
  _count: { products: number };
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get<Category[]>('/categories');
      setCategories(res.data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchCategories().catch(() => null);
  }, [fetchCategories]);

  const handleLogout = async () => {
    await logout();
    toast.success('Гарлаа');
    router.push('/login');
  };

  const isShopPage = pathname === '/shop';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--fp-cream)' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--fp-surface)', borderBottom: '0.5px solid var(--fp-border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--fp-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🥐</div>
            <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--fp-primary-dark)' }}>Family Pastry</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link href="/shop/orders" style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none', color: pathname === '/shop/orders' ? 'var(--fp-primary-dark)' : 'var(--fp-text-muted)', background: pathname === '/shop/orders' ? 'var(--fp-primary-light)' : 'transparent' }}>
              Захиалгууд
            </Link>
            <span style={{ fontSize: '13px', color: 'var(--fp-text-muted)', padding: '0 4px' }}>{user?.firstName}</span>
            <button onClick={handleLogout} style={{ padding: '6px 12px', border: 'none', background: 'transparent', fontSize: '13px', color: 'var(--fp-text-muted)', cursor: 'pointer', borderRadius: '6px' }}>
              Гарах
            </button>
            <Link href="/shop/cart" style={{ padding: '7px 14px', borderRadius: '8px', border: '0.5px solid var(--fp-primary)', background: pathname === '/shop/cart' ? 'var(--fp-primary)' : 'var(--fp-primary-light)', color: pathname === '/shop/cart' ? 'white' : 'var(--fp-primary-dark)', fontSize: '13px', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🛒 Сагс
              {totalItems > 0 && (
                <span style={{ background: pathname === '/shop/cart' ? 'white' : 'var(--fp-primary)', color: pathname === '/shop/cart' ? 'var(--fp-primary)' : 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '500' }}>
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Body — sidebar + content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', display: 'flex', gap: '1.5rem' }}>

        {/* Зүүн sidebar — зөвхөн shop хуудаст */}
        {isShopPage && categories.length > 0 && (
          <aside style={{ width: '180px', flexShrink: 0 }}>
            <div style={{ background: 'var(--fp-surface)', border: '0.5px solid var(--fp-border)', borderRadius: '12px', overflow: 'hidden', position: 'sticky', top: '72px' }}>
              <div style={{ padding: '10px 14px', borderBottom: '0.5px solid var(--fp-border)', background: 'var(--fp-cream)' }}>
                <p style={{ fontSize: '12px', fontWeight: '500', color: 'var(--fp-text-muted)' }}>АНГИЛАЛ</p>
              </div>

              {/* Бүгд */}
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '10px 14px',
                  border: 'none',
                  borderBottom: '0.5px solid var(--fp-border)',
                  background: selectedCategory === null ? 'var(--fp-primary-light)' : 'transparent',
                  color: selectedCategory === null ? 'var(--fp-primary-dark)' : 'var(--fp-text)',
                  fontSize: '13px',
                  fontWeight: selectedCategory === null ? '500' : '400',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <span>🛍</span> Бүгд
              </button>

              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '10px 14px',
                    border: 'none',
                    borderBottom: i < categories.length - 1 ? '0.5px solid var(--fp-border)' : 'none',
                    background: selectedCategory === cat.id ? 'var(--fp-primary-light)' : 'transparent',
                    color: selectedCategory === cat.id ? 'var(--fp-primary-dark)' : 'var(--fp-text)',
                    fontSize: '13px',
                    fontWeight: selectedCategory === cat.id ? '500' : '400',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  <span>{cat.imageEmoji}</span>
                  <span style={{ flex: 1 }}>{cat.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--fp-text-muted)' }}>{cat._count.products}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Гол агуулга */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* selectedCategory-г children-д дамжуулах хэрэгтэй тул URL query ашиглана */}
          {isShopPage && selectedCategory !== null
            ? <ChildrenWithCategory categoryId={selectedCategory}>{children}</ChildrenWithCategory>
            : children
          }
        </main>
      </div>
    </div>
  );
}

// selectedCategory-г URL-д хийж children-д дамжуулна
function ChildrenWithCategory({ categoryId, children }: { categoryId: string; children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/shop?categoryId=${categoryId}`);
  }, [categoryId, router]);
  return <>{children}</>;
}