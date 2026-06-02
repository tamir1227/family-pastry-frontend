'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, deliveryDate, deliveryAddress, removeItem, updateQuantity, setDeliveryDate, setDeliveryAddress, getTotalAmount, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isB2B = user?.role === 'B2B';

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const sectionStyle = {
    background: 'var(--fp-surface)',
    border: '0.5px solid var(--fp-border)',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '16px',
  };

  const sectionHeaderStyle = {
    padding: '12px 16px',
    borderBottom: '0.5px solid var(--fp-border)',
    background: 'var(--fp-cream)',
    fontSize: '13px',
    fontWeight: '500' as const,
    color: 'var(--fp-text)',
  };

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

  const handleOrder = async () => {
    if (!deliveryDate) { toast.error('Хүргэлтийн огноо сонгоно уу'); return; }
    if (!isB2B && !deliveryAddress) { toast.error('Хүргэлтийн хаяг оруулна уу'); return; }
    if (items.length === 0) { toast.error('Сагс хоосон байна'); return; }

    setIsSubmitting(true);
    try {
      await api.post('/orders', {
        deliveryDate,
        deliveryAddress: isB2B ? undefined : deliveryAddress,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clearCart();
      toast.success('Захиалга амжилттай хийгдлээ!');
      router.push('/shop/orders');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; details?: string[] } } };
      const data = axiosErr.response?.data;
      if (data?.details) { data.details.forEach((d) => toast.error(d)); }
      else { toast.error(data?.message ?? 'Захиалга хийхэд алдаа гарлаа'); }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ display: 'flex', height: '300px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--fp-text-muted)' }}>
        <span style={{ fontSize: '48px' }}>🛒</span>
        <p style={{ fontSize: '16px' }}>Сагс хоосон байна</p>
        <Link
          href="/shop"
          style={{ padding: '9px 20px', border: '0.5px solid var(--fp-primary)', borderRadius: '8px', color: 'var(--fp-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
        >
          Бүтээгдэхүүн үзэх
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '500', color: 'var(--fp-text)', marginBottom: '1.5rem' }}>
        Захиалгын сагс
      </h1>

      {/* Бүтээгдэхүүнүүд */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>Захиалсан бүтээгдэхүүн</div>
        {items.map((item, i) => (
          <div
            key={item.productId}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px',
              borderBottom: i < items.length - 1 ? '0.5px solid var(--fp-border)' : 'none',
            }}
          >
            <div style={{ width: '40px', height: '40px', background: 'var(--fp-primary-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              🍞
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--fp-text)', marginBottom: '2px' }}>{item.name}</p>
              <p style={{ fontSize: '12px', color: 'var(--fp-text-muted)' }}>{item.price.toLocaleString()}₮ / {item.unit}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} style={{ width: '26px', height: '26px', border: '0.5px solid var(--fp-border)', borderRadius: '6px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fp-text-muted)' }}>−</button>
              <span style={{ width: '24px', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} style={{ width: '26px', height: '26px', border: '0.5px solid var(--fp-border)', borderRadius: '6px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fp-text-muted)' }}>+</button>
            </div>
            <p style={{ width: '80px', textAlign: 'right', fontSize: '14px', fontWeight: '500', color: 'var(--fp-primary-dark)' }}>
              {(item.price * item.quantity).toLocaleString()}₮
            </p>
            <button onClick={() => removeItem(item.productId)} style={{ width: '24px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--fp-text-muted)', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--fp-primary-light)', borderTop: '0.5px solid var(--fp-border)' }}>
          <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--fp-text)' }}>Нийт дүн</span>
          <span style={{ fontSize: '18px', fontWeight: '500', color: 'var(--fp-primary-dark)' }}>{getTotalAmount().toLocaleString()}₮</span>
        </div>
      </div>

      {/* Хүргэлт */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>Хүргэлтийн мэдээлэл</div>
        <div style={{ padding: '16px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--fp-text-muted)', marginBottom: '6px' }}>
              Хүргэлтийн огноо
            </label>
            <input type="date" min={minDate} value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} style={inputStyle} />
            <p style={{ fontSize: '11px', color: 'var(--fp-text-muted)', marginTop: '4px' }}>
              Маргаашийн захиалгыг өнөөдөр 18:00 цагаас өмнө өгнө үү
            </p>
          </div>

          {!isB2B && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--fp-text-muted)', marginBottom: '6px' }}>
                Хүргэлтийн хаяг
              </label>
              <input placeholder="Дүүрэг, хороо, байр, тоот..." value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} style={inputStyle} />
            </div>
          )}

          {isB2B && user?.b2bProfile && (
            <div style={{ padding: '10px 14px', background: 'var(--fp-primary-light)', borderRadius: '8px', border: '0.5px solid var(--fp-border)' }}>
              <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--fp-text)', marginBottom: '2px' }}>{user.b2bProfile.businessName}</p>
              {user.b2bProfile.route && (
                <p style={{ fontSize: '12px', color: 'var(--fp-text-muted)' }}>Хүргэлт: {user.b2bProfile.route.deliveryTime}</p>
              )}
              <p style={{ fontSize: '12px', color: 'var(--fp-text-muted)' }}>
                Боломжит credit: {Number(user.b2bProfile.creditAvailable).toLocaleString()}₮
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleOrder}
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '14px',
          background: 'var(--fp-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: '500',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? 'Захиалж байна...' : 'Захиалга өгөх'}
      </button>
    </div>
  );
}