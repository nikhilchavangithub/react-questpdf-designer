using PdfDesigner.Api.Pdf.Services;
using Xunit;

namespace PdfDesigner.Api.Tests;

public sealed class BindingResolverTests
{
    [Fact]
    public void Resolve_replaces_simple_tokens()
    {
        var resolver = new BindingResolver();
        var result = resolver.Resolve("Client: {{ClientName}}", new Dictionary<string, object> { ["ClientName"] = "John Doe" });
        Assert.Equal("Client: John Doe", result);
    }
}
