"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useCart, CartItem } from '../../../context/CartContext';
import { ArrowLeft, Box, Check, Info, ShoppingCart, Percent } from 'lucide-react';
import Link from 'next/link';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { apiUrl } = useAuth();
  const { addBulkToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Matrix State: size -> color -> quantity (packs)
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [addedAlert, setAddedAlert] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        // Initialize quantities to 0
        const initialQuants: { [key: string]: number } = {};
        data.sizes.forEach((size: string) => {
          data.colors.forEach((color: string) => {
            initialQuants[`${size}-${color}`] = 0;
          });
        });
        setQuantities(initialQuants);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl, id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-500">
        Loading wholesale specifications...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-850">
        <p className="text-red-800 font-bold mb-4">Error: {error || 'Product not found'}</p>
        <Link href="/products" className="bg-stone-900 text-white px-4 py-2 rounded text-xs font-semibold">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleQtyChange = (size: string, color: string, value: string) => {
    const val = parseInt(value) || 0;
    const key = `${size}-${color}`;
    setQuantities(prev => ({
      ...prev,
      [key]: val >= 0 ? val : 0
    }));
  };

  // Calculations for matrix
  let totalPacksSelected = 0;
  let totalPiecesSelected = 0;
  let totalCostSelected = 0;

  Object.entries(quantities).forEach(([key, qty]) => {
    if (qty > 0) {
      totalPacksSelected += qty;
      totalPiecesSelected += qty * product.packSize;
      totalCostSelected += qty * product.packSize * product.wholesalePrice;
    }
  });

  const handleAddBulkToCart = () => {
    const itemsToAdd: CartItem[] = [];

    Object.entries(quantities).forEach(([key, qty]) => {
      if (qty > 0) {
        const [size, color] = key.split('-');
        itemsToAdd.push({
          productId: product._id,
          name: product.name,
          brand: product.brand,
          image: product.images[0] || '',
          size,
          color,
          packQuantity: qty,
          packSize: product.packSize,
          wholesalePrice: product.wholesalePrice
        });
      }
    });

    if (itemsToAdd.length > 0) {
      addBulkToCart(itemsToAdd);
      setAddedAlert(true);
      
      // Reset quantities
      const resetQuants: { [key: string]: number } = {};
      product.sizes.forEach((size: string) => {
        product.colors.forEach((color: string) => {
          resetQuants[`${size}-${color}`] = 0;
        });
      });
      setQuantities(resetQuants);

      setTimeout(() => {
        setAddedAlert(false);
      }, 3000);
    }
  };

  const packPrice = (product.wholesalePrice ?? 0) * (product.packSize ?? 0);
  const savingPercent = product.retailPrice > 0
    ? Math.round(((product.retailPrice - product.wholesalePrice) / product.retailPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
      
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/products" 
          className="inline-flex items-center text-xs font-bold text-stone-600 hover:text-rose-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Wholesale Catalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Product Image Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-8 aspect-square flex items-center justify-center overflow-hidden">
            <img 
              src={product.images[0] || 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80'} 
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Product Spec Panel */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold text-amber-700 tracking-widest">{product.brand}</span>
            <h1 className="text-3xl font-extrabold text-stone-900 mt-1 font-serif leading-tight">{product.name}</h1>
            <p className="text-stone-500 text-xs mt-2 uppercase tracking-wide font-medium">Category: {product.category} Wear | Type: {product.type}</p>
          </div>

          <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Retail MSRP per Pc</span>
              <span className="text-lg font-bold text-stone-600 line-through">₹{product.retailPrice}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-800 block">Wholesale Rate per Pc</span>
              <span className="text-2xl font-extrabold text-rose-900">₹{product.wholesalePrice}</span>
            </div>
            <div className="col-span-2 border-t border-stone-200 pt-3 flex justify-between items-center">
              <span className="text-xs text-stone-600 font-semibold flex items-center">
                <Box className="w-4 h-4 mr-1.5 text-stone-500" />
                Box Packaging: {product.packSize} Pcs
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded flex items-center">
                <Percent className="w-3.5 h-3.5 mr-0.5" />
                {savingPercent}% wholesale margin
              </span>
            </div>
            <div className="col-span-2 bg-rose-50 border border-rose-100 rounded p-2.5 flex justify-between items-center text-xs font-bold text-rose-950">
              <span>Wholesale Box Pack Cost:</span>
              <span>₹{packPrice} / Pack of {product.packSize} pieces</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-stone-850 text-sm">Product Description</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{product.description}</p>
          </div>

          <hr className="border-stone-200" />

          {/* Quick Wholesale Order Matrix */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-stone-900 text-sm flex items-center">
                <Box className="w-4.5 h-4.5 mr-1.5 text-rose-900" />
                Wholesale Size & Color Order Matrix
              </h3>
              <span className="text-[10px] text-stone-400 font-medium">Select pack quantities</span>
            </div>

            <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold">
                    <th className="p-3">Size</th>
                    <th className="p-3">Color</th>
                    <th className="p-3">Wholesale Price</th>
                    <th className="p-3 text-right">Pack Qty (Boxes)</th>
                    <th className="p-3 text-right">Total Pcs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150">
                  {product.sizes.map((size: string) => (
                    product.colors.map((color: string) => {
                      const key = `${size}-${color}`;
                      const qty = quantities[key] || 0;
                      return (
                        <tr key={key} className="hover:bg-stone-50/50 transition">
                          <td className="p-3 font-extrabold text-stone-800">{size}</td>
                          <td className="p-3 text-stone-600 font-medium">{color}</td>
                          <td className="p-3 font-semibold text-rose-900">₹{product.wholesalePrice}/Pc <br/><span className="text-[10px] text-stone-400">₹{packPrice}/Pack</span></td>
                          <td className="p-3 text-right">
                            <input
                              type="number"
                              min="0"
                              value={qty || ''}
                              placeholder="0"
                              onChange={(e) => handleQtyChange(size, color, e.target.value)}
                              className="w-16 px-2 py-1 border border-stone-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 font-bold text-stone-900"
                            />
                          </td>
                          <td className="p-3 text-right font-medium text-stone-600">
                            {qty * product.packSize} Pcs
                          </td>
                        </tr>
                      );
                    })
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selection Summary Alert */}
            <div className="bg-stone-900 text-white rounded-lg p-5 space-y-4 shadow-md">
              <div className="grid grid-cols-3 gap-2 text-center border-b border-stone-750 pb-3">
                <div>
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Total Packs</span>
                  <span className="text-base font-extrabold text-amber-500">{totalPacksSelected} Boxes</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Total Pieces</span>
                  <span className="text-base font-extrabold text-amber-500">{totalPiecesSelected} Pcs</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Total Cost</span>
                  <span className="text-base font-extrabold text-amber-500">₹{totalCostSelected}</span>
                </div>
              </div>

              {addedAlert && (
                <div className="bg-green-800 text-white text-xs font-bold rounded p-2.5 flex items-center justify-center space-x-1.5 animate-bounce">
                  <Check className="w-4 h-4" />
                  <span>Wholesale packs added to cart successfully!</span>
                </div>
              )}

              <button
                disabled={totalPacksSelected === 0}
                onClick={handleAddBulkToCart}
                className={`w-full py-3 rounded text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition ${
                  totalPacksSelected === 0
                    ? 'bg-stone-700 text-stone-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                }`}
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                <span>Add Selected Packs to Cart</span>
              </button>
              
              <div className="flex items-start text-[10px] text-stone-400 space-x-1">
                <Info className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                <span>Entering quantity of '1' adds 1 box of {product.packSize} pieces. Ensure your total cart value meets the minimum wholesale requirement of ₹5,000.</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
