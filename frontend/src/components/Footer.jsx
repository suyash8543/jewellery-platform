import React from 'react';
import { Link } from 'react-router-dom';
import { useGoldRate } from '../context/GoldRateContext';
import { ShieldCheck, Award, Scale, RefreshCw, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { settings, rates } = useGoldRate();
  const phone = settings?.contactNumber || '+91 98765 43210';
  const whatsapp = settings?.whatsappNumber || '919876543210';
  const address = settings?.storeAddress || 'Plot 42, Heritage Gold Lane, Zaveri Bazaar, Mumbai 400002';

  return (
    <footer className="bg-burgundy-950 text-stone-300 pt-12 sm:pt-16 pb-24 md:pb-12 border-t-4 border-gold-500">
      {/* 4 Pillars of Trust */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 border-b border-burgundy-900">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-center">
          <div className="flex flex-col items-center p-3.5 sm:p-4 bg-burgundy-900/40 rounded-xl border border-gold-500/10">
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400 mb-2 shrink-0" />
            <h4 className="font-serif text-white font-semibold text-xs sm:text-sm">100% BIS Hallmarked</h4>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-1 leading-tight sm:leading-normal">Unique 6-digit HUID laser engraved purity guarantee.</p>
          </div>
          <div className="flex flex-col items-center p-3.5 sm:p-4 bg-burgundy-900/40 rounded-xl border border-gold-500/10">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400 mb-2 shrink-0" />
            <h4 className="font-serif text-white font-semibold text-xs sm:text-sm">Certified Diamonds</h4>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-1 leading-tight sm:leading-normal">Every gemstone verified by international gemological labs.</p>
          </div>
          <div className="flex flex-col items-center p-3.5 sm:p-4 bg-burgundy-900/40 rounded-xl border border-gold-500/10">
            <Scale className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400 mb-2 shrink-0" />
            <h4 className="font-serif text-white font-semibold text-xs sm:text-sm">Transparent Pricing</h4>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-1 leading-tight sm:leading-normal">Live bullion spot rate multiplied by certified net weight.</p>
          </div>
          <div className="flex flex-col items-center p-3.5 sm:p-4 bg-burgundy-900/40 rounded-xl border border-gold-500/10">
            <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400 mb-2 shrink-0" />
            <h4 className="font-serif text-white font-semibold text-xs sm:text-sm">Lifetime Exchange</h4>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-1 leading-tight sm:leading-normal">Guaranteed buyback & upgrade policy on gold and diamonds.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Story */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-serif text-gold-400 font-bold tracking-wider">SWARNA MAHAL</h3>
            <p className="text-xs leading-relaxed text-stone-400">
              For over four decades, Swarna Mahal Jewellers has been the trusted destination for generations of families celebrating weddings, auspicious festivals, and lifetime milestones with bespoke handcrafted artistry.
            </p>
            <div className="pt-2 text-xs text-gold-300">
              <span className="font-semibold block">Today's Benchmark Rates:</span>
              <span>22K: ₹{rates.gold22kPerGram}/g | 24K: ₹{rates.gold24kPerGram}/g</span>
            </div>
          </div>

          {/* Jewellery Collections */}
          <div>
            <h4 className="text-xs sm:text-sm font-serif font-bold text-white uppercase tracking-wider mb-4 border-b border-gold-500/30 pb-1">
              Curated Collections
            </h4>
            <ul className="space-y-1 text-xs">
              <li><Link to="/collections?category=Bridal%20Jewellery" className="hover:text-gold-400 transition py-1.5 inline-flex items-center min-h-[32px]">Bridal Chokers & Haars</Link></li>
              <li><Link to="/collections?category=Necklaces" className="hover:text-gold-400 transition py-1.5 inline-flex items-center min-h-[32px]">Temple & Antique Gold</Link></li>
              <li><Link to="/collections?category=Bangles" className="hover:text-gold-400 transition py-1.5 inline-flex items-center min-h-[32px]">Kadas & Bridal Bangles</Link></li>
              <li><Link to="/collections?category=Rings" className="hover:text-gold-400 transition py-1.5 inline-flex items-center min-h-[32px]">Diamond Solitaires</Link></li>
              <li><Link to="/collections?category=Coins" className="hover:text-gold-400 transition py-1.5 inline-flex items-center min-h-[32px]">24K Dhanteras Gold Coins</Link></li>
              <li><Link to="/custom-sample" className="hover:text-gold-400 font-semibold text-gold-300 transition py-1.5 inline-flex items-center min-h-[32px]">Bespoke Design Orders</Link></li>
            </ul>
          </div>

          {/* Quick Links & Services */}
          <div>
            <h4 className="text-xs sm:text-sm font-serif font-bold text-white uppercase tracking-wider mb-4 border-b border-gold-500/30 pb-1">
              Customer Services
            </h4>
            <ul className="space-y-1 text-xs">
              <li><Link to="/gold-rates" className="hover:text-gold-400 transition py-1.5 inline-flex items-center min-h-[32px]">Live Gold Rate Calculator</Link></li>
              <li><Link to="/diwali-offers" className="hover:text-gold-400 transition py-1.5 inline-flex items-center min-h-[32px]">Diwali Festive Offers</Link></li>
              <li><Link to="/custom-sample" className="hover:text-gold-400 transition py-1.5 inline-flex items-center min-h-[32px]">Upload Design Sample</Link></li>
              <li><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-gold-400 transition py-1.5 inline-flex items-center min-h-[32px]">Book VIP Bridal Lounge</a></li>
              <li><Link to="/admin" className="text-stone-500 hover:text-stone-300 transition py-1.5 inline-flex items-center min-h-[32px]">Store Owner Dashboard</Link></li>
            </ul>
          </div>

          {/* Showroom Visit & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-serif font-bold text-white uppercase tracking-wider mb-4 border-b border-gold-500/30 pb-1">
              Flagship Showroom
            </h4>
            <p className="text-xs flex items-start gap-2 text-stone-300">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>{address}</span>
            </p>
            <p className="text-xs flex items-center gap-2 text-stone-300">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-gold-300 py-1">{phone}</a>
            </p>
            <p className="text-xs flex items-center gap-2 text-stone-300">
              <Clock className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Mon - Sun: 10:30 AM - 8:30 PM</span>
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center min-h-[44px] gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs px-4 py-2 rounded-lg font-medium transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4" /> Direct WhatsApp Concierge
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-burgundy-900/60 text-center text-xs text-stone-500">
        <p>© {new Date().getFullYear()} Swarna Mahal Jewellers. All rights reserved. 100% BIS Hallmarked Jewellery.</p>
      </div>
    </footer>
  );
}
