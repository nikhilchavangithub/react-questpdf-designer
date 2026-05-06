namespace PdfDesigner.Api.Pdf.Models;

public sealed class StyleDefinition
{
    public float? FontSize { get; set; }
    public string? FontWeight { get; set; }
    public string? Color { get; set; }
    public string? Background { get; set; }
    public object? Padding { get; set; }
    public object? Margin { get; set; }
    public BorderDefinition? Border { get; set; }
    public string? Align { get; set; }
    public string? VerticalAlign { get; set; }
}

public sealed class BorderDefinition
{
    public float? Width { get; set; }
    public string? Color { get; set; }
    public float? Radius { get; set; }
}
