namespace PdfDesigner.Api.Pdf.Models;

public sealed class DocumentSchema
{
    public string Version { get; set; } = "1.0.0";
    public string Name { get; set; } = string.Empty;
    public string Mode { get; set; } = "absolute";
    public PageSettings Page { get; set; } = new();
    public List<ElementNode> Elements { get; set; } = new();
    public Dictionary<string, object>? Data { get; set; }
    public Dictionary<string, StyleDefinition>? Styles { get; set; }
}
