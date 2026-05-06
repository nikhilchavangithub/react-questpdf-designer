import { useDesignerStore } from '../store/designerStore';

export function LayersPanel() {
  const { elements } = useDesignerStore((state) => state.template);
  const selectedElementId = useDesignerStore((state) => state.selectedElementId);
  const selectElement = useDesignerStore((state) => state.selectElement);
  const deleteElement = useDesignerStore((state) => state.deleteElement);
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Layers</h2>
      <div className="space-y-1">
        {elements.map((element) => (
          <div key={element.id} className={`flex items-center justify-between rounded-md border px-2 py-2 text-sm ${selectedElementId === element.id ? 'border-blue-300 bg-blue-50' : 'border-transparent hover:bg-slate-50'}`}>
            <button className="min-w-0 flex-1 truncate text-left" onClick={() => selectElement(element.id)}>{element.name || element.id}<span className="ml-2 text-xs text-slate-400">{element.type}</span></button>
            <button className="text-xs text-slate-400 hover:text-red-600" onClick={() => deleteElement(element.id)}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
}
