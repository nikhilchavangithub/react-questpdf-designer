namespace PdfDesigner.Api.Pdf.Models;

public sealed class TableColumn
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public object? Width { get; set; } = "relative";
    public string? Binding { get; set; }
}

public sealed class TableRow
{
    public string Id { get; set; } = string.Empty;
    public List<TableCell> Cells { get; set; } = new();
}

public sealed class TableCell
{
    public string Id { get; set; } = string.Empty;
    public string? Text { get; set; }
    public string? Binding { get; set; }
    public int? ColSpan { get; set; }
    public int? RowSpan { get; set; }
    public StyleDefinition? Style { get; set; }
}
