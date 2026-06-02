// src/app/admin/orders/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Order, OrderStatus } from '@/types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Хүлээгдэж байна',
  CONFIRMED: 'Баталгаажсан',
  IN_PRODUCTION: 'Үйлдвэрлэж байна',
  READY: 'Бэлэн болсон',
  OUT_FOR_DELIVERY: 'Хүргэлтэнд гарсан',
  DELIVERED: 'Хүргэгдсэн',
  CANCELLED: 'Цуцлагдсан',
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'IN_PRODUCTION',
  IN_PRODUCTION: 'READY',
  READY: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
};

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  PENDING:          { bg: '#FEF3DC', text: '#8B5219' },
  CONFIRMED:        { bg: '#DCFCE7', text: '#166534' },
  IN_PRODUCTION:    { bg: '#DBEAFE', text: '#1E40AF' },
  READY:            { bg: '#F3E8FF', text: '#6B21A8' },
  OUT_FOR_DELIVERY: { bg: '#DBEAFE', text: '#1E40AF' },
  DELIVERED:        { bg: '#DCFCE7', text: '#166534' },
  CANCELLED:        { bg: '#FEE2E2', text: '#991B1B' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get<Order[]>('/orders');
      setOrders(res.data);
    } catch {
      toast.error('Захиалга ачааллахад алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders().catch(() => null); }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      toast.success('Статус шинэчлэгдлээ');
      await fetchOrders();
    } catch {
      toast.error('Алдаа гарлаа');
    }
  };

  const handleReport = async () => {
    try {
      const res = await api.get(`/admin/orders/production-report?date=${date}`);
      const report = res.data as { items: Array<{ productName: string; totalQuantity: number; b2cQuantity: number; b2bQuantity: number }> };
      if (report.items.length === 0) {
        toast.info('Тухайн өдөрт захиалга байхгүй байна');
        return;
      }
      const text = report.items.map((i) => `${i.productName}: ${i.totalQuantity} ширхэг (B2C: ${i.b2cQuantity}, B2B: ${i.b2bQuantity})`).join('\n');
      alert(`${date}-ний үйлдвэрлэлийн тайлан:\n\n${text}`);
    } catch {
      toast.error('Тайлан ачааллахад алдаа гарлаа');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', color: 'var(--fp-text)' }}>Захиалгууд</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: '7px 10px', border: '0.5px solid var(--fp-border)', borderRadius: '8px', fontSize: '13px', background: 'white', color: 'var(--fp-text)' }} />
          <button onClick={handleReport} style={{ padding: '8px 14px', background: 'var(--fp-primary-light)', color: 'var(--fp-primary-dark)', border: '0.5px solid var(--fp-primary)', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
            📊 Тайлан
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fp-text-muted)' }}>Ачааллаж байна...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fp-text-muted)' }}>
          <p style={{ fontSize: '40px', marginBottom: '8px' }}>📋</p>
          <p>Захиалга байхгүй байна</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {orders.map((order) => {
            const sc = STATUS_COLORS[order.status];
            const nextStatus = NEXT_STATUS[order.status];
            return (
              <div key={order.id} style={{ background: 'var(--fp-surface)', border: '0.5px solid var(--fp-border)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--fp-cream)', borderBottom: '0.5px solid var(--fp-border)' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--fp-text)', fontFamily: 'monospace' }}>#{order.orderNumber}</p>
                    <p style={{ fontSize: '12px', color: 'var(--fp-text-muted)' }}>
                      {order.orderType} • Хүргэх: {new Date(order.deliveryDate).toLocaleDateString('mn-MN')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '500', background: sc.bg, color: sc.text }}>
                      {STATUS_LABELS[order.status]}
                    </span>
                    {nextStatus && (
                      <button onClick={() => handleStatusUpdate(order.id, nextStatus)} style={{ padding: '5px 10px', background: 'var(--fp-primary)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
                        → {STATUS_LABELS[nextStatus]}
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ padding: '10px 16px' }}>
                  {order.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '3px 0' }}>
                      <span style={{ color: 'var(--fp-text)' }}>{item.product?.name ?? item.productId} × {item.quantity}</span>
                      <span style={{ color: 'var(--fp-primary-dark)', fontWeight: '500' }}>{Number(item.totalPrice).toLocaleString()}₮</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid var(--fp-border)', marginTop: '6px', paddingTop: '6px', fontWeight: '500' }}>
                    <span style={{ fontSize: '13px', color: 'var(--fp-text)' }}>Нийт</span>
                    <span style={{ fontSize: '14px', color: 'var(--fp-primary-dark)' }}>{Number(order.totalAmount).toLocaleString()}₮</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}