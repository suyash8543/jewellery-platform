import React, { useState } from 'react';
import { useGoldRate } from '../context/GoldRateContext';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function GoldRateCalculatorWidget({ embedded = false }) {
  const { rates } = useGoldRate();
  const [purity, setPurity] = useState('22K');
  const [weight, setWeight] = useState(10);
  const [makingPercent, setMakingPercent] = useState(12);

  // Quick weight presets
  const presets = [
    { label: '1 Gram', grams: 1 },
    { label: '8 Grams (Pavan)', grams: 8 },
    { label: '10 Grams', grams: 10 },
    { label: '1 Tola (11.66g)', grams: 11.66 },
    { label: '50 Grams', grams: 50 },
  ];

  function getRate() {
    switch (purity) {
      case '24K': return rates.gold24kPerGram || 8125;
      case '22K': return rates.gold22kPerGram || 7450;
      case '18K': return rates.gold18kPerGram || 6095;
      case '14K': return rates.gold14kPerGram || 4740;
      case 'Silver': return rates.silverPerGram || 98.5;
      default: return rates.gold22kPerGram || 7450;
    }
  }

  const currentRate = getRate();
  const bullionValue = Math.round((Number(weight) || 0) * currentRate);
  const estimatedMaking = Math.round(bullionValue * ((Number(makingPercent) || 0) / 100));
  const totalValue = bullionValue + estimatedMaking;

  return (
    <div className={`bg-white rounded-2xl border border-gold-300 shadow-luxury overflow-hidden ${embedded ? '' : 'p-6 sm:p-8'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 p-6 text-white rounded-xl mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                Live Gold & Silver Value Calculator
              </h3>
              <p className="text-xs text-gold-200 mt-0.5">
                Calculate today's real-time jewellery market value based on certified bullion rates.
              </p>
            </div>
          </div>
          <div className="bg-burgundy-900/80 px-3 py-1 rounded-full border border-gold-400/30 text-xs text-gold-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live IBJA Session: ₹{rates.gold22kPerGram}/g (22K)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
        {/* Input Controls */}
        <div className="space-y-5">
          {/* Metal / Purity Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Select Metal & Purity
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { id: '24K', name: '24K (999)', rate: rates.gold24kPerGram },
                { id: '22K', name: '22K (916)', rate: rates.gold22kPerGram },
                { id: '18K', name: '18K (750)', rate: rates.gold18kPerGram },
                { id: '14K', name: '14K (585)', rate: rates.gold14kPerGram },
                { id: 'Silver', name: '999 Silver', rate: rates.silverPerGram },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPurity(item.id)}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    purity === item.id
                      ? 'bg-burgundy-950 text-white border-gold-500 shadow-sm'
                      : 'bg-stone-50 hover:bg-gold-50 text-stone-800 border-stone-200'
                  }`}
                >
                  <span className="block text-xs font-bold">{item.id}</span>
                  <span className="block text-[10px] text-gold-400 mt-0.5">₹{item.rate}/g</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weight in Grams Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Weight in Grams
              </label>
              <span className="text-xs text-gold-700 font-semibold">
                Rate: ₹{currentRate.toLocaleString('en-IN')} / gram
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-xl font-bold bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 text-stone-900"
                placeholder="Enter weight in grams..."
              />
              <span className="absolute right-4 top-3.5 text-stone-500 font-semibold text-sm">
                grams
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setWeight(p.grams)}
                  className="text-[11px] bg-stone-100 hover:bg-gold-100 text-stone-700 px-2.5 py-1 rounded-full border border-stone-200 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Making Charges Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Making Charges (Karigari)
              </label>
              <span className="text-xs font-bold text-burgundy-900">{makingPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={makingPercent}
              onChange={(e) => setMakingPercent(parseInt(e.target.value, 10))}
              className="w-full accent-gold-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>0% (Coins/Bars)</span>
              <span>12% (Standard)</span>
              <span>25% (Intricate Bridal)</span>
            </div>
          </div>
        </div>

        {/* Live Calculation Output Card */}
        <div className="bg-gradient-to-br from-ivory to-gold-50 rounded-2xl p-6 border border-gold-200 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gold-200 pb-3">
              <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">
                Calculation Summary
              </span>
              <span className="text-xs font-semibold text-burgundy-900 bg-gold-200/50 px-2 py-0.5 rounded">
                {weight}g • {purity}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Pure Bullion Value:</span>
                <span className="font-semibold text-stone-900">₹{bullionValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Making Charges ({makingPercent}%):</span>
                <span className="font-semibold text-stone-900">₹{estimatedMaking.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Diwali Festival Advantage:
                </span>
                <span>Best Price Guarantee</span>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-gold-400">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold block mb-1">
                Estimated Net Value Today
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-burgundy-950">
                ₹{totalValue.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">
                *Subject to exact certified balance weight upon invoice.
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 space-y-2.5">
            <Link
              to={`/custom-sample?weight=${weight}&metal=${encodeURIComponent(purity + ' Gold')}`}
              className="w-full bg-burgundy-950 hover:bg-burgundy-900 text-gold-300 font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md"
            >
              <span>Customise a Piece in this Weight</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>

            <a
              href={`https://wa.me/919876543210?text=Hello%20Swarna%20Mahal%20Jewellers,%20I%20used%20your%20gold%20calculator%20for%20${weight}g%20of%20${purity}%20Gold%20(Estimated%20₹${totalValue}).%20Can%20you%20share%20designs%20in%20this%20weight%20range?`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Ask for Designs on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
