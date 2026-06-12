"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Mail, Lock, Phone, MapPin, Building } from 'lucide-react';
import Link from 'next/link';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, apiUrl } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  
  // Address
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectUrl = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone || !businessName) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      name,
      email,
      password,
      phone,
      businessName,
      gstin,
      address: {
        street,
        city,
        state,
        pincode
      }
    };

    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      login(data.token, data.user);
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto px-4 py-12 flex-grow flex flex-col justify-center">
      <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-md space-y-6">
        
        <div className="text-center space-y-1">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-rose-900 font-serif block">
            RIYA TOUCH
          </span>
          <h2 className="text-lg font-bold text-stone-900">Merchant Registration</h2>
          <p className="text-xs text-stone-500">Create your wholesale customer profile</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-800 text-xs p-3 rounded border border-rose-250 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Section 1: User & Business Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-stone-850 text-xs uppercase tracking-wider border-b border-stone-150 pb-1.5 flex items-center">
              <Building className="w-4 h-4 mr-1 text-rose-900" />
              Business Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Contact Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Aditya Gupta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-800"
                  />
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Business / Shop Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Gupta Hosiery Store"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-800"
                  />
                  <Building className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="buyer@shop.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-800"
                  />
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Mobile Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="9999988888"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 border border-stone-300 rounded focus:outline-none"
                  />
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">GSTIN (Optional)</label>
                <input
                  type="text"
                  placeholder="07BBBBB2222B2Z2"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:outline-none uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Portal Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 border border-stone-300 rounded focus:outline-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Address */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-stone-850 text-xs uppercase tracking-wider border-b border-stone-150 pb-1.5 flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-rose-900" />
              Delivery / Billing Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1 sm:col-span-4">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Shop / Street Address</label>
                <input
                  type="text"
                  placeholder="Bazar Gali No 4, Shop 3"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">City</label>
                <input
                  type="text"
                  placeholder="Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">State</label>
                <input
                  type="text"
                  placeholder="Delhi"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Pincode</label>
                <input
                  type="text"
                  placeholder="110051"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-3 rounded text-xs uppercase tracking-wider transition cursor-pointer"
          >
            {loading ? 'Submitting Registration...' : 'Register Merchant Account'}
          </button>
        </form>

        <div className="border-t border-stone-150 pt-4 text-center text-xs space-y-2">
          <p className="text-stone-500">
            Already have a merchant profile?{' '}
            <Link href={`/login?redirect=${encodeURIComponent(redirectUrl)}`} className="text-rose-900 font-bold hover:underline">
              Sign In Here
            </Link>
          </p>
          <div className="text-[10px] text-stone-400 font-medium flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Wholesale Verification</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="max-w-xl w-full mx-auto py-12 text-center text-stone-500">
        Loading signup...
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
