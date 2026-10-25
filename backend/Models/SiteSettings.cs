using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace JewelleryApi.Models;

public class CampaignConfig
{
    public string CampaignName { get; set; } = "Diwali & Dhanteras Utsav 2026";
    public string Theme { get; set; } = "FestiveBurgundyGold"; // "FestiveBurgundyGold" or "ClassicLuxury"
    public bool IsActive { get; set; } = true;
    public string BannerDesktopUrl { get; set; } = "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=1920";
    public string BannerMobileUrl { get; set; } = "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=768";
    public string HighlightOffer { get; set; } = "Flat 25% Off on Making Charges + Free Silver Coin with Every Gold Purchase";
    public string OfferTerms { get; set; } = "Valid on all 22K Gold & Diamond collections till Bhai Dooj. Minimum purchase of 10 grams required.";
}

public class SiteSettings
{
    [BsonId]
    public string Id { get; set; } = "settings_global";

    [BsonElement("shopName")]
    public string ShopName { get; set; } = "Swarna Mahal Jewellers";

    [BsonElement("tagline")]
    public string Tagline { get; set; } = "Crafting Heritage & Trust Since 1982";

    [BsonElement("contactNumber")]
    public string ContactNumber { get; set; } = "+91 98765 43210";

    [BsonElement("whatsappNumber")]
    public string WhatsAppNumber { get; set; } = "919876543210"; // International format without +

    [BsonElement("storeAddress")]
    public string StoreAddress { get; set; } = "Plot 42, Heritage Gold Lane, Zaveri Bazaar, Mumbai, Maharashtra 400002";

    [BsonElement("googleMapsEmbedUrl")]
    public string GoogleMapsEmbedUrl { get; set; } = "https://maps.google.com";

    [BsonElement("businessHours")]
    public string BusinessHours { get; set; } = "Mon - Sun: 10:30 AM - 8:30 PM";

    [BsonElement("bullionRates")]
    public BullionRate BullionRates { get; set; } = new();

    [BsonElement("activeCampaign")]
    public CampaignConfig ActiveCampaign { get; set; } = new();

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
