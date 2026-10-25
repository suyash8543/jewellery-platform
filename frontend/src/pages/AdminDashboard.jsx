import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useGoldRate } from '../context/GoldRateContext';
import { 
  Sparkles, Plus, Trash2, Edit3, TrendingUp, UploadCloud, MessageCircle, 
  CheckCircle, AlertTriangle, ShieldCheck, Scale, LogOut, Lock, RefreshCw, Eye
} from 'lucide-react';

export default function AdminDashboard() {
  const { rates: contextRates, refreshRates, formatPrice } = useGoldRate();
  const [token, setToken] = useState(localStorage.getItem('swarna_admin_token'));
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('products');

  // Dashboard Data
  const [products, setProducts] = useState([]);
  const [samples, setSamples] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Bullion Rates Edit State
  const [goldRatesForm, setGoldRatesForm] = useState({
    gold24kPerGram: 8125,
    gold22kPerGram: 7450,
    gold18kPerGram: 6095,
    gold14kPerGram: 4740,
    silverPerGram: 98.5,
    useManualOverride: true,
  });

  // Product Add / Edit Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    sku: '',
    category: 'Bridal Jewellery',
    metalType: 'Gold',
    purity: '22K',
    grossWeightGrams: 20.0,
    netGoldWeightGrams: 20.0,
    gemstoneWeightGrams: 0,
    makingChargeType: 'Percentage',
    makingChargeValue: 12.0,
    gemstoneCharges: 0,
    hasSpecialOffer: false,
    offerPrice: '',
    offerBadgeText: '',
    imageUrl: '',
    description: '',
    isBestseller: false,
    isDiwaliFeatured: true,
    inStock: true,
  });

  // Handle Login
  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.login(loginForm.username, loginForm.password);
      localStorage.setItem('swarna_admin_token', res.token);
      setToken(res.token);
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials. Default: admin / DiwaliGold2026!');
    }
  }

  function handleLogout() {
    localStorage.removeItem('swarna_admin_token');
    setToken(null);
  }

  // Load Admin Data
  async function loadAdminData() {
    if (!token) return;
    try {
      setLoading(true);
      const [prods, smpls, enqs, liveRates] = await Promise.allSettled([
        api.getProducts(),
        api.getCustomSamples(),
        api.getEnquiries(),
        api.getGoldRates(),
      ]);

      if (prods.status === 'fulfilled') setProducts(prods.value || []);
      if (smpls.status === 'fulfilled') setSamples(smpls.value || []);
      if (enqs.status === 'fulfilled') setEnquiries(enqs.value || []);
      if (liveRates.status === 'fulfilled' && liveRates.value) {
        setGoldRatesForm({
          gold24kPerGram: liveRates.value.gold24kPerGram,
          gold22kPerGram: liveRates.value.gold22kPerGram,
          gold18kPerGram: liveRates.value.gold18kPerGram,
          gold14kPerGram: liveRates.value.gold14kPerGram,
          silverPerGram: liveRates.value.silverPerGram,
          useManualOverride: liveRates.value.useManualOverride,
        });
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, [token]);

  // 1-Click Clear Demo Items
  async function handleClearDemoItems() {
    if (!window.confirm('Are you sure you want to remove all demo products from web imagery? This action will leave only your actual store inventory.')) {
      return;
    }
    try {
      const res = await api.clearDemoProducts();
      setActionSuccess(res.message);
      loadAdminData();
      refreshRates();
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      alert('Error removing demo items: ' + err.message);
    }
  }

  // Save Gold Rates
  async function handleSaveRates(e) {
    e.preventDefault();
    try {
      await api.updateGoldRates(goldRatesForm);
      setActionSuccess('Today\'s bullion rates updated successfully! All product prices recalculated across the site.');
      refreshRates();
      loadAdminData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert('Failed to update rates: ' + err.message);
    }
  }

  // Save / Update Product
  async function handleSaveProduct(e) {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        grossWeightGrams: parseFloat(productForm.grossWeightGrams) || 0,
        netGoldWeightGrams: parseFloat(productForm.netGoldWeightGrams) || 0,
        makingChargeValue: parseFloat(productForm.makingChargeValue) || 0,
        gemstoneCharges: parseFloat(productForm.gemstoneCharges) || 0,
        offerPrice: productForm.offerPrice ? parseFloat(productForm.offerPrice) : null,
        images: productForm.imageUrl ? [{ url: productForm.imageUrl, isPrimary: true, alt: productForm.title }] : [],
      };

      if (editingProductId) {
        await api.updateProduct(editingProductId, payload);
        setActionSuccess('Product updated successfully!');
      } else {
        await api.createProduct(payload);
        setActionSuccess('New product created and live in catalog!');
      }

      setProductModalOpen(false);
      setEditingProductId(null);
      loadAdminData();
      refreshRates();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  }

  // Delete Product
  async function handleDeleteProduct(id, title) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.deleteProduct(id);
      setActionSuccess(`Deleted ${title}`);
      loadAdminData();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  }

  // Update Sample Request Status
  async function handleSampleStatus(id, newStatus) {
    try {
      await api.updateSampleStatus(id, newStatus, 'Status updated by owner');
      loadAdminData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  }

  // Count Demo Items
  const demoCount = products.filter((p) => p.isDemoItem).length;

  // Login Screen if not authenticated
  if (!token) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gold-300 shadow-luxury space-y-5 sm:space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-burgundy-950 text-gold-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-burgundy-950">
              Shop Owner Portal
            </h2>
            <p className="text-xs text-stone-500">
              Manage your jewellery catalogue, daily gold rates, and customer enquiries.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 uppercase mb-1">Username</label>
              <input
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-sm min-h-[44px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="Enter admin password..."
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-sm min-h-[44px]"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] bg-burgundy-950 hover:bg-burgundy-900 text-gold-300 font-bold py-3.5 rounded-xl text-sm transition shadow-md flex items-center justify-center"
            >
              Sign In to Dashboard
            </button>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-stone-500 text-[11px] leading-relaxed">
              💡 <strong>Default Demo Credentials:</strong><br />
              Username: <code className="text-burgundy-900 font-bold">admin</code><br />
              Password: <code className="text-burgundy-900 font-bold">DiwaliGold2026!</code>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-6 sm:py-8 px-3 sm:px-6 lg:px-8 text-stone-800">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm gap-3 sm:gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-gold-600 uppercase tracking-widest block">
              Swarna Mahal Jewellers • Management Portal
            </span>
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-burgundy-950">
              Store Owner Control Center
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={loadAdminData}
              className="min-h-[44px] min-w-[44px] p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs flex items-center justify-center gap-1 transition"
              title="Refresh Data"
              aria-label="Refresh Dashboard Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="min-h-[44px] px-4 py-2 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Global Action Banner */}
        {actionSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 sm:p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* 1-Click Demo Catalog Handover Alert */}
        {demoCount > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-amber-500/10 border-2 border-amber-400 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                <span>Demo Catalog Active ({demoCount} Sample Products Loaded)</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                These items use high-res web images from Unsplash to impress your client during the pitch. Once the deal is closed, click the button to remove all demo items in one click.
              </p>
            </div>
            <button
              onClick={handleClearDemoItems}
              className="min-h-[44px] bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 sm:px-5 py-2.5 rounded-xl transition shadow flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Demo Products (1-Click Handover)</span>
            </button>
          </div>
        )}

        {/* Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-[11px] sm:text-xs text-stone-500 block truncate">Total Items</span>
            <span className="text-xl sm:text-2xl font-serif font-bold text-burgundy-950 mt-1 block">
              {products.length}
            </span>
            <span className="text-[10px] text-stone-400">({demoCount} demo, {products.length - demoCount} custom)</span>
          </div>
          <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-[11px] sm:text-xs text-stone-500 block truncate">Sample Uploads</span>
            <span className="text-xl sm:text-2xl font-serif font-bold text-amber-700 mt-1 block">
              {samples.length}
            </span>
            <span className="text-[10px] text-stone-400">Bespoke requests</span>
          </div>
          <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-[11px] sm:text-xs text-stone-500 block truncate">Enquiries</span>
            <span className="text-xl sm:text-2xl font-serif font-bold text-emerald-700 mt-1 block">
              {enquiries.length}
            </span>
            <span className="text-[10px] text-stone-400">Viewing leads</span>
          </div>
          <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-[11px] sm:text-xs text-stone-500 block truncate">Live 22K Rate</span>
            <span className="text-xl sm:text-2xl font-serif font-bold text-burgundy-950 mt-1 block">
              ₹{contextRates.gold22kPerGram}/g
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold truncate block">Active benchmark</span>
          </div>
        </div>

        {/* Navigation Tabs - Horizontally Scrollable on Mobile */}
        <div className="overflow-x-auto scrollbar-none flex border-b border-stone-200 bg-white rounded-t-2xl px-2 sm:px-4 pt-2 gap-1 sm:gap-2 whitespace-nowrap">
          {[
            { id: 'products', label: `Products (${products.length})` },
            { id: 'rates', label: 'Daily Gold Rates' },
            { id: 'samples', label: `Custom Samples (${samples.length})` },
            { id: 'enquiries', label: `Enquiries (${enquiries.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap flex items-center ${
                activeTab === tab.id
                  ? 'border-burgundy-900 text-burgundy-900 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Product Management */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-b-2xl p-4 sm:p-6 border border-stone-200 shadow-sm space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="font-serif text-lg font-bold text-burgundy-950">
                Jewellery Inventory ({products.length})
              </h2>
              <button
                onClick={() => {
                  setEditingProductId(null);
                  setProductForm({
                    title: '',
                    sku: `SW-${Date.now().toString().slice(-4)}`,
                    category: 'Bridal Jewellery',
                    metalType: 'Gold',
                    purity: '22K',
                    grossWeightGrams: 20.0,
                    netGoldWeightGrams: 20.0,
                    gemstoneWeightGrams: 0,
                    makingChargeType: 'Percentage',
                    makingChargeValue: 12.0,
                    gemstoneCharges: 0,
                    hasSpecialOffer: false,
                    offerPrice: '',
                    offerBadgeText: '',
                    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200',
                    description: '',
                    isBestseller: false,
                    isDiwaliFeatured: true,
                    inStock: true,
                  });
                  setProductModalOpen(true);
                }}
                className="w-full sm:w-auto min-h-[44px] bg-burgundy-950 hover:bg-burgundy-900 text-gold-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
              >
                <Plus className="w-4 h-4" /> Add New Ornament
              </button>
            </div>

            {/* Products Mobile Card View (< md) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
              {products.map((p) => {
                const price = p.price || {};
                return (
                  <div key={p.id} className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2.5 shadow-sm">
                    <div className="flex gap-3 items-center">
                      <img
                        src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200'}
                        alt={p.title}
                        className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-burgundy-950 block text-xs truncate">{p.title}</span>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className="text-[10px] text-gold-700 font-semibold">{p.category}</span>
                          <span className="text-[10px] text-stone-400 font-mono">({p.sku})</span>
                          {p.isDemoItem && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-semibold">
                              Demo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center bg-white p-2 rounded-lg border border-stone-200 text-[11px]">
                      <div>
                        <span className="text-stone-400 block text-[9px]">Purity</span>
                        <span className="font-bold text-stone-800">{p.purity}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px]">Net Wt</span>
                        <span className="font-bold text-stone-800">{p.netGoldWeightGrams}g</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px]">Making</span>
                        <span className="font-bold text-stone-800">
                          {p.makingChargeType === 'FixedPerGram' ? `₹${p.makingChargeValue}/g` : `${p.makingChargeValue}%`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                      <div>
                        <span className="text-[9px] text-stone-400 block">Live Price</span>
                        <span className="font-serif font-bold text-burgundy-950 text-sm">
                          ₹{price.finalPrice?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingProductId(p.id);
                            setProductForm({
                              ...p,
                              offerPrice: p.offerPrice || '',
                              imageUrl: p.images?.[0]?.url || '',
                            });
                            setProductModalOpen(true);
                          }}
                          className="min-h-[38px] px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 hover:text-burgundy-900 flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="min-h-[38px] px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-400 hover:text-rose-600 flex items-center"
                          aria-label={`Delete ${p.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Products Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider">
                    <th className="py-3 px-3">Item</th>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3">Purity & Weights</th>
                    <th className="py-3 px-3">Making Charge</th>
                    <th className="py-3 px-3">Live Dynamic Price</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => {
                    const price = p.price || {};
                    return (
                      <tr key={p.id} className="hover:bg-stone-50 transition">
                        <td className="py-3 px-3 flex items-center gap-3">
                          <img
                            src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200'}
                            alt={p.title}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-burgundy-950 block">{p.title}</span>
                            <span className="text-[10px] text-gold-700">{p.category}</span>
                            {p.isDemoItem && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold ml-1">
                                Demo
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-stone-600">{p.sku}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold block">{p.purity}</span>
                          <span className="text-stone-500 text-[11px]">Net: {p.netGoldWeightGrams}g</span>
                        </td>
                        <td className="py-3 px-3">
                          {p.makingChargeType === 'FixedPerGram' ? `₹${p.makingChargeValue}/g` : `${p.makingChargeValue}%`}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-serif font-bold text-burgundy-950 block">
                            ₹{price.finalPrice?.toLocaleString('en-IN')}
                          </span>
                          {p.hasSpecialOffer && (
                            <span className="text-[10px] text-amber-700 font-semibold">Special Offer</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProductId(p.id);
                              setProductForm({
                                ...p,
                                offerPrice: p.offerPrice || '',
                                imageUrl: p.images?.[0]?.url || '',
                              });
                              setProductModalOpen(true);
                            }}
                            className="p-1.5 text-stone-600 hover:text-burgundy-900 transition"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Daily Gold Rates Updater */}
        {activeTab === 'rates' && (
          <div className="bg-white rounded-b-2xl p-4 sm:p-6 lg:p-8 border border-stone-200 shadow-sm space-y-5 sm:space-y-6">
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-burgundy-950">
                Manage Daily Bullion Benchmark Rates
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Updating these rates immediately recalculates the price of every gold and diamond ornament across the entire website.
              </p>
            </div>

            <form onSubmit={handleSaveRates} className="space-y-5 sm:space-y-6 max-w-2xl text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    24K Pure Gold (per gram in ₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={goldRatesForm.gold24kPerGram}
                    onChange={(e) => setGoldRatesForm({ ...goldRatesForm, gold24kPerGram: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl font-bold text-base text-stone-900 min-h-[44px]"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Standard: ₹8,125/g</span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    22K Hallmarked Gold (916) (per gram in ₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={goldRatesForm.gold22kPerGram}
                    onChange={(e) => setGoldRatesForm({ ...goldRatesForm, gold22kPerGram: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl font-bold text-base text-stone-900 min-h-[44px]"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Standard: ₹7,450/g</span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    18K Diamond Jewellery Gold (per gram in ₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={goldRatesForm.gold18kPerGram}
                    onChange={(e) => setGoldRatesForm({ ...goldRatesForm, gold18kPerGram: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl font-bold text-base text-stone-900 min-h-[44px]"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Standard: ₹6,095/g</span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    999 Fine Silver (per gram in ₹)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={goldRatesForm.silverPerGram}
                    onChange={(e) => setGoldRatesForm({ ...goldRatesForm, silverPerGram: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl font-bold text-base text-stone-900 min-h-[44px]"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Standard: ₹98.5/g</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="override"
                  checked={goldRatesForm.useManualOverride}
                  onChange={(e) => setGoldRatesForm({ ...goldRatesForm, useManualOverride: e.target.checked })}
                  className="rounded text-burgundy-950 focus:ring-gold-500 w-4 h-4"
                />
                <label htmlFor="override" className="text-xs text-stone-700 font-medium">
                  Use manual shop association rates instead of automated market feed
                </label>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto min-h-[48px] bg-burgundy-950 hover:bg-burgundy-900 text-gold-300 font-bold px-6 py-3 rounded-xl text-xs transition shadow flex items-center justify-center"
              >
                Save & Recalculate Storefront Prices
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Custom Sample Requests Inbox */}
        {activeTab === 'samples' && (
          <div className="bg-white rounded-b-2xl p-4 sm:p-6 border border-stone-200 shadow-sm space-y-5 sm:space-y-6">
            <h2 className="font-serif text-lg font-bold text-burgundy-950">
              Customer Bespoke Design Samples & Quotes
            </h2>

            {samples.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">
                No custom design samples submitted yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {samples.map((s) => (
                  <div key={s.id} className="border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 bg-stone-50/50">
                    <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                      <img
                        src={s.sampleImageUrl}
                        alt="Customer Reference"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-stone-300 shrink-0 mx-auto xs:mx-0"
                      />
                      <div className="space-y-1 text-xs flex-1">
                        <span className="font-bold text-sm text-burgundy-950 block">{s.customerName}</span>
                        <span className="text-stone-600 block">📞 {s.phoneNumber}</span>
                        {s.city && <span className="text-stone-500 block">📍 {s.city}</span>}
                        <span className="text-gold-700 font-semibold block">{s.preferredMetal}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-stone-200">
                      <div>
                        <span className="text-stone-400 block text-[10px]">Target Weight</span>
                        <span className="font-bold">{s.targetWeightGrams ? `${s.targetWeightGrams}g` : 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px]">Budget</span>
                        <span className="font-bold">{s.targetBudgetINR ? `₹${s.targetBudgetINR.toLocaleString('en-IN')}` : 'Flexible'}</span>
                      </div>
                    </div>

                    {s.notes && (
                      <p className="text-xs text-stone-600 bg-white p-2.5 rounded-lg border border-stone-100">
                        "{s.notes}"
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2">
                      <select
                        value={s.status}
                        onChange={(e) => handleSampleStatus(s.id, e.target.value)}
                        className="text-xs p-2 border border-stone-300 rounded-lg bg-white min-h-[38px]"
                      >
                        <option value="New">Status: New</option>
                        <option value="Quoted">Status: Quoted</option>
                        <option value="InDiscussion">Status: In Discussion</option>
                        <option value="OrderPlaced">Status: Order Placed</option>
                        <option value="Declined">Status: Declined</option>
                      </select>

                      <a
                        href={`https://wa.me/${s.phoneNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(s.customerName)},%20this%20is%20Swarna%20Mahal%20Jewellers%20regarding%20your%20custom%20design%20sample%20request.`}
                        target="_blank"
                        rel="noreferrer"
                        className="min-h-[40px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Reply on WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Customer Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-b-2xl p-4 sm:p-6 border border-stone-200 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-burgundy-950">
              In-Store Viewing Appointments & Enquiries
            </h2>
            {enquiries.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">No customer enquiries logged yet.</p>
            ) : (
              <div className="divide-y divide-stone-100 text-xs">
                {enquiries.map((e) => (
                  <div key={e.id} className="py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2.5">
                    <div>
                      <span className="font-bold text-burgundy-950">{e.customerName}</span> ({e.phoneNumber})
                      <p className="text-stone-500 text-[11px] mt-0.5">{e.message}</p>
                      {e.productTitle && <span className="text-gold-700 font-medium">Product: {e.productTitle}</span>}
                    </div>
                    <a
                      href={`tel:${e.phoneNumber.replace(/[^0-9]/g, '')}`}
                      className="min-h-[38px] bg-stone-100 hover:bg-stone-200 text-stone-800 px-3.5 py-1.5 rounded-lg font-semibold flex items-center justify-center self-start sm:self-auto"
                    >
                      Call Customer
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Add or Edit Product - Constrained & Mobile Scrollable */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 max-h-[92dvh] flex flex-col border border-gold-300 shadow-2xl space-y-4 text-xs overflow-hidden">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3 shrink-0">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-burgundy-950">
                {editingProductId ? 'Edit Ornament Specifications' : 'Add New Jewellery Piece'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center text-lg"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="overflow-y-auto flex-1 pr-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-xs min-h-[42px]"
                    placeholder="e.g. Royal 22K Kundan Choker"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-xs min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-xs min-h-[42px]"
                  >
                    <option value="Bridal Jewellery">Bridal Jewellery</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Bangles">Bangles & Kadas</option>
                    <option value="Rings">Rings</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Coins">Gold & Silver Coins</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Metal & Purity *</label>
                  <select
                    value={productForm.purity}
                    onChange={(e) => setProductForm({ ...productForm, purity: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-xs min-h-[42px]"
                  >
                    <option value="22K">22K Gold (916 Hallmarked)</option>
                    <option value="24K">24K Pure Gold (999)</option>
                    <option value="18K">18K Diamond Gold (750)</option>
                    <option value="14K">14K Gold (585)</option>
                    <option value="Silver 999">999 Pure Silver</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Gross Weight (grams) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.grossWeightGrams}
                    onChange={(e) => setProductForm({ ...productForm, grossWeightGrams: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-base sm:text-xs min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Net Gold Weight (grams) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.netGoldWeightGrams}
                    onChange={(e) => setProductForm({ ...productForm, netGoldWeightGrams: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-base sm:text-xs min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Making Charge (% or ₹/g)</label>
                  <div className="flex gap-2">
                    <select
                      value={productForm.makingChargeType}
                      onChange={(e) => setProductForm({ ...productForm, makingChargeType: e.target.value })}
                      className="p-2.5 bg-stone-50 border border-stone-300 rounded-xl w-32 text-base sm:text-xs min-h-[42px]"
                    >
                      <option value="Percentage">% of Bullion</option>
                      <option value="FixedPerGram">Fixed ₹/gram</option>
                    </select>
                    <input
                      type="number"
                      step="0.1"
                      value={productForm.makingChargeValue}
                      onChange={(e) => setProductForm({ ...productForm, makingChargeValue: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-base sm:text-xs min-h-[42px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Gemstone Charges (₹)</label>
                  <input
                    type="number"
                    value={productForm.gemstoneCharges}
                    onChange={(e) => setProductForm({ ...productForm, gemstoneCharges: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-xs min-h-[42px]"
                  />
                </div>

                {/* Optional Festive Offer Price */}
                <div className="sm:col-span-2 bg-gold-50 p-3 rounded-xl border border-gold-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="specialOffer"
                      checked={productForm.hasSpecialOffer}
                      onChange={(e) => setProductForm({ ...productForm, hasSpecialOffer: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="specialOffer" className="font-bold text-burgundy-950">
                      Enable Festive Special Offer Price (Fixed Price Override)
                    </label>
                  </div>
                  {productForm.hasSpecialOffer && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <input
                        type="number"
                        placeholder="Offer Price in ₹ (e.g. 299000)"
                        value={productForm.offerPrice}
                        onChange={(e) => setProductForm({ ...productForm, offerPrice: e.target.value })}
                        className="p-2 bg-white border border-stone-300 rounded-lg text-base sm:text-xs min-h-[40px]"
                      />
                      <input
                        type="text"
                        placeholder="Offer Badge (e.g. Diwali Dhamaka)"
                        value={productForm.offerBadgeText}
                        onChange={(e) => setProductForm({ ...productForm, offerBadgeText: e.target.value })}
                        className="p-2 bg-white border border-stone-300 rounded-lg text-base sm:text-xs min-h-[40px]"
                      />
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Image URL (Web or Cloudinary/Supabase) *</label>
                  <input
                    type="url"
                    required
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-xs min-h-[42px]"
                    placeholder="https://..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base sm:text-xs"
                  ></textarea>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3 border-t border-stone-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 border border-stone-300 rounded-xl font-semibold flex items-center justify-center transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2 bg-burgundy-950 hover:bg-burgundy-900 text-gold-300 font-bold rounded-xl shadow flex items-center justify-center transition"
                >
                  Save Ornament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
