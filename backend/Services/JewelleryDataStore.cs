using MongoDB.Driver;
using JewelleryApi.Models;

namespace JewelleryApi.Services;

public interface IJewelleryDataStore
{
    Task<List<Product>> GetAllProductsAsync(string? category = null, bool? featured = null, bool? diwali = null);
    Task<Product?> GetProductByIdOrSlugAsync(string identifier);
    Task<Product> CreateProductAsync(Product product);
    Task<Product?> UpdateProductAsync(string id, Product updated);
    Task<bool> DeleteProductAsync(string id);
    Task<int> RemoveAllDemoProductsAsync();
    
    Task<SiteSettings> GetSettingsAsync();
    Task<SiteSettings> UpdateSettingsAsync(SiteSettings settings);
    Task<BullionRate> UpdateBullionRatesAsync(BullionRate rates);

    Task<CustomSampleRequest> SubmitSampleRequestAsync(CustomSampleRequest request);
    Task<List<CustomSampleRequest>> GetSampleRequestsAsync(string? status = null);
    Task<bool> UpdateSampleStatusAsync(string id, string status, string? adminNotes);

    Task<Enquiry> SubmitEnquiryAsync(Enquiry enquiry);
    Task<List<Enquiry>> GetEnquiriesAsync(string? status = null);
    Task<bool> UpdateEnquiryStatusAsync(string id, string status);

    Task<AdminUser?> GetAdminByUsernameAsync(string username);
    Task SeedInitialDataAsync();
}

public class JewelleryDataStore : IJewelleryDataStore
{
    private readonly IMongoDbService _mongo;
    private readonly ILogger<JewelleryDataStore> _logger;
    
    // In-memory fallback caches
    private static readonly List<Product> _memProducts = new();
    private static readonly List<CustomSampleRequest> _memSamples = new();
    private static readonly List<Enquiry> _memEnquiries = new();
    private static SiteSettings _memSettings = new();
    private static readonly List<AdminUser> _memAdmins = new();
    private static bool _seeded = false;

    public JewelleryDataStore(IMongoDbService mongo, ILogger<JewelleryDataStore> logger)
    {
        _mongo = mongo;
        _logger = logger;
    }

