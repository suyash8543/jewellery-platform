import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const GoldRateContext = createContext();

export function GoldRateProvider({ children }) {
  const [rates, setRates] = useState({
    gold24kPerGram: 8125,
    gold22kPerGram: 7450,
    gold18kPerGram: 6095,
    gold14kPerGram: 4740,
    silverPerGram: 98.5,
    silverPerKg: 98500,
    useManualOverride: false,
    source: 'IBJA Live Feed',
    lastUpdatedAt: new Date().toISOString(),
  });
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const [fetchedRates, fetchedSettings] = await Promise.allSettled([
        api.getGoldRates(),
        api.getSettings(),
      ]);

      if (fetchedRates.status === 'fulfilled' && fetchedRates.value) {
        setRates(fetchedRates.value);
      }
      if (fetchedSettings.status === 'fulfilled' && fetchedSettings.value) {
        setSettings(fetchedSettings.value);
      }
    } catch (err) {
      console.warn('Using baseline fallback gold rates:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // Auto refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  function getRateForPurity(purity) {
    if (!purity) return rates.gold22kPerGram;
    const p = purity.toUpperCase();
    if (p.includes('24K') || p.includes('999 GOLD')) return rates.gold24kPerGram;
    if (p.includes('22K') || p.includes('916')) return rates.gold22kPerGram;
    if (p.includes('18K') || p.includes('750')) return rates.gold18kPerGram;
    if (p.includes('14K') || p.includes('585')) return rates.gold14kPerGram;
    if (p.includes('SILVER')) return rates.silverPerGram;
    return rates.gold22kPerGram;
  }

  function calculateDynamicPrice(product) {
    if (!product) return null;
    const ratePerGram = getRateForPurity(product.purity);
    const weight = product.netGoldWeightGrams || product.grossWeightGrams || 0;
    const goldValue = Math.round(weight * ratePerGram);

    let making = 0;
    if (product.makingChargeType === 'FixedPerGram') {
      making = Math.round((product.makingChargeValue || 0) * weight);
    } else {
      making = Math.round(goldValue * ((product.makingChargeValue || 12) / 100));
    }

    const gemstone = product.gemstoneCharges || 0;
    const grossPrice = goldValue + making + gemstone;

    let discount = 0;
    let finalPrice = grossPrice;

    if (product.hasSpecialOffer && product.offerPrice && product.offerPrice > 0) {
      finalPrice = product.offerPrice;
      discount = Math.max(0, grossPrice - finalPrice);
    } else if (product.discountPercent > 0) {
      discount = Math.round(making * (product.discountPercent / 100));
      finalPrice = grossPrice - discount;
    }

    return {
      goldComponentValue: goldValue,
      makingCharges: making,
      gemstoneCharges: gemstone,
      grossPrice,
      discountValue: discount,
      finalPrice,
      hasSpecialOffer: product.hasSpecialOffer || discount > 0,
      offerBadgeText: product.offerBadgeText,
      purityRatePerGram: ratePerGram,
      purity: product.purity,
      weightGrams: weight,
      formattedPrice: `₹${finalPrice.toLocaleString('en-IN')}`,
      formattedGross: `₹${grossPrice.toLocaleString('en-IN')}`,
      formattedDiscount: `₹${discount.toLocaleString('en-IN')}`,
    };
  }

  function formatPrice(amount) {
    if (typeof amount !== 'number') return '₹0';
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  }

  return (
    <GoldRateContext.Provider
      value={{
        rates,
        settings,
        loading,
        refreshRates: loadData,
        getRateForPurity,
        calculateDynamicPrice,
        formatPrice,
      }}
    >
      {children}
    </GoldRateContext.Provider>
  );
}

export function useGoldRate() {
  return useContext(GoldRateContext);
}
