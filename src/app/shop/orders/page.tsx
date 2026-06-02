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

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  PENDING:          { bg: '#FEF3DC', text: '#8B5219' },
  CONFIRMED:        { bg: '#DCFCE7', text: '#166534' },
  IN_PRODUCTION:    { bg: '#DBEAFE', text: '#1E40AF' },
  READY:            { bg: '#F3E8FF', text: '#6B21A8' },
  OUT_FOR_DELIVERY: { bg: '#DBEAFE', text: '#1E40AF' },
  DELIVERED:        { bg: '#DCFCE7', text: '#166534' },
  CANCELLED:        { bg: '#FEE2E2', text: '#991B1B' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchOrders().catch(() => null);
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '240px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--fp-primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ display: 'flex', height: '240px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--fp-text-muted)' }}>
        <span style={{ fontSize: '40px' }}>📋</span>
        <p style={{ fontSize: '15px' }}>Захиалга байхгүй байна</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '500', color: 'var(--fp-text)', marginBottom: '1.5rem' }}>
        Миний захиалгууд
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {orders.map((order) => {
          const statusColor = STATUS_COLORS[order.status];
          return (
            <div
              key={order.id}
              style={{
                background: 'var(--fp-surface)',
                border: '0.5px solid var(--fp-border)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderBottom: '0.5px solid var(--fp-border)',
                  background: 'var(--fp-cream)',
                }}
              >
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--fp-text)', fontFamily: 'monospace' }}>
                    #{order.orderNumber}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--fp-text-muted)', marginTop: '2px' }}>
                    Хүргэх: {new Date(order.deliveryDate).toLocaleDateString('mn-MN')}
                  </p>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: statusColor.bg,
                    color: statusColor.text,
                  }}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              {/* Items */}
              <div style={{ padding: '12px 16px' }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }}>
                    <span style={{ color: 'var(--fp-text)' }}>
                      {item.product?.name ?? item.productId} × {item.quantity} {item.product?.unit ?? ''}
                    </span>
                    <span style={{ fontWeight: '500', color: 'var(--fp-primary-dark)' }}>
                      {Number(item.totalPrice).toLocaleString()}₮
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    display: 'flex', justifyContent: 'space-between',
                    borderTop: '0.5px solid var(--fp-border)',
                    marginTop: '8px',
                    paddingTop: '8px',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--fp-text)' }}>Нийт</span>
                  <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--fp-primary-dark)' }}>
                    {Number(order.totalAmount).toLocaleString()}₮
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}