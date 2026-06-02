// src/app/admin/categories/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  imageEmoji: string;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '0.5px solid var(--fp-border)',
  borderRadius: '8px',
  fontSize: '13px',
  background: 'white',
  color: 'var(--fp-text)',
  outline: 'none',
  marginBottom: '10px',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', imageEmoji: '🍞', sortOrder: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get<Category[]>('/admin/categories');
      setCategories(res.data);
    } catch {
      toast.error('Ангилал ачааллахад алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories().catch(() => null);
  }, [fetchCategories]);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    setForm((p) => ({ ...p, name, slug }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug) { toast.error('Нэр болон slug оруулна уу'); return; }
    setIsSubmitting(true);
    try {
      await api.post('/admin/categories', form);
      toast.success('Ангилал нэмэгдлээ!');
      setForm({ name: '', slug: '', imageEmoji: '🍞', sortOrder: 0 });
      setShowForm(false);
      await fetchCategories();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? 'Алдаа гарлаа');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" ангиллыг устгах уу?`)) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Устгагдлаа');
      await fetchCategories();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? 'Устгахад алдаа гарлаа');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', color: 'var(--fp-text)' }}>Ангиллууд</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '9px 16px', background: 'var(--fp-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
        >
          + Ангилал нэмэх
        </button>
      </div>

      {/* Нэмэх форм */}
      {showForm && (
        <div style={{ background: 'var(--fp-surface)', border: '0.5px solid var(--fp-border)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '500', color: 'var(--fp-text)', marginBottom: '1rem' }}>Шинэ ангилал</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--fp-text-muted)', display: 'block', marginBottom: '4px' }}>Нэр</label>
              <input style={inputStyle} value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Талх" />
              <label style={{ fontSize: '12px', color: 'var(--fp-text-muted)', display: 'block', marginBottom: '4px' }}>Slug</label>
              <input style={inputStyle} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="talh" />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--fp-text-muted)', display: 'block', marginBottom: '4px' }}>Emoji</label>
              <input style={inputStyle} value={form.imageEmoji} onChange={(e) => setForm((p) => ({ ...p, imageEmoji: e.target.value }))} placeholder="🍞" />
              <label style={{ fontSize: '12px', color: 'var(--fp-text-muted)', display: 'block', marginBottom: '4px' }}>Дараалал</label>
              <input style={inputStyle} type="number" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button onClick={handleSubmit} disabled={isSubmitting} style={{ padding: '9px 20px', background: 'var(--fp-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
              {isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: '9px 20px', background: 'transparent', color: 'var(--fp-text-muted)', border: '0.5px solid var(--fp-border)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
              Цуцлах
            </button>
          </div>
        </div>
      )}

      {/* Жагсаалт */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fp-text-muted)' }}>Ачааллаж байна...</div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fp-text-muted)' }}>
          <p style={{ fontSize: '40px', marginBottom: '8px' }}>📁</p>
          <p>Ангилал байхгүй байна. Эхлээд ангилал нэмнэ үү.</p>
        </div>
      ) : (
        <div style={{ background: 'var(--fp-surface)', border: '0.5px solid var(--fp-border)', borderRadius: '12px', overflow: 'hidden' }}>
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 16px',
                borderBottom: i < categories.length - 1 ? '0.5px solid var(--fp-border)' : 'none',
              }}
            >
              <span style={{ fontSize: '28px' }}>{cat.imageEmoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--fp-text)' }}>{cat.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--fp-text-muted)' }}>
                  {cat._count.products} бүтээгдэхүүн • slug: {cat.slug}
                </p>
              </div>
              <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '5px', background: cat.isActive ? '#DCFCE7' : '#FEE2E2', color: cat.isActive ? '#166534' : '#991B1B' }}>
                {cat.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
              </span>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                style={{ padding: '6px 12px', background: 'transparent', border: '0.5px solid #FCA5A5', borderRadius: '6px', fontSize: '12px', color: '#DC2626', cursor: 'pointer' }}
              >
                Устгах
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}