using Microsoft.AspNetCore.Mvc;
using JewelleryApi.Models;
using JewelleryApi.Services;

namespace JewelleryApi.Controllers;

public class CalculateGoldRequest
{
    public string Purity { get; set; } = "22K";
    public decimal WeightGrams { get; set; } = 10.0m;
    public decimal MakingChargePercent { get; set; } = 0;
}

public class CalculateGoldResponse
{
    public string Purity { get; set; } = string.Empty;
    public decimal WeightGrams { get; set; }
    public decimal RatePerGram { get; set; }
    public decimal PureGoldValue { get; set; }
    public decimal EstimatedMakingCharges { get; set; }
    public decimal TotalEstimatedValue { get; set; }
    public string Currency { get; set; } = "INR";
    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;
}

[ApiController]
[Route("api/[controller]")]
public class GoldRatesController : ControllerBase
{
    private readonly IJewelleryDataStore _dataStore;
    private readonly IDynamicPricingService _pricingService;

    public GoldRatesController(IJewelleryDataStore dataStore, IDynamicPricingService pricingService)
    {
        _dataStore = dataStore;
        _pricingService = pricingService;
    }

    [HttpGet]
    public async Task<ActionResult<BullionRate>> GetRates()
    {
        var settings = await _dataStore.GetSettingsAsync();
        return Ok(settings.BullionRates);
    }

    [HttpPost("calculate")]
    public async Task<ActionResult<CalculateGoldResponse>> Calculate([FromBody] CalculateGoldRequest request)
    {
        if (request.WeightGrams <= 0)
            return BadRequest(new { message = "Weight must be greater than 0 grams." });

        var settings = await _dataStore.GetSettingsAsync();
        var ratePerGram = _pricingService.GetRateForPurity(request.Purity, settings.BullionRates);
        var goldValue = Math.Round(request.WeightGrams * ratePerGram, 2);
        var making = Math.Round(goldValue * (request.MakingChargePercent / 100m), 2);

        return Ok(new CalculateGoldResponse
        {
            Purity = request.Purity,
            WeightGrams = request.WeightGrams,
            RatePerGram = ratePerGram,
            PureGoldValue = goldValue,
            EstimatedMakingCharges = making,
            TotalEstimatedValue = goldValue + making,
            Currency = "INR",
            CalculatedAt = DateTime.UtcNow
        });
    }

    [HttpPut]
    public async Task<ActionResult<BullionRate>> UpdateRates([FromBody] BullionRate rates)
    {
        var updated = await _dataStore.UpdateBullionRatesAsync(rates);
        return Ok(updated);
    }
}
