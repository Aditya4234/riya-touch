"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, BadgeIndianRupee, Warehouse, PackageCheck, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-rose-950 via-stone-900 to-amber-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#fff_0.5px,_transparent_0.5px)] bg-[length:20px_20px] opacity-[0.07]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-amber-300 text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>India&apos;s Trusted Wholesale Hosiery Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-tight font-serif">
              Riya<span className="text-amber-500">Touch</span>
            </h1>

            <p className="text-xl sm:text-2xl text-stone-300 max-w-3xl mx-auto font-light leading-relaxed">
              Premium undergarments & hosiery at <span className="text-amber-400 font-semibold">factory-direct wholesale rates</span>.
              Bulk orders with full GST input credit.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/login"
                className="group bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-10 py-4 rounded-xl text-base uppercase tracking-wider transition-all shadow-2xl shadow-amber-600/25 hover:shadow-amber-500/40 flex items-center space-x-3"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Merchant Login</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/products"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold px-10 py-4 rounded-xl text-base uppercase tracking-wider transition-all flex items-center space-x-3"
              >
                <span>Browse Catalog</span>
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400 font-medium">
              <span className="flex items-center space-x-1.5">
                <BadgeIndianRupee className="w-4 h-4 text-amber-500" /> Min Order ₹5,000
              </span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> GST Invoice
              </span>
              <span className="flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-amber-500" /> Pan-India Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-stone-950 border-y border-stone-800 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '40+', label: 'Years of Trust', icon: Warehouse },
            { value: '200+', label: 'Wholesale Products', icon: PackageCheck },
            { value: '1000+', label: 'Happy Retailers', icon: ShoppingBag },
            { value: '40-60%', label: 'Avg. Retail Margin', icon: BadgeIndianRupee },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <stat.icon className="w-6 h-6 text-amber-500 mx-auto" />
              <div className="text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-xs text-stone-500 font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#fdfcfb]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold font-serif text-stone-900">Why Choose Riya Touch?</h2>
            <p className="text-stone-500 mt-3 text-lg">Delhi's premier wholesale supplier for hosiery & innerwear retailers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Warehouse,
                title: 'Factory Direct Pricing',
                desc: 'We source directly from manufacturers and pass the savings to you. No middlemen, just unbeatable wholesale rates.'
              },
              {
                icon: ShieldCheck,
                title: 'GST Billing & Tax Credit',
                desc: 'Every order comes with a complete GST invoice. Claim full input tax credit on your business purchases.'
              },
              {
                icon: Truck,
                title: 'Pan India Delivery',
                desc: 'Reliable shipping across all states. Orders dispatched within 24-48 hours via trusted logistics partners.'
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-rose-900/10 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="w-7 h-7 text-rose-900" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-stone-50 border-y border-stone-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold font-serif text-stone-900 mb-8">Authorised Brands We Supply</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {['Riya Touch', 'Jockey', 'Rupa', 'Lux Cozi', 'Dixcy Scott', 'Juliet', 'Trylo'].map((brand) => (
              <div key={brand} className="bg-white px-8 py-4 rounded-xl border border-stone-200 shadow-sm font-bold text-stone-800 tracking-tight">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-rose-950 to-stone-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-4xl font-bold font-serif">Ready to Start Ordering?</h2>
          <p className="text-stone-300 text-lg">Join hundreds of retailers across India who trust Riya Touch for their hosiery inventory.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-8 py-3.5 rounded-xl text-sm uppercase tracking-wider transition shadow-lg"
            >
              Register Your Business
            </Link>
            <Link
              href="/login"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl text-sm uppercase tracking-wider transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
