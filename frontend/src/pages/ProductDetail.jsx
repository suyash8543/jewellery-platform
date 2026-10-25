import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useGoldRate } from '../context/GoldRateContext';
import PriceBreakdownModal from '../components/PriceBreakdownModal';
import { ShieldCheck, Scale, Sparkles, MessageCircle, Phone, Calendar, ArrowLeft, CheckCircle2, Info } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const { calculateDynamicPrice, settings } = useGoldRate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    phoneNumber: '',
    preferredDate: '',
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await api.getProduct(slug);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center space-y-3">
          <Sparkles className="w-8 h-8 text-gold-500 animate-spin-slow mx-auto" />
          <p className="text-xs text-stone-500">Loading fine jewellery craftsmanship...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="font-serif text-xl font-bold text-burgundy-950">Ornament Not Found</h2>
          <p className="text-xs text-stone-500">
            The jewellery piece you are looking for may have been updated or booked.
          </p>
          <Link
            to="/collections"
            className="inline-block bg-burgundy-950 text-gold-300 text-xs font-semibold px-5 py-2.5 rounded-lg"
          >
            ← Browse All Collections
          </Link>
        </div>
      </div>
    );
  }

  const priceData = calculateDynamicPrice(product);
  const images = product.images?.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200', alt: product.title }];

  const whatsapp = settings?.whatsappNumber || '919876543210';
  const waMessage = `Hello Swarna Mahal Jewellers, I would like to inquire about "${product.title}" (SKU: ${product.sku}, Net Gold Weight: ${priceData.weightGrams}g, Purity: ${product.purity}). Today's estimated price is ${priceData.formattedPrice}. Is this available for in-store viewing at your Zaveri Bazaar showroom?`;

  async function handleBookViewing(e) {
    e.preventDefault();
    if (!bookingForm.customerName || !bookingForm.phoneNumber) return;

    try {
      await api.submitEnquiry({
        productId: product.id,
        productTitle: product.title,
        productSku: product.sku,
        customerName: bookingForm.customerName,
        phoneNumber: bookingForm.phoneNumber,
        message: `Bridal Consultation / In-Store Viewing Request for date: ${bookingForm.preferredDate || 'Earliest available'}`,
        enquiryType: 'BridalConsultation',
      });
      setBookingSuccess(true);
    } catch (err) {
      console.error('Enquiry error:', err);
    }
  }

  return (
    <div className="min-h-screen bg-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Link to="/" className="hover:text-burgundy-900">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-burgundy-900">Collections</Link>
          <span>/</span>
          <Link to={`/collections?category=${encodeURIComponent(product.category)}`} className="hover:text-burgundy-900">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-burgundy-950 font-semibold truncate max-w-xs">{product.title}</span>
        </div>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-ivory-border shadow-luxury">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Viewport */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={images[activeImageIndex]?.url}
                alt={images[activeImageIndex]?.alt || product.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="bg-burgundy-950/85 backdrop-blur-md text-gold-300 text-xs font-bold px-3 py-1 rounded-full border border-gold-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> {product.purity} BIS Hallmarked
                </span>
                {product.hasSpecialOffer && (
                  <span className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                    <Sparkles className="w-3.5 h-3.5" /> {product.offerBadgeText || 'Diwali Special Offer'}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      activeImageIndex === idx ? 'border-gold-500 shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.alt || 'Thumbnail'} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specifications & Pricing */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-gold-600 tracking-widest">
                  {product.category} {product.subCategory ? `• ${product.subCategory}` : ''}
                </span>
                <span className="text-xs text-stone-400 font-mono">SKU: {product.sku}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-burgundy-950 leading-tight">
                {product.title}
              </h1>

              {/* Dynamic Live Price Presentation */}
              <div className="bg-gradient-to-br from-ivory to-gold-50 p-5 rounded-2xl border border-gold-300">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>Today's Estimated Market Value:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live IBJA Spot Calculation
                  </span>
                </div>

                <div className="flex items-baseline gap-3 my-1">
                  <span className="font-serif text-3xl sm:text-4xl font-extrabold text-burgundy-950">
                    {priceData.formattedPrice}
                  </span>
                  {priceData.discountValue > 0 && (
                    <span className="text-sm text-stone-400 line-through">
                      {priceData.formattedGross}
                    </span>
                  )}
                </div>

                {priceData.discountValue > 0 && (
                  <p className="text-xs text-amber-800 font-medium">
                    You save {priceData.formattedDiscount} through our active festival offer!
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-3 text-xs font-semibold text-gold-700 hover:text-gold-900 underline flex items-center gap-1"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>View Itemized Price Breakup (Gold vs Making Charges)</span>
                </button>
              </div>

              {/* Certified Weight Specifications Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Certified Weight & Purity Breakdown
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px]">Net Gold Weight</span>
                    <span className="font-bold text-burgundy-950 text-sm">{product.netGoldWeightGrams} g</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px]">Gross Weight</span>
                    <span className="font-bold text-burgundy-950 text-sm">{product.grossWeightGrams} g</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px]">Metal Purity</span>
                    <span className="font-bold text-burgundy-950 text-sm">{product.purity}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[10px]">Hallmarking</span>
                    <span className="font-bold text-emerald-700 text-sm">HUID Certified</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-2">
                <p>{product.description}</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              {/* Primary WhatsApp Action */}
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Inquire & Reserve on WhatsApp</span>
              </a>

              {/* Book Showroom Consultation */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                {bookingSuccess ? (
                  <div className="text-center py-2 text-xs text-emerald-800 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your private showroom viewing request has been recorded. Our staff will confirm your slot via call.</span>
                  </div>
                ) : (
                  <form onSubmit={handleBookViewing} className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-burgundy-950">
                      <Calendar className="w-4 h-4 text-gold-600" />
                      <span>Book VIP In-Store Viewing at Zaveri Bazaar</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={bookingForm.customerName}
                        onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                        className="bg-white border border-stone-300 rounded-lg p-2 text-xs text-stone-900"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        value={bookingForm.phoneNumber}
                        onChange={(e) => setBookingForm({ ...bookingForm, phoneNumber: e.target.value })}
                        className="bg-white border border-stone-300 rounded-lg p-2 text-xs text-stone-900"
                      />
                      <button
                        type="submit"
                        className="bg-burgundy-950 hover:bg-burgundy-900 text-gold-300 text-xs font-semibold rounded-lg py-2 transition"
                      >
                        Request Appointment
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PriceBreakdownModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={product}
        priceData={priceData}
      />
    </div>
  );
}
