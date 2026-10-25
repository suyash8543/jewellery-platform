import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGoldRate } from '../context/GoldRateContext';
import PriceBreakdownModal from './PriceBreakdownModal';
import { MessageCircle, Scale, Sparkles, ShieldCheck, Eye } from 'lucide-react';

export default function ProductCard({ product }) {
  const { calculateDynamicPrice, settings } = useGoldRate();
  const [modalOpen, setModalOpen] = useState(false);

  if (!product) return null;

  const priceData = calculateDynamicPrice(product);
  const primaryImage = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200';
  const whatsapp = settings?.whatsappNumber || '919876543210';

  const waMessage = `Hello Swarna Mahal Jewellers, I am interested in "${product.title}" (SKU: ${product.sku}, Net Gold Weight: ${priceData.weightGrams}g). Estimated Price: ${priceData.formattedPrice}. Is this available for in-store viewing?`;

  return (
    <>
      <div className="group relative bg-white rounded-2xl overflow-hidden border border-ivory-border shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col">
        {/* Image Container with 4:5 Aspect Ratio - Clickable Link on all screen sizes */}
        <Link to={`/product/${product.slug || product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-stone-100">
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10">
            {/* Purity & BIS Badge */}
            <span className="inline-flex items-center gap-1 bg-burgundy-950/85 backdrop-blur-md text-gold-300 text-[9px] xs:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-gold-500/30">
              <ShieldCheck className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-gold-400" /> {product.purity} BIS 916
            </span>

            {/* Special Offer Badge */}
            {product.hasSpecialOffer && (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[9px] xs:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
                <Sparkles className="w-2.5 h-2.5 xs:w-3 xs:h-3 animate-spin-slow" /> {product.offerBadgeText || 'Festive Offer'}
              </span>
            )}

            {/* Bestseller Badge */}
            {product.isBestseller && !product.hasSpecialOffer && (
              <span className="inline-flex items-center bg-stone-900/80 backdrop-blur-md text-white text-[9px] xs:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                Bestseller
              </span>
            )}
          </div>

          {/* Quick View Button on Image Hover (Desktop) */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center pointer-events-none">
            <span className="pointer-events-auto bg-white/95 text-burgundy-950 text-xs font-semibold px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition flex items-center gap-1.5 hover:bg-gold-500 hover:text-white">
              <Eye className="w-3.5 h-3.5" /> View Details
            </span>
          </div>
        </Link>

        {/* Product Details */}
        <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Weight Indicator */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500 mb-1">
              <span className="uppercase tracking-wider font-semibold text-gold-600 truncate max-w-[55%]">
                {product.category}
              </span>
              <span className="flex items-center gap-1 font-medium bg-stone-100 px-1.5 sm:px-2 py-0.5 rounded text-stone-700 shrink-0">
                <Scale className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-400" />
                {priceData.weightGrams}g Net
              </span>
            </div>

            {/* Product Title */}
            <Link to={`/product/${product.slug || product.id}`}>
              <h3 className="font-serif text-xs xs:text-sm sm:text-base font-bold text-burgundy-950 group-hover:text-gold-600 transition line-clamp-1 mb-1 sm:mb-2">
                {product.title}
              </h3>
            </Link>

            {/* Price Presentation */}
            <div className="mt-0.5 sm:mt-1 mb-2 sm:mb-3">
              <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-serif text-base xs:text-lg sm:text-xl font-bold text-burgundy-950">
                  {priceData.formattedPrice}
                </span>
                {priceData.discountValue > 0 && (
                  <span className="text-[10px] xs:text-xs text-stone-400 line-through">
                    {priceData.formattedGross}
                  </span>
                )}
              </div>

              {/* Price Breakdown Link */}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="text-[10px] sm:text-[11px] text-gold-600 hover:text-gold-700 underline font-medium flex items-center gap-1 mt-0.5"
              >
                <span>View Live Price Breakup</span>
              </button>
            </div>
          </div>

          {/* Card Action Buttons */}
          <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 sm:gap-2">
            {/* WhatsApp Direct Inquiry */}
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              title="Chat with jeweller on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">Enquire on WhatsApp</span>
              <span className="xs:hidden">WhatsApp</span>
            </a>

            {/* Detail Link */}
            <Link
              to={`/product/${product.slug || product.id}`}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 border border-stone-200 hover:border-gold-400 hover:bg-gold-50 text-stone-700 rounded-xl transition shrink-0"
              title="View Specifications"
              aria-label={`View details for ${product.title}`}
            >
              <Eye className="w-4 h-4 text-stone-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Itemized Price Modal */}
      <PriceBreakdownModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={product}
        priceData={priceData}
      />
    </>
  );
}
