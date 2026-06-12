"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ProductCard, { ProductType } from '../../components/ProductCard';
import { Filter, RotateCcw, Search } from 'lucide-react';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { apiUrl } = useAuth();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Available filter options
  const [brands, setBrands] = useState<string[]>([]);
  
  // Active Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');

  // Keep search input in sync with URL queries
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setSelectedType(searchParams.get('type') || '');
  }, [searchParams]);

  // Fetch unique brands
  useEffect(() => {
    fetch(`${apiUrl}/products/brands`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch((err) => console.error('Error fetching brands:', err));
  }, [apiUrl]);

  // Fetch Products based on active filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (selectedType) params.append('type', selectedType);
    if (search) params.append('search', search);

    fetch(`${apiUrl}/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching filtered products:', err);
        setLoading(false);
      });
  }, [apiUrl, selectedCategory, selectedBrand, selectedType, search]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedType('');
    router.push('/products');
  };

  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const types = [
    { label: 'Bra', value: 'Brassieres', image: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ecf5?w=100&auto=format&fit=crop&q=60' },
    { label: 'Panties', value: 'Panties', image: 'https://images.unsplash.com/photo-1618677831708-0e7fda3148b4?w=100&auto=format&fit=crop&q=60' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
      
      {/* Page Title */}
      <div className="mb-8 border-b border-stone-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">Wholesale Product Catalog</h1>
          <p className="text-xs text-stone-500 mt-1">
            Displaying {products.length} products. Bulk orders only.
          </p>
        </div>

        {/* Clear Filters Button */}
        {(selectedCategory || selectedBrand || selectedType || search) && (
          <button
            onClick={handleClearFilters}
            className="self-start sm:self-auto flex items-center space-x-1 text-xs font-semibold text-rose-800 hover:text-rose-950 transition border border-rose-200 px-3 py-1.5 rounded-md bg-rose-50 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-6">
            
            <div className="flex items-center space-x-2 border-b border-stone-150 pb-3">
              <Filter className="w-4 h-4 text-stone-700" />
              <h3 className="font-bold text-stone-900 text-sm">Filters</h3>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Search Keyword</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter name, brand..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    updateUrl('search', e.target.value);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-800"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">Category</label>
              <div className="flex flex-col space-y-1">
                {['Women', 'Girls'].map((cat) => (
                  <label key={cat} className="flex items-center space-x-2 text-xs text-stone-700 cursor-pointer hover:text-stone-950 font-medium">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => {
                        setSelectedCategory(cat);
                        updateUrl('category', cat);
                      }}
                      className="text-rose-900 focus:ring-rose-900"
                    />
                    <span>{cat} Wear</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">Brands</label>
              {brands.length > 0 ? (
                <div className="flex flex-col space-y-1 max-h-40 overflow-y-auto pr-1">
                  {brands.map((br) => (
                    <label key={br} className="flex items-center space-x-2 text-xs text-stone-700 cursor-pointer hover:text-stone-950 font-medium">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === br}
                        onChange={() => {
                          setSelectedBrand(br);
                          updateUrl('brand', br);
                        }}
                        className="text-rose-900 focus:ring-rose-900"
                      />
                      <span>{br}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-stone-400 italic">No brands found</span>
              )}
            </div>

            {/* Garment Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">Garment Type</label>
              <div className="flex flex-col space-y-1 max-h-40 overflow-y-auto pr-1">
                {types.map((ty) => (
                  <label key={ty.value} className="flex items-center space-x-2 text-xs text-stone-700 cursor-pointer hover:text-stone-950 font-medium">
                    <input
                      type="radio"
                      name="type"
                      checked={selectedType === ty.value}
                      onChange={() => {
                        setSelectedType(ty.value);
                        updateUrl('type', ty.value);
                      }}
                      className="text-rose-900 focus:ring-rose-900"
                    />
                    <img src={ty.image} alt={ty.label} className="w-6 h-6 rounded object-cover border border-stone-200" />
                    <span>{ty.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

        </aside>

        {/* Products Grid */}
        <main className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg border border-stone-200 p-4 space-y-4 h-96">
                  <div className="bg-stone-200 w-full aspect-square rounded"></div>
                  <div className="bg-stone-200 h-4 w-2/3 rounded"></div>
                  <div className="bg-stone-200 h-4 w-1/2 rounded"></div>
                  <div className="bg-stone-200 h-10 w-full rounded mt-8"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="animate-fade-in">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center text-stone-500 border border-stone-200 rounded-lg shadow-xs flex flex-col items-center justify-center space-y-4">
              <span className="text-4xl">📦</span>
              <h3 className="font-bold text-stone-850">No wholesale items match your search.</h3>
              <p className="text-xs max-w-xs text-stone-400">
                Try widening your filters, clearing search input, or selecting a different category.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-rose-900 text-white px-4 py-2 rounded text-xs font-semibold hover:bg-rose-800 transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-10 text-center text-stone-500">
        Loading wholesale catalog...
      </div>
    }>
      <ProductsCatalogContent />
    </Suspense>
  );
}
