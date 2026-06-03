// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }

    // Token байгаа бол role-г backend-ээс авна
    api.get<{ role: string }>('/auth/me')
      .then((res) => {
        if (res.data.role === 'ADMIN') {
          router.replace('/admin');
        } else {
          router.replace('/shop');
        }
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.replace('/login');
      });
  }, [router]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--fp-cream)' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--fp-primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}