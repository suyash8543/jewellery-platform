import React from 'react';
import { useGoldRate } from '../context/GoldRateContext';
import GoldRateCalculatorWidget from '../components/GoldRateCalculatorWidget';
import { TrendingUp, ShieldCheck, Clock, Sparkles, Scale, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CheckGoldRates() {
  const { rates } = useGoldRate();

  const rateCards = [
    {
      title: '24K Pure Gold',
      purity: '99.9% Purity (Fine Gold)',
      ratePerGram: rates.gold24kPerGram,
      ratePer10g: rates.gold24kPerGram * 10,
      description: 'Used for investment gold coins, bullion bars, and sovereign reserves.',
      tag: 'Investment Standard',
    },
    {
      title: '22K Hallmarked Gold',
      purity: '91.6% Purity (916 BIS)',
      ratePerGram: rates.gold22kPerGram,
      ratePer10g: rates.gold22kPerGram * 10,
      description: 'The golden benchmark for Indian bridal necklaces, kadas, and wedding jewellery.',
      tag: 'Most Popular',
      highlight: true,
    },
    {
      title: '18K Gold',
      purity: '75.0% Purity (750 BIS)',
      ratePerGram: rates.gold18kPerGram,
      ratePer10g: rates.gold18kPerGram * 10,
      description: 'Ideal strength and luster for holding natural diamond solitaires & stone jewellery.',
      tag: 'Diamond Jewellery',
    },
    {
      title: '14K Daily Wear',
      purity: '58.5% Purity (585 BIS)',
      ratePerGram: rates.gold14kPerGram,
      ratePer10g: rates.gold14kPerGram * 10,
      description: 'Modern, durable, and lightweight gold for contemporary workwear and stacking rings.',
      tag: 'Contemporary',
    },
    {
      title: 'Fine Silver 999',
      purity: '99.9% Pure Silver',
      ratePerGram: rates.silverPerGram,
      ratePer10g: rates.silverPerKg,
      rateLabel: 'Rate per Kg',
      description: 'Auspicious silver utensils, puja articles, and Lakshmi-Ganesh festive coins.',
      tag: 'Festive Silver',
    },
  ];

  return (
    <div className="min-h-screen bg-ivory py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-3 px-2">
          <div className="inline-flex items-center gap-1.5 bg-burgundy-950 text-gold-300 px-3.5 py-1 rounded-full text-[11px] xs:text-xs font-semibold tracking-wider uppercase border border-gold-500/30">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Today's Official Bullion Benchmark</span>
          </div>

          <h1 className="font-serif text-2xl xs:text-3xl sm:text-5xl font-extrabold text-burgundy-950 leading-tight">
            Live Gold & Silver Rates in India
          </h1>

          <p className="text-stone-600 text-xs xs:text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Transparent, real-time bullion spot prices updated twice daily from official market sessions. All jewellery at Swarna Mahal is certified 100% BIS Hallmarked with unique HUID.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] xs:text-xs text-stone-500 pt-1">
            <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Last Updated: {new Date(rates.lastUpdatedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • Source: {rates.source}</span>
          </div>
        </div>

        {/* Live Rates Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {rateCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                card.highlight
                  ? 'bg-gradient-to-br from-burgundy-950 to-burgundy-900 text-white shadow-luxury border-2 border-gold-400'
                  : 'bg-white text-stone-800 border border-stone-200 shadow-sm hover:shadow-md'
              }`}
            >
              {card.highlight && (
                <div className="absolute top-0 right-0 bg-gold-500 text-burgundy-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                  {card.tag}
                </div>
              )}

              <div>
                <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${
                  card.highlight ? 'text-gold-300' : 'text-gold-600'
                }`}>
                  {card.purity}
                </span>

                <h3 className={`font-serif text-lg sm:text-xl font-bold mb-3 ${
                  card.highlight ? 'text-white' : 'text-burgundy-950'
                }`}>
                  {card.title}
                </h3>

                {/* Rates */}
                <div className="space-y-1.5 my-3 sm:my-4">
                  <div className="flex items-baseline justify-between border-b border-stone-100 pb-2">
                    <span className={`text-xs ${card.highlight ? 'text-stone-300' : 'text-stone-500'}`}>
                      Rate per Gram:
                    </span>
                    <span className={`text-xl sm:text-2xl font-bold font-serif ${
                      card.highlight ? 'text-gold-300' : 'text-burgundy-950'
                    }`}>
                      ₹{card.ratePerGram?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 text-xs">
                    <span className={card.highlight ? 'text-stone-300' : 'text-stone-500'}>
                      {card.rateLabel || 'Rate per 10 Grams'}:
                    </span>
                    <span className={`font-semibold ${card.highlight ? 'text-white' : 'text-stone-800'}`}>
                      ₹{card.ratePer10g?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <p className={`text-xs leading-relaxed mt-2 ${
                  card.highlight ? 'text-stone-300' : 'text-stone-500'
                }`}>
                  {card.description}
                </p>
              </div>

              <div className="pt-4 sm:pt-5 mt-4 border-t border-stone-200/40">
                <Link
                  to={`/custom-sample?metal=${encodeURIComponent(card.title)}`}
                  className={`flex items-center justify-center min-h-[44px] text-center text-xs font-semibold px-3 py-2 rounded-lg transition active:scale-95 ${
                    card.highlight
                      ? 'bg-gold-500 hover:bg-gold-400 text-burgundy-950'
                      : 'bg-stone-50 hover:bg-gold-50 text-stone-800 border border-stone-200'
                  }`}
                >
                  Order Custom Design in {card.title} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Value Calculator */}
        <div>
          <GoldRateCalculatorWidget />
        </div>

        {/* Hallmarking Purity Guide Section */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
            <ShieldCheck className="w-7 h-7 text-gold-500 shrink-0" />
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-burgundy-950">
                Understanding BIS Hallmarking & HUID Purity Marks
              </h2>
              <p className="text-xs text-stone-500">
                Your statutory guarantee when purchasing authentic Indian gold jewellery.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-xs text-stone-600 leading-relaxed">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-burgundy-950 text-sm block">1. Triangular BIS Logo</span>
              <p>Indicates that the ornament has been officially assayed and certified at an authorized Bureau of Indian Standards testing centre.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-burgundy-950 text-sm block">2. Purity Fineness Grade</span>
              <p><strong>22K916</strong> signifies 91.6% pure gold. <strong>18K750</strong> signifies 75% pure gold. Look for this stamp on the inner clasp.</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 sm:col-span-2 md:col-span-1">
              <span className="font-bold text-burgundy-950 text-sm block">3. 6-Digit Alphanumeric HUID</span>
              <p>Every single jewellery piece carries a unique Hallmark Unique Identification laser code trackable on the BIS Care App.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
