using PdfDesigner.Api.Pdf.Models;
using PdfDesigner.Api.Pdf.Services;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace PdfDesigner.Api.Pdf.Rendering;

public sealed class QuestPdfRenderer(BindingResolver bindingResolver)
{
    public void RenderNode(IContainer container, ElementNode node, RenderContext context)
    {
        if (node.Hidden) return;
        switch (node.Type)
        {
            case "text": RenderText(container, node, context); break;
            case "box": RenderBox(container, node); break;
            case "line": RenderLine(container, node); break;
            case "image": RenderImage(container, node); break;
            case "table": RenderTable(container, node, context); break;
            case "container": RenderContainer(container, node, context); break;
            case "row": RenderRow(container, node, context); break;
            case "column": RenderColumn(container, node, context); break;
            case "absolute": RenderContainer(container, node, context); break;
            default: container.Border(1).BorderColor(Colors.Red.Medium).Padding(4).Text($"Unsupported element type: {node.Type}").FontColor(Colors.Red.Medium).FontSize(9); break;
        }
    }

    private void RenderText(IContainer container, ElementNode node, RenderContext context)
    {
        var target = ApplyBoxStyle(container, node.Style);
        var text = bindingResolver.Resolve(node.Text ?? string.Empty, context.Data);
        var descriptor = target.Text(text).FontSize(node.Style?.FontSize ?? 11).FontColor(node.Style?.Color ?? Colors.Grey.Darken4);
        if (node.Style?.FontWeight == "bold") descriptor.Bold();
    }

    private static void RenderBox(IContainer container, ElementNode node) => ApplyBoxStyle(container, node.Style).MinHeight(node.Height ?? 1);

    private static void RenderLine(IContainer container, ElementNode node)
    {
        var color = node.Style?.Border?.Color ?? node.Style?.Color ?? Colors.Grey.Darken3;
        var width = node.Style?.Border?.Width ?? 1;
        if (node.Orientation == "vertical") container.Width(width).Height(node.Height ?? 20).Background(color);
        else container.Height(width).Width(node.Width ?? 100).Background(color);
    }

    private static void RenderImage(IContainer container, ElementNode node) => ApplyBoxStyle(container, node.Style).AlignCenter().AlignMiddle().Text("Image placeholder").FontSize(9).FontColor(Colors.Indigo.Medium);

    private void RenderTable(IContainer container, ElementNode node, RenderContext context)
    {
        var columns = node.Columns ?? [];
        var rows = node.Rows ?? [];
        ApplyBoxStyle(container, node.Style).Table(table =>
        {
            table.ColumnsDefinition(definition =>
            {
                foreach (var column in columns) definition.RelativeColumn();
                if (columns.Count == 0) definition.RelativeColumn();
            });
            table.Header(header =>
            {
                foreach (var column in columns) header.Cell().Border(0.5f).BorderColor(Colors.Grey.Lighten1).Background(Colors.Grey.Lighten3).Padding(3).Text(column.Title).Bold().FontSize(node.Style?.FontSize ?? 9);
            });
            foreach (var row in rows)
                foreach (var cell in row.Cells)
                    table.Cell().Border(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(3).Text(bindingResolver.Resolve(cell.Text ?? string.Empty, context.Data)).FontSize(cell.Style?.FontSize ?? node.Style?.FontSize ?? 9).FontColor(cell.Style?.Color ?? node.Style?.Color ?? Colors.Grey.Darken4);
        });
    }

    private void RenderContainer(IContainer container, ElementNode node, RenderContext context) => ApplyBoxStyle(container, node.Style).Column(column =>
    {
        foreach (var child in node.Children ?? []) column.Item().Element(inner => RenderNode(inner, child, context));
    });

    private void RenderRow(IContainer container, ElementNode node, RenderContext context) => ApplyBoxStyle(container, node.Style).Row(row =>
    {
        foreach (var child in node.Children ?? []) row.RelativeItem().Element(inner => RenderNode(inner, child, context));
    });

    private void RenderColumn(IContainer container, ElementNode node, RenderContext context) => RenderContainer(container, node, context);

    private static IContainer ApplyBoxStyle(IContainer container, StyleDefinition? style)
    {
        if (style?.Background is not null) container = container.Background(style.Background);
        if (style?.Border?.Width is > 0) container = container.Border(style.Border.Width.Value).BorderColor(style.Border.Color ?? Colors.Grey.Darken2);
        if (style?.Padding is not null) container = container.Padding(ReadSpacing(style.Padding));
        return container;
    }

    private static float ReadSpacing(object spacing)
    {
        if (spacing is float f) return f;
        if (spacing is double d) return (float)d;
        if (spacing is int i) return i;
        return 0;
    }
}
