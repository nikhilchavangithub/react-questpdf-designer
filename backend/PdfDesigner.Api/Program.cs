using PdfDesigner.Api.Pdf.Rendering;
using PdfDesigner.Api.Pdf.Services;
using QuestPDF.Infrastructure;

QuestPDF.Settings.License = LicenseType.Community;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers().AddJsonOptions(options => { options.JsonSerializerOptions.PropertyNameCaseInsensitive = true; });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<SchemaValidator>();
builder.Services.AddSingleton<BindingResolver>();
builder.Services.AddSingleton<QuestPdfRenderer>();
builder.Services.AddSingleton<PdfGenerationService>();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.MapControllers();
app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.Run();

public partial class Program { }
