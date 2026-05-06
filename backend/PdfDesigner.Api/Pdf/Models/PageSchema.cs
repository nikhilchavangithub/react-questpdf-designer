namespace PdfDesigner.Api.Pdf.Models;

public sealed class PageSettings
{
    public string Size { get; set; } = "Letter";
    public float Width { get; set; } = 612;
    public float Height { get; set; } = 792;
    public string Unit { get; set; } = "pt";
    public object? Margin { get; set; } = 24;
}
