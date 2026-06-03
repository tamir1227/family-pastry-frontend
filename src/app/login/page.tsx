'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Амжилттай нэвтэрлээ!');
      router.push('/');

    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message ?? 'Нэвтрэхэд алдаа гарлаа');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--fp-cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Лого */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'var(--fp-primary)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 12px',
            }}
          >
            🥐
          </div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '500',
              color: 'var(--fp-text)',
              marginBottom: '4px',
            }}
          >
            Family Pastry
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--fp-text-muted)' }}>
            Гурилан бүтээгдэхүүний захиалгын систем
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'var(--fp-surface)',
            border: '0.5px solid var(--fp-border)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '1.5rem 1.5rem 0' }}>
            <h2
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--fp-text)',
                marginBottom: '4px',
              }}
            >
              Нэвтрэх
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--fp-text-muted)', marginBottom: '1.25rem' }}>
              Имэйл болон нууц үгээ оруулна уу
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '0 1.5rem 1.5rem' }}>
            <div style={{ marginBottom: '12px' }}>
              <label
                htmlFor="email"
                style={{ display: 'block', fontSize: '12px', color: 'var(--fp-text-muted)', marginBottom: '6px' }}
              >
                Имэйл
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '0.5px solid var(--fp-border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white',
                  color: 'var(--fp-text)',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="password"
                style={{ display: 'block', fontSize: '12px', color: 'var(--fp-text-muted)', marginBottom: '6px' }}
              >
                Нууц үг
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '0.5px solid var(--fp-border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white',
                  color: 'var(--fp-text)',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '11px',
                background: isLoading ? 'var(--fp-primary-light)' : 'var(--fp-primary)',
                color: isLoading ? 'var(--fp-primary-dark)' : 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginBottom: '1rem',
              }}
            >
              {isLoading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </button>

            <div
              style={{
                borderTop: '0.5px solid var(--fp-border)',
                paddingTop: '1rem',
                textAlign: 'center',
                fontSize: '13px',
                color: 'var(--fp-text-muted)',
              }}
            >
              Бүртгэл байхгүй юу?{' '}
              <Link
                href="/register"
                style={{ color: 'var(--fp-primary)', fontWeight: '500', textDecoration: 'none' }}
              >
                Бүртгүүлэх
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}