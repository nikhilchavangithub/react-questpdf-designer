import { useMemo, useState } from 'react';
import { generatePdf } from '../services/pdfApi';
import { validateDocument } from '../schema/validators';
import { useDesignerStore } from '../store/designerStore';
import { Toolbox } from './Toolbox';
import { PdfCanvas } from './PdfCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { LayersPanel } from './LayersPanel';
import { Toolbar } from './Toolbar';
import { PageNavigator } from './PageNavigator';
import { WorkflowGuide } from './WorkflowGuide';

type GenerationMessage = { tone: 'success' | 'error' | 'info'; title: string; detail?: string };

export function DesignerShell() {
  const template = useDesignerStore((state) => state.template);
  const selectedPage = useDesignerStore((state) => state.selectedPage);
  const selectedElementId = useDesignerStore((state) => state.selectedElementId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<GenerationMessage>();
  const validation = useMemo(() => validateDocument(template), [template]);
  const validationIssues = validation.success ? [] : validation.error.issues;

  const handleGenerate = async () => {
    setMessage(undefined);
    if (validationIssues.length) {
      setMessage({
        tone: 'error',
        title: `${validationIssues.length} blocking validation issue${validationIssues.length === 1 ? '' : 's'} found`,
        detail: validationIssues.map((issue) => `• ${issue.path.join('.') || 'Document'}: ${issue.message}`).join('\n')
      });
      return;
    }
    setIsGenerating(true);
    setMessage({ tone: 'info', title: 'Generating PDF…', detail: 'Preparing the current template and downloading the file.' });
    try {
      await generatePdf(template);
      setMessage({ tone: 'success', title: 'PDF generated and downloaded.', detail: 'Your document passed validation and the download has started.' });
    } catch (error) {
      setMessage({ tone: 'error', title: 'PDF generation failed', detail: error instanceof Error ? error.message : 'Try again or review the document schema.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-shell">
      <Toolbar onGenerate={handleGenerate} isGenerating={isGenerating} validationCount={validationIssues.length} />
      <div className="workflow-strip"><WorkflowGuide activeStep={selectedElementId ? 3 : 2} /></div>
      {message ? (
        <div className={`status-banner status-${message.tone}`} role={message.tone === 'error' ? 'alert' : 'status'}>
          <strong>{message.title}</strong>
          {message.detail ? <span>{message.detail}</span> : null}
        </div>
      ) : null}
      <div className="workspace-grid">
        <aside className="side-panel left-panel" aria-label="Template, page, and layer navigation">
          <PageNavigator />
          <Toolbox />
          <LayersPanel />
        </aside>
        <main className="canvas-region" aria-label="PDF canvas workspace">
          <div className="workspace-context">
            <span>Page {selectedPage}</span>
            <span>{selectedElementId ? `${selectedElementId} selected` : 'Select an element to edit properties'}</span>
            <span>{validationIssues.length ? `${validationIssues.length} validation issue${validationIssues.length === 1 ? '' : 's'}` : 'Schema valid'}</span>
          </div>
          <PdfCanvas />
        </main>
        <aside className="side-panel right-panel" aria-label="Contextual properties">
          <PropertiesPanel validationIssues={validationIssues} />
        </aside>
      </div>
    </div>
  );
}
