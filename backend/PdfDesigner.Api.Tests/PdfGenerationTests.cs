using PdfDesigner.Api.Pdf.Models;
using PdfDesigner.Api.Pdf.Rendering;
using PdfDesigner.Api.Pdf.Services;
using QuestPDF.Infrastructure;
using Xunit;

namespace PdfDesigner.Api.Tests;

public sealed class PdfGenerationTests
{
    [Fact]
    public void Generate_returns_pdf_bytes_for_text_and_unsupported_fallback()
    {
        QuestPDF.Settings.License = LicenseType.Community;
        var schema = new DocumentSchema
        {
            Name = "Smoke",
            Elements =
            [
                new ElementNode { Id = "text", Type = "text", X = 40, Y = 40, Width = 200, Height = 30, Text = "Hello {{Name}}" },
                new ElementNode { Id = "future", Type = "future-widget", X = 40, Y = 80, Width = 200, Height = 30 }
            ],
            Data = new Dictionary<string, object> { ["Name"] = "QuestPDF" }
        };
        var pdf = new PdfGenerationService(new QuestPdfRenderer(new BindingResolver())).Generate(schema);
        Assert.StartsWith("%PDF", System.Text.Encoding.ASCII.GetString(pdf, 0, 4));
    }
}
