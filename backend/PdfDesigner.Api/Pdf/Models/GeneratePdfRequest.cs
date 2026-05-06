namespace PdfDesigner.Api.Pdf.Models;

public sealed class GeneratePdfRequest
{
    public DocumentSchema? Template { get; set; }
    public Dictionary<string, object>? Data { get; set; }
}
