import { useMemo, useState } from 'react';
import { isAbsoluteElement, type ElementNode, type StyleDefinition } from '../schema/documentSchema';
import { getSelectedElement, useDesignerStore } from '../store/designerStore';

type NumberFieldProps = { label: string; value?: number; onChange: (value: number) => void; min?: number };
const NumberField = ({ label, value, onChange, min }: NumberFieldProps) => (
  <label className="block text-xs font-medium text-slate-600">{label}<input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" type="number" min={min} value={value ?? 0} onChange={(event) => onChange(Number(event.target.value))} /></label>
);

type ColorFieldProps = { label: string; value?: string; onChange: (value: string) => void };
const ColorField = ({ label, value, onChange }: ColorFieldProps) => (
  <label className="block text-xs font-medium text-slate-600">{label}<div className="mt-1 flex gap-2"><input className="h-9 w-10 rounded border border-slate-300" type="color" value={value || '#111827'} onChange={(event) => onChange(event.target.value)} /><input className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm" value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder="#111827" /></div></label>
);

function stylePatch(style: StyleDefinition | undefined, patch: StyleDefinition): StyleDefinition {
  return { ...(style ?? {}), ...patch };
}

export function PropertiesPanel() {
  const template = useDesignerStore((state) => state.template);
  const selectedElementId = useDesignerStore((state) => state.selectedElementId);
  const updateElement = useDesignerStore((state) => state.updateElement);
  const duplicateElement = useDesignerStore((state) => state.duplicateElement);
  const deleteElement = useDesignerStore((state) => state.deleteElement);
  const [jsonOpen, setJsonOpen] = useState(true);
  const selected = useMemo(() => getSelectedElement(template, selectedElementId), [template, selectedElementId]);

  const updateStyle = (element: ElementNode, patch: StyleDefinition) => updateElement(element.id, { style: stylePatch(element.style, patch) } as Partial<ElementNode>);
  const updateBorder = (element: ElementNode, patch: NonNullable<StyleDefinition['border']>) => updateStyle(element, { border: { ...(element.style?.border ?? {}), ...patch } });

  return (
    <div className="space-y-6 p-4">
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Properties</h2>
        {!selected ? <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Select an element on the canvas or in Layers.</p> : (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="mb-3 flex items-center justify-between"><div><div className="text-sm font-semibold">{selected.type}</div><div className="text-xs text-slate-500">{selected.id}</div></div><div className="flex gap-2"><button className="text-xs text-blue-600" onClick={() => duplicateElement(selected.id)}>Duplicate</button><button className="text-xs text-red-600" onClick={() => deleteElement(selected.id)}>Delete</button></div></div>
              <label className="block text-xs font-medium text-slate-600">Name<input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" value={selected.name ?? ''} onChange={(event) => updateElement(selected.id, { name: event.target.value } as Partial<ElementNode>)} placeholder="Friendly layer name" /></label>
            </div>
            {isAbsoluteElement(selected) ? <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 p-3"><NumberField label="X" value={selected.x} onChange={(x) => updateElement(selected.id, { x } as Partial<ElementNode>)} /><NumberField label="Y" value={selected.y} onChange={(y) => updateElement(selected.id, { y } as Partial<ElementNode>)} /><NumberField label="Width" value={selected.width} min={1} onChange={(width) => updateElement(selected.id, { width } as Partial<ElementNode>)} /><NumberField label="Height" value={selected.height} min={1} onChange={(height) => updateElement(selected.id, { height } as Partial<ElementNode>)} /></div> : null}
            {selected.type === 'text' ? <label className="block text-xs font-medium text-slate-600">Text<textarea className="mt-1 min-h-24 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" value={selected.text} onChange={(event) => updateElement(selected.id, { text: event.target.value } as Partial<ElementNode>)} /></label> : null}
            {selected.type === 'line' ? <label className="block text-xs font-medium text-slate-600">Orientation<select className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" value={selected.orientation} onChange={(event) => updateElement(selected.id, { orientation: event.target.value as 'horizontal' | 'vertical' } as Partial<ElementNode>)}><option value="horizontal">Horizontal</option><option value="vertical">Vertical</option></select></label> : null}
            <div className="space-y-3 rounded-lg border border-slate-200 p-3">
              <h3 className="text-sm font-semibold">Style</h3>
              <NumberField label="Font size" value={selected.style?.fontSize ?? 11} min={1} onChange={(fontSize) => updateStyle(selected, { fontSize })} />
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600"><input type="checkbox" checked={selected.style?.fontWeight === 'bold'} onChange={(event) => updateStyle(selected, { fontWeight: event.target.checked ? 'bold' : 'normal' })} /> Bold</label>
              <ColorField label="Text color" value={selected.style?.color} onChange={(color) => updateStyle(selected, { color })} />
              <ColorField label="Background" value={selected.style?.background} onChange={(background) => updateStyle(selected, { background })} />
              <NumberField label="Padding" value={typeof selected.style?.padding === 'number' ? selected.style.padding : 0} min={0} onChange={(padding) => updateStyle(selected, { padding })} />
              <NumberField label="Border width" value={selected.style?.border?.width ?? 0} min={0} onChange={(width) => updateBorder(selected, { width })} />
              <ColorField label="Border color" value={selected.style?.border?.color} onChange={(color) => updateBorder(selected, { color })} />
            </div>
          </div>
        )}
      </section>
      <section>
        <button className="mb-2 flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-slate-500" onClick={() => setJsonOpen((open) => !open)}>JSON Preview <span>{jsonOpen ? '−' : '+'}</span></button>
        {jsonOpen ? <pre className="max-h-96 overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">{JSON.stringify(template, null, 2)}</pre> : null}
      </section>
    </div>
  );
}
