"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ArrowLeft, CheckCircle2, Phone, Copy, Box } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalAmount, totalPacks, totalItems, clearCart, isMinOrderMet } = useCart();
  const { user, token, apiUrl } = useAuth();

  // Form states
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Bank Transfer' | 'Razorpay'>('COD');
  
  // App States
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [error, setError] = useState('');
  const [copiedText, setCopiedText] = useState('');

  // Redirect if cart is empty or min order not met
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    } else if (!isMinOrderMet) {
      router.push('/cart');
    }
  }, [cart, isMinOrderMet, router]);

  // Autofill user profile data
  useEffect(() => {
    if (user) {
      setBusinessName(user.businessName || user.name);
      setGstin(user.gstin || '');
      setPhone(user.phone || '');
      if (user.address) {
        setStreet(user.address.street || '');
        setCity(user.address.city || '');
        setState(user.address.state || '');
        setPincode(user.address.pincode || '');
      }
    }
  }, [user]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/checkout`);
      return;
    }

    if (!street || !city || !state || !pincode || !phone || !businessName) {
      setError('Please fill in all required business and address fields.');
      return;
    }

    setIsOrdering(true);
    setError('');

    const orderPayload = {
      items: cart.map(item => ({
        productId: item.productId,
        size: item.size,
        color: item.color,
        packQuantity: item.packQuantity
      })),
      businessName,
      gstin,
      shippingAddress: {
        street,
        city,
        state,
        pincode
      },
      paymentMethod
    };

    try {
      const res = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error placing order');
      }

      if (data.paymentMethod === 'Razorpay') {
        const paymentRes = await fetch(`${apiUrl}/payment/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ orderId: data._id })
        });
        const paymentData = await paymentRes.json();
        if (paymentRes.ok && (window as any).Razorpay) {
          const rzp = new (window as any).Razorpay({
            key: paymentData.key,
            amount: paymentData.amount,
            currency: paymentData.currency,
            name: 'Riya Touch Wholesale',
            description: `Order #${data._id}`,
            order_id: paymentData.id,
            handler: async (response: any) => {
              await fetch(`${apiUrl}/payment/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(response)
              });
              setOrderSuccess(data);
              clearCart();
            },
            modal: {
              ondismiss: () => setError('Payment cancelled. Your order is pending.')
            }
          });
          rzp.open();
        } else {
          setError('Payment gateway unavailable. Your order is saved.');
        }
        return;
      }

      setOrderSuccess(data);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'Order failed. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  const getWhatsAppSuccessLink = () => {
    if (!orderSuccess) return '#';
    let msg = `*Riya Touch Wholesale Order Booked!*\n\n`;
    msg += `*Order ID:* ${orderSuccess._id}\n`;
    msg += `*Business Name:* ${orderSuccess.businessName}\n`;
    if (orderSuccess.gstin) msg += `*GSTIN:* ${orderSuccess.gstin}\n`;
    msg += `*Total Amount:* *₹${orderSuccess.totalAmount}*\n`;
    msg += `*Total Packs:* ${orderSuccess.totalPacks} Boxes\n`;
    msg += `*Payment Method:* ${orderSuccess.paymentMethod}\n\n`;
    
    if (orderSuccess.paymentMethod === 'Bank Transfer') {
      msg += `I will share the transaction slip soon. Please verify.`;
    } else {
      msg += `Please confirm my order and share shipping delivery status.`;
    }

    return `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`;
  };

  // Success view
  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 animate-bounce" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif">Order Booking Confirmed!</h1>
        
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 text-left space-y-3 text-sm">
          <p className="text-stone-500 font-medium">Order ID: <span className="font-extrabold text-stone-900">{orderSuccess._id}</span></p>
          <p className="text-stone-500 font-medium">Firm Name: <span className="font-bold text-stone-900">{orderSuccess.businessName}</span></p>
          <p className="text-stone-500 font-medium">Wholesale Total: <span className="font-extrabold text-rose-950">₹{orderSuccess.totalAmount}</span></p>
          <p className="text-stone-500 font-medium">Total Volume: <span className="font-bold text-stone-900">{orderSuccess.totalPacks} Boxes ({orderSuccess.totalItems} Pieces)</span></p>
          <p className="text-stone-500 font-medium">Payment Mode: <span className="font-bold text-amber-700">{orderSuccess.paymentMethod}</span></p>
        </div>

        {orderSuccess.paymentMethod === 'Bank Transfer' && (
          <div className="bg-amber-50 border border-amber-200 text-amber-950 rounded-lg p-5 text-left text-xs space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-amber-900">Pending Verification Instruction</h4>
            <p className="text-[11px] leading-relaxed">
              Your order status is currently <span className="font-bold">Pending</span>. Please transfer ₹{orderSuccess.totalAmount} to the bank details below and send the transaction slip/screenshot on our WhatsApp for instant approval.
            </p>
            <div className="bg-white p-3 rounded border border-amber-250 font-mono space-y-1.5 text-stone-800">
              <p>Bank: HDFC Bank, Gandhi Nagar Branch</p>
              <p>A/c Name: Riya Touch Wholesale</p>
              <p>A/c No: 50200039482910</p>
              <p>IFSC Code: HDFC0000291</p>
              <p>UPI ID: riyatouch@hdfc</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/receipt/${orderSuccess._id}`}
            className="bg-stone-950 hover:bg-stone-900 text-white font-bold px-6 py-3 rounded text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1.5"
          >
            <span>View Booking Receipt</span>
          </Link>
          <a
            href={getWhatsAppSuccessLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-700 hover:bg-green-600 text-white font-bold px-6 py-3 rounded text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1.5"
          >
            <Phone className="w-4.5 h-4.5" />
            <span>Send Invoice to WhatsApp</span>
          </a>
          <Link
            href="/products"
            className="bg-stone-950 hover:bg-stone-900 text-white font-bold px-6 py-3 rounded text-xs uppercase tracking-wider transition flex items-center justify-center"
          >
            Continue Catalog Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
      
      {/* Back to Cart */}
      <div className="mb-6">
        <Link 
          href="/cart" 
          className="inline-flex items-center text-xs font-bold text-stone-600 hover:text-rose-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Wholesale Cart</span>
        </Link>
      </div>

      <h1 className="text-3xl font-extrabold text-stone-900 mb-8 font-serif">Wholesale Checkout Billing</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Form Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Business & Firm Info */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm border-b border-stone-150 pb-2 flex items-center">
              <ShieldCheck className="w-4.5 h-4.5 mr-1.5 text-rose-900" />
              Business & Billing Info
            </h3>

            {!user && (
              <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded border border-amber-250">
                You must be logged in as a wholesale customer to place bookings. <Link href="/login?redirect=/checkout" className="underline font-bold hover:text-amber-955">Login / Register Here</Link>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Business / Shop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Gupta Innerwears & Hosiery"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">GSTIN (Optional for Billing Credit)</label>
                <input
                  type="text"
                  placeholder="07AAAAA1111A1Z1"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-800 uppercase"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Contact Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9999988888 (WhatsApp active preferred)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-800"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm border-b border-stone-150 pb-2">
              Shipping & Transport Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1 md:col-span-4">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Street / Shop Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Bazar Gali No. 4, Shop 3"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:outline-none"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">City *</label>
                <input
                  type="text"
                  required
                  placeholder="Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">State *</label>
                <input
                  type="text"
                  required
                  placeholder="Delhi"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Pincode *</label>
                <input
                  type="text"
                  required
                  placeholder="110051"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm border-b border-stone-150 pb-2">
              Wholesale Payment Option
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* COD */}
              <label className={`border rounded-lg p-4 flex items-start space-x-3 cursor-pointer transition ${
                paymentMethod === 'COD' ? 'border-rose-900 bg-rose-50/20' : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-rose-900 focus:ring-rose-900"
                />
                <div className="text-xs">
                  <h4 className="font-bold text-stone-900">COD / Pay on Delivery</h4>
                  <p className="text-stone-500 mt-1">Pay when goods arrive at your shop via transport carrier.</p>
                </div>
              </label>

              {/* Bank Transfer */}
              <label className={`border rounded-lg p-4 flex items-start space-x-3 cursor-pointer transition ${
                paymentMethod === 'Bank Transfer' ? 'border-rose-900 bg-rose-50/20' : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Bank Transfer'}
                  onChange={() => setPaymentMethod('Bank Transfer')}
                  className="mt-1 text-rose-900 focus:ring-rose-900"
                />
                <div className="text-xs">
                  <h4 className="font-bold text-stone-900">Direct Bank / UPI Transfer</h4>
                  <p className="text-stone-500 mt-1">Transfer directly to our HDFC corporate account or business UPI ID.</p>
                </div>
              </label>

              {/* Razorpay */}
              <label className={`border rounded-lg p-4 flex items-start space-x-3 cursor-pointer transition ${
                paymentMethod === 'Razorpay' ? 'border-rose-900 bg-rose-50/20' : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  className="mt-1 text-rose-900 focus:ring-rose-900"
                />
                <div className="text-xs">
                  <h4 className="font-bold text-stone-900">Pay Online (Card / UPI / NetBanking)</h4>
                  <p className="text-stone-500 mt-1">Secure instant payment via Razorpay — cards, UPI, or net banking.</p>
                </div>
              </label>

            </div>

            {paymentMethod === 'Bank Transfer' && (
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-900">Riya Touch Official Account</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px] text-stone-700">
                  <div className="flex justify-between border-b border-stone-200 pb-1.5 col-span-2">
                    <span>Account Name: Riya Touch Wholesale</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span>Bank: HDFC Bank</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span>Branch: Gandhi Nagar</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span>A/c No: 50200039482910</span>
                    <button type="button" onClick={() => copyToClipboard('50200039482910', 'A/c No')} className="text-rose-900 hover:underline flex items-center"><Copy className="w-3 h-3 ml-1" /></button>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span>IFSC: HDFC0000291</span>
                    <button type="button" onClick={() => copyToClipboard('HDFC0000291', 'IFSC')} className="text-rose-900 hover:underline flex items-center"><Copy className="w-3 h-3 ml-1" /></button>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-1.5 col-span-2">
                    <span>Business UPI ID: riyatouch@hdfc</span>
                    <button type="button" onClick={() => copyToClipboard('riyatouch@hdfc', 'UPI')} className="text-rose-900 hover:underline flex items-center"><Copy className="w-3 h-3 ml-1" /></button>
                  </div>
                </div>
                {copiedText && (
                  <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    Copied {copiedText} successfully!
                  </span>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Order Review Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm border-b border-stone-150 pb-2 font-serif">Review Order</h3>
            
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-xs items-center">
                  <div className="max-w-[70%]">
                    <h4 className="font-bold text-stone-800 truncate">{item.name}</h4>
                    <span className="text-[10px] text-stone-500">Size: {item.size} | Qty: {item.packQuantity} Packs ({item.packQuantity * item.packSize} pcs)</span>
                  </div>
                  <span className="font-bold text-stone-900">₹{item.wholesalePrice * item.packSize * item.packQuantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-3 space-y-2 text-xs font-semibold text-stone-600">
              <div className="flex justify-between">
                <span>Total Packs:</span>
                <span className="text-stone-950 font-bold">{totalPacks} Boxes</span>
              </div>
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="text-stone-950 font-bold">{totalItems} Pcs</span>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline">
              <span className="text-xs font-bold text-stone-900">Grand Wholesale Total:</span>
              <span className="text-lg font-extrabold text-rose-900">₹{totalAmount}</span>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-800 text-[11px] p-2.5 rounded border border-rose-200 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isOrdering || !user}
              className={`w-full py-3 rounded text-xs font-bold uppercase tracking-wider transition duration-200 flex items-center justify-center space-x-1.5 cursor-pointer ${
                isOrdering || !user
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-rose-900 hover:bg-rose-800 text-white shadow-md'
              }`}
            >
              {isOrdering ? (
                <span>Booking Order...</span>
              ) : (
                <>
                  <Box className="w-4.5 h-4.5" />
                  <span>Confirm & Book Wholesale Order</span>
                </>
              )}
            </button>

            {!user && (
              <p className="text-[10px] text-rose-800 text-center font-bold bg-rose-50 p-2 rounded">
                * You must be logged in to confirm bookings.
              </p>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
