// src/app/admin/layout.tsx
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.replace('/shop');
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    toast.success('Гарлаа');
    router.push('/login');
  };

  const navItems = [
    { href: '/admin', label: 'Хянах самбар', emoji: '📊' },
    { href: '/admin/categories', label: 'Ангиллууд', emoji: '📁' },
    { href: '/admin/products', label: 'Бүтээгдэхүүн', emoji: '🍞' },
    { href: '/admin/orders', label: 'Захиалгууд', emoji: '📋' },
  ];

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--fp-cream)' }}>
      <aside
        style={{
          width: '220px',
          background: 'var(--fp-surface)',
          borderRight: '0.5px solid var(--fp-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0, left: 0,
          height: '100vh',
        }}
      >
        <div style={{ padding: '1.25rem', borderBottom: '0.5px solid var(--fp-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--fp-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            🥐
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--fp-text)' }}>Family Pastry</p>
            <p style={{ fontSize: '11px', color: 'var(--fp-text-muted)' }}>Админ панель</p>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0.75rem' }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px', marginBottom: '2px',
                textDecoration: 'none', fontSize: '13px',
                fontWeight: isActive(item.href) ? '500' : '400',
                color: isActive(item.href) ? 'var(--fp-primary-dark)' : 'var(--fp-text-muted)',
                background: isActive(item.href) ? 'var(--fp-primary-light)' : 'transparent',
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Зөвхөн нэр + гарах товч — Shop товч байхгүй */}
        <div style={{ padding: '1rem', borderTop: '0.5px solid var(--fp-border)' }}>
          <p style={{ fontSize: '12px', color: 'var(--fp-text-muted)', marginBottom: '8px' }}>
            {user?.firstName} {user?.lastName}
          </p>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '8px',
              border: 'none', borderRadius: '7px',
              fontSize: '13px', color: 'white',
              background: 'var(--fp-primary)', cursor: 'pointer',
            }}
          >
            Гарах
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: '220px', flex: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}