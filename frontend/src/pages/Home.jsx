import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useGoldRate } from '../context/GoldRateContext';
import FestiveDiwaliBanner from '../components/FestiveDiwaliBanner';
import ProductCard from '../components/ProductCard';
import GoldRateCalculatorWidget from '../components/GoldRateCalculatorWidget';
import { Sparkles, ArrowRight, ShieldCheck, UploadCloud, Gem, Coins, HeartHandshake, MapPin, Phone, MessageCircle } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { rates, settings } = useGoldRate();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await api.getProducts();
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const categories = [
    {
      name: 'Bridal Jewellery',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600',
      tag: 'Grand Heritage',
      link: '/collections?category=Bridal%20Jewellery',
    },
    {
      name: 'Temple Necklaces',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600',
      tag: 'Antique Karigari',
      link: '/collections?category=Necklaces',
    },
    {
      name: 'Kadas & Bangles',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600',
      tag: '22K Solid Gold',
      link: '/collections?category=Bangles',
    },
    {
      name: 'Diamond Solitaires',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600',
      tag: 'VVS Certified',
      link: '/collections?category=Rings',
    },
    {
      name: '24K Gold Coins',
      image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=600',
      tag: 'Dhanteras Shubh',
      link: '/collections?category=Coins',
    },
  ];

  const whatsapp = settings?.whatsappNumber || '919876543210';

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Festive Hero Banner */}
      <FestiveDiwaliBanner />

      {/* 2. Curated Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold text-gold-600 tracking-widest block mb-1">
            Exclusive Showroom Collections
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
            Handcrafted for Life's Sacred Milestones
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-sm hover:shadow-luxury transition-all duration-300 border border-ivory-border"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/90 via-burgundy-950/30 to-transparent flex flex-col justify-end p-4 text-center">
                <span className="text-[10px] text-gold-300 font-bold uppercase tracking-wider mb-0.5">
                  {cat.tag}
                </span>
                <h3 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-gold-300 transition">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Diwali Featured & Bestseller Jewellery Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-ivory-border pb-4">
          <div>
            <div className="flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-gold-500 animate-spin-slow" />
              <span>Diwali Mahotsav Bestsellers</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
              Auspicious Festive Creations
            </h2>
          </div>
          <Link
            to="/collections"
            className="text-xs sm:text-sm font-semibold text-burgundy-900 hover:text-gold-600 flex items-center gap-1 group"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-stone-200 aspect-[4/5] rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id || product.slug} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. "Upload Your Jewellery Sample" Spotlight Feature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 rounded-3xl p-8 sm:p-12 text-white border-2 border-gold-400/40 shadow-luxury relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-gold-500/20 text-gold-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-gold-500/30">
                <UploadCloud className="w-4 h-4 text-gold-400" />
                <span>Bespoke Karigari Consultation</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                Saw a Design You Love? <span className="gold-gradient-text">We'll Craft It For You</span>
              </h2>

              <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Send us a photo from Instagram, Pinterest, or a family heirloom. Our master karigars will evaluate the design, provide an exact weight estimation in 22K or 18K gold, and give you a transparent price quote.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/custom-sample"
                  className="bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-bold px-6 py-3.5 rounded-full text-xs sm:text-sm flex items-center gap-2 transition shadow-gold-glow"
                >
                  <UploadCloud className="w-4 h-4 text-burgundy-950" />
                  <span>Upload Your Design Sample Now</span>
                </Link>
                <a
                  href={`https://wa.me/${whatsapp}?text=Hello%20Swarna%20Mahal%20Jewellers,%20I%20have%20a%20jewellery%20photo%20I%20want%20to%20recreate.%20Can%20I%20share%20it%20here?`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-full text-xs sm:text-sm flex items-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 text-center lg:text-right">
              <div className="inline-block bg-burgundy-900/90 border border-gold-400/30 rounded-2xl p-6 text-left space-y-3">
                <span className="text-xs uppercase font-bold text-gold-400 block tracking-wider">
                  How It Works:
                </span>
                <ol className="text-xs space-y-2 text-stone-200 list-decimal list-inside">
                  <li>Upload reference photo or screenshot</li>
                  <li>Select preferred metal (22K, 18K, Silver)</li>
                  <li>Specify target weight or budget</li>
                  <li>Receive quotation on WhatsApp within hours</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Live Bullion Value Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GoldRateCalculatorWidget />
      </section>

      {/* 6. Festive Jewellery Purchase Scheme ("11 + 1 Month Bonus") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gold-300 shadow-luxury grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase font-bold text-gold-600 tracking-widest block">
              Smart Gold Investment Scheme
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
              Swarna Dhanvriddhi: Pay 11 Months, Get 1 Month Free Bonus
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Plan your family's future jewellery and wedding purchases effortlessly. Invest a fixed monthly instalment starting from ₹2,000 for 11 months. On the 12th month, Swarna Mahal contributes 100% of one instalment as a festive gift towards your jewellery redemption.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-stone-500 block">Min. Commitment</span>
                <span className="font-bold text-burgundy-950 text-sm">₹2,000 / month</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-stone-500 block">Tenure</span>
                <span className="font-bold text-burgundy-950 text-sm">11 Months</span>
              </div>
              <div className="bg-gold-50 p-3 rounded-xl border border-gold-200 col-span-2 sm:col-span-1">
                <span className="text-gold-800 block">Store Contribution</span>
                <span className="font-bold text-burgundy-950 text-sm">1 Month Free</span>
              </div>
            </div>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsapp}?text=Hello%20Swarna%20Mahal%20Jewellers,%20I%20would%20like%20to%20know%20more%20about%20the%2011%2B1%20Jewellery%20Purchase%20Scheme.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-burgundy-950 hover:bg-burgundy-900 text-gold-300 font-bold px-6 py-3 rounded-full text-xs transition"
              >
                <span>Enquire About Jewellery Scheme</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-gold-50 to-ivory p-6 sm:p-8 rounded-2xl border border-gold-200 space-y-4 text-center">
            <Coins className="w-12 h-12 text-gold-600 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-burgundy-950">
              Illustrative Scheme Example
            </h3>
            <div className="bg-white p-4 rounded-xl border border-stone-200 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span>Your Monthly Investment:</span>
                <span className="font-bold">₹5,000</span>
              </div>
              <div className="flex justify-between">
                <span>You Pay (11 Months):</span>
                <span className="font-bold">₹55,000</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Store Bonus Contribution:</span>
                <span>+ ₹5,000</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-serif text-sm font-bold text-burgundy-950">
                <span>You Redeem Jewellery Worth:</span>
                <span className="text-base text-gold-600">₹60,000</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500">
              Redeemable across all 22K Hallmarked Gold, Antique, and Diamond collections.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
