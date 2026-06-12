"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Printer, Phone, CheckCircle2, Clock, Truck, XCircle, Copy, Upload, Ban } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    brand: string;
    images: string[];
  };
  size: string;
  color: string;
  packQuantity: number;
  packSize: number;
  wholesalePrice: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  totalPacks: number;
  totalItems: number;
  businessName: string;
  gstin: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  paymentReceipt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    businessName: string;
    gstin: string;
  };
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  Pending: {
    color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200',
    icon: <Clock className="w-4 h-4" />, label: 'Pending'
  },
  Confirmed: {
    color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200',
    icon: <CheckCircle2 className="w-4 h-4" />, label: 'Confirmed'
  },
  Shipped: {
    color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200',
    icon: <Truck className="w-4 h-4" />, label: 'Shipped'
  },
  Delivered: {
    color: 'text-green-700', bg: 'bg-green-50 border-green-200',
    icon: <CheckCircle2 className="w-4 h-4" />, label: 'Delivered'
  },
  Cancelled: {
    color: 'text-red-700', bg: 'bg-red-50 border-red-200',
    icon: <XCircle className="w-4 h-4" />, label: 'Cancelled'
  },
};

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const { token, apiUrl, user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [actionError, setActionError] = useState('');
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      router.push(`/login?redirect=/receipt/${params.id}`);
      return;
    }
    fetchOrder();
  }, [token, params.id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${apiUrl}/orders/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order not found');
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(`${apiUrl}/orders/${order?._id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setActionMsg('Order cancelled successfully');
      fetchOrder();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err: any) {
      setActionError(err.message);
      setTimeout(() => setActionError(''), 3000);
    }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const res = await fetch(`${apiUrl}/orders/${order?._id}/receipt`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentReceipt: reader.result }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setActionMsg('Payment receipt uploaded!');
        fetchOrder();
        setTimeout(() => setActionMsg(''), 3000);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setActionError(err.message);
      setTimeout(() => setActionError(''), 3000);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order?._id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-stone-500">
        Loading receipt...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-rose-800 font-bold mb-4">{error || 'Order not found'}</p>
        <Link href="/products" className="text-sm underline text-stone-600">Back to Catalog</Link>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.Pending;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow" ref={receiptRef}>

      {/* Action Buttons (hidden when printing) */}
      <div className="flex justify-between items-center mb-6 no-print">
        <Link
          href="/cart"
          className="inline-flex items-center text-xs font-bold text-stone-600 hover:text-rose-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back</span>
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Receipt Card */}
      <div className="bg-white border-2 border-stone-200 rounded-xl shadow-lg overflow-hidden print:border print:shadow-none">

        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-rose-950 to-stone-900 text-white px-6 sm:px-8 py-6 print:bg-white print:text-stone-900 print:border-b-2 print:border-stone-300">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif">RIYA TOUCH</h1>
              <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-widest print:text-amber-700">
                Wholesale Hosiery & Undergarments
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5 print:text-stone-500">
                Delhi, India
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-stone-400 uppercase print:text-stone-500">Booking Receipt</p>
              <p className="text-lg font-bold font-mono tracking-tight print:text-stone-900">
                #{order._id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Status Badge + Date */}
        <div className="px-6 sm:px-8 py-3 border-b border-stone-200 flex flex-wrap justify-between items-center gap-2 text-xs">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full border font-bold ${status.bg} ${status.color}`}>
              {status.icon}
              <span>{status.label}</span>
            </span>
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full border font-bold ${
              order.paymentStatus === 'Paid'
                ? 'bg-green-50 border-green-200 text-green-700'
                : order.paymentStatus === 'Failed'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              {order.paymentStatus === 'Paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              <span>{order.paymentStatus === 'Paid' ? 'Paid' : order.paymentStatus}</span>
            </span>
          </div>
          <p className="text-stone-400 font-medium">
            Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Business & Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 sm:px-8 py-5 border-b border-stone-200 text-xs">
          <div>
            <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-1.5 text-[10px]">Bill To / Buyer</h4>
            <p className="font-bold text-stone-800">{order.businessName}</p>
            {order.gstin && <p className="text-[10px] text-rose-700 font-semibold">GSTIN: {order.gstin}</p>}
            <p className="text-stone-500 mt-0.5">{order.user?.name}</p>
            <p className="text-stone-500">{order.user?.phone}</p>
            <p className="text-stone-500">{order.user?.email}</p>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-1.5 text-[10px]">Ship To</h4>
            <p className="text-stone-700">{order.shippingAddress.street}</p>
            <p className="text-stone-700">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p className="text-stone-700">Pincode: {order.shippingAddress.pincode}</p>
            <p className="text-stone-500 mt-1 font-semibold">Payment: {order.paymentMethod}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-6 sm:px-8 py-4 border-b border-stone-200">
          <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[10px] mb-3">Order Items</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-bold text-[10px] uppercase tracking-wider">
                  <th className="pb-2 text-left">#</th>
                  <th className="pb-2 text-left">Product</th>
                  <th className="pb-2 text-left">Size</th>
                  <th className="pb-2 text-right">Rate/Pc</th>
                  <th className="pb-2 text-right">Pcs/Pack</th>
                  <th className="pb-2 text-right">Packs</th>
                  <th className="pb-2 text-right">Total Pcs</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((item, idx) => {
                  const lineTotal = item.wholesalePrice * item.packSize * item.packQuantity;
                  return (
                    <tr key={idx} className="text-stone-700">
                      <td className="py-2.5 font-bold text-stone-400">{idx + 1}</td>
                      <td className="py-2.5">
                        <p className="font-bold text-stone-900">{item.product?.name || 'Deleted Product'}</p>
                        <span className="text-[10px] text-stone-400">{item.product?.brand}</span>
                      </td>
                      <td className="py-2.5 font-semibold">{item.size}</td>
                      <td className="py-2.5 text-right font-mono">₹{item.wholesalePrice}</td>
                      <td className="py-2.5 text-right">{item.packSize}</td>
                      <td className="py-2.5 text-right font-bold">{item.packQuantity}</td>
                      <td className="py-2.5 text-right">{item.packQuantity * item.packSize}</td>
                      <td className="py-2.5 text-right font-bold font-mono">₹{lineTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="px-6 sm:px-8 py-5 border-b border-stone-200">
          <div className="max-w-xs ml-auto space-y-2 text-sm">
            <div className="flex justify-between text-xs text-stone-600">
              <span>Total Packs (Boxes)</span>
              <span className="font-bold text-stone-900">{order.totalPacks}</span>
            </div>
            <div className="flex justify-between text-xs text-stone-600">
              <span>Total Pieces</span>
              <span className="font-bold text-stone-900">{order.totalItems}</span>
            </div>
            <div className="flex justify-between text-xs text-stone-600">
              <span>Transport / Shipping</span>
              <span className="font-semibold text-green-700">To be calculated</span>
            </div>
            <div className="border-t-2 border-stone-300 pt-2 flex justify-between items-baseline">
              <span className="font-bold text-stone-900 uppercase">Grand Total</span>
              <span className="text-xl font-extrabold text-rose-900">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Payment Instructions (if Bank Transfer) */}
        {order.paymentMethod === 'Bank Transfer' && order.paymentStatus !== 'Paid' && (
          <div className="px-6 sm:px-8 py-4 border-b border-stone-200 bg-amber-50/50">
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[10px] mb-2">Bank Transfer Details</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px] text-stone-700">
                <div><span className="text-amber-800 font-bold block text-[9px] uppercase">Bank</span>HDFC Bank</div>
                <div><span className="text-amber-800 font-bold block text-[9px] uppercase">A/c Name</span>Riya Touch Wholesale</div>
                <div><span className="text-amber-800 font-bold block text-[9px] uppercase">A/c No</span>50200039482910</div>
                <div><span className="text-amber-800 font-bold block text-[9px] uppercase">IFSC</span>HDFC0000291</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 text-center text-[10px] text-stone-400 space-y-1">
          <p className="font-semibold text-stone-500">Thank you for your wholesale order!</p>
          <p>
            This is a system-generated booking receipt. For any inquiries, contact us on{' '}
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-green-700 font-bold underline">
              WhatsApp
            </a>
          </p>
          <p className="text-[9px]">Order ID: {order._id}</p>
        </div>

      </div>

      {/* Action Buttons (below receipt, hidden when printing) */}
      {user && (user.role === 'admin' || (order.status === 'Pending')) && (
        <div className="mt-6 flex flex-wrap gap-3 no-print">
          {actionMsg && (
            <div className="w-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold p-3 rounded">
              {actionMsg}
            </div>
          )}
          {actionError && (
            <div className="w-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold p-3 rounded">
              {actionError}
            </div>
          )}

          {order.status === 'Pending' && order.paymentMethod === 'Bank Transfer' && order.paymentStatus !== 'Paid' && (
            <label className="inline-flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold px-4 py-2 rounded border border-amber-200 transition cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{order.paymentReceipt ? 'Update' : 'Upload'} Payment Receipt</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleReceiptUpload} />
            </label>
          )}

          {order.status === 'Pending' && user?.role !== 'admin' && (
            <button
              onClick={handleCancel}
              className="inline-flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-4 py-2 rounded border border-red-200 transition cursor-pointer"
            >
              <Ban className="w-4 h-4" />
              <span>Cancel Order</span>
            </button>
          )}
        </div>
      )}

      {/* Print-only watermark */}
      <div className="hidden print:block fixed bottom-4 right-4 text-[8px] text-stone-300">
        Generated by Riya Touch Wholesale Portal
      </div>
    </div>
  );
}
