using JewelleryApi.DTOs;
using JewelleryApi.Models;

namespace JewelleryApi.Services;

public interface IDynamicPricingService
{
    PriceBreakdownDto CalculatePrice(Product product, BullionRate rates);
    ProductWithPriceDto MapToDto(Product product, BullionRate rates);
    decimal GetRateForPurity(string purity, BullionRate rates);
}

public class DynamicPricingService : IDynamicPricingService
{
    public decimal GetRateForPurity(string purity, BullionRate rates)
    {
        var normalized = purity.Trim().ToUpperInvariant();

        if (normalized.Contains("24K") || normalized.Contains("999 GOLD"))
            return rates.Gold24kPerGram;

        if (normalized.Contains("22K") || normalized.Contains("916"))
            return rates.Gold22kPerGram > 0 ? rates.Gold22kPerGram : rates.Gold24kPerGram * (22m / 24m);

        if (normalized.Contains("18K") || normalized.Contains("750"))
            return rates.Gold18kPerGram > 0 ? rates.Gold18kPerGram : rates.Gold24kPerGram * (18m / 24m);

        if (normalized.Contains("14K") || normalized.Contains("585"))
            return rates.Gold14kPerGram > 0 ? rates.Gold14kPerGram : rates.Gold24kPerGram * (14m / 24m);

        if (normalized.Contains("SILVER"))
            return rates.SilverPerGram;

        // Default to 22K standard
        return rates.Gold22kPerGram > 0 ? rates.Gold22kPerGram : rates.Gold24kPerGram * (22m / 24m);
    }

    public PriceBreakdownDto CalculatePrice(Product product, BullionRate rates)
    {
        var ratePerGram = GetRateForPurity(product.Purity, rates);
        var weight = product.NetGoldWeightGrams > 0 ? product.NetGoldWeightGrams : product.GrossWeightGrams;
        var goldValue = Math.Round(weight * ratePerGram, 2);

        decimal makingCharges = 0;
        if (product.MakingChargeType.Equals("FixedPerGram", StringComparison.OrdinalIgnoreCase))
        {
            makingCharges = Math.Round(product.MakingChargeValue * weight, 2);
        }
        else
        {
            // Percentage of bullion value
            makingCharges = Math.Round(goldValue * (product.MakingChargeValue / 100m), 2);
        }

        var gemstoneCharges = Math.Round(product.GemstoneCharges, 2);
        var grossPrice = Math.Round(goldValue + makingCharges + gemstoneCharges, 2);

        decimal discount = 0;
        decimal finalPrice = grossPrice;

        // Priority 1: Direct Offer Price set by owner (e.g. promotional fixed festive price)
        if (product.HasSpecialOffer && product.OfferPrice.HasValue && product.OfferPrice.Value > 0)
        {
            finalPrice = product.OfferPrice.Value;
            discount = Math.Max(0, grossPrice - finalPrice);
        }
        // Priority 2: Percentage discount on making charges or overall price
        else if (product.DiscountPercent > 0)
        {
            discount = Math.Round(makingCharges * (product.DiscountPercent / 100m), 2);
            finalPrice = Math.Round(grossPrice - discount, 2);
        }

        return new PriceBreakdownDto
        {
            GoldComponentValue = goldValue,
            MakingCharges = makingCharges,
            GemstoneCharges = gemstoneCharges,
            GrossPrice = grossPrice,
            DiscountValue = discount,
            FinalPrice = finalPrice,
            HasSpecialOffer = product.HasSpecialOffer || discount > 0,
            OfferBadgeText = product.OfferBadgeText,
            PurityRatePerGram = ratePerGram,
            Purity = product.Purity,
            WeightGrams = weight,
            Currency = "INR"
        };
    }

    public ProductWithPriceDto MapToDto(Product product, BullionRate rates)
    {
        var price = CalculatePrice(product, rates);
        return new ProductWithPriceDto
        {
            Id = product.Id ?? string.Empty,
            Title = product.Title,
            Slug = product.Slug,
            Sku = product.Sku,
            Category = product.Category,
            SubCategory = product.SubCategory,
            MetalType = product.MetalType,
            Purity = product.Purity,
            GrossWeightGrams = product.GrossWeightGrams,
            NetGoldWeightGrams = product.NetGoldWeightGrams,
            GemstoneWeightGrams = product.GemstoneWeightGrams,
            MakingChargeType = product.MakingChargeType,
            MakingChargeValue = product.MakingChargeValue,
            GemstoneCharges = product.GemstoneCharges,
            HasSpecialOffer = product.HasSpecialOffer,
            OfferPrice = product.OfferPrice,
            DiscountPercent = product.DiscountPercent,
            OfferBadgeText = product.OfferBadgeText,
            Images = product.Images,
            Description = product.Description,
            IsHallmarked = product.IsHallmarked,
            HuidCompliant = product.HuidCompliant,
            IsBestseller = product.IsBestseller,
            IsDiwaliFeatured = product.IsDiwaliFeatured,
            InStock = product.InStock,
            IsDemoItem = product.IsDemoItem,
            Price = price
        };
    }
}
