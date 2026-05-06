import { useDesignerStore } from '../store/designerStore';

const tools = [
  { type: 'text', label: 'Text', description: 'Bound or static text' },
  { type: 'box', label: 'Box', description: 'Background and border' },
  { type: 'line', label: 'Line', description: 'Horizontal divider' },
  { type: 'image', label: 'Image', description: 'Placeholder frame' },
  { type: 'table', label: 'Table', description: 'Simple grid preview' }
] as const;

export function Toolbox() {
  const addElement = useDesignerStore((state) => state.addElement);
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Toolbox</h2>
      <div className="space-y-2">
        {tools.map((tool) => (
          <button key={tool.type} className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50" onClick={() => addElement(tool.type)}>
            <div className="text-sm font-semibold text-slate-900">{tool.label}</div>
            <div className="text-xs text-slate-500">{tool.description}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
