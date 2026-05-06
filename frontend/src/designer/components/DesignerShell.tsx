import { useMemo, useState } from 'react';
import { generatePdf } from '../services/pdfApi';
import { validateDocument } from '../schema/validators';
import { useDesignerStore } from '../store/designerStore';
import { Toolbox } from './Toolbox';
import { PdfCanvas } from './PdfCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { LayersPanel } from './LayersPanel';
import { Toolbar } from './Toolbar';

export function DesignerShell() {
  const template = useDesignerStore((state) => state.template);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<string>();
  const validation = useMemo(() => validateDocument(template), [template]);

  const handleGenerate = async () => {
    setMessage(undefined);
    if (!validation.success) {
      setMessage(validation.error.issues.map((issue) => issue.message).join('\n'));
      return;
    }
    setIsGenerating(true);
    try {
      await generatePdf(template);
      setMessage('PDF generated and downloaded.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'PDF generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-100 text-slate-900">
      <Toolbar onGenerate={handleGenerate} isGenerating={isGenerating} validationCount={validation.success ? 0 : validation.error.issues.length} />
      {message ? <div className="border-b border-slate-200 bg-white px-4 py-2 text-sm whitespace-pre-line text-slate-700">{message}</div> : null}
      <div className="grid min-h-0 flex-1 grid-cols-[260px_minmax(680px,1fr)_340px]">
        <aside className="border-r border-slate-200 bg-white p-4"><Toolbox /><LayersPanel /></aside>
        <main className="min-w-0 overflow-auto bg-slate-100 p-8"><PdfCanvas /></main>
        <aside className="overflow-auto border-l border-slate-200 bg-white"><PropertiesPanel /></aside>
      </div>
    </div>
  );
}
