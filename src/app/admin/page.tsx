// src/app/admin/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCategories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const [products, categories] = await Promise.all([
        api.get('/admin/products').catch(() => ({ data: [] })),
        api.get('/admin/categories').catch(() => ({ data: [] })),
      ]);
      setStats({
        totalOrders: 0,
        pendingOrders: 0,
        totalProducts: Array.isArray(products.data) ? products.data.length : 0,
        totalCategories: Array.isArray(categories.data) ? categories.data.length : 0,
      });
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchStats().catch(() => null);
  }, [fetchStats]);

  const cards = [
    { label: 'Ангилал', value: stats?.totalCategories ?? '—', emoji: '📁', href: '/admin/categories' },
    { label: 'Бүтээгдэхүүн', value: stats?.totalProducts ?? '—', emoji: '🍞', href: '/admin/products' },
    { label: 'Захиалгууд', value: stats?.totalOrders ?? '—', emoji: '📋', href: '/admin/orders' },
    { label: 'Хүлээгдэж буй', value: stats?.pendingOrders ?? '—', emoji: '⏳', href: '/admin/orders' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '500', color: 'var(--fp-text)', marginBottom: '1.5rem' }}>
        Хянах самбар
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {cards.map((card) => (
          <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--fp-surface)', border: '0.5px solid var(--fp-border)', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{card.emoji}</div>
              <div style={{ fontSize: '28px', fontWeight: '500', color: 'var(--fp-primary-dark)', marginBottom: '4px' }}>{card.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--fp-text-muted)' }}>{card.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}