import { useDesignerStore } from '../store/designerStore';

const tools = [
  { type: 'text', label: 'Text', description: 'Bound or static text' },
  { type: 'box', label: 'Box', description: 'Background and border' },
  { type: 'line', label: 'Line', description: 'Horizontal divider' },
  { type: 'image', label: 'Image', description: 'Placeholder frame' },
  { type: 'table', label: 'Table', description: 'Rows, columns, and presets' }
] as const;

export function Toolbox() {
  const addElement = useDesignerStore((state) => state.addElement);
  return (
    <section className="panel-section" aria-labelledby="toolbox-title">
      <h2 id="toolbox-title" className="section-eyebrow">Place components</h2>
      <p className="helper-text">Click to add to the selected page, or drag onto the page to place precisely. Elements snap to the 8pt grid.</p>
      <div className="tool-list">
        {tools.map((tool) => (
          <button
            key={tool.type}
            type="button"
            draggable
            className="tool-card"
            onClick={() => addElement(tool.type)}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = 'copy';
              event.dataTransfer.setData('application/pdf-designer-element', tool.type);
            }}
          >
            <span className="tool-icon" aria-hidden="true">{tool.label.slice(0, 1)}</span>
            <span>
              <strong>{tool.label}</strong>
              <small>{tool.description}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
