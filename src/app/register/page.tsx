'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';

type Role = 'B2C' | 'B2B';

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '0.5px solid var(--fp-border)',
  borderRadius: '8px',
  fontSize: '14px',
  background: 'white',
  color: 'var(--fp-text)',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: 'var(--fp-text-muted)',
  marginBottom: '6px',
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [role, setRole] = useState<Role>('B2C');
  const [form, setForm] = useState({
    email: '',
    phone: '',
    password: '',
    firstName: '',
    lastName: '',
    businessName: '',
    businessAddress: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ ...form, role });
      toast.success('Бүртгэл амжилттай!');
      router.push('/shop');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string | string[] } } };
      const msg = axiosErr.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg ?? 'Алдаа гарлаа'));
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
        padding: '1.5rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px', height: '48px',
              background: 'var(--fp-primary)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', margin: '0 auto 10px',
            }}
          >
            🥐
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '500', color: 'var(--fp-text)' }}>
            Family Pastry
          </h1>
        </div>

        <div
          style={{
            background: 'var(--fp-surface)',
            border: '0.5px solid var(--fp-border)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '1.25rem 1.5rem 0' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '500', color: 'var(--fp-text)', marginBottom: '1rem' }}>
              Бүртгүүлэх
            </h2>

            {/* Хэрэглэгчийн төрөл */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
              {(['B2C', 'B2B'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: role === r ? '1.5px solid var(--fp-primary)' : '0.5px solid var(--fp-border)',
                    background: role === r ? 'var(--fp-primary-light)' : 'white',
                    color: role === r ? 'var(--fp-primary-dark)' : 'var(--fp-text-muted)',
                    fontSize: '13px',
                    fontWeight: role === r ? '500' : '400',
                    cursor: 'pointer',
                  }}
                >
                  {r === 'B2C' ? '🛍 Энгийн хэрэглэгч' : '🏪 Дэлгүүр / Кафе'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={labelStyle}>Овог</label>
                <input style={inputStyle} name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
              <div>
                <label style={labelStyle}>Нэр</label>
                <input style={inputStyle} name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Имэйл</label>
              <input style={inputStyle} type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div>
              <label style={labelStyle}>Утасны дугаар</label>
              <input style={inputStyle} type="tel" name="phone" placeholder="99001122" value={form.phone} onChange={handleChange} required />
            </div>

            <div>
              <label style={labelStyle}>Нууц үг</label>
              <input style={inputStyle} type="password" name="password" placeholder="Доод тал нь 8 тэмдэгт" value={form.password} onChange={handleChange} required minLength={8} />
            </div>

            {role === 'B2B' && (
              <>
                <div>
                  <label style={labelStyle}>Дэлгүүрийн нэр</label>
                  <input style={inputStyle} name="businessName" value={form.businessName} onChange={handleChange} required />
                </div>
                <div>
                  <label style={labelStyle}>Хаяг</label>
                  <input style={inputStyle} name="businessAddress" value={form.businessAddress} onChange={handleChange} />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '11px',
                background: 'var(--fp-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              {isLoading ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}
            </button>

            <div style={{ borderTop: '0.5px solid var(--fp-border)', paddingTop: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--fp-text-muted)' }}>
              Бүртгэлтэй юу?{' '}
              <Link href="/login" style={{ color: 'var(--fp-primary)', fontWeight: '500', textDecoration: 'none' }}>
                Нэвтрэх
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}