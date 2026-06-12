import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Truck, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto border-t border-stone-800">
      
      {/* Brand Highlights */}
      <div className="bg-rose-950 py-8 border-b border-rose-900 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <Truck className="w-8 h-8 text-amber-500 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">Pan-India Wholesale Shipping</h4>
              <p className="text-xs text-rose-200">Transport and courier options available</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <Award className="w-8 h-8 text-amber-500 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">100% Genuine Brands</h4>
              <p className="text-xs text-rose-200">Direct from Rupa, Jockey, Lux, Dixcy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <ShieldCheck className="w-8 h-8 text-amber-500 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">GST Invoice Bill</h4>
              <p className="text-xs text-rose-200">Get input tax credit (ITC) on all orders</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <HeartHandshake className="w-8 h-8 text-amber-500 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">Bulk Discounts</h4>
              <p className="text-xs text-rose-200">Save more on larger box volumes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Info Column */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg tracking-wider font-serif">RIYA TOUCH</h3>
          <p className="text-sm text-stone-400">
            Leading wholesale distributor of premium undergarments, socks, and thermals. Offering top hosiery brands at lowest wholesale market prices since 2018.
          </p>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
            Categories
          </h4>
          <ul className="space-y-2 text-sm text-stone-400">
            <li>
              <Link href="/products?category=Men" className="hover:text-amber-500 transition">Men's Wear (Briefs, Vests, Boxers)</Link>
            </li>
            <li>
              <Link href="/products?category=Women" className="hover:text-amber-500 transition">Women's Wear (Panties, Bras)</Link>
            </li>
            <li>
              <Link href="/products?category=Girls" className="hover:text-amber-500 transition">Girls' Innerwear (Riya Touch)</Link>
            </li>
            <li>
              <Link href="/products?category=Kids" className="hover:text-amber-500 transition">Kids' Hosiery (Vests, Briefs)</Link>
            </li>
            <li>
              <Link href="/products?type=Socks" className="hover:text-amber-500 transition">Socks & Thermals</Link>
            </li>
          </ul>
        </div>

        {/* Wholesale Policies Column */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
            Wholesale Policies
          </h4>
          <ul className="space-y-2 text-sm text-stone-400">
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span>Minimum Order Value: ₹5,000</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span>GSTIN validation required for bill claim</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span>Direct Bank Transfer or COD available</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span>Easy order booking over WhatsApp</span>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
            Contact Shop
          </h4>
          <ul className="space-y-3 text-sm text-stone-400">
            <li className="flex items-start">
              <MapPin className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
              <span>Shop No. 12, Gandhi Nagar Wholesale Market, Delhi - 110031</span>
            </li>
            <li className="flex items-center">
              <Phone className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
              <span>+91 9876543210</span>
            </li>
            <li className="flex items-center">
              <Mail className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
              <span>sales@riyatouch.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copy & Rights */}
      <div className="bg-stone-950 py-4 border-t border-stone-800 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p>© {new Date().getFullYear()} Riya Touch Wholesale. All rights reserved.</p>
          <p className="text-stone-600">Designed for wholesale merchants and hosiery retailers.</p>
        </div>
      </div>

    </footer>
  );
}
