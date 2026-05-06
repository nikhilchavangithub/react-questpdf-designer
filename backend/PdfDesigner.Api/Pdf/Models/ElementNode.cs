namespace PdfDesigner.Api.Pdf.Models;

public sealed class ElementNode
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? Name { get; set; }
    public bool Locked { get; set; }
    public bool Hidden { get; set; }
    public float? X { get; set; }
    public float? Y { get; set; }
    public float? Width { get; set; }
    public float? Height { get; set; }
    public int? Page { get; set; }
    public string? Text { get; set; }
    public string? Src { get; set; }
    public string? Fit { get; set; }
    public string? Orientation { get; set; }
    public StyleDefinition? Style { get; set; }
    public List<ElementNode>? Children { get; set; }
    public List<TableColumn>? Columns { get; set; }
    public List<TableRow>? Rows { get; set; }
    public bool RepeatHeader { get; set; }
    public string? DataBinding { get; set; }
}
