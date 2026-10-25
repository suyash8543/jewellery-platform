using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace JewelleryApi.Models;

public class AdminUser
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("username")]
    public string Username { get; set; } = "admin";

    [BsonElement("email")]
    public string Email { get; set; } = "owner@swarnamahal.com";

    [BsonElement("passwordHash")]
    public string PasswordHash { get; set; } = string.Empty;

    [BsonElement("role")]
    public string Role { get; set; } = "Admin";

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("lastLoginAt")]
    public DateTime? LastLoginAt { get; set; }
}

public class Enquiry
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("productId")]
    public string? ProductId { get; set; }

    [BsonElement("productTitle")]
    public string? ProductTitle { get; set; }

    [BsonElement("productSku")]
    public string? ProductSku { get; set; }

    [BsonElement("customerName")]
    public string CustomerName { get; set; } = string.Empty;

    [BsonElement("phoneNumber")]
    public string PhoneNumber { get; set; } = string.Empty;

    [BsonElement("message")]
    public string Message { get; set; } = string.Empty;

    [BsonElement("enquiryType")]
    public string EnquiryType { get; set; } = "ProductInquiry"; // "ProductInquiry", "BridalConsultation", "SchemeInquiry", "DhanterasPreBook"

    [BsonElement("status")]
    public string Status { get; set; } = "New"; // "New", "Contacted", "Converted", "Archived"

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
