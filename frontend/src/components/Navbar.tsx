"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X, ShieldAlert, Phone, FileText } from 'lucide-react';

export default function Navbar() {
  const { user, logout, apiUrl, token } = useAuth();
  const { cart, totalAmount } = useCart();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  const cartItemsCount = cart.reduce((count, item) => count + item.packQuantity, 0);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    const fetchAdminCounts = async () => {
      try {
        const [pendingRes, stockRes] = await Promise.all([
          fetch(`${apiUrl}/orders/pending-count`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${apiUrl}/products/low-stock?threshold=10`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        const pendingData = await pendingRes.json();
        const stockData = await stockRes.json();
        if (pendingData.count !== undefined) setPendingCount(pendingData.count);
        if (stockData.count !== undefined) setLowStockCount(stockData.count);
      } catch {}
    };
    fetchAdminCounts();
    const interval = setInterval(fetchAdminCounts, 30000);
    return () => clearInterval(interval);
  }, [user, apiUrl, token]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/products');
    }
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href={user ? "/dashboard" : "/"} className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-rose-900 font-serif">
                RIYA TOUCH
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-700 -mt-1">
                Wholesale Hosiery
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Search brands, types (e.g. briefs, vest)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-stone-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800"
            />
            <button
              type="submit"
              className="bg-rose-900 text-white px-4 py-2 rounded-r-md text-sm font-medium hover:bg-rose-800 transition"
            >
              Search
            </button>
          </form>

          {/* Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-stone-700 hover:text-rose-900 text-sm font-medium transition">
              Shop Catalog
            </Link>
            
            <a 
              href="https://wa.me/919876543210?text=Hello%20Riya%20Touch%20Wholesale%2C%20I%20have%20an%20inquiry." 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-green-700 hover:text-green-800 text-sm font-medium transition"
            >
              <Phone className="w-4 h-4 mr-1" />
              Inquiry
            </a>

            {user?.role === 'admin' && (
              <Link href="/admin" className="relative flex items-center text-amber-700 hover:text-amber-800 text-sm font-semibold transition bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <ShieldAlert className="w-4 h-4 mr-1 text-amber-700" />
                Admin Panel
                {pendingCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
                    {pendingCount}
                  </span>
                )}
                {lowStockCount > 0 && pendingCount === 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
                    {lowStockCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-stone-700 hover:text-rose-900 transition">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Account / Profile */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/orders"
                  className="flex items-center text-stone-600 hover:text-rose-900 text-sm font-medium transition"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Orders
                </Link>
                <span className="text-sm text-stone-600 font-medium max-w-[100px] truncate">
                  {user.businessName || user.name}
                </span>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-stone-500 hover:text-rose-850 transition cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center space-x-1 bg-rose-900 text-white px-4.5 py-2 rounded-md text-sm font-medium hover:bg-rose-800 transition"
              >
                <UserIcon className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Hamburger Menu - Mobile */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-stone-700 hover:text-rose-900 transition">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-stone-600 hover:text-rose-900 hover:bg-stone-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-stone-300 rounded-l-md focus:outline-none"
            />
            <button
              type="submit"
              className="bg-rose-900 text-white px-3 py-1.5 rounded-r-md text-sm font-medium"
            >
              Search
            </button>
          </form>

          <Link
            href="/products"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-rose-900"
          >
            Shop Catalog
          </Link>

          <a
            href="https://wa.me/919876543210?text=Hello%20Riya%20Touch%20Wholesale..."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-green-700 hover:bg-green-50"
          >
            <Phone className="w-4 h-4 mr-2" />
            WhatsApp Inquiry
          </a>

          {user?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="relative block px-3 py-2 rounded-md text-base font-bold text-amber-700 bg-amber-50 border border-amber-200"
            >
              Admin Dashboard
              {pendingCount > 0 && (
                <span className="ml-2 bg-rose-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 inline-flex items-center">
                  {pendingCount} pending
                </span>
              )}
              {lowStockCount > 0 && pendingCount === 0 && (
                <span className="ml-2 bg-amber-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 inline-flex items-center">
                  {lowStockCount} low stock
                </span>
              )}
            </Link>
          )}

          <hr className="border-stone-200 my-2" />

          {user ? (
            <div className="px-3 py-2 space-y-2">
              <div className="text-sm font-semibold text-stone-800">
                {user.businessName || user.name}
              </div>
              <Link
                href="/orders"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center space-x-2 bg-stone-100 text-stone-700 py-2 rounded-md text-sm font-medium hover:bg-stone-200"
              >
                <FileText className="w-4 h-4" />
                <span>My Orders</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-stone-100 text-stone-700 py-2 rounded-md text-sm font-medium hover:bg-stone-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-2 bg-rose-900 text-white py-2 rounded-md text-sm font-medium hover:bg-rose-800"
            >
              <UserIcon className="w-4 h-4" />
              <span>Login / Register</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
