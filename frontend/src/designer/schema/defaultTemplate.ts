import type { DocumentSchema } from './documentSchema';

export const defaultTemplate: DocumentSchema = {
  version: '1.0.0',
  name: 'Claim Summary Template',
  mode: 'absolute',
  page: { size: 'Letter', width: 612, height: 792, unit: 'pt', margin: 24 },
  data: {
    ClientName: 'John Doe',
    ProviderName: 'Positive Behavior Supports',
    ClaimLines: [{ ServiceDate: '2026-05-06', Code: '97153', Units: '8', Amount: '$120.00' }]
  },
  elements: [
    { id: 'title', type: 'text', x: 40, y: 40, width: 300, height: 30, text: 'Claim Summary', style: { fontSize: 18, fontWeight: 'bold', color: '#111827' } },
    { id: 'client-name', type: 'text', x: 40, y: 85, width: 240, height: 22, text: 'Client: {{ClientName}}', style: { fontSize: 11, color: '#111827' } },
    { id: 'provider-name', type: 'text', x: 40, y: 112, width: 360, height: 22, text: 'Provider: {{ProviderName}}', style: { fontSize: 11, color: '#111827' } },
    { id: 'summary-box', type: 'box', x: 36, y: 150, width: 540, height: 120, style: { background: '#F9FAFB', border: { width: 1, color: '#D1D5DB', radius: 4 } } },
    { id: 'divider', type: 'line', x: 40, y: 300, width: 520, height: 1, orientation: 'horizontal', style: { border: { width: 1, color: '#9CA3AF' } } }
  ]
};
