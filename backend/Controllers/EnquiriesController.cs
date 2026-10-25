using Microsoft.AspNetCore.Mvc;
using JewelleryApi.Models;
using JewelleryApi.Services;

namespace JewelleryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnquiriesController : ControllerBase
{
    private readonly IJewelleryDataStore _dataStore;

    public EnquiriesController(IJewelleryDataStore dataStore)
    {
        _dataStore = dataStore;
    }

    [HttpPost]
    public async Task<ActionResult<Enquiry>> Create([FromBody] Enquiry enquiry)
    {
        if (string.IsNullOrWhiteSpace(enquiry.CustomerName) || string.IsNullOrWhiteSpace(enquiry.PhoneNumber))
            return BadRequest(new { message = "Customer name and phone number are required." });

        var created = await _dataStore.SubmitEnquiryAsync(enquiry);
        return Ok(created);
    }

    [HttpGet]
    public async Task<ActionResult<List<Enquiry>>> GetAll([FromQuery] string? status)
    {
        var list = await _dataStore.GetEnquiriesAsync(status);
        return Ok(list);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] string status)
    {
        var success = await _dataStore.UpdateEnquiryStatusAsync(id, status);
        if (!success)
            return NotFound(new { message = $"Enquiry with ID '{id}' was not found." });

        return Ok(new { message = "Status updated successfully." });
    }
}

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly IJewelleryDataStore _dataStore;

    public SettingsController(IJewelleryDataStore dataStore)
    {
        _dataStore = dataStore;
    }

    [HttpGet]
    public async Task<ActionResult<SiteSettings>> Get()
    {
        var settings = await _dataStore.GetSettingsAsync();
        return Ok(settings);
    }

    [HttpPut]
    public async Task<ActionResult<SiteSettings>> Update([FromBody] SiteSettings settings)
    {
        var updated = await _dataStore.UpdateSettingsAsync(settings);
        return Ok(updated);
    }
}
