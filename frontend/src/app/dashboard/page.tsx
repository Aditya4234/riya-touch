"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ProductCard, { ProductType } from '../../components/ProductCard';
import { Sparkles, ArrowRight, ShoppingBag, PhoneCall } from 'lucide-react';

export default function DashboardPage() {
  const { user, apiUrl, loading } = useAuth();
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch(`${apiUrl}/products?isFeatured=true`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.products || data;
        if (Array.isArray(list)) {
          setFeaturedProducts(list.slice(0, 4));
        }
        setFetching(false);
      })
      .catch((err) => {
        console.error('Error fetching featured products:', err);
        setFetching(false);
      });
  }, [apiUrl]);

  if (loading || !user) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-rose-900 border-t-transparent rounded-full" />
      </div>
    );
  }

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
    <div className="flex flex-col flex-grow">

      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-rose-950 to-stone-900 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif">
              Welcome back, {user.businessName || user.name}
            </h1>
            <p className="text-stone-300 text-sm mt-1">
              Browse our catalog and place your bulk order today.
            </p>
          </div>
          <Link
            href="/products"
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition shadow-lg flex items-center space-x-2 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Start Ordering</span>
          </Link>
        </div>
      </section>

      {/* Top Wholesale Brands */}
      <section className="bg-stone-100 py-10 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xs uppercase font-extrabold tracking-widest text-stone-500 mb-6">
            Wholesale Authorized Brands We Supply
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
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
          {[
            { name: "Men's Innerwear", desc: 'Briefs, Trunks, Vests, Boxers & Thermals', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&auto=format&fit=crop&q=80', category: 'Men' },
            { name: "Women's Innerwear", desc: 'Panties, Brassieres, Camisoles & Socks', img: 'https://images.unsplash.com/photo-1618677831708-0e7fda3148b4?w=600&auto=format&fit=crop&q=80', category: 'Women' },
            { name: "Girls' Innerwear", desc: 'Briefs, Panties, Vests & Socks by Riya Touch', img: 'https://images.unsplash.com/photo-1489269637500-aaa0e757be08?w=600&auto=format&fit=crop&q=80', category: 'Girls' },
            { name: "Kids' Hosiery", desc: 'Comfort Vests, Briefs & Colorful Socks', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80', category: 'Kids' },
          ].map((cat) => (
            <Link
              key={cat.category}
              href={`/products?category=${cat.category}`}
              className="group relative overflow-hidden rounded-xl h-80 shadow-md"
            >
              <div className="absolute inset-0 bg-stone-900/60 group-hover:bg-stone-900/50 transition-colors z-10"></div>
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
              />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white font-serif">{cat.name}</h3>
                <p className="text-stone-300 text-xs mt-1">{cat.desc}</p>
                <span className="mt-4 inline-flex items-center text-xs font-bold text-amber-500 uppercase tracking-wider group-hover:text-amber-400">
                  <span>View Products</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
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

          {fetching ? (
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

      {/* How To Order */}
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
