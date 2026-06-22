"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, apiUrl } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    // If already logged in, redirect
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.token, data.user);
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-16 flex-grow flex flex-col justify-center">
      <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-md space-y-6">
        
        <div className="text-center space-y-1">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-rose-900 font-serif block">
            RIYA TOUCH
          </span>
          <h2 className="text-lg font-bold text-stone-900">Merchant Portal Login</h2>
          <p className="text-xs text-stone-500">Sign in to view wholesale pricing & book orders</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-800 text-xs p-3 rounded border border-rose-250 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Registered Email Address</label>
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

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Account Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-800"
              />
              <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wider transition cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="border-t border-stone-150 pt-4 text-center text-xs space-y-2">
          <p className="text-stone-500">
            New wholesale merchant?{' '}
            <Link href={`/register?redirect=${encodeURIComponent(redirectUrl)}`} className="text-rose-900 font-bold hover:underline">
              Register Business Profile
            </Link>
          </p>
          <div className="text-[10px] text-stone-400 font-medium flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Wholesale Portal</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md w-full mx-auto py-16 text-center text-stone-500">
        Loading sign-in...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
