import { useDesignerStore } from '../store/designerStore';

type ToolbarProps = { onGenerate: () => void; isGenerating: boolean; validationCount: number };

export function Toolbar({ onGenerate, isGenerating, validationCount }: ToolbarProps) {
  const resetTemplate = useDesignerStore((state) => state.resetTemplate);
  const template = useDesignerStore((state) => state.template);
  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="product-title">QuestPDF Enterprise Designer</div>
        <div className="template-meta">{template.name} · Schema {template.version} · {template.page.size} {template.page.width}×{template.page.height}pt · {template.pageCount} page(s)</div>
      </div>
      <div className="toolbar-actions">
        {validationCount ? <span className="status-chip warning">{validationCount} validation issue{validationCount === 1 ? '' : 's'}</span> : <span className="status-chip success">Schema valid</span>}
        <button className="secondary-button" type="button" onClick={resetTemplate}>Reset template</button>
        <button className="primary-button" type="button" onClick={onGenerate} disabled={isGenerating}>{isGenerating ? 'Generating…' : 'Generate PDF'}</button>
      </div>
    </header>
  );
}
