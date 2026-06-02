// src/app/admin/products/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Category { id: string; name: string; imageEmoji: string; }
interface Product {
  id: string; name: string; slug: string;
  retailPrice: string; wholesalePrice: string;
  dailyCapacity: number | null; isActive: boolean;
  unit: string;
  category: { name: string; imageEmoji: string };
}

const inputStyle = {
  width: '100%', padding: '8px 12px',
  border: '0.5px solid var(--fp-border)', borderRadius: '8px',
  fontSize: '13px', background: 'white', color: 'var(--fp-text)',
  outline: 'none', marginBottom: '10px',
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', slug: '', categoryId: '',
    retailPrice: '', wholesalePrice: '',
    dailyCapacity: '', unit: 'ширхэг',
  });

  const fetchData = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([
        api.get<Product[]>('/admin/products'),
        api.get<Category[]>('/admin/categories'),
      ]);
      setProducts(p.data);
      setCategories(c.data);
    } catch {
      toast.error('Мэдээлэл ачааллахад алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData().catch(() => null); }, [fetchData]);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    setForm((p) => ({ ...p, name, slug }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.categoryId || !form.retailPrice || !form.wholesalePrice) {
      toast.error('Бүх шаардлагатай талбарыг бөглөнө үү'); return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/admin/products', {
        name: form.name, slug: form.slug, categoryId: form.categoryId,
        retailPrice: Number(form.retailPrice),
        wholesalePrice: Number(form.wholesalePrice),
        dailyCapacity: form.dailyCapacity ? Number(form.dailyCapacity) : undefined,
        unit: form.unit,
      });
      toast.success('Бүтээгдэхүүн нэмэгдлээ!');
      setForm({ name: '', slug: '', categoryId: '', retailPrice: '', wholesalePrice: '', dailyCapacity: '', unit: 'ширхэг' });
      setShowForm(false);
      await fetchData();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? 'Алдаа гарлаа');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Идэвхгүй болгогдлоо');
      await fetchData();
    } catch {
      toast.error('Алдаа гарлаа');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', color: 'var(--fp-text)' }}>Бүтээгдэхүүн</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '9px 16px', background: 'var(--fp-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
          + Бүтээгдэхүүн нэмэх
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--fp-surface)', border: '0.5px solid var(--fp-border)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '500', color: 'var(--fp-text)', marginBottom: '1rem' }}>Шинэ бүтээгдэхүүн</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--fp-text-muted)', display: 'block', marginBottom: '4px' }}>Нэр *</label>
              <input style={inputStyle} value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Улаан буудайн талх" />
              <label style={{ fontSize: '12px', color: 'var(--fp-text-muted)', display: 'block', marginBottom: '4px' }}>Slug</label>
              <input style={inputStyle} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
              <label style={{ fontSize: '12px', color: 'var(--fp-text-muted)', display: 'block', marginBottom: '4px' }}>Ангилал *</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                style={{ ...inputStyle, marginBottom: '10px' }}
              >
                <option value="">Ангилал сонгоно уу</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.imageEmoji} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--fp-text-muted)', display: 'block', marginBottom: '4px' }}>Жижиглэн үнэ (₮) *</label>
              <input style={inputStyle} type="number" value={form.retailPrice} onChange={(e) => setForm((p) => ({ ...p, retailPrice: e.target.value }))} placeholder="3500" />
              <label style={{ fontSize: '12px', color: 'var(--fp-text-muted)', display: 'block', marginBottom: '4px' }}>Бөөний үнэ (₮) *</label>
              <input style={inputStyle} type="number" value={form.wholesalePrice} onChange={(e) => setForm((p) => ({ ...p, wholesalePrice: e.target.value }))} placeholder="2800" />
              <label style={{ fontSize: '12px', color: 'var(--fp-text-muted)', display: 'block', marginBottom: '4px' }}>Өдрийн лимит</label>
              <input style={inputStyle} type="number" value={form.dailyCapacity} onChange={(e) => setForm((p) => ({ ...p, dailyCapacity: e.target.value }))} placeholder="200 (хоосон = лимитгүй)" />
              <label style={{ fontSize: '12px', color: 'var(--fp-text-muted)', display: 'block', marginBottom: '4px' }}>Нэгж</label>
              <input style={inputStyle} value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))} placeholder="ширхэг" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSubmit} disabled={isSubmitting} style={{ padding: '9px 20px', background: 'var(--fp-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
              {isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: '9px 20px', background: 'transparent', color: 'var(--fp-text-muted)', border: '0.5px solid var(--fp-border)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
              Цуцлах
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fp-text-muted)' }}>Ачааллаж байна...</div>
      ) : (
        <div style={{ background: 'var(--fp-surface)', border: '0.5px solid var(--fp-border)', borderRadius: '12px', overflow: 'hidden' }}>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fp-text-muted)' }}>
              <p style={{ fontSize: '40px', marginBottom: '8px' }}>🍞</p>
              <p>Бүтээгдэхүүн байхгүй байна</p>
            </div>
          ) : (
            products.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 16px',
                  borderBottom: i < products.length - 1 ? '0.5px solid var(--fp-border)' : 'none',
                  opacity: p.isActive ? 1 : 0.5,
                }}
              >
                <span style={{ fontSize: '24px' }}>{p.category.imageEmoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--fp-text)' }}>{p.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--fp-text-muted)' }}>
                    {p.category.name} • {Number(p.retailPrice).toLocaleString()}₮ / {Number(p.wholesalePrice).toLocaleString()}₮
                    {p.dailyCapacity ? ` • лимит: ${p.dailyCapacity}` : ''}
                  </p>
                </div>
                <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '5px', background: p.isActive ? '#DCFCE7' : '#FEE2E2', color: p.isActive ? '#166534' : '#991B1B' }}>
                  {p.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                </span>
                {p.isActive && (
                  <button onClick={() => handleDeactivate(p.id)} style={{ padding: '6px 12px', background: 'transparent', border: '0.5px solid #FCA5A5', borderRadius: '6px', fontSize: '12px', color: '#DC2626', cursor: 'pointer' }}>
                    Идэвхгүй болгох
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}