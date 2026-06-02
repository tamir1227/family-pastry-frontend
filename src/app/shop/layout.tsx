'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  const handleLogout = async () => {
    await logout();
    toast.success('Гарлаа');
    router.push('/login');
  };

  const navLinkStyle = (href: string) => ({
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    textDecoration: 'none',
    color: pathname === href ? 'var(--fp-primary-dark)' : 'var(--fp-text-muted)',
    background: pathname === href ? 'var(--fp-primary-light)' : 'transparent',
    fontWeight: pathname === href ? '500' : '400',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--fp-cream)' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--fp-surface)',
          borderBottom: '0.5px solid var(--fp-border)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: '1024px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div
              style={{
                width: '32px', height: '32px',
                background: 'var(--fp-primary)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              🥐
            </div>
            <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--fp-primary-dark)' }}>
              Family Pastry
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link href="/shop/orders" style={navLinkStyle('/shop/orders')}>
              Захиалгууд
            </Link>

            <button
              onClick={handleLogout}
              style={{
                padding: '6px 12px',
                border: 'none',
                background: 'transparent',
                fontSize: '13px',
                color: 'var(--fp-text-muted)',
                cursor: 'pointer',
                borderRadius: '6px',
              }}
            >
              Гарах
            </button>

            <Link
              href="/shop/cart"
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: '0.5px solid var(--fp-primary)',
                background: pathname === '/shop/cart' ? 'var(--fp-primary)' : 'var(--fp-primary-light)',
                color: pathname === '/shop/cart' ? 'white' : 'var(--fp-primary-dark)',
                fontSize: '13px',
                fontWeight: '500',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🛒 Сагс
              {totalItems > 0 && (
                <span
                  style={{
                    background: pathname === '/shop/cart' ? 'white' : 'var(--fp-primary)',
                    color: pathname === '/shop/cart' ? 'var(--fp-primary)' : 'white',
                    borderRadius: '50%',
                    width: '18px', height: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '500',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1024px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {children}
      </main>
    </div>
  );
}