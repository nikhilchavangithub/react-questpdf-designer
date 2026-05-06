import type { DocumentSchema } from '../schema/documentSchema';

export async function generatePdf(template: DocumentSchema) {
  const response = await fetch('/api/pdf/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ template, data: template.data ?? {} })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `PDF generation failed with ${response.status}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${template.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'document'}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
