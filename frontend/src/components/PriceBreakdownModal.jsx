import React from 'react';
import { X, Scale, Sparkles, ShieldCheck, Info } from 'lucide-react';

export default function PriceBreakdownModal({ isOpen, onClose, product, priceData }) {
  if (!isOpen || !product || !priceData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[92dvh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gold-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 p-4 sm:p-5 text-white flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-gold-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">
              <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> Transparent Weight-Based Pricing
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-white line-clamp-1">
              {product.title}
            </h3>
            <p className="text-[11px] sm:text-xs text-gold-200 mt-0.5">
              SKU: {product.sku} • {product.purity} Gold • Net: {priceData.weightGrams}g
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Breakdown - Scrollable */}
        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-xs sm:text-sm overflow-y-auto flex-1">
          {/* Rate Notice */}
          <div className="bg-gold-50 border border-gold-200 rounded-xl p-3 flex items-center justify-between text-xs text-burgundy-950">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              Today's {product.purity} Rate Applied:
            </span>
            <span className="font-bold text-xs sm:text-sm text-burgundy-900">
              ₹{priceData.purityRatePerGram?.toLocaleString('en-IN')} / g
            </span>
          </div>

          {/* Table Breakdown */}
          <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50 text-xs">
            {/* Pure Gold Component */}
            <div className="p-3 sm:p-3.5 flex justify-between items-center bg-white">
              <div>
                <span className="font-medium text-stone-800 block text-xs sm:text-sm">Gold Bullion Value</span>
                <span className="text-[10px] sm:text-xs text-stone-500">
                  {priceData.weightGrams}g × ₹{priceData.purityRatePerGram?.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="font-bold text-stone-900 text-xs sm:text-sm">
                ₹{priceData.goldComponentValue?.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Making Charges (Karigari) */}
            <div className="p-3 sm:p-3.5 flex justify-between items-center bg-white">
              <div>
                <span className="font-medium text-stone-800 block text-xs sm:text-sm">Craftsmanship / Making</span>
                <span className="text-[10px] sm:text-xs text-stone-500">
                  {product.makingChargeType === 'FixedPerGram'
                    ? `₹${product.makingChargeValue}/g fixed`
                    : `${product.makingChargeValue}% of bullion`}
                </span>
              </div>
              <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                ₹{priceData.makingCharges?.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Gemstones / Pearls if any */}
            {priceData.gemstoneCharges > 0 && (
              <div className="p-3 sm:p-3.5 flex justify-between items-center bg-white">
                <div>
                  <span className="font-medium text-stone-800 block text-xs sm:text-sm">Gemstones & Pearls</span>
                  <span className="text-[10px] sm:text-xs text-stone-500">Certified natural stones</span>
                </div>
                <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                  ₹{priceData.gemstoneCharges?.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Festive Discount / Special Offer if active */}
            {priceData.discountValue > 0 && (
              <div className="p-3 sm:p-3.5 flex justify-between items-center bg-amber-50/60 text-amber-900">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-semibold block text-[11px] sm:text-xs uppercase tracking-wide">
                      {priceData.offerBadgeText || 'Diwali Festive Savings'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-amber-700">Special seasonal discount applied</span>
                  </div>
                </div>
                <span className="font-bold text-emerald-700 text-xs sm:text-sm">
                  - ₹{priceData.discountValue?.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Total Today's Final Price */}
            <div className="p-3.5 sm:p-4 flex justify-between items-center bg-burgundy-50 border-t-2 border-gold-400">
              <div>
                <span className="font-serif font-bold text-burgundy-950 text-sm sm:text-base block">
                  Today's Estimated Price
                </span>
                <span className="text-[10px] sm:text-[11px] text-stone-500">Inclusive of all crafting charges</span>
              </div>
              <div className="text-right">
                <span className="font-serif text-xl sm:text-2xl font-bold text-burgundy-950">
                  ₹{priceData.finalPrice?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Statutory Disclaimer */}
          <div className="flex items-start gap-2 bg-stone-100 p-2.5 sm:p-3 rounded-xl text-[10px] sm:text-[11px] text-stone-600 leading-relaxed">
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Indicative price computed live based on today's bullion market session. Final billing at the showroom reflects the exact weight verified on electronic scales and the live rate at the time of your invoice.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-50 p-3 sm:p-4 border-t border-stone-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl border border-stone-200 sm:border-transparent flex items-center justify-center transition"
          >
            Close
          </button>
          <a
            href={`https://wa.me/919876543210?text=Hello%20Swarna%20Mahal%20Jewellers,%20I%20am%20inquiring%20about%20${encodeURIComponent(product.title)}%20(SKU:%20${product.sku},%20Weight:%20${priceData.weightGrams}g).%20Today's%20breakup%20shows%20₹${priceData.finalPrice}.%20Please%20confirm%20availability.`}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
          >
            Inquire This Piece on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
