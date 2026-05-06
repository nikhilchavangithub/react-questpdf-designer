using System.Text.RegularExpressions;
using PdfDesigner.Api.Pdf.Models;

namespace PdfDesigner.Api.Pdf.Services;

public sealed partial class SchemaValidator
{
    private static readonly HashSet<string> SupportedTypes = ["text", "box", "line", "image", "table", "container", "row", "column", "absolute"];
    private static readonly HashSet<string> AbsoluteTypes = ["text", "box", "line", "image", "table", "absolute"];

    public List<string> Validate(DocumentSchema schema)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(schema.Version)) errors.Add("Document version is required.");
        if (schema.PageCount <= 0) errors.Add("Page count must be positive.");
        if (schema.Page is null) errors.Add("Page settings are required.");
        else
        {
            if (schema.Page.Width <= 0 || schema.Page.Height <= 0) errors.Add("Page width and height must be positive.");
            if (schema.Page.Unit is not ("pt" or "px")) errors.Add("Page unit must be pt or px.");
        }

        var ids = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        ValidateElements(schema.Elements ?? [], errors, ids, "elements");
        return errors;
    }

    private static void ValidateElements(IEnumerable<ElementNode> elements, List<string> errors, HashSet<string> ids, string path)
    {
        var index = 0;
        foreach (var node in elements)
        {
            var nodePath = $"{path}[{index}]";
            if (string.IsNullOrWhiteSpace(node.Id)) errors.Add($"{nodePath}.id is required.");
            else if (!ids.Add(node.Id)) errors.Add($"Element id '{node.Id}' must be unique.");

            if (string.IsNullOrWhiteSpace(node.Type)) errors.Add($"{nodePath}.type is required.");
            else if (!SupportedTypes.Contains(node.Type)) errors.Add($"{nodePath}.type '{node.Type}' is not supported by this schema version.");

            if (AbsoluteTypes.Contains(node.Type))
            {
                if (node.X is null || node.Y is null || node.Width is null || node.Height is null) errors.Add($"{nodePath} requires x, y, width, and height.");
                if (node.Width <= 0 || node.Height <= 0) errors.Add($"{nodePath} width and height must be positive.");
                if (node.Page is not null && node.Page <= 0) errors.Add($"{nodePath}.page must be positive.");
            }

            if (node.Type == "text" && node.Text is null) errors.Add($"{nodePath}.text is required for text elements.");
            ValidateStyle(node.Style, errors, nodePath);
            if (node.Children is not null) ValidateElements(node.Children, errors, ids, $"{nodePath}.children");
            if (node.Rows is not null)
            {
                foreach (var row in node.Rows)
                    foreach (var cell in row.Cells) ValidateStyle(cell.Style, errors, $"{nodePath}.rows[{row.Id}].cells[{cell.Id}]");
            }
            index++;
        }
    }

    private static void ValidateStyle(StyleDefinition? style, List<string> errors, string path)
    {
        if (style is null) return;
        if (style.Color is not null && !HexColorRegex().IsMatch(style.Color)) errors.Add($"{path}.style.color must be a valid hex color.");
        if (style.Background is not null && !HexColorRegex().IsMatch(style.Background)) errors.Add($"{path}.style.background must be a valid hex color.");
        if (style.Border?.Color is not null && !HexColorRegex().IsMatch(style.Border.Color)) errors.Add($"{path}.style.border.color must be a valid hex color.");
    }

    [GeneratedRegex("^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$")]
    private static partial Regex HexColorRegex();
}
