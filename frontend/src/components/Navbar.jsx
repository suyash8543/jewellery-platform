import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGoldRate } from '../context/GoldRateContext';
import { Sparkles, Phone, MessageCircle, TrendingUp, UploadCloud, Menu, X, ShieldCheck, User } from 'lucide-react';

export default function Navbar() {
  const { rates, settings } = useGoldRate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const phone = settings?.contactNumber || '+91 98765 43210';
  const whatsapp = settings?.whatsappNumber || '919876543210';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'Bridal Studio', path: '/collections?category=Bridal%20Jewellery' },
    { name: 'Diwali Offers', path: '/diwali-offers' },
    { name: 'Live Gold Rates', path: '/gold-rates', highlight: true },
    { name: 'Upload Design Sample', path: '/custom-sample', badge: 'New' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ivory-border shadow-sm">
      {/* Top Ticker: Live Bullion Rates & Quick Contact */}
      <div className="bg-burgundy-950 text-gold-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Live Rates Ticker */}
          <div className="flex items-center gap-3 overflow-x-auto py-0.5 scrollbar-none">
            <span className="flex items-center gap-1 font-semibold text-gold-400 uppercase tracking-wider text-[11px] whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Gold Today:
            </span>
            <span className="whitespace-nowrap bg-burgundy-900/80 px-2 py-0.5 rounded border border-gold-500/20">
              <strong className="text-white">22K (916):</strong> ₹{rates.gold22kPerGram?.toLocaleString('en-IN')}/g
            </span>
            <span className="whitespace-nowrap bg-burgundy-900/80 px-2 py-0.5 rounded border border-gold-500/20">
              <strong className="text-white">24K:</strong> ₹{rates.gold24kPerGram?.toLocaleString('en-IN')}/g
            </span>
            <span className="whitespace-nowrap bg-burgundy-900/80 px-2 py-0.5 rounded border border-gold-500/20">
              <strong className="text-white">Silver:</strong> ₹{rates.silverPerGram?.toLocaleString('en-IN')}/g
            </span>
            <Link 
              to="/gold-rates" 
              className="text-gold-300 hover:text-white underline text-[11px] flex items-center gap-0.5 ml-1"
            >
              Calculator <TrendingUp className="w-3 h-3 inline" />
            </Link>
          </div>

          {/* Quick Contact & Store Assurance */}
          <div className="hidden md:flex items-center gap-4 text-[11px] text-stone-300">
            <span className="flex items-center gap-1 text-gold-300">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> 100% BIS Hallmarked HUID
            </span>
            <a 
              href={`tel:${phone.replace(/\s+/g, '')}`} 
              className="hover:text-gold-300 flex items-center gap-1 transition"
            >
              <Phone className="w-3 h-3 text-gold-400" /> {phone}
            </a>
            <Link 
              to="/admin" 
              className="hover:text-gold-300 flex items-center gap-1 text-stone-400 transition ml-2 border-l border-burgundy-800 pl-3"
              title="Shop Owner Admin Portal"
            >
              <User className="w-3 h-3" /> Owner Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Heritage Brand */}
          <Link to="/" className="flex flex-col group">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold tracking-wider text-burgundy-900 group-hover:text-gold-600 transition">
                SWARNA MAHAL
              </span>
              <Sparkles className="w-5 h-5 text-gold-500 animate-spin-slow" />
            </div>
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans text-stone-500 font-semibold -mt-1">
              Jewellers • Heritage Since 1982
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-1 transition flex items-center gap-1.5 ${
                    isActive
                      ? 'text-burgundy-900 font-bold border-b-2 border-gold-500'
                      : 'text-stone-700 hover:text-burgundy-800'
                  } ${link.highlight ? 'text-burgundy-800 font-semibold' : ''}`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Upload Sample / Bespoke Design CTA */}
            <Link
              to="/custom-sample"
              className="bg-gold-50 hover:bg-gold-100 text-burgundy-900 border border-gold-300 font-medium px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5 transition shadow-sm hover:shadow"
            >
              <UploadCloud className="w-4 h-4 text-gold-600" />
              <span>Upload Your Design</span>
            </Link>

            {/* Direct WhatsApp Chat */}
            <a
              href={`https://wa.me/${whatsapp}?text=Hello%20Swarna%20Mahal%20Jewellers,%20I%20am%20exploring%20your%20jewellery%20collection.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-full text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-2">
            <Link
              to="/custom-sample"
              className="text-xs bg-gold-50 text-burgundy-900 border border-gold-300 px-2.5 py-1.5 rounded-full flex items-center gap-1"
            >
              <UploadCloud className="w-3.5 h-3.5 text-gold-600" />
              <span>Sample</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-burgundy-900 hover:text-gold-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ivory border-b border-ivory-border px-4 pt-3 pb-6 space-y-3">
          <div className="bg-white p-3 rounded-lg border border-gold-200 text-xs mb-3">
            <div className="font-semibold text-burgundy-900 mb-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-gold-600" /> Today's Gold Rates:
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gold-50 p-1.5 rounded">
                <span className="block text-[10px] text-stone-500">22K Gold</span>
                <span className="font-bold text-burgundy-900">₹{rates.gold22kPerGram}/g</span>
              </div>
              <div className="bg-gold-50 p-1.5 rounded">
                <span className="block text-[10px] text-stone-500">24K Pure</span>
                <span className="font-bold text-burgundy-900">₹{rates.gold24kPerGram}/g</span>
              </div>
              <div className="bg-gold-50 p-1.5 rounded">
                <span className="block text-[10px] text-stone-500">Silver</span>
                <span className="font-bold text-burgundy-900">₹{rates.silverPerGram}/g</span>
              </div>
            </div>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-serif text-burgundy-950 hover:bg-gold-100 rounded-md"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-2 border-t border-ivory-border flex flex-col gap-2">
            <Link
              to="/custom-sample"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-gold-500 hover:bg-gold-600 text-burgundy-950 font-semibold py-2.5 rounded-md text-sm flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" /> Upload Jewellery Sample
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-emerald-600 text-white font-semibold py-2.5 rounded-md text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs text-stone-500 hover:text-burgundy-900 py-1"
            >
              Store Owner Dashboard Login →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
