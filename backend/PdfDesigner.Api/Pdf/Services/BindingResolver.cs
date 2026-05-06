using System.Text.Json;
using System.Text.RegularExpressions;

namespace PdfDesigner.Api.Pdf.Services;

public sealed partial class BindingResolver
{
    public string Resolve(string input, IReadOnlyDictionary<string, object> data) => BindingRegex().Replace(input, match => ResolvePath(match.Groups[1].Value.Trim(), data) ?? string.Empty);

    private static string? ResolvePath(string path, object? current)
    {
        foreach (var segment in path.Split('.', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            current = current switch
            {
                JsonElement json when json.ValueKind == JsonValueKind.Object && json.TryGetProperty(segment, out var value) => value,
                Dictionary<string, object> dict when dict.TryGetValue(segment, out var value) => value,
                IReadOnlyDictionary<string, object> dict when dict.TryGetValue(segment, out var value) => value,
                _ => null
            };
            if (current is null) return null;
        }
        return current is JsonElement element ? ElementToString(element) : current.ToString();
    }

    private static string ElementToString(JsonElement element) => element.ValueKind switch
    {
        JsonValueKind.String => element.GetString() ?? string.Empty,
        JsonValueKind.Number => element.ToString(),
        JsonValueKind.True => "true",
        JsonValueKind.False => "false",
        _ => element.ToString()
    };

    [GeneratedRegex("{{\\s*([\\w.]+)\\s*}}")]
    private static partial Regex BindingRegex();
}
