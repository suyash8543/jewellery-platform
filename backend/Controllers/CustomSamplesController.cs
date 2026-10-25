using Microsoft.AspNetCore.Mvc;
using JewelleryApi.Models;
using JewelleryApi.Services;

namespace JewelleryApi.Controllers;

public class UpdateSampleStatusDto
{
    public string Status { get; set; } = "Quoted";
    public string? AdminNotes { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class CustomSamplesController : ControllerBase
{
    private readonly IJewelleryDataStore _dataStore;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<CustomSamplesController> _logger;

    public CustomSamplesController(IJewelleryDataStore dataStore, IWebHostEnvironment env, ILogger<CustomSamplesController> logger)
    {
        _dataStore = dataStore;
        _env = env;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<CustomSampleRequest>> Submit([FromBody] CustomSampleRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CustomerName))
            return BadRequest(new { message = "Customer name is required." });

        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
            return BadRequest(new { message = "Customer contact phone number is required." });

        var created = await _dataStore.SubmitSampleRequestAsync(request);
        _logger.LogInformation("New custom jewellery design sample received from {CustomerName} ({Phone}).", created.CustomerName, created.PhoneNumber);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<object>> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No image file provided." });

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
            return BadRequest(new { message = "Invalid image type. Please upload a JPG, PNG, or WebP photo." });

        // Save into wwwroot/uploads/samples
        var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads", "samples");
        Directory.CreateDirectory(uploadsDir);

        var uniqueFileName = $"sample_{Guid.NewGuid():N}{ext}";
        var filePath = Path.Combine(uploadsDir, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var publicUrl = $"{baseUrl}/uploads/samples/{uniqueFileName}";

        return Ok(new
        {
            url = publicUrl,
            fileName = uniqueFileName
        });
    }

    [HttpGet]
    public async Task<ActionResult<List<CustomSampleRequest>>> GetAll([FromQuery] string? status)
    {
        var list = await _dataStore.GetSampleRequestsAsync(status);
        return Ok(list);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateSampleStatusDto dto)
    {
        var success = await _dataStore.UpdateSampleStatusAsync(id, dto.Status, dto.AdminNotes);
        if (!success)
            return NotFound(new { message = $"Custom design sample request with ID '{id}' was not found." });

        return Ok(new { message = "Sample status updated successfully." });
    }
}
