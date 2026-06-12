"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Plus, Trash2, Check, ExternalLink, Calendar, Download, AlertTriangle } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, token, apiUrl } = useAuth();

  // Tab Control
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // Backend state
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  // Form states for creating product
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Men' | 'Women' | 'Girls' | 'Kids'>('Men');
  const [newProdType, setNewProdType] = useState('Briefs');
  const [newProdWholesale, setNewProdWholesale] = useState(50);
  const [newProdRetail, setNewProdRetail] = useState(100);
  const [newProdPackSize, setNewProdPackSize] = useState(10);
  const [newProdStock, setNewProdStock] = useState(100);
  const [newProdImage, setNewProdImage] = useState('');
  
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Access validation
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchAdminData();
  }, [user, router]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch orders
      const ordersRes = await fetch(`${apiUrl}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      if (Array.isArray(ordersData)) setOrders(ordersData);

      // Fetch products
      const productsRes = await fetch(`${apiUrl}/products`);
      const productsData = await productsRes.json();
      if (Array.isArray(productsData)) setProducts(productsData);

      // Fetch low stock
      const stockRes = await fetch(`${apiUrl}/products/low-stock?threshold=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const stockData = await stockRes.json();
      if (Array.isArray(stockData.products)) setLowStockProducts(stockData.products);
    } catch (err: any) {
      setError('Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const res = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, paymentStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      // Update locally
      setOrders(prev => prev.map(o => {
        if (o._id === orderId) {
          return {
            ...o,
            status: status || o.status,
            paymentStatus: paymentStatus || o.paymentStatus
          };
        }
        return o;
      }));
      
      setSuccessMsg('Order updated successfully!');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err: any) {
      setError('Error updating order.');
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`${apiUrl}/products/${prodId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');

      setProducts(prev => prev.filter(p => p._id !== prodId));
      setSuccessMsg('Product deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch(`${apiUrl}/orders/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `riya-touch-orders-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Failed to export orders');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    const payload = {
      name: newProdName,
      brand: newProdBrand,
      description: newProdDesc,
      category: newProdCategory,
      type: newProdType,
      wholesalePrice: newProdWholesale,
      retailPrice: newProdRetail,
      packSize: newProdPackSize,
      stock: newProdStock,
      images: newProdImage ? [newProdImage] : ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400']
    };

    try {
      const res = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Creation failed');

      setProducts(prev => [data, ...prev]);
      setSuccessMsg('New product added to catalog!');
      
      // Reset form
      setNewProdName('');
      setNewProdBrand('');
      setNewProdDesc('');
      setNewProdImage('');
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error creating product.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-500">
        Loading admin console...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
      
      <div className="mb-8 border-b border-stone-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif flex items-center">
            <ShieldAlert className="w-8 h-8 mr-2 text-rose-900" />
            Admin Wholesale Panel
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your orders, update inventory, and publish new products.
          </p>
        </div>

        {/* Admin Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1 bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {lowStockProducts.length > 0 && (
            <a href="#low-stock" className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded transition">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lowStockProducts.length} Low Stock</span>
            </a>
          )}
        </div>

        {/* Tab Controls */}
        <div className="flex bg-stone-100 p-1 rounded-md border border-stone-250 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
              activeTab === 'orders' ? 'bg-white text-rose-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Orders Queue ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
              activeTab === 'products' ? 'bg-white text-rose-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Manage Products ({products.length})
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 text-xs font-bold p-3 rounded flex items-center space-x-1.5">
          <Check className="w-4.5 h-4.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold p-3 rounded">
          {error}
        </div>
      )}

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div id="low-stock" className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
          <h3 className="flex items-center text-amber-900 text-sm font-bold">
            <AlertTriangle className="w-4.5 h-4.5 mr-1.5" />
            Low Stock Alert — {lowStockProducts.length} products running low
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {lowStockProducts.map((p: any) => (
              <div key={p._id} className="bg-white border border-amber-100 rounded p-2.5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-stone-900">{p.name}</span>
                  <span className="block text-[10px] text-stone-500">{p.brand} | {p.packSize} pcs/pack</span>
                </div>
                <span className={`font-extrabold ${p.stock <= 5 ? 'text-red-700' : 'text-amber-700'}`}>
                  {p.stock} boxes
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Queue View */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-stone-950 font-serif">Order Fulfillment Center</h2>
          
          {orders.length === 0 ? (
            <div className="bg-white border p-8 text-center text-stone-500 rounded">
              No merchant orders placed yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o._id} className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
                  
                  {/* Order Top Meta */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-stone-150 pb-3 gap-2">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">Order ID: {o._id}</h3>
                      <div className="flex items-center text-[10px] text-stone-400 font-semibold mt-0.5 space-x-2">
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(o.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Mode: {o.paymentMethod}</span>
                      </div>
                    </div>
                    
                    {/* Status Dropdowns */}
                    <div className="flex flex-wrap items-center gap-3">
                      
                      {/* Payment Status Dropdown */}
                      <div className="flex items-center space-x-1">
                        <span className="text-[9px] uppercase font-bold text-stone-400">Payment:</span>
                        <select
                          value={o.paymentStatus}
                          onChange={(e) => handleUpdateOrderStatus(o._id, '', e.target.value)}
                          className="text-xs font-bold px-2.5 py-1 border rounded bg-stone-50 text-stone-800 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </div>

                      {/* Order Status Dropdown */}
                      <div className="flex items-center space-x-1">
                        <span className="text-[9px] uppercase font-bold text-stone-400">Status:</span>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                          className="text-xs font-bold px-2.5 py-1 border rounded bg-rose-900 text-white cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Buyer & Shipment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
                    <div>
                      <h4 className="font-bold text-stone-900 uppercase tracking-wide mb-1.5">Buyer Firm</h4>
                      <p className="font-bold text-stone-800">{o.businessName}</p>
                      {o.gstin && <p className="text-[10px] font-semibold text-rose-800 mt-0.5">GSTIN: {o.gstin}</p>}
                      <p className="mt-1">Contact: {o.user?.phone || 'No phone'}</p>
                      <p>Email: {o.user?.email || 'No email'}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-stone-900 uppercase tracking-wide mb-1.5">Delivery Address</h4>
                      <p>{o.shippingAddress?.street}</p>
                      <p>{o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pincode}</p>
                    </div>

                    <div className="bg-stone-50 p-3 rounded border border-stone-200">
                      <h4 className="font-bold text-stone-900 uppercase tracking-wide mb-1">Financial Summary</h4>
                      <div className="space-y-1 text-[11px] font-medium">
                        <div className="flex justify-between">
                          <span>Total Packs:</span>
                          <span className="font-bold">{o.totalPacks} Boxes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Pcs:</span>
                          <span className="font-bold">{o.totalItems} Pcs</span>
                        </div>
                        <div className="flex justify-between border-t border-stone-200 pt-1 font-bold text-rose-900">
                          <span>Grand Total:</span>
                          <span>₹{o.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="border border-stone-200 rounded overflow-x-auto">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
                          <th className="p-2">Product</th>
                          <th className="p-2">Size</th>
                          <th className="p-2">Color</th>
                          <th className="p-2 text-right">Wholesale Rate</th>
                          <th className="p-2 text-right">Pack Size</th>
                          <th className="p-2 text-right">Boxes</th>
                          <th className="p-2 text-right">Total Pcs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-150">
                        {o.items.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td className="p-2 font-semibold text-stone-900">{item.product?.name || 'Deleted Product'}</td>
                            <td className="p-2 font-bold">{item.size}</td>
                            <td className="p-2">{item.color}</td>
                            <td className="p-2 text-right">₹{item.wholesalePrice}/Pc</td>
                            <td className="p-2 text-right">{item.packSize} pcs</td>
                            <td className="p-2 text-right font-bold text-stone-800">{item.packQuantity}</td>
                            <td className="p-2 text-right font-semibold text-stone-600">{item.packQuantity * item.packSize} pcs</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Catalog Management */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Product Form */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4 h-fit">
            <h3 className="font-bold text-stone-900 text-base border-b border-stone-150 pb-2 font-serif">Add New Product</h3>
            
            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Jockey Modern Boxer Briefs"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jockey"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Garment Category *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e: any) => setNewProdCategory(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none bg-white"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Girls">Girls</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Garment Type *</label>
                  <select
                    value={newProdType}
                    onChange={(e: any) => setNewProdType(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none bg-white"
                  >
                    <option value="Briefs">Briefs</option>
                    <option value="Boxers">Boxers</option>
                    <option value="Vests">Vests</option>
                    <option value="Brassieres">Brassieres</option>
                    <option value="Panties">Panties</option>
                    <option value="Socks">Socks</option>
                    <option value="Thermals">Thermals</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Box Packaging Size *</label>
                  <input
                    type="number"
                    required
                    value={newProdPackSize}
                    onChange={(e) => setNewProdPackSize(parseInt(e.target.value) || 0)}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-stone-600 uppercase tracking-wide">Wholesale Rate *</label>
                  <input
                    type="number"
                    required
                    value={newProdWholesale}
                    onChange={(e) => setNewProdWholesale(parseInt(e.target.value) || 0)}
                    className="w-full text-xs px-2 py-1.5 border border-stone-300 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-stone-600 uppercase tracking-wide">Retail MSRP *</label>
                  <input
                    type="number"
                    required
                    value={newProdRetail}
                    onChange={(e) => setNewProdRetail(parseInt(e.target.value) || 0)}
                    className="w-full text-xs px-2 py-1.5 border border-stone-300 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-stone-600 uppercase tracking-wide">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(parseInt(e.target.value) || 0)}
                    className="w-full text-xs px-2 py-1.5 border border-stone-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Product Image URL</label>
                <input
                  type="text"
                  placeholder="https://unsplash.com/..."
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Product Specifications *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Super combed fabric, anti bacterial finish..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>{actionLoading ? 'Creating...' : 'Publish Product'}</span>
              </button>
            </form>
          </div>

          {/* Product List Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-stone-900 text-lg font-serif">Published Inventory</h3>
            
            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-xs divide-y divide-stone-150">
              {products.map((p) => (
                <div key={p._id} className="p-4 flex items-center justify-between text-xs gap-4">
                  <div className="flex items-center space-x-3 max-w-[70%]">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-12 object-contain border rounded p-1 bg-stone-50 flex-shrink-0"
                    />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-amber-700 tracking-wide">{p.brand}</span>
                      <h4 className="font-bold text-stone-900 truncate">{p.name}</h4>
                      <p className="text-[10px] text-stone-500">
                        Rate: ₹{p.wholesalePrice}/Pc | Pack: {p.packSize} Pcs | Stock: {p.stock} Boxes
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(p._id)}
                    className="text-stone-400 hover:text-red-700 p-2 rounded hover:bg-stone-50 transition cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
