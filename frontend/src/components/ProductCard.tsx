import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Percent } from 'lucide-react';

export interface ProductType {
  _id: string;
  name: string;
  description: string;
  brand: string;
  category: 'Women' | 'Girls';
  type: string;
  images: string[];
  wholesalePrice: number;
  retailPrice: number;
  packSize: number;
  sizes: string[];
  colors: string[];
  stock: number;
}

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const packPrice = product.wholesalePrice * product.packSize;
  const savingPercent = Math.round(((product.retailPrice - product.wholesalePrice) / product.retailPrice) * 100);

  return (
    <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group h-full">
      {/* Product Image */}
      <div className="relative pt-[100%] bg-stone-50 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400 bg-stone-100 text-xs">
            No Image
          </div>
        )}
        
        {/* Savings Badge */}
        <div className="absolute top-2 left-2 bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm flex items-center shadow-xs">
          <Percent className="w-3 h-3 mr-0.5" />
          <span>{savingPercent}% wholesale margins</span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-sm uppercase tracking-wider">
          {product.category}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Brand */}
          <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">
            {product.brand}
          </span>
          
          {/* Name */}
          <Link href={`/product/${product._id}`} className="block mt-1">
            <h3 className="font-semibold text-stone-900 text-sm hover:text-rose-900 transition-colors line-clamp-2 min-h-[40px]">
              {product.name}
            </h3>
          </Link>
          
          {/* Packaging details */}
          <div className="mt-2 text-xs text-stone-500 font-medium">
            Packaging: <span className="text-stone-850 font-bold">{product.packSize} Pcs Box / Pack</span>
          </div>
        </div>

        {/* Pricing matrix block */}
        <div className="mt-4 border-t border-stone-100 pt-3">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs text-stone-500">Retail MSRP:</span>
            <span className="text-xs text-stone-600 line-through">₹{product.retailPrice}/Pc</span>
          </div>
          
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-stone-500 font-medium">Wholesale Rate:</span>
            <span className="text-base font-extrabold text-rose-900">₹{product.wholesalePrice}<span className="text-[10px] font-normal text-stone-500">/Pc</span></span>
          </div>

          <div className="mt-2.5 bg-rose-50 rounded px-2.5 py-1.5 flex justify-between items-center">
            <span className="text-[11px] font-semibold text-rose-900">Pack Cost:</span>
            <span className="text-sm font-bold text-rose-950">₹{packPrice} <span className="text-[9px] font-medium text-stone-600">({product.packSize} Pcs)</span></span>
          </div>
        </div>
      </div>

      {/* Button footer */}
      <div className="p-4 pt-0">
        <Link 
          href={`/product/${product._id}`}
          className="w-full flex items-center justify-center space-x-2 bg-stone-900 hover:bg-rose-900 text-white py-2 rounded text-xs font-semibold tracking-wider transition-colors duration-200 uppercase cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick Bulk Order</span>
        </Link>
      </div>
    </div>
  );
}
