# React QuestPDF Designer

Enterprise PDF designer MVP where React produces a versioned, point-based document schema and ASP.NET Core renders that schema with QuestPDF.

This project intentionally does **not** convert HTML/CSS to PDF. The React canvas is an approximation for designers; QuestPDF rendering is the source of truth.

## Structure

- `frontend/` - React, TypeScript, Vite designer UI with Zustand state, Zod validation, JSON preview, and PDF generation client.
- `backend/PdfDesigner.Api/` - ASP.NET Core API with `POST /api/pdf/generate`, schema validation, simple binding resolver, and QuestPDF renderer.
- `backend/PdfDesigner.Api.Tests/` - Minimal xUnit tests for validation, bindings, PDF smoke generation, and unsupported renderer fallback.
- `docs/` - Schema, renderer, and roadmap notes.

## Run

```bash
cd frontend
npm install
npm run dev
```

```bash
cd backend/PdfDesigner.Api
dotnet run
```

Then open the Vite URL and click **Generate PDF** to post the schema to the API.

## Test

See [`docs/testing.md`](docs/testing.md) for frontend, backend, end-to-end, and direct API testing steps.
