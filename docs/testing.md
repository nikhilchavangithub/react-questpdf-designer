# Testing the Phase 1 MVP

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- .NET SDK 8.0 or newer

## Frontend checks

From the `frontend` directory:

```bash
npm install
npm test
npm run build
npm run dev
```

`npm test` runs the Vitest unit tests for schema validation and binding resolution. `npm run build` type-checks the React/TypeScript app and creates a production Vite build.

## Backend checks

From the repository root:

```bash
dotnet restore backend/PdfDesigner.sln
dotnet test backend/PdfDesigner.sln
dotnet run --project backend/PdfDesigner.Api/PdfDesigner.Api.csproj
```

The backend tests cover schema validation, binding resolution, and a QuestPDF smoke test that verifies PDF bytes are generated.

## End-to-end manual test

1. Start the API:

   ```bash
   dotnet run --project backend/PdfDesigner.Api/PdfDesigner.Api.csproj
   ```

2. Start the frontend in another terminal:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open the Vite URL shown in the terminal.
4. Add a Text, Box, or Line element from the toolbox.
5. Select the element on the canvas or in Layers.
6. Move/resize it and edit properties in the right panel.
7. Confirm the JSON preview updates.
8. Click **Generate PDF** and confirm the browser downloads a PDF.

## Direct API smoke test

With the API running, post the default schema shape directly:

```bash
curl -X POST http://localhost:5000/api/pdf/generate \
  -H 'Content-Type: application/json' \
  -o claim-summary.pdf \
  --data '{
    "template": {
      "version": "1.0.0",
      "name": "Smoke Test",
      "mode": "absolute",
      "page": { "size": "Letter", "width": 612, "height": 792, "unit": "pt", "margin": 24 },
      "data": { "ClientName": "John Doe" },
      "elements": [
        { "id": "title", "type": "text", "x": 40, "y": 40, "width": 300, "height": 30, "text": "Client: {{ClientName}}", "style": { "fontSize": 18, "fontWeight": "bold", "color": "#111827" } },
        { "id": "box", "type": "box", "x": 36, "y": 90, "width": 540, "height": 120, "style": { "background": "#F9FAFB", "border": { "width": 1, "color": "#D1D5DB" } } }
      ]
    }
  }'
```