    public async Task SeedInitialDataAsync()
    {
        if (_seeded) return;
        _seeded = true;

        if (_mongo.IsConnected)
        {
            var count = await _mongo.Products.CountDocumentsAsync(FilterDefinition<Product>.Empty);
            if (count > 0) return; // already seeded in Mongo
        }
        else if (_memProducts.Count > 0)
        {
            return;
        }

        _logger.LogInformation("Seeding curated festive jewellery demo catalog with high-resolution imagery...");

        var initialProducts = new List<Product>
        {
            new Product
            {
                Id = "671b56a1e3f89a0012ab0001",
                Title = "Aadhira Royal 22K Kundan & Pearl Bridal Choker Set",
                Slug = "aadhira-royal-22k-kundan-pearl-bridal-choker",
                Sku = "SW-BRD-22K-0101",
                Category = "Bridal Jewellery",
                SubCategory = "Necklace Sets",
                MetalType = "Gold",
                Purity = "22K",
                GrossWeightGrams = 48.50m,
                NetGoldWeightGrams = 42.20m,
                GemstoneWeightGrams = 6.30m,
                MakingChargeType = "Percentage",
                MakingChargeValue = 14.0m,
                GemstoneCharges = 8500m,
                HasSpecialOffer = true,
                OfferPrice = 365000m,
                DiscountPercent = 20,
                OfferBadgeText = "Diwali Special: Flat ₹15,000 Off Making Charges",
                Description = "Exquisite handcrafted 22 Karat yellow gold bridal necklace featuring uncut Kundan stones, fine meenakari work, and natural freshwater pearl drops. 100% BIS Hallmarked with unique HUID laser engraving.",
                IsHallmarked = true,
                HuidCompliant = true,
                IsBestseller = true,
                IsDiwaliFeatured = true,
                InStock = true,
                IsDemoItem = true,
                Images = new List<ProductImage>
                {
                    new() { Url = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200", Alt = "Aadhira Bridal Choker", IsPrimary = true },
                    new() { Url = "https://images.unsplash.com/photo-1611591475870-7607a67f1b63?q=80&w=1200", Alt = "Choker Detail View" }
                }
            },
            new Product
            {
                Id = "671b56a1e3f89a0012ab0002",
                Title = "Navya Heritage Peacock 22K Temple Gold Haar",
                Slug = "navya-heritage-peacock-22k-temple-gold-haar",
                Sku = "SW-TMP-22K-0204",
                Category = "Necklaces",
                SubCategory = "Long Haar",
                MetalType = "Gold",
                Purity = "22K",
                GrossWeightGrams = 56.80m,
                NetGoldWeightGrams = 55.00m,
                GemstoneWeightGrams = 1.80m,
                MakingChargeType = "Percentage",
                MakingChargeValue = 12.5m,
                GemstoneCharges = 4200m,
                HasSpecialOffer = false,
                OfferBadgeText = "Festive Auspicious Collection",
                Description = "Traditional South Indian temple jewellery long necklace sculpted with intricate dancing peacock motifs and Goddess Lakshmi centerpiece in antique 22K matte gold finish.",
                IsHallmarked = true,
                HuidCompliant = true,
                IsBestseller = true,
                IsDiwaliFeatured = true,
                InStock = true,
                IsDemoItem = true,
                Images = new List<ProductImage>
                {
                    new() { Url = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200", Alt = "Temple Gold Haar", IsPrimary = true },
                    new() { Url = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200", Alt = "Necklace Close-up" }
                }
            },
            new Product
            {
                Id = "671b56a1e3f89a0012ab0003",
                Title = "Mayura Filigree 22K Gold Bridal Kadas (Pair)",
                Slug = "mayura-filigree-22k-gold-bridal-kadas-pair",
                Sku = "SW-BNG-22K-0312",
                Category = "Bangles",
                SubCategory = "Kada & Bangles",
                MetalType = "Gold",
                Purity = "22K",
                GrossWeightGrams = 38.40m,
                NetGoldWeightGrams = 38.40m,
                GemstoneWeightGrams = 0m,
                MakingChargeType = "FixedPerGram",
                MakingChargeValue = 420m,
                GemstoneCharges = 0m,
                HasSpecialOffer = true,
                OfferPrice = 302000m,
                OfferBadgeText = "Dhanteras Pre-Book Offer",
                Description = "A regal pair of handcrafted 22 Karat yellow gold screw-pipe bridal kadas featuring delicate floral jaali work and hand-carved borders. Ideal for auspicious wedding and festive celebrations.",
                IsHallmarked = true,
                HuidCompliant = true,
                IsBestseller = true,
                IsDiwaliFeatured = true,
                InStock = true,
                IsDemoItem = true,
                Images = new List<ProductImage>
                {
                    new() { Url = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200", Alt = "22K Gold Bridal Kadas", IsPrimary = true },
                    new() { Url = "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200", Alt = "Bangle Side Profile" }
                }
            },
            new Product
            {
                Id = "671b56a1e3f89a0012ab0004",
                Title = "Ishani Solitaire Diamond & 18K Rose Gold Ring",
                Slug = "ishani-solitaire-diamond-18k-rose-gold-ring",
                Sku = "SW-RNG-18K-0455",
                Category = "Rings",
                SubCategory = "Diamond Rings",
                MetalType = "Diamond",
                Purity = "18K",
                GrossWeightGrams = 4.80m,
                NetGoldWeightGrams = 4.55m,
                GemstoneWeightGrams = 0.25m,
                MakingChargeType = "Percentage",
                MakingChargeValue = 15.0m,
                GemstoneCharges = 45000m, // Certified Natural VVS-EF Diamond Solitaire
                HasSpecialOffer = true,
                OfferBadgeText = "Diwali Glow: Free Making Charges",
                DiscountPercent = 100, // 100% off making charge
                Description = "Captivating 18 Karat rose gold engagement ring crowned with a 0.75 Carat certified VVS1 clarity diamond surrounded by a micro-pave diamond halo. Accompanied by IGI certification.",
                IsHallmarked = true,
                HuidCompliant = true,
                IsBestseller = false,
                IsDiwaliFeatured = true,
                InStock = true,
                IsDemoItem = true,
                Images = new List<ProductImage>
                {
                    new() { Url = "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200", Alt = "Solitaire Diamond Ring", IsPrimary = true }
                }
            },
            new Product
            {
                Id = "671b56a1e3f89a0012ab0005",
                Title = "Shree Lakshmi-Ganesh 24K 999 Pure Gold Coin (10g)",
                Slug = "shree-lakshmi-ganesh-24k-999-pure-gold-coin-10g",
                Sku = "SW-COIN-24K-0510",
                Category = "Coins",
                SubCategory = "Gold Coins",
                MetalType = "Gold",
                Purity = "24K",
                GrossWeightGrams = 10.00m,
                NetGoldWeightGrams = 10.00m,
                GemstoneWeightGrams = 0m,
                MakingChargeType = "FixedPerGram",
                MakingChargeValue = 150m,
                GemstoneCharges = 0m,
                HasSpecialOffer = true,
                OfferPrice = 82500m,
                OfferBadgeText = "Dhanteras Shubh Mahurat Pick",
                Description = "Auspicious 24 Karat 999.9 purity fine gold coin embossed with Lord Ganesha and Goddess Lakshmi blessings. Comes in tamper-proof certicard packaging with NABL certified lab assay.",
                IsHallmarked = true,
                HuidCompliant = true,
                IsBestseller = true,
                IsDiwaliFeatured = true,
                InStock = true,
                IsDemoItem = true,
                Images = new List<ProductImage>
                {
                    new() { Url = "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=1200", Alt = "24K Pure Gold Coin", IsPrimary = true }
                }
            },
            new Product
            {
                Id = "671b56a1e3f89a0012ab0006",
                Title = "Ananya Chandbali 22K Gold & Emerald Jhumkas",
                Slug = "ananya-chandbali-22k-gold-emerald-jhumkas",
                Sku = "SW-EAR-22K-0678",
                Category = "Earrings",
                SubCategory = "Jhumkas",
                MetalType = "Gold",
                Purity = "22K",
                GrossWeightGrams = 22.40m,
                NetGoldWeightGrams = 20.80m,
                GemstoneWeightGrams = 1.60m,
                MakingChargeType = "Percentage",
                MakingChargeValue = 13.5m,
                GemstoneCharges = 6500m,
                HasSpecialOffer = false,
                Description = "Statement 22K gold Chandbali earrings crafted with natural Zambian emerald beads, south sea pearl droplets, and filigree moon crescent carvings. Perfect festive companion for silk sarees.",
                IsHallmarked = true,
                HuidCompliant = true,
                IsBestseller = true,
                IsDiwaliFeatured = true,
                InStock = true,
                IsDemoItem = true,
                Images = new List<ProductImage>
                {
                    new() { Url = "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1200", Alt = "Emerald Chandbali Jhumkas", IsPrimary = true }
                }
            }
        };

        if (_mongo.IsConnected)
        {
            await _mongo.Products.InsertManyAsync(initialProducts);
            var settings = await _mongo.Settings.Find(s => s.Id == "settings_global").FirstOrDefaultAsync();
            if (settings == null)
            {
                await _mongo.Settings.InsertOneAsync(new SiteSettings());
            }
        }
        else
        {
            _memProducts.AddRange(initialProducts);
        }

        // Seed default admin user
        var admin = new AdminUser
        {
            Id = "admin_001",
            Username = "admin",
            Email = "owner@swarnamahal.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("DiwaliGold2026!"),
            Role = "Admin"
        };
        _memAdmins.Add(admin);

        _logger.LogInformation("Demo catalog successfully seeded with {Count} products.", initialProducts.Count);
    }

    public async Task<List<Product>> GetAllProductsAsync(string? category = null, bool? featured = null, bool? diwali = null)
    {
        await SeedInitialDataAsync();

        if (_mongo.IsConnected)
        {
            var builder = Builders<Product>.Filter;
            var filter = builder.Empty;

            if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
                filter &= builder.Eq(p => p.Category, category);

            if (featured.HasValue && featured.Value)
                filter &= builder.Eq(p => p.IsBestseller, true);

            if (diwali.HasValue && diwali.Value)
                filter &= builder.Eq(p => p.IsDiwaliFeatured, true);

            return await _mongo.Products.Find(filter).ToListAsync();
        }

        var query = _memProducts.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
            query = query.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
        if (featured.HasValue && featured.Value)
            query = query.Where(p => p.IsBestseller);
        if (diwali.HasValue && diwali.Value)
            query = query.Where(p => p.IsDiwaliFeatured);

        return query.ToList();
    }

    public async Task<Product?> GetProductByIdOrSlugAsync(string identifier)
    {
        await SeedInitialDataAsync();

        if (_mongo.IsConnected)
        {
            var filter = Builders<Product>.Filter.Or(
                Builders<Product>.Filter.Eq(p => p.Id, identifier),
                Builders<Product>.Filter.Eq(p => p.Slug, identifier),
                Builders<Product>.Filter.Eq(p => p.Sku, identifier)
            );
            return await _mongo.Products.Find(filter).FirstOrDefaultAsync();
        }

        return _memProducts.FirstOrDefault(p => p.Id == identifier || p.Slug == identifier || p.Sku == identifier);
    }

    public async Task<Product> CreateProductAsync(Product product)
    {
        if (string.IsNullOrWhiteSpace(product.Id))
            product.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();

        if (string.IsNullOrWhiteSpace(product.Slug))
            product.Slug = product.Title.ToLowerInvariant().Replace(" ", "-").Replace("&", "and");

        product.IsDemoItem = false; // Owner created product is never demo
        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;

        if (_mongo.IsConnected)
        {
            await _mongo.Products.InsertOneAsync(product);
        }
        _memProducts.Add(product);
        return product;
    }

    public async Task<Product?> UpdateProductAsync(string id, Product updated)
    {
        updated.UpdatedAt = DateTime.UtcNow;

        if (_mongo.IsConnected)
        {
            var result = await _mongo.Products.ReplaceOneAsync(p => p.Id == id, updated);
            if (result.MatchedCount == 0) return null;
        }

        var index = _memProducts.FindIndex(p => p.Id == id);
        if (index >= 0)
        {
            _memProducts[index] = updated;
            return updated;
        }
        return null;
    }

    public async Task<bool> DeleteProductAsync(string id)
    {
        if (_mongo.IsConnected)
        {
            var res = await _mongo.Products.DeleteOneAsync(p => p.Id == id);
            return res.DeletedCount > 0;
        }

        var removed = _memProducts.RemoveAll(p => p.Id == id);
        return removed > 0;
    }

    public async Task<int> RemoveAllDemoProductsAsync()
    {
        if (_mongo.IsConnected)
        {
            var res = await _mongo.Products.DeleteManyAsync(p => p.IsDemoItem);
            return (int)res.DeletedCount;
        }

        var count = _memProducts.RemoveAll(p => p.IsDemoItem);
        return count;
    }

    public async Task<SiteSettings> GetSettingsAsync()
    {
        await SeedInitialDataAsync();

        if (_mongo.IsConnected)
        {
            var s = await _mongo.Settings.Find(x => x.Id == "settings_global").FirstOrDefaultAsync();
            if (s != null) return s;
        }
        return _memSettings;
    }

    public async Task<SiteSettings> UpdateSettingsAsync(SiteSettings settings)
    {
        settings.UpdatedAt = DateTime.UtcNow;
        if (_mongo.IsConnected)
        {
            await _mongo.Settings.ReplaceOneAsync(
                x => x.Id == "settings_global",
                settings,
                new ReplaceOptions { IsUpsert = true }
            );
        }
        _memSettings = settings;
        return settings;
    }

    public async Task<BullionRate> UpdateBullionRatesAsync(BullionRate rates)
    {
        rates.LastUpdatedAt = DateTime.UtcNow;
        var settings = await GetSettingsAsync();
        settings.BullionRates = rates;
        await UpdateSettingsAsync(settings);
        return rates;
    }

    public async Task<CustomSampleRequest> SubmitSampleRequestAsync(CustomSampleRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Id))
            request.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();

        request.SubmittedAt = DateTime.UtcNow;
        request.Status = "New";

        if (_mongo.IsConnected)
        {
            await _mongo.CustomSamples.InsertOneAsync(request);
        }
        _memSamples.Insert(0, request);
        return request;
    }

    public async Task<List<CustomSampleRequest>> GetSampleRequestsAsync(string? status = null)
    {
        if (_mongo.IsConnected)
        {
            var filter = string.IsNullOrWhiteSpace(status) 
                ? Builders<CustomSampleRequest>.Filter.Empty 
                : Builders<CustomSampleRequest>.Filter.Eq(s => s.Status, status);
            return await _mongo.CustomSamples.Find(filter).SortByDescending(s => s.SubmittedAt).ToListAsync();
        }

        var list = _memSamples.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(status))
            list = list.Where(s => s.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
        return list.ToList();
    }

    public async Task<bool> UpdateSampleStatusAsync(string id, string status, string? adminNotes)
    {
        if (_mongo.IsConnected)
        {
            var update = Builders<CustomSampleRequest>.Update
                .Set(s => s.Status, status)
                .Set(s => s.AdminQuotationNotes, adminNotes);
            var res = await _mongo.CustomSamples.UpdateOneAsync(s => s.Id == id, update);
            return res.ModifiedCount > 0;
        }

        var item = _memSamples.FirstOrDefault(s => s.Id == id);
        if (item != null)
        {
            item.Status = status;
            if (!string.IsNullOrWhiteSpace(adminNotes))
                item.AdminQuotationNotes = adminNotes;
            return true;
        }
        return false;
    }

    public async Task<Enquiry> SubmitEnquiryAsync(Enquiry enquiry)
    {
        if (string.IsNullOrWhiteSpace(enquiry.Id))
            enquiry.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
        enquiry.CreatedAt = DateTime.UtcNow;

        if (_mongo.IsConnected)
        {
            await _mongo.Enquiries.InsertOneAsync(enquiry);
        }
        _memEnquiries.Insert(0, enquiry);
        return enquiry;
    }

    public async Task<List<Enquiry>> GetEnquiriesAsync(string? status = null)
    {
        if (_mongo.IsConnected)
        {
            var filter = string.IsNullOrWhiteSpace(status) 
                ? Builders<Enquiry>.Filter.Empty 
                : Builders<Enquiry>.Filter.Eq(e => e.Status, status);
            return await _mongo.Enquiries.Find(filter).SortByDescending(e => e.CreatedAt).ToListAsync();
        }

        var list = _memEnquiries.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(status))
            list = list.Where(e => e.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
        return list.ToList();
    }

    public async Task<bool> UpdateEnquiryStatusAsync(string id, string status)
    {
        if (_mongo.IsConnected)
        {
            var update = Builders<Enquiry>.Update.Set(e => e.Status, status);
            var res = await _mongo.Enquiries.UpdateOneAsync(e => e.Id == id, update);
            return res.ModifiedCount > 0;
        }

        var item = _memEnquiries.FirstOrDefault(e => e.Id == id);
        if (item != null)
        {
            item.Status = status;
            return true;
        }
        return false;
    }

    public async Task<AdminUser?> GetAdminByUsernameAsync(string username)
    {
        await SeedInitialDataAsync();

        if (_mongo.IsConnected)
        {
            return await _mongo.AdminUsers.Find(u => u.Username == username).FirstOrDefaultAsync();
        }

        return _memAdmins.FirstOrDefault(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
    }
}
