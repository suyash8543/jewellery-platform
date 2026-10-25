import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Filter, Search, Sparkles, Scale, RefreshCw } from 'lucide-react';

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const activeCategory = searchParams.get('category') || 'All';
  const activeMetal = searchParams.get('metal') || 'All';

  const categories = [
    'All',
    'Bridal Jewellery',
    'Necklaces',
    'Bangles',
    'Rings',
    'Coins',
    'Earrings',
  ];

  const metals = ['All', '22K Gold', '18K Diamond', '24K Gold', 'Silver'];

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await api.getProducts({
          category: activeCategory !== 'All' ? activeCategory : undefined,
        });
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to load collections:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMetal =
      activeMetal === 'All' ||
      p.purity.toLowerCase().includes(activeMetal.toLowerCase()) ||
      p.metalType.toLowerCase().includes(activeMetal.toLowerCase());

    return matchesSearch && matchesMetal;
  });

  function handleCategoryClick(cat) {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') params.delete('category');
    else params.set('category', cat);
    setSearchParams(params);
  }

  function handleMetalClick(metal) {
    const params = new URLSearchParams(searchParams);
    if (metal === 'All') params.delete('metal');
    else params.set('metal', metal);
    setSearchParams(params);
  }

  return (
    <div className="min-h-screen bg-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Title & Breadcrumb */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold text-gold-600 tracking-widest block">
            Authentic Hallmark Creations
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950">
            {activeCategory === 'All' ? 'Complete Jewellery Collection' : activeCategory}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto">
            Explore 100% BIS Hallmarked fine jewellery with certified gross & net gold weights, transparent making charges, and live market pricing.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-ivory-border shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3.5 sm:gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search necklace, choker, ring, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-stone-900 min-h-[44px]"
              />
            </div>

            {/* Metal & Purity Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider mr-1">
                Metal:
              </span>
              {metals.map((metal) => (
                <button
                  key={metal}
                  onClick={() => handleMetalClick(metal)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition min-h-[36px] flex items-center ${
                    activeMetal === metal
                      ? 'bg-burgundy-950 text-gold-300 border-burgundy-950 font-bold shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-gold-300'
                  }`}
                >
                  {metal}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs - Edge to Edge Scrollable */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-stone-100 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl whitespace-nowrap transition font-medium min-h-[40px] flex items-center ${
                  activeCategory === cat
                    ? 'bg-gold-500 text-burgundy-950 font-bold shadow-sm'
                    : 'bg-stone-50 text-stone-600 hover:bg-gold-50 hover:text-burgundy-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Product Grid */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-stone-500 mb-4 sm:mb-6 gap-1">
            <span className="font-medium">Showing {filteredProducts.length} jewellery designs</span>
            <span className="text-gold-700 font-medium">All prices calculated live based on today's spot rate</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-stone-200 aspect-[4/5] rounded-2xl"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id || product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-4">
              <Scale className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-burgundy-950">
                No Designs Match Your Selected Filter
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Have a specific design or weight in mind? You can upload a photo of the jewellery you want and our goldsmiths will craft it.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchParams({});
                }}
                className="text-xs font-semibold text-gold-600 underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
