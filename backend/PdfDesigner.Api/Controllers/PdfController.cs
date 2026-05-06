using Microsoft.AspNetCore.Mvc;
using PdfDesigner.Api.Pdf.Models;
using PdfDesigner.Api.Pdf.Services;

namespace PdfDesigner.Api.Controllers;

[ApiController]
[Route("api/pdf")]
public sealed class PdfController(PdfGenerationService pdfGenerationService, SchemaValidator validator) : ControllerBase
{
    [HttpPost("generate")]
    [Produces("application/pdf")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public IActionResult Generate([FromBody] GeneratePdfRequest request)
    {
        var template = request.Template;
        if (template is null)
            return BadRequest(new { errors = new[] { "Request body must include a template object." } });

        if (request.Data is not null)
            template.Data = request.Data;

        var errors = validator.Validate(template);
        if (errors.Count > 0)
            return BadRequest(new { errors });

        try
        {
            var pdf = pdfGenerationService.Generate(template);
            var fileName = string.IsNullOrWhiteSpace(template.Name) ? "document.pdf" : $"{template.Name}.pdf";
            return File(pdf, "application/pdf", fileName);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "PDF generation failed. Check the schema and try again." });
        }
    }
}
