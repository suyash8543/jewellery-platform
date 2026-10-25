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
        {/* Image Container with 4:5 Aspect Ratio */}
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {/* Purity & BIS Badge */}
            <span className="inline-flex items-center gap-1 bg-burgundy-950/85 backdrop-blur-md text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gold-500/30">
              <ShieldCheck className="w-3 h-3 text-gold-400" /> {product.purity} BIS 916
            </span>

            {/* Special Offer Badge */}
            {product.hasSpecialOffer && (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                <Sparkles className="w-3 h-3 animate-spin-slow" /> {product.offerBadgeText || 'Festive Offer'}
              </span>
            )}

            {/* Bestseller Badge */}
            {product.isBestseller && !product.hasSpecialOffer && (
              <span className="inline-flex items-center bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                Bestseller
              </span>
            )}
          </div>

          {/* Quick View Button on Image Hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <Link
              to={`/product/${product.slug || product.id}`}
              className="pointer-events-auto bg-white/95 text-burgundy-950 text-xs font-semibold px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition flex items-center gap-1.5 hover:bg-gold-500 hover:text-white"
            >
              <Eye className="w-3.5 h-3.5" /> View Details
            </Link>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Weight Indicator */}
            <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
              <span className="uppercase tracking-wider font-semibold text-gold-600">
                {product.category}
              </span>
              <span className="flex items-center gap-1 font-medium bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                <Scale className="w-3 h-3 text-stone-400" />
                {priceData.weightGrams}g Net
              </span>
            </div>

            {/* Product Title */}
            <Link to={`/product/${product.slug || product.id}`}>
              <h3 className="font-serif text-sm sm:text-base font-bold text-burgundy-950 group-hover:text-gold-600 transition line-clamp-1 mb-2">
                {product.title}
              </h3>
            </Link>

            {/* Price Presentation */}
            <div className="mt-1 mb-3">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold text-burgundy-950">
                  {priceData.formattedPrice}
                </span>
                {priceData.discountValue > 0 && (
                  <span className="text-xs text-stone-400 line-through">
                    {priceData.formattedGross}
                  </span>
                )}
              </div>

              {/* Price Breakdown Link */}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="text-[11px] text-gold-600 hover:text-gold-700 underline font-medium flex items-center gap-1 mt-0.5"
              >
                <span>View Live Price Breakup</span>
              </button>
            </div>
          </div>

          {/* Card Action Buttons */}
          <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
            {/* WhatsApp Direct Inquiry */}
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              title="Chat with jeweller on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Enquire on WhatsApp</span>
            </a>

            {/* Detail Link */}
            <Link
              to={`/product/${product.slug || product.id}`}
              className="p-2 border border-stone-200 hover:border-gold-400 hover:bg-gold-50 text-stone-700 rounded-lg transition"
              title="View Specifications"
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
