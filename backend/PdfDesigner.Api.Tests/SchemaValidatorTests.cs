using PdfDesigner.Api.Pdf.Models;
using PdfDesigner.Api.Pdf.Services;
using Xunit;

namespace PdfDesigner.Api.Tests;

public sealed class SchemaValidatorTests
{
    [Fact]
    public void Validate_accepts_minimal_absolute_text_template()
    {
        var schema = new DocumentSchema { Name = "Test", Elements = [new ElementNode { Id = "one", Type = "text", X = 10, Y = 10, Width = 100, Height = 20, Text = "Hello" }] };
        Assert.Empty(new SchemaValidator().Validate(schema));
    }

    [Fact]
    public void Validate_rejects_duplicate_ids()
    {
        var schema = new DocumentSchema { Name = "Test", Elements = [new ElementNode { Id = "one", Type = "box", X = 0, Y = 0, Width = 10, Height = 10 }, new ElementNode { Id = "one", Type = "box", X = 20, Y = 0, Width = 10, Height = 10 }] };
        Assert.Contains(new SchemaValidator().Validate(schema), error => error.Contains("unique"));
    }
}
