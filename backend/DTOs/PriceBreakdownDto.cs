namespace JewelleryApi.DTOs;

public class PriceBreakdownDto
{
    public decimal GoldComponentValue { get; set; }
    public decimal MakingCharges { get; set; }
    public decimal GemstoneCharges { get; set; }
    public decimal GrossPrice { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal FinalPrice { get; set; }
    public bool HasSpecialOffer { get; set; }
    public string? OfferBadgeText { get; set; }
    public decimal PurityRatePerGram { get; set; }
    public string Purity { get; set; } = string.Empty;
    public decimal WeightGrams { get; set; }
    public string Currency { get; set; } = "INR";
}

public class ProductWithPriceDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? SubCategory { get; set; }
    public string MetalType { get; set; } = "Gold";
    public string Purity { get; set; } = "22K";
    public decimal GrossWeightGrams { get; set; }
    public decimal NetGoldWeightGrams { get; set; }
    public decimal GemstoneWeightGrams { get; set; }
    public string MakingChargeType { get; set; } = "Percentage";
    public decimal MakingChargeValue { get; set; }
    public decimal GemstoneCharges { get; set; }
    public bool HasSpecialOffer { get; set; }
    public decimal? OfferPrice { get; set; }
    public decimal DiscountPercent { get; set; }
    public string? OfferBadgeText { get; set; }
    public List<Models.ProductImage> Images { get; set; } = new();
    public string Description { get; set; } = string.Empty;
    public bool IsHallmarked { get; set; }
    public bool HuidCompliant { get; set; }
    public bool IsBestseller { get; set; }
    public bool IsDiwaliFeatured { get; set; }
    public bool InStock { get; set; }
    public bool IsDemoItem { get; set; }
    public PriceBreakdownDto Price { get; set; } = new();
}
