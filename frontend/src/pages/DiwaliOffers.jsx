import React from 'react';
import { Sparkles, Gift, Flame, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGoldRate } from '../context/GoldRateContext';

export default function DiwaliOffers() {
  const { settings, rates } = useGoldRate();
  const whatsapp = settings?.whatsappNumber || '919876543210';

  const offers = [
    {
      title: 'Flat 25% Off on Making Charges',
      category: '22K Gold & Antique Jewellery',
      badge: 'Festive Mahotsav',
      description: 'Enjoy 25% discount on all intricate craftsmanship and karigari charges across our exclusive bridal and festive necklace sets.',
      validity: 'Valid till Bhai Dooj 2026',
      terms: 'Applicable on minimum purchase of 10 grams of 22K gold.',
    },
    {
      title: 'Free 10g Silver Coin on Gold Purchases',
      category: 'Auspicious Dhanteras Shubh Muhurat',
      badge: 'Assured Gift',
      description: 'Receive an auspicious 999 Fine Silver Lakshmi-Ganesh coin with every gold jewellery purchase above ₹50,000.',
      validity: 'Dhanteras & Diwali Days Only',
      terms: 'Subject to stock availability. Certified tamper-proof packaging included.',
    },
    {
      title: 'Zero Making Charges on 24K Gold Coins',
      category: 'Bullion & Investment Coins',
      badge: 'Zero Premium',
      description: 'Lock in pure bullion value this Dhanteras. Purchase 24K 999.9 fine gold coins (1g, 5g, 10g, 20g) at raw spot market rates with zero making charges.',
      validity: 'Pre-Booking Open Now',
      terms: 'NABL accredited purity certificate included.',
    },
    {
      title: 'Swarna Dhanvriddhi: 11 + 1 Bonus Scheme',
      category: 'Jewellery Purchase Scheme',
      badge: '100% Free Month',
      description: 'Pay a fixed monthly instalment starting from ₹2,000 for 11 months, and Swarna Mahal Jewellers contributes the 12th month instalment completely free.',
      validity: 'Year-Round Auspicious Enrollment',
      terms: 'Redeemable on all 22K Gold and Diamond jewellery with zero deduction.',
    },
  ];

  return (
    <div className="min-h-screen bg-ivory py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
        {/* Banner */}
        <div className="bg-gradient-to-br from-burgundy-950 via-burgundy-900 to-burgundy-950 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-white border-2 border-gold-400 text-center space-y-4 shadow-luxury">
          <div className="inline-flex items-center gap-1.5 bg-gold-500/20 text-gold-300 text-[11px] xs:text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-gold-500/30">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Diwali & Dhanteras Utsav 2026</span>
          </div>

          <h1 className="font-serif text-2xl xs:text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Exclusive Festive Privileges & Schemes
          </h1>

          <p className="text-stone-300 text-xs xs:text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Make this Diwali truly auspicious with transparent weight-based pricing, guaranteed BIS hallmarked purity, and unmatched seasonal savings.
          </p>

          <div className="pt-2">
            <span className="inline-block text-[11px] xs:text-xs text-gold-300 bg-burgundy-900/90 px-3.5 py-1.5 rounded-full border border-gold-400/30">
              Today's 22K Benchmark: ₹{rates.gold22kPerGram}/g | 24K: ₹{rates.gold24kPerGram}/g
            </span>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {offers.map((offer) => (
            <div
              key={offer.title}
              className="bg-white rounded-2xl p-5 sm:p-7 border border-gold-200 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 justify-between items-start">
                  <span className="text-[11px] xs:text-xs font-bold uppercase tracking-wider text-gold-600">
                    {offer.category}
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {offer.badge}
                  </span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-burgundy-950">
                  {offer.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {offer.description}
                </p>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-500 space-y-1">
                  <div><strong>Validity:</strong> {offer.validity}</div>
                  <div><strong>Terms:</strong> {offer.terms}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3">
                <Link
                  to="/collections"
                  className="min-h-[44px] text-xs font-bold text-burgundy-950 hover:text-gold-600 flex items-center justify-center xs:justify-start gap-1"
                >
                  <span>Explore Eligible Pieces</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={`https://wa.me/${whatsapp}?text=Hello%20Swarna%20Mahal%20Jewellers,%20I%20am%20inquiring%20about%20the%20offer:%20"${encodeURIComponent(offer.title)}".%20Please%20guide%20me.`}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enquire</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
