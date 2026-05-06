using PdfDesigner.Api.Pdf.Models;
using PdfDesigner.Api.Pdf.Rendering;
using QuestPDF.Fluent;

namespace PdfDesigner.Api.Pdf.Services;

public sealed class PdfGenerationService(QuestPdfRenderer renderer)
{
    public byte[] Generate(DocumentSchema schema)
    {
        var document = new QuestPdfDocument(schema, renderer);
        return document.GeneratePdf();
    }
}
