"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FileText, Clock, CheckCircle2, Truck, XCircle, Eye, RefreshCw, Ban, Upload } from 'lucide-react';

interface OrderItemSummary {
  product: { _id: string; name: string; brand: string; images: string[] };
  size: string;
  color: string;
  packQuantity: number;
  packSize: number;
  wholesalePrice: number;
}

interface OrderSummary {
  _id: string;
  items: OrderItemSummary[];
  totalAmount: number;
  totalPacks: number;
  totalItems: number;
  businessName: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentReceipt: string;
  createdAt: string;
}

const statusBadge: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Pending: { color: 'text-amber-700', bg: 'bg-amber-50', icon: <Clock className="w-3.5 h-3.5" /> },
  Confirmed: { color: 'text-blue-700', bg: 'bg-blue-50', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  Shipped: { color: 'text-purple-700', bg: 'bg-purple-50', icon: <Truck className="w-3.5 h-3.5" /> },
  Delivered: { color: 'text-green-700', bg: 'bg-green-50', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  Cancelled: { color: 'text-red-700', bg: 'bg-red-50', icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function OrdersPage() {
  const router = useRouter();
  const { token, apiUrl, loading: authLoading } = useAuth();
  const { addBulkToCart } = useCart();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.push('/login?redirect=/orders');
      return;
    }
    fetchOrders();
  }, [token, authLoading]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${apiUrl}/orders/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setActionError('');
    try {
      const res = await fetch(`${apiUrl}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setActionMsg('Order cancelled successfully');
      fetchOrders();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err: any) {
      setActionError(err.message);
      setTimeout(() => setActionError(''), 3000);
    }
  };

  const handleReorder = (order: OrderSummary) => {
    const items = order.items.map(i => ({
      productId: i.product._id,
      name: i.product.name,
      brand: i.product.brand,
      image: i.product.images?.[0] || '',
      size: i.size,
      color: i.color,
      packQuantity: i.packQuantity,
      packSize: i.packSize,
      wholesalePrice: i.wholesalePrice,
    }));
    addBulkToCart(items);
    setActionMsg('Items added to cart!');
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleReceiptUpload = async (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setActionError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      fetch(`${apiUrl}/orders/${orderId}/receipt`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentReceipt: base64 }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          setActionMsg('Payment receipt uploaded!');
          fetchOrders();
          setTimeout(() => setActionMsg(''), 3000);
        })
        .catch((err) => {
          setActionError(err.message);
          setTimeout(() => setActionError(''), 3000);
        });
    };
    reader.onerror = () => {
      setActionError('Failed to read file');
      setTimeout(() => setActionError(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-stone-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
      <div className="flex items-center space-x-3 mb-8">
        <FileText className="w-7 h-7 text-rose-900" />
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif">My Orders</h1>
      </div>

      {actionMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 text-xs font-bold p-3 rounded">
          {actionMsg}
        </div>
      )}
      {actionError && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold p-3 rounded">
          {actionError}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-lg p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="font-bold text-stone-800">No orders yet</h2>
          <p className="text-xs text-stone-500">You haven't placed any wholesale orders yet.</p>
          <Link
            href="/products"
            className="inline-block bg-rose-900 hover:bg-rose-800 text-white font-bold px-6 py-2.5 rounded text-xs uppercase tracking-wider transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const badge = statusBadge[o.status] || statusBadge.Pending;
            return (
              <div key={o._id} className="bg-white border border-stone-200 rounded-lg p-5 space-y-3">
                <Link href={`/receipt/${o._id}`} className="block hover:border-rose-300 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-stone-400">#{o._id.slice(-8).toUpperCase()}</span>
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.color}`}>
                          {badge.icon}
                          <span>{o.status}</span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          o.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-stone-900">{o.businessName}</p>
                      <p className="text-[11px] text-stone-500">
                        {o.totalPacks} Boxes &middot; {o.totalItems} Pcs &middot; {o.paymentMethod}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-extrabold text-rose-900">₹{o.totalAmount}</p>
                        <p className="text-[10px] text-stone-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <Eye className="w-5 h-5 text-stone-400" />
                    </div>
                  </div>
                </Link>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                  <Link
                    href={`/receipt/${o._id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-stone-600 hover:text-rose-900 bg-stone-50 hover:bg-rose-50 px-3 py-1.5 rounded border border-stone-200 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>

                  {o.status === 'Pending' && o.paymentMethod === 'Bank Transfer' && o.paymentStatus !== 'Paid' && (
                    <label className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded border border-amber-200 transition cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{o.paymentReceipt ? 'Update' : 'Upload'} Receipt</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleReceiptUpload(o._id, e)} />
                    </label>
                  )}

                  {o.status === 'Pending' && (
                    <button
                      onClick={() => handleCancel(o._id)}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded border border-red-200 transition cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}

                  {o.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleReorder(o)}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded border border-green-200 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
