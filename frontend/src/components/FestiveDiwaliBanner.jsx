import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, UploadCloud, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export default function FestiveDiwaliBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white border-b-2 border-gold-500">
      {/* Decorative Festive Lighting Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Auspicious Festival Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-gold-500/20 via-amber-400/20 to-gold-500/20 border border-gold-400/40 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-gold-300 text-[10px] xs:text-xs font-semibold uppercase tracking-widest backdrop-blur-sm max-w-full truncate">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span>Shubh Dhanteras & Diwali Mahotsav 2026</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Bring Home <span className="gold-gradient-text">Auspicious Fortune</span> in Pure Certified Gold
            </h1>

            {/* Sub-headline */}
            <p className="text-xs xs:text-sm sm:text-base text-stone-300 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
              Celebrate the festival of lights with heirloom bridal jewellery, antique temple karigari, and 24K pure Lakshmi-Ganesh gold coins. Handcrafted with four decades of uncompromising purity.
            </p>

            {/* Festive Highlights Box */}
            <div className="bg-burgundy-900/80 border border-gold-500/30 rounded-2xl p-3.5 sm:p-5 backdrop-blur-sm max-w-xl mx-auto lg:mx-0">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 animate-spin-slow" />
                </div>
                <div className="text-left">
                  <h4 className="text-[11px] sm:text-xs uppercase font-bold text-gold-300 tracking-wider">
                    Limited Period Diwali Privilege
                  </h4>
                  <p className="text-xs sm:text-sm text-white font-medium mt-0.5 leading-snug">
                    Flat <strong>25% Off on Making Charges</strong> on all 22K Gold & Diamond jewellery + <strong>Free 10g Silver Coin</strong> on purchases above ₹50,000.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link
                to="/collections?category=Bridal%20Jewellery"
                className="w-full sm:w-auto min-h-[44px] bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-burgundy-950 font-bold px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-gold-glow transform hover:-translate-y-0.5"
              >
                <span>Explore Festive Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/custom-sample"
                className="w-full sm:w-auto min-h-[44px] bg-white/10 hover:bg-white/15 text-white border border-gold-400/50 font-semibold px-6 py-3 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition backdrop-blur-sm"
              >
                <UploadCloud className="w-4 h-4 text-gold-300" />
                <span>Upload Design Sample</span>
              </Link>
            </div>

            {/* Trust Assurance Strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-3 sm:pt-4 text-xs text-stone-400 border-t border-burgundy-800/80">
              <span className="flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-gold-400" /> 100% BIS Hallmarked (HUID)
              </span>
              <span className="flex items-center gap-1.5 text-stone-300">
                <Sparkles className="w-4 h-4 text-gold-400" /> Real-time Weight Based Pricing
              </span>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Gold Border Glow Frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-gold-500 via-amber-300 to-gold-600 rounded-3xl blur opacity-40 animate-pulse"></div>
              
              <div className="relative rounded-2xl overflow-hidden bg-burgundy-900 border-2 border-gold-400/50 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200"
                  alt="Aadhira Royal 22K Kundan Choker"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover object-center"
                />
                
                {/* Floating Card Info */}
                <div className="p-3 sm:p-4 bg-gradient-to-t from-burgundy-950 via-burgundy-950/90 to-transparent">
                  <div className="flex justify-between items-end gap-2">
                    <div>
                      <span className="text-[10px] text-gold-400 uppercase tracking-widest font-bold">
                        Diwali Featured Masterpiece
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white line-clamp-1">
                        Aadhira Royal Kundan Set
                      </h3>
                      <p className="text-[11px] sm:text-xs text-stone-300">22K Gold • 42.2g Net Weight</p>
                    </div>
                    <Link
                      to="/product/aadhira-royal-22k-kundan-pearl-bridal-choker"
                      className="min-h-[36px] bg-gold-500 hover:bg-gold-400 text-burgundy-950 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center shrink-0"
                    >
                      View Piece
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
