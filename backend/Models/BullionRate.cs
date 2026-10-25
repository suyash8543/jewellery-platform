using MongoDB.Bson.Serialization.Attributes;

namespace JewelleryApi.Models;

public class BullionRate
{
    [BsonElement("gold24kPerGram")]
    public decimal Gold24kPerGram { get; set; } = 8125.00m; // Today's market 24K spot rate (approx ₹81,250 / 10g)

    [BsonElement("gold22kPerGram")]
    public decimal Gold22kPerGram { get; set; } = 7450.00m; // 916 Hallmarked rate (approx ₹74,500 / 10g)

    [BsonElement("gold18kPerGram")]
    public decimal Gold18kPerGram { get; set; } = 6095.00m; // 750 Diamond jewellery rate

    [BsonElement("gold14kPerGram")]
    public decimal Gold14kPerGram { get; set; } = 4740.00m; // 585 Daily wear rate

    [BsonElement("silverPerGram")]
    public decimal SilverPerGram { get; set; } = 98.50m; // 999 Silver per gram

    [BsonElement("silverPerKg")]
    public decimal SilverPerKg { get; set; } = 98500.00m;

    [BsonElement("useManualOverride")]
    public bool UseManualOverride { get; set; } = false;

    [BsonElement("source")]
    public string Source { get; set; } = "IBJA Live Market Feed";

    [BsonElement("lastUpdatedAt")]
    public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
}
