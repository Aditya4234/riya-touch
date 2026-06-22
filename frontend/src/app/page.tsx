"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  ArrowRight, ShoppingBag, ShieldCheck, Truck, Star, Phone, Mail, MapPin,
  ChevronDown, CheckCircle, Package, Award, Clock, HeadphonesIcon, BadgeIndianRupee,
  Sparkles, Quote, Plus, Minus, Send, Warehouse
} from 'lucide-react';

function SlideUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const brands = ['Jockey', 'Rupa', 'Lux Cozi', 'Dixcy Scott', 'Juliet', 'Riya Touch'];

const categories = [
  { name: "Men's Briefs", desc: 'Premium cotton & microfiber briefs in bulk packs', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&auto=format&fit=crop&q=80' },
  { name: 'Vests', desc: 'Cotton vests & banians for men & kids', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80' },
  { name: 'Thermals', desc: 'Winter thermal wear for men, women & kids', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80' },
  { name: "Ladies Innerwear", desc: 'Panties, brassieres, camisoles & shapewear', img: 'https://images.unsplash.com/photo-1618677831708-0e7fda3148b4?w=600&auto=format&fit=crop&q=80' },
  { name: "Kids Hosiery", desc: 'Colorful socks, briefs & vests for children', img: 'https://images.unsplash.com/photo-1489269637500-aaa0e757be08?w=600&auto=format&fit=crop&q=80' },
  { name: 'Socks', desc: 'Cotton, sports & fashion socks in bulk', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80' },
];

const features = [
  { icon: BadgeIndianRupee, title: 'Factory Direct Pricing', desc: 'Source directly from manufacturers. No middlemen, just unbeatable wholesale rates.' },
  { icon: ShieldCheck, title: '100% Authentic Brands', desc: 'We supply genuine products from Jockey, Rupa, Lux Cozi, Dixcy Scott & more.' },
  { icon: Award, title: 'GST Billing & ITC', desc: 'Every order includes a full GST invoice. Claim input tax credit on your purchases.' },
  { icon: Package, title: 'Bulk Discounts', desc: 'Save more with volume-based pricing on box packs and carton orders.' },
  { icon: Truck, title: 'Fast Dispatch', desc: 'Orders dispatched within 24-48 hours via trusted pan-India logistics partners.' },
  { icon: HeadphonesIcon, title: 'Dedicated Support', desc: 'Personal relationship manager assigned for every wholesale client.' },
];

const steps = [
  { num: '01', icon: ShoppingBag, title: 'Browse Products', desc: 'Explore our catalog of 100+ hosiery products across top brands.' },
  { num: '02', icon: Phone, title: 'Send Inquiry', desc: 'Call or WhatsApp us with your product list and quantity requirements.' },
  { num: '03', icon: BadgeIndianRupee, title: 'Receive Quotation', desc: 'Get the best wholesale pricing with bulk discount breakdown.' },
  { num: '04', icon: Truck, title: 'Fast Delivery', desc: 'Order confirmed, packed and dispatched within 24-48 hours.' },
];

const testimonials = [
  { name: 'Rajesh Kumar', shop: 'Kumar Garments, Delhi', text: 'Best wholesale hosiery supplier in Delhi. Genuine products, on-time delivery, and very competitive pricing.', rating: 5 },
  { name: 'Amit Sharma', shop: 'Sharma Hosiery Store, Meerut', text: 'Competitive prices and genuine products. The GST billing is a huge plus for our business accounting.', rating: 5 },
  { name: 'Suresh Patel', shop: 'Patel Textiles, Ahmedabad', text: 'Excellent support and timely delivery. Great collection of Jockey and Rupa products at wholesale rates.', rating: 5 },
];

const faqs = [
  { q: 'What is the minimum order amount?', a: 'Minimum wholesale order value is ₹5,000. This allows us to offer the best possible factory-direct pricing.' },
  { q: 'Do you provide GST invoices?', a: 'Yes, absolutely. All orders come with a complete GST invoice for input tax credit (ITC) claim.' },
  { q: 'Which brands are available?', a: 'We stock Jockey, Rupa, Lux Cozi, Dixcy Scott, Juliet, Trylo, and our own brand Riya Touch.' },
  { q: 'Do you deliver outside Delhi?', a: 'Yes, we deliver across India via trusted courier and transport partners. Shipping charges apply.' },
  { q: 'Can I place bulk orders?', a: 'Yes, we specialize in bulk and wholesale orders. Contact us for volume discounts and custom packing.' },
];

function FloatingProductCard({ index, className }: { index: number; className: string }) {
  const products = [
    { emoji: '🩲', label: "Men's Briefs", color: 'from-rose-100 to-rose-200' },
    { emoji: '👕', label: 'Cotton Vests', color: 'from-blue-100 to-blue-200' },
    { emoji: '🧥', label: 'Thermals', color: 'from-amber-100 to-amber-200' },
    { emoji: '👙', label: 'Ladies Wear', color: 'from-pink-100 to-pink-200' },
    { emoji: '🧦', label: 'Socks', color: 'from-green-100 to-green-200' },
    { emoji: '📦', label: 'Brand Packs', color: 'from-purple-100 to-purple-200' },
  ];
  const p = products[index % products.length];
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 3 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className={`bg-gradient-to-br ${p.color} p-3 sm:p-4 rounded-2xl shadow-lg border border-white/60 backdrop-blur-sm`}>
        <div className="text-2xl sm:text-3xl">{p.emoji}</div>
        <p className="text-[10px] sm:text-xs font-semibold text-stone-700 mt-1">{p.label}</p>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7A0026] via-[#5c001d] to-[#3a0012] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,255,255,0.03)_0%,_transparent_50%)]" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-[30rem] h-[30rem] bg-rose-500/5 rounded-full blur-3xl" />

      <div className="hidden lg:block">
        <FloatingProductCard index={0} className="top-[20%] left-[5%]" />
        <FloatingProductCard index={1} className="top-[15%] right-[8%]" />
        <FloatingProductCard index={2} className="top-[55%] left-[3%]" />
        <FloatingProductCard index={3} className="top-[50%] right-[5%]" />
        <FloatingProductCard index={4} className="top-[75%] left-[10%]" />
        <FloatingProductCard index={5} className="top-[70%] right-[10%]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2 rounded-full uppercase tracking-widest"
          >
            <Sparkles className="w-4 h-4" />
            <span>Delhi's Trusted Wholesale Hosiery Supplier</span>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight font-serif"
        >
          Factory Direct Prices on <br className="hidden sm:block" />
          <span className="text-amber-400">Premium Innerwear Brands</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-stone-300 max-w-3xl mx-auto font-light leading-relaxed px-4"
        >
          Supply your retail store with authentic Jockey, Rupa, Lux Cozi, Dixcy Scott, Juliet and more at wholesale rates.
          GST billing, bulk discounts, fast dispatch and trusted service since 2018.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/products"
            className="group bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-8 sm:px-10 py-4 rounded-xl text-sm sm:text-base uppercase tracking-wider transition-all shadow-2xl shadow-amber-500/30 hover:shadow-amber-400/50 flex items-center space-x-3"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="https://wa.me/919876543210?text=Hello%20Riya%20Touch%2C%20I%20want%20to%20place%20a%20wholesale%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 sm:px-10 py-4 rounded-xl text-sm sm:text-base uppercase tracking-wider transition-all flex items-center space-x-3"
          >
            <Phone className="w-5 h-5 text-green-400" />
            <span>Order on WhatsApp</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-stone-400 font-medium"
        >
          {[
            { icon: BadgeIndianRupee, text: 'Min Order ₹5,000' },
            { icon: ShieldCheck, text: 'GST Billing' },
            { icon: CheckCircle, text: '100% Original' },
            { icon: Truck, text: 'Fast Delivery' },
          ].map((item) => (
            <span key={item.text} className="flex items-center space-x-1.5">
              <item.icon className="w-4 h-4 text-amber-500" />
              <span>{item.text}</span>
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-white/40" />
      </motion.div>
    </section>
  );
}

function TrustSection() {
  const stats = [
    { value: '500+', label: 'Retailers Served', icon: ShoppingBag },
    { value: '10+', label: 'Years Experience', icon: Clock },
    { value: '100+', label: 'Products Available', icon: Package },
    { value: '100%', label: 'Original Products', icon: ShieldCheck },
  ];
  return (
    <section className="bg-[#7A0026] py-12 sm:py-16 border-y border-[#5c001d]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <SlideUp key={s.label} delay={i * 0.1}>
              <div className="text-center space-y-2">
                <s.icon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 mx-auto" />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-rose-200 font-medium uppercase tracking-wide">{s.label}</div>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandsSection() {
  const brandColors = [
    'from-rose-950 to-rose-800', 'from-blue-900 to-blue-700', 'from-stone-900 to-stone-700',
    'from-emerald-900 to-emerald-700', 'from-purple-900 to-purple-700', 'from-amber-900 to-amber-700',
  ];
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SlideUp>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">Brands We Supply</h2>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="text-stone-500 mt-3">Authorised wholesale distributor for leading innerwear brands</p>
          </SlideUp>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
          {brands.map((brand, i) => (
            <SlideUp key={brand} delay={i * 0.08}>
              <div className="group bg-gradient-to-br cursor-pointer text-center border border-white/10 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`, background: `linear-gradient(135deg, ${['#4a0016', '#1e3a5f', '#44403c', '#064e3b', '#3b0764', '#78350f'][i]}, ${['#7A0026', '#1e40af', '#57534e', '#047857', '#581c87', '#92400e'][i]})` }}
              >
                <div className="text-white font-extrabold text-base sm:text-lg font-serif tracking-tight">{brand}</div>
                <div className="w-8 h-0.5 bg-amber-400 mx-auto mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SlideUp>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">Popular Categories</h2>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="text-stone-500 mt-3">Explore our wide range of hosiery products</p>
          </SlideUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, i) => (
            <SlideUp key={cat.name} delay={i * 0.08}>
              <div className="group relative overflow-hidden rounded-2xl h-72 sm:h-80 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-[#7A0026]/90 via-[#7A0026]/40 to-transparent z-10" />
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white font-serif">{cat.name}</h3>
                  <p className="text-stone-200 text-sm mt-1 max-w-xs">{cat.desc}</p>
                  <span className="mt-4 inline-flex items-center text-xs font-bold text-amber-400 uppercase tracking-wider group-hover:text-amber-300 transition-colors">
                    <span>View Products</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SlideUp>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">Why Choose Riya Touch?</h2>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="text-stone-500 mt-3">What makes us Delhi's preferred wholesale hosiery partner</p>
          </SlideUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, i) => (
            <SlideUp key={f.title} delay={i * 0.08}>
              <div className="group bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#7A0026]/20">
                <div className="w-14 h-14 bg-[#7A0026]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#7A0026] transition-colors duration-300">
                  <f.icon className="w-7 h-7 text-[#7A0026] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">{f.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{f.desc}</p>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#f8f9fa]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SlideUp>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">How It Works</h2>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="text-stone-500 mt-3">Four simple steps to get your wholesale order delivered</p>
          </SlideUp>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7A0026] via-amber-400 to-[#7A0026] hidden md:block" />

          <div className="space-y-12 sm:space-y-16">
            {steps.map((step, i) => (
              <SlideUp key={step.num} delay={i * 0.12}>
                <div className={`relative flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6 sm:gap-8`}>
                  <div className="flex-shrink-0 w-16 h-16 bg-white border-2 border-[#7A0026] rounded-full flex items-center justify-center shadow-lg z-10">
                    <step.icon className="w-7 h-7 text-[#7A0026]" />
                  </div>

                  <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-shadow">
                    <span className="text-xs font-bold text-[#7A0026] bg-[#7A0026]/10 px-3 py-1 rounded-full">Step {step.num}</span>
                    <h3 className="text-xl font-bold text-stone-900 mt-3">{step.title}</h3>
                    <p className="text-sm text-stone-500 mt-2">{step.desc}</p>
                  </div>

                  <div className="hidden md:flex flex-shrink-0 w-16 h-16 bg-amber-400 text-stone-950 rounded-full items-center justify-center font-extrabold text-lg shadow-lg z-10">
                    {step.num}
                  </div>
                </div>
              </SlideUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SlideUp>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">What Our Retailers Say</h2>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="text-stone-500 mt-3">Trusted by 500+ retailers across India</p>
          </SlideUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <SlideUp key={t.name} delay={i * 0.1}>
              <div className="relative bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300">
                <Quote className="w-8 h-8 text-[#7A0026]/10 absolute top-4 right-4" />
                <div className="flex space-x-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, ri) => (
                    <Star key={ri} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="border-t border-stone-100 pt-4">
                  <p className="font-bold text-stone-900 text-sm">{t.name}</p>
                  <p className="text-xs text-stone-500">{t.shop}</p>
                </div>
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="py-16 sm:py-20 bg-[#f8f9fa]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SlideUp>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">Frequently Asked Questions</h2>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="text-stone-500 mt-3">Everything you need to know about wholesale ordering</p>
          </SlideUp>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <SlideUp key={i} delay={i * 0.06}>
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer"
                >
                  <span className="font-semibold text-stone-900 text-sm sm:text-base pr-4">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-[#7A0026]/10 flex items-center justify-center flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-45' : ''}`}>
                    <Plus className="w-4 h-4 text-[#7A0026]" />
                  </div>
                </button>
                {openIndex === i && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <p className="text-sm text-stone-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: '', phone: '', business: '', requirement: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SlideUp>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">Get In Touch</h2>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="text-stone-500 mt-3">Call, WhatsApp, or send us your requirement</p>
          </SlideUp>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-6">
            {[
              { icon: Phone, label: 'Phone', value: '+91 9876543210', href: 'tel:+919876543210' },
              { icon: Mail, label: 'Email', value: 'sales@riyatouch.com', href: 'mailto:sales@riyatouch.com' },
              { icon: MapPin, label: 'Address', value: 'Shop No. 12, Gandhi Nagar Wholesale Market, Delhi - 110031' },
            ].map((item, i) => (
              <SlideUp key={item.label} delay={i * 0.1}>
                <div className="flex items-start space-x-4 p-4 sm:p-5 rounded-xl bg-[#f8f9fa] border border-stone-200">
                  <div className="w-12 h-12 bg-[#7A0026]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-[#7A0026]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-semibold text-stone-900 hover:text-[#7A0026] transition">{item.value}</a>
                    ) : (
                      <p className="text-sm font-semibold text-stone-900">{item.value}</p>
                    )}
                  </div>
                </div>
              </SlideUp>
            ))}

            <SlideUp>
              <a
                href="https://wa.me/919876543210?text=Hello%20Riya%20Touch%2C%20I%20need%20a%20wholesale%20quotation."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl"
              >
                <Phone className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
            </SlideUp>
          </div>

          <SlideUp delay={0.2}>
            <form onSubmit={handleSubmit} className="bg-[#f8f9fa] p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <h3 className="text-xl font-bold text-stone-900 font-serif">Send Your Requirement</h3>

              {[
                { label: 'Your Name', value: form.name, key: 'name', type: 'text' },
                { label: 'Phone Number', value: form.phone, key: 'phone', type: 'tel' },
                { label: 'Business Name', value: form.business, key: 'business', type: 'text' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">{field.label}</label>
                  <input
                    type={field.type}
                    required
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] transition"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Your Requirement</label>
                <textarea
                  rows={3}
                  required
                  value={form.requirement}
                  onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] transition resize-none"
                  placeholder="Tell us what products and quantities you need..."
                />
              </div>

              <button type="submit"
                className={`w-full flex items-center justify-center space-x-3 bg-[#7A0026] hover:bg-[#5c001d] text-white font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl ${submitted ? 'bg-green-600 hover:bg-green-600' : ''}`}
              >
                {submitted ? (
                  <><CheckCircle className="w-5 h-5" /><span>Sent Successfully!</span></>
                ) : (
                  <><Send className="w-5 h-5" /><span>Submit Inquiry</span></>
                )}
              </button>
            </form>
          </SlideUp>
        </div>
      </div>
    </section>
  );
}

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
      <HeroSection />
      <TrustSection />
      <BrandsSection />
      <CategoriesSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
    </div>
  );
}
