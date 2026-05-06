using PdfDesigner.Api.Pdf.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace PdfDesigner.Api.Pdf.Rendering;

public sealed class QuestPdfDocument(DocumentSchema schema, QuestPdfRenderer renderer) : IDocument
{
    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        var context = new RenderContext(schema);
        container.Page(page =>
        {
            page.Size(schema.Page.Size == "A4" ? PageSizes.A4 : PageSizes.Letter);
            page.Margin(0);
            page.Content().Layers(layers =>
            {
                layers.PrimaryLayer().Background(Colors.White);
                foreach (var element in schema.Elements.Where(element => !element.Hidden))
                {
                    layers.Layer()
                        .TranslateX(element.X ?? 0)
                        .TranslateY(element.Y ?? 0)
                        .Width(element.Width ?? 100)
                        .Height(element.Height ?? 20)
                        .Element(inner => renderer.RenderNode(inner, element, context));
                }
            });
        });
    }
}
