using MongoDB.Driver;
using JewelleryApi.Models;

namespace JewelleryApi.Services;

public interface IMongoDbService
{
    IMongoCollection<Product> Products { get; }
    IMongoCollection<CustomSampleRequest> CustomSamples { get; }
    IMongoCollection<Enquiry> Enquiries { get; }
    IMongoCollection<SiteSettings> Settings { get; }
    IMongoCollection<AdminUser> AdminUsers { get; }
    bool IsConnected { get; }
}

public class MongoDbService : IMongoDbService
{
    private readonly IMongoDatabase? _database;
    private readonly ILogger<MongoDbService> _logger;
    private readonly bool _isConnected;

    public bool IsConnected => _isConnected;

    public IMongoCollection<Product> Products => _database!.GetCollection<Product>("products");
    public IMongoCollection<CustomSampleRequest> CustomSamples => _database!.GetCollection<CustomSampleRequest>("custom_sample_requests");
    public IMongoCollection<Enquiry> Enquiries => _database!.GetCollection<Enquiry>("enquiries");
    public IMongoCollection<SiteSettings> Settings => _database!.GetCollection<SiteSettings>("site_settings");
    public IMongoCollection<AdminUser> AdminUsers => _database!.GetCollection<AdminUser>("admin_users");

    public MongoDbService(IConfiguration config, ILogger<MongoDbService> logger)
    {
        _logger = logger;
        var connectionString = config["MongoDb:ConnectionString"];
        var databaseName = config["MongoDb:DatabaseName"] ?? "SwarnaMahalJewellery";

        if (!string.IsNullOrWhiteSpace(connectionString) && !connectionString.Contains("<password>"))
        {
            try
            {
                var settings = MongoClientSettings.FromConnectionString(connectionString);
                settings.ServerSelectionTimeout = TimeSpan.FromSeconds(4);
                var client = new MongoClient(settings);
                _database = client.GetDatabase(databaseName);
                
                // Quick ping check
                _database.RunCommand((Command<MongoDB.Bson.BsonDocument>)"{ping:1}");
                _isConnected = true;
                _logger.LogInformation("Successfully connected to MongoDB Cloud (Atlas) database: {DatabaseName}", databaseName);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not connect to MongoDB Atlas directly: {Message}. Operating in resilient memory-cached repository mode.", ex.Message);
                _isConnected = false;
            }
        }
        else
        {
            _logger.LogInformation("MongoDB connection string not configured or contains placeholder. Operating in memory-cached repository mode.");
            _isConnected = false;
        }
    }
}
