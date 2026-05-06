using PdfDesigner.Api.Pdf.Models;

namespace PdfDesigner.Api.Pdf.Rendering;

public sealed class RenderContext(DocumentSchema schema)
{
    public DocumentSchema Schema { get; } = schema;
    public IReadOnlyDictionary<string, object> Data { get; } = schema.Data ?? new Dictionary<string, object>();
}
