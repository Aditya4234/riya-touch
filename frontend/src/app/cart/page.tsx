"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, ShieldAlert, Phone, CornerDownRight } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalAmount, totalPacks, totalItems, minOrderValue, isMinOrderMet } = useCart();
  const { user } = useAuth();

  const amtShort = minOrderValue - totalAmount;

  const getWhatsAppLink = () => {
    let msg = `*Riya Touch Wholesale Order Inquiry*\n\n`;
    if (user) {
      msg += `*Buyer Details:*\n`;
      msg += `Name: ${user.name}\n`;
      if (user.businessName) msg += `Business: ${user.businessName}\n`;
      if (user.gstin) msg += `GSTIN: ${user.gstin}\n`;
      msg += `Phone: ${user.phone}\n\n`;
    }
    
    msg += `*Order Items:*\n`;
    cart.forEach((item, index) => {
      const subtotal = item.wholesalePrice * item.packSize * item.packQuantity;
      msg += `${index + 1}. *${item.brand}* - ${item.name}\n`;
      msg += `   Size: ${item.size} | Color: ${item.color}\n`;
      msg += `   Qty: *${item.packQuantity} Packs* (${item.packQuantity * item.packSize} pcs) @ ₹${item.wholesalePrice}/pc\n`;
      msg += `   Subtotal: *₹${subtotal}*\n\n`;
    });

    msg += `----------------------------\n`;
    msg += `*Total Packs:* ${totalPacks} Boxes\n`;
    msg += `*Total Pieces:* ${totalItems} Pcs\n`;
    msg += `*Grand Total:* *₹${totalAmount}*\n\n`;
    msg += `Please book this order and share invoice/payment details.`;

    return `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`;
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center space-y-5">
        <ShoppingCart className="w-16 h-16 text-stone-300" />
        <h1 className="text-2xl font-bold text-stone-850 font-serif">Your Wholesale Cart is Empty</h1>
        <p className="text-xs text-stone-400 max-w-sm">
          You haven't added any items to your wholesale inquiry yet. Visit the catalog to choose premium vests, briefs, socks, and panties.
        </p>
        <Link
          href="/products"
          className="bg-rose-900 hover:bg-rose-800 text-white font-semibold px-6 py-3 rounded text-xs uppercase tracking-wider transition"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
      
      <h1 className="text-3xl font-extrabold text-stone-900 mb-8 font-serif">Wholesale Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-250 hidden md:grid grid-cols-12 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <div className="col-span-6">Item Specifications</div>
              <div className="col-span-3 text-center">Pack Quantity (Boxes)</div>
              <div className="col-span-2 text-right">Pack Price</div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y divide-stone-200">
              {cart.map((item) => {
                const itemPackPrice = item.wholesalePrice * item.packSize;
                const subtotal = itemPackPrice * item.packQuantity;

                return (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Item details */}
                    <div className="col-span-12 md:col-span-6 flex items-center space-x-4">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&auto=format&fit=crop&q=80'} 
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded border border-stone-200 p-1 bg-stone-50 flex-shrink-0"
                      />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wide">{item.brand}</span>
                        <h3 className="font-bold text-stone-900 text-sm line-clamp-1">{item.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600 font-semibold uppercase">Size: {item.size}</span>
                          <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600 font-semibold">Color: {item.color}</span>
                          <span className="text-[10px] bg-rose-50 px-2 py-0.5 rounded text-rose-800 font-semibold">{item.packSize} Pcs/Box</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-6 md:col-span-3 flex justify-center md:justify-center">
                      <div className="flex items-center border border-stone-300 rounded overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.packQuantity - 1)}
                          className="p-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 py-1 text-sm font-bold text-stone-900 bg-white min-w-[36px] text-center">
                          {item.packQuantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.packQuantity + 1)}
                          className="p-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Pack Price / Subtotal */}
                    <div className="col-span-5 md:col-span-2 text-right">
                      <div className="text-sm font-extrabold text-stone-900">₹{subtotal}</div>
                      <div className="text-[10px] text-stone-400 font-medium">₹{itemPackPrice} / Box ({item.packQuantity * item.packSize} pcs)</div>
                    </div>

                    {/* Remove */}
                    <div className="col-span-1 text-right md:text-center">
                      <button
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-stone-400 hover:text-red-700 transition p-1 cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Wholesale Order Summary */}
        <div className="space-y-6">
          
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
            <h2 className="font-bold text-stone-900 text-base border-b border-stone-150 pb-3 font-serif">Order Summary</h2>
            
            <div className="space-y-2 text-xs font-semibold text-stone-600">
              <div className="flex justify-between">
                <span>Total Box Packs:</span>
                <span className="text-stone-950 font-bold">{totalPacks} Boxes</span>
              </div>
              <div className="flex justify-between">
                <span>Total Pieces:</span>
                <span className="text-stone-950 font-bold">{totalItems} Pcs</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Transport:</span>
                <span className="text-green-700">Calculated at booking</span>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-stone-900">Total Wholesale Cost:</span>
              <span className="text-xl font-extrabold text-rose-900">₹{totalAmount}</span>
            </div>

            {/* Minimum Order Value Alert */}
            <div className={`p-4 rounded-md border ${
              isMinOrderMet
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <div className="flex space-x-2">
                <ShieldAlert className={`w-5 h-5 flex-shrink-0 ${isMinOrderMet ? 'text-green-700' : 'text-rose-700'}`} />
                <div className="text-xs">
                  {isMinOrderMet ? (
                    <div>
                      <h4 className="font-bold">Minimum Order Met</h4>
                      <p className="mt-0.5 text-[11px] text-green-700">Your order meets the ₹{minOrderValue} wholesale requirement. You can proceed to checkout.</p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-bold">Minimum Order Limit Not Met</h4>
                      <p className="mt-0.5 text-[11px] text-rose-700">Add <span className="font-bold">₹{amtShort}</span> more to unlock wholesale pricing and place your booking.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              {isMinOrderMet ? (
                <>
                  <Link
                    href="/checkout"
                    className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-3 rounded text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1.5"
                  >
                    <Phone className="w-4.5 h-4.5" />
                    <span>Book Direct on WhatsApp</span>
                  </a>
                </>
              ) : (
                <>
                  <button
                    disabled
                    className="w-full bg-stone-200 text-stone-400 font-bold py-3 rounded text-xs uppercase tracking-wider cursor-not-allowed"
                  >
                    Checkout Locked (Min ₹5k)
                  </button>
                  <Link
                    href="/products"
                    className="w-full border border-stone-300 hover:border-stone-400 text-stone-700 font-semibold py-3 rounded text-xs uppercase tracking-wider transition flex items-center justify-center bg-white"
                  >
                    Add More Items
                  </Link>
                </>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
