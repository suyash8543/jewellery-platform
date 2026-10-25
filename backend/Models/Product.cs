using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace JewelleryApi.Models;

public class ProductImage
{
    public string Url { get; set; } = string.Empty;
    public string Alt { get; set; } = string.Empty;
    public bool IsPrimary { get; set; } = false;
    public string? PublicId { get; set; }
}

public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("slug")]
    public string Slug { get; set; } = string.Empty;

    [BsonElement("sku")]
    public string Sku { get; set; } = string.Empty;

    [BsonElement("category")]
    public string Category { get; set; } = string.Empty; // e.g. "Bridal Jewellery", "Necklaces", "Bangles", "Rings", "Coins"

    [BsonElement("subCategory")]
    public string? SubCategory { get; set; }

    [BsonElement("metalType")]
    public string MetalType { get; set; } = "Gold"; // "Gold", "Diamond", "Silver", "Platinum"

    [BsonElement("purity")]
    public string Purity { get; set; } = "22K"; // "24K", "22K", "18K", "14K", "999 Silver", "925 Silver"

    [BsonElement("grossWeightGrams")]
    public decimal GrossWeightGrams { get; set; }

    [BsonElement("netGoldWeightGrams")]
    public decimal NetGoldWeightGrams { get; set; }

    [BsonElement("gemstoneWeightGrams")]
    public decimal GemstoneWeightGrams { get; set; } = 0;

    [BsonElement("makingChargeType")]
    public string MakingChargeType { get; set; } = "Percentage"; // "Percentage" or "FixedPerGram"

    [BsonElement("makingChargeValue")]
    public decimal MakingChargeValue { get; set; } = 12.0m;

    [BsonElement("gemstoneCharges")]
    public decimal GemstoneCharges { get; set; } = 0;

    [BsonElement("hasSpecialOffer")]
    public bool HasSpecialOffer { get; set; } = false;

    [BsonElement("offerPrice")]
    public decimal? OfferPrice { get; set; }

    [BsonElement("discountPercent")]
    public decimal DiscountPercent { get; set; } = 0;

    [BsonElement("offerBadgeText")]
    public string? OfferBadgeText { get; set; }

    [BsonElement("images")]
    public List<ProductImage> Images { get; set; } = new();

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("isHallmarked")]
    public bool IsHallmarked { get; set; } = true;

    [BsonElement("huidCompliant")]
    public bool HuidCompliant { get; set; } = true;

    [BsonElement("isBestseller")]
    public bool IsBestseller { get; set; } = false;

    [BsonElement("isDiwaliFeatured")]
    public bool IsDiwaliFeatured { get; set; } = false;

    [BsonElement("inStock")]
    public bool InStock { get; set; } = true;

    [BsonElement("isDemoItem")]
    public bool IsDemoItem { get; set; } = true; // True for web demo images, allows 1-click batch cleanup

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
