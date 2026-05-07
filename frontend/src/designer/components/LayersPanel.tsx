import { useDesignerStore } from '../store/designerStore';

export function LayersPanel() {
  const { elements } = useDesignerStore((state) => state.template);
  const selectedElementId = useDesignerStore((state) => state.selectedElementId);
  const selectElement = useDesignerStore((state) => state.selectElement);
  const deleteElement = useDesignerStore((state) => state.deleteElement);
  return (
    <section className="panel-section" aria-labelledby="layers-title">
      <h2 id="layers-title" className="section-eyebrow">Element layers</h2>
      <p className="helper-text">Select an element to reveal contextual editing controls.</p>
      <div className="layer-list">
        {elements.length ? elements.map((element) => (
          <div key={element.id} className={`layer-row ${selectedElementId === element.id ? 'layer-row-active' : ''}`}>
            <button type="button" className="layer-select" onClick={() => selectElement(element.id)}>
              <span>{element.name || element.id}</span>
              <small>{element.type}{'page' in element ? ` · Page ${element.page ?? 1}` : ''}</small>
            </button>
            <button type="button" className="danger-link" onClick={() => deleteElement(element.id)} aria-label={`Delete ${element.name || element.id}`}>Delete</button>
          </div>
        )) : <p className="empty-card">No elements yet. Add a component from the toolbox.</p>}
      </div>
    </section>
  );
}
