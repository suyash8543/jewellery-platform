import React from 'react';
import { Link } from 'react-router-dom';
import { useGoldRate } from '../context/GoldRateContext';
import { Phone, MessageCircle, UploadCloud, TrendingUp } from 'lucide-react';

export default function StickyMobileBar() {
  const { settings, rates } = useGoldRate();
  const phone = settings?.contactNumber || '+91 98765 43210';
  const whatsapp = settings?.whatsappNumber || '919876543210';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-burgundy-950/95 backdrop-blur-md border-t border-gold-500/30 px-3 py-2 pb-safe flex items-center justify-around md:hidden shadow-lg">
      {/* Call Button */}
      <a
        href={`tel:${phone.replace(/\s+/g, '')}`}
        className="flex flex-col items-center text-stone-300 hover:text-gold-300 text-[10px] font-medium min-w-[50px] min-h-[44px] justify-center"
      >
        <div className="w-8 h-8 rounded-full bg-burgundy-900 border border-gold-500/30 flex items-center justify-center mb-0.5 text-gold-400">
          <Phone className="w-4 h-4" />
        </div>
        <span>Call Store</span>
      </a>

      {/* Gold Rates Check */}
      <Link
        to="/gold-rates"
        className="flex flex-col items-center text-stone-300 hover:text-gold-300 text-[10px] font-medium min-w-[50px] min-h-[44px] justify-center"
      >
        <div className="w-8 h-8 rounded-full bg-burgundy-900 border border-gold-500/30 flex items-center justify-center mb-0.5 text-gold-400">
          <TrendingUp className="w-4 h-4" />
        </div>
        <span>₹{rates.gold22kPerGram}/g</span>
      </Link>

      {/* Upload Sample / Custom Order - Highlighted Center */}
      <Link
        to="/custom-sample"
        className="flex flex-col items-center text-burgundy-950 font-bold text-[10px] -mt-4 min-w-[50px]"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold-500 to-gold-300 border-2 border-white shadow-gold-glow flex items-center justify-center mb-0.5 text-burgundy-950">
          <UploadCloud className="w-6 h-6 animate-bounce" />
        </div>
        <span className="text-gold-300 font-semibold">Upload Design</span>
      </Link>

      {/* WhatsApp Direct */}
      <a
        href={`https://wa.me/${whatsapp}?text=Hello%20Swarna%20Mahal%20Jewellers,%20I%20am%20inquiring%20about%20your%20jewellery.`}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center text-emerald-400 hover:text-emerald-300 text-[10px] font-medium min-w-[50px] min-h-[44px] justify-center"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mb-0.5 text-emerald-400">
          <MessageCircle className="w-4 h-4" />
        </div>
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
