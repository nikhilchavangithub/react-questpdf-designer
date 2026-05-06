import { useDesignerStore } from '../store/designerStore';

type ToolbarProps = { onGenerate: () => void; isGenerating: boolean; validationCount: number };

export function Toolbar({ onGenerate, isGenerating, validationCount }: ToolbarProps) {
  const resetTemplate = useDesignerStore((state) => state.resetTemplate);
  const template = useDesignerStore((state) => state.template);
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      <div>
        <div className="text-sm font-semibold">QuestPDF Enterprise Designer</div>
        <div className="text-xs text-slate-500">{template.name} · Schema {template.version} · {template.page.size} {template.page.width}×{template.page.height}pt</div>
      </div>
      <div className="flex items-center gap-2">
        {validationCount ? <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">{validationCount} validation issue(s)</span> : <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">Schema valid</span>}
        <button className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50" onClick={resetTemplate}>Reset</button>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60" onClick={onGenerate} disabled={isGenerating}>{isGenerating ? 'Generating…' : 'Generate PDF'}</button>
      </div>
    </header>
  );
}
