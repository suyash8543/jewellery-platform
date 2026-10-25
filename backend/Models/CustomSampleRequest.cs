using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace JewelleryApi.Models;

public class CustomSampleRequest
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("customerName")]
    public string CustomerName { get; set; } = string.Empty;

    [BsonElement("phoneNumber")]
    public string PhoneNumber { get; set; } = string.Empty;

    [BsonElement("email")]
    public string? Email { get; set; }

    [BsonElement("city")]
    public string City { get; set; } = string.Empty;

    [BsonElement("preferredMetal")]
    public string PreferredMetal { get; set; } = "22K Yellow Gold"; // "22K Yellow Gold", "18K Diamond", "Rose Gold", "Silver"

    [BsonElement("targetWeightGrams")]
    public decimal? TargetWeightGrams { get; set; }

    [BsonElement("targetBudgetINR")]
    public decimal? TargetBudgetINR { get; set; }

    [BsonElement("sampleImageUrl")]
    public string SampleImageUrl { get; set; } = string.Empty;

    [BsonElement("supabaseStoragePath")]
    public string? SupabaseStoragePath { get; set; }

    [BsonElement("notes")]
    public string Notes { get; set; } = string.Empty;

    [BsonElement("status")]
    public string Status { get; set; } = "New"; // "New", "Quoted", "InDiscussion", "OrderPlaced", "Declined"

    [BsonElement("adminQuotationNotes")]
    public string? AdminQuotationNotes { get; set; }

    [BsonElement("submittedAt")]
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}
