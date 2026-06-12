"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import ProductCard, { ProductType } from '../components/ProductCard';
import { Sparkles, ArrowRight, ShieldCheck, Truck, ShoppingBag, PhoneCall } from 'lucide-react';

export default function HomePage() {
  const { apiUrl } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/products?isFeatured=true`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.products || data;
        if (Array.isArray(list)) {
          setFeaturedProducts(list.slice(0, 4));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching featured products:', err);
        setLoading(false);
      });
  }, [apiUrl]);

  const brands = [
    { name: 'Riya Touch', desc: 'Girls innerwear, briefs & vests' },
    { name: 'Jockey', desc: 'Premium innerwear & athleisure' },
    { name: 'Rupa', desc: 'Frontline, Air, Macroman & Thermals' },
    { name: 'Lux Cozi', desc: 'Everyday comfort vests & briefs' },
    { name: 'Dixcy Scott', desc: 'High durability men & kids hosiery' },
    { name: 'Juliet', desc: 'Elegant ladies innerwear' },
    { name: 'Trylo', desc: 'Premium ladies brassieres & shapewear' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Premium Hero Banner */}
      <section className="relative bg-gradient-to-r from-rose-950 to-stone-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 space-y-6 text-center md:text-left">
            <span className="inline-flex items-center space-x-1.5 bg-rose-800 text-rose-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct Factory Wholesale Pricing</span>
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-serif">
              Premium Undergarments <br className="hidden sm:inline" />
              <span className="text-amber-500">At India's Lowest Rates</span>
            </h1>
            <p className="text-stone-300 text-base sm:text-lg max-w-xl">
              Riya Touch is Delhi's premier wholesale supplier for hosiery retail shops. Order directly in packs and boxes with complete GST input credit bills.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link
                href="/products"
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-8 py-3.5 rounded text-sm uppercase tracking-wider transition shadow-lg flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Bulk Catalog</span>
              </Link>
              <a
                href="https://wa.me/919876543210?text=Hello%20Riya%20Touch%2C%20I%20want%20to%20place%20a%20bulk%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 hover:border-white font-semibold px-8 py-3.5 rounded text-sm uppercase tracking-wider transition flex items-center justify-center space-x-2"
              >
                <PhoneCall className="w-4 h-4 text-green-400" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
            {/* MOV Notice */}
            <div className="pt-2 text-stone-400 text-xs font-semibold">
              ⚠️ Minimum Wholesale Order Value: <span className="text-amber-500">₹5,000</span> | GST Billing Available
            </div>
          </div>

          <div className="flex-1 w-full max-w-md md:max-w-lg aspect-square bg-gradient-to-tr from-amber-600/20 to-rose-900/20 rounded-2xl border border-white/10 p-6 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute inset-0 bg-stone-900/40 rounded-2xl backdrop-blur-xs"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-sm uppercase">Quick Stats</span>
                <span className="text-xs text-stone-400">Delhi Market</span>
              </div>
              <div className="my-auto space-y-6">
                <div className="border-l-4 border-rose-800 pl-4">
                  <div className="text-3xl font-extrabold text-amber-500">₹5,000</div>
                  <div className="text-xs text-stone-400 font-medium uppercase mt-0.5">Min Order Limit</div>
                </div>
                <div className="border-l-4 border-rose-800 pl-4">
                  <div className="text-3xl font-extrabold text-white">40% - 60%</div>
                  <div className="text-xs text-stone-400 font-medium uppercase mt-0.5">Average Retail Margin</div>
                </div>
                <div className="border-l-4 border-rose-800 pl-4">
                  <div className="text-3xl font-extrabold text-white">100% Cotton</div>
                  <div className="text-xs text-stone-400 font-medium uppercase mt-0.5">High Quality Guarantee</div>
                </div>
              </div>
              <div className="text-stone-300 text-xs italic text-center border-t border-white/10 pt-4">
                "Supplying hosiery shopkeepers, retail stores, and online sellers."
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Top Wholesale Brands */}
      <section className="bg-stone-100 py-10 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xs uppercase font-extrabold tracking-widest text-stone-500 mb-6">
            Wholesale Authorized Brands We Supply
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((b) => (
              <div key={b.name} className="bg-white p-5 rounded border border-stone-200 shadow-xs flex flex-col justify-center items-center text-center hover:border-amber-600 transition">
                <span className="font-extrabold text-lg text-rose-950 font-serif tracking-tight">{b.name}</span>
                <span className="text-[10px] text-stone-500 mt-1 font-semibold">{b.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Category Portals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-bold font-serif text-stone-900">Shop By Section</h2>
          <p className="text-sm text-stone-500 mt-2">
            Select category to view products packed in bulk with size matrix ordering grids.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Men Category */}
          <Link href="/products?category=Men" className="group relative overflow-hidden rounded-xl h-80 shadow-md">
            <div className="absolute inset-0 bg-stone-900/60 group-hover:bg-stone-900/50 transition-colors z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&auto=format&fit=crop&q=80" 
              alt="Men's Undergarments" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
            />
            <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white font-serif">Men's Innerwear</h3>
              <p className="text-stone-300 text-xs mt-1">Briefs, Trunks, Vests, Boxers & Thermals</p>
              <span className="mt-4 inline-flex items-center text-xs font-bold text-amber-500 uppercase tracking-wider group-hover:text-amber-400">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Women Category */}
          <Link href="/products?category=Women" className="group relative overflow-hidden rounded-xl h-80 shadow-md">
            <div className="absolute inset-0 bg-stone-900/60 group-hover:bg-stone-900/50 transition-colors z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1618677831708-0e7fda3148b4?w=600&auto=format&fit=crop&q=80" 
              alt="Women's Undergarments" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
            />
            <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white font-serif">Women's Innerwear</h3>
              <p className="text-stone-300 text-xs mt-1">Panties, Brassieres, Camisoles & Socks</p>
              <span className="mt-4 inline-flex items-center text-xs font-bold text-amber-500 uppercase tracking-wider group-hover:text-amber-400">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Girls Category */}
          <Link href="/products?category=Girls" className="group relative overflow-hidden rounded-xl h-80 shadow-md">
            <div className="absolute inset-0 bg-stone-900/60 group-hover:bg-stone-900/50 transition-colors z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1489269637500-aaa0e757be08?w=600&auto=format&fit=crop&q=80" 
              alt="Girls' Innerwear" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
            />
            <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white font-serif">Girls' Innerwear</h3>
              <p className="text-stone-300 text-xs mt-1">Briefs, Panties, Vests & Socks by Riya Touch</p>
              <span className="mt-4 inline-flex items-center text-xs font-bold text-amber-500 uppercase tracking-wider group-hover:text-amber-400">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Kids Category */}
          <Link href="/products?category=Kids" className="group relative overflow-hidden rounded-xl h-80 shadow-md">
            <div className="absolute inset-0 bg-stone-900/60 group-hover:bg-stone-900/50 transition-colors z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80" 
              alt="Kids' Hosiery" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
            />
            <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white font-serif">Kids' Hosiery</h3>
              <p className="text-stone-300 text-xs mt-1">Comfort Vests, Briefs & Colorful Socks</p>
              <span className="mt-4 inline-flex items-center text-xs font-bold text-amber-500 uppercase tracking-wider group-hover:text-amber-400">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-stone-50 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold font-serif text-stone-900">Hot Wholesale Deals</h2>
              <p className="text-sm text-stone-500 mt-1">Our best-selling bulk hosiery packages in high demand.</p>
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center text-sm font-semibold text-rose-900 hover:text-rose-800 transition">
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg border border-stone-200 p-4 space-y-4 h-96">
                  <div className="bg-stone-200 w-full aspect-square rounded"></div>
                  <div className="bg-stone-200 h-4 w-2/3 rounded"></div>
                  <div className="bg-stone-200 h-4 w-1/2 rounded"></div>
                  <div className="bg-stone-200 h-10 w-full rounded mt-8"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {featuredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 text-center text-stone-500 border border-stone-200 rounded">
              No featured products found. Please seed the database or start the backend.
            </div>
          )}
        </div>
      </section>

      {/* Wholesale Order Guidelines / Support */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold font-serif text-stone-900">How To Place A Wholesale Order?</h2>
        <p className="text-stone-600 text-sm">
          Riya Touch makes ordering bulk apparel simple and transparent. Follow these 3 easy steps:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left pt-6">
          <div className="bg-white p-6 rounded border border-stone-200">
            <div className="bg-rose-900/10 text-rose-900 w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">1</div>
            <h4 className="font-bold text-stone-800">Add Box Packs</h4>
            <p className="text-xs text-stone-500 mt-2">Select your products and fill in the size-wise pack quantities on the order grid.</p>
          </div>
          <div className="bg-white p-6 rounded border border-stone-200">
            <div className="bg-rose-900/10 text-rose-900 w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">2</div>
            <h4 className="font-bold text-stone-800">Fill Firm & GST</h4>
            <p className="text-xs text-stone-500 mt-2">Enter your billing address and GSTIN (optional) during checkout to get tax invoice benefit.</p>
          </div>
          <div className="bg-white p-6 rounded border border-stone-200">
            <div className="bg-rose-900/10 text-rose-900 w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">3</div>
            <h4 className="font-bold text-stone-800">Checkout Option</h4>
            <p className="text-xs text-stone-500 mt-2">Choose "WhatsApp Order" to chat directly, or "Bank/UPI Transfer" to process the order immediately.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
