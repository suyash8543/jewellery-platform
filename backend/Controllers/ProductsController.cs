using Microsoft.AspNetCore.Mvc;
using JewelleryApi.DTOs;
using JewelleryApi.Models;
using JewelleryApi.Services;

namespace JewelleryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IJewelleryDataStore _dataStore;
    private readonly IDynamicPricingService _pricingService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IJewelleryDataStore dataStore, IDynamicPricingService pricingService, ILogger<ProductsController> logger)
    {
        _dataStore = dataStore;
        _pricingService = pricingService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductWithPriceDto>>> GetAll([FromQuery] string? category, [FromQuery] bool? featured, [FromQuery] bool? diwali)
    {
        var settings = await _dataStore.GetSettingsAsync();
        var products = await _dataStore.GetAllProductsAsync(category, featured, diwali);

        var result = products.Select(p => _pricingService.MapToDto(p, settings.BullionRates)).ToList();
        return Ok(result);
    }

    [HttpGet("{identifier}")]
    public async Task<ActionResult<ProductWithPriceDto>> GetByIdOrSlug(string identifier)
    {
        var settings = await _dataStore.GetSettingsAsync();
        var product = await _dataStore.GetProductByIdOrSlugAsync(identifier);
        if (product == null)
            return NotFound(new { message = $"Product with identifier '{identifier}' was not found." });

        return Ok(_pricingService.MapToDto(product, settings.BullionRates));
    }

    [HttpPost]
    public async Task<ActionResult<ProductWithPriceDto>> Create([FromBody] Product product)
    {
        if (string.IsNullOrWhiteSpace(product.Title))
            return BadRequest(new { message = "Product title is required." });

        if (product.GrossWeightGrams <= 0)
            return BadRequest(new { message = "Product weight must be greater than 0 grams." });

        var created = await _dataStore.CreateProductAsync(product);
        var settings = await _dataStore.GetSettingsAsync();
        return CreatedAtAction(nameof(GetByIdOrSlug), new { identifier = created.Id }, _pricingService.MapToDto(created, settings.BullionRates));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductWithPriceDto>> Update(string id, [FromBody] Product updated)
    {
        var product = await _dataStore.UpdateProductAsync(id, updated);
        if (product == null)
            return NotFound(new { message = $"Product with ID '{id}' was not found." });

        var settings = await _dataStore.GetSettingsAsync();
        return Ok(_pricingService.MapToDto(product, settings.BullionRates));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var success = await _dataStore.DeleteProductAsync(id);
        if (!success)
            return NotFound(new { message = $"Product with ID '{id}' was not found." });

        return NoContent();
    }

    [HttpPost("clear-demo")]
    public async Task<ActionResult<object>> ClearDemoItems()
    {
        var removedCount = await _dataStore.RemoveAllDemoProductsAsync();
        _logger.LogInformation("Admin executed 1-click demo catalog removal. Removed {Count} items.", removedCount);
        return Ok(new
        {
            message = "Demo products successfully removed. The catalog is now ready for your actual shop inventory.",
            deletedCount = removedCount
        });
    }
}
