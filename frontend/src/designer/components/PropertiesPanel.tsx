import { useMemo, useState } from 'react';
import type { ZodIssue } from 'zod';
import { isAbsoluteElement, type ElementNode, type StyleDefinition, type TableElement } from '../schema/documentSchema';
import { getSelectedElement, useDesignerStore } from '../store/designerStore';

type PropertiesPanelProps = { validationIssues?: ZodIssue[] };
type NumberFieldProps = { label: string; value?: number; onChange: (value: number) => void; min?: number; max?: number; help?: string };
const NumberField = ({ label, value, onChange, min, max, help }: NumberFieldProps) => (
  <label className="field-label">
    {label}
    <input className="field-input" type="number" min={min} max={max} value={value ?? 0} onChange={(event) => onChange(Number(event.target.value))} />
    {help ? <span className="field-help">{help}</span> : null}
  </label>
);

type ColorFieldProps = { label: string; value?: string; onChange: (value: string) => void };
const ColorField = ({ label, value, onChange }: ColorFieldProps) => (
  <label className="field-label">
    {label}
    <span className="color-field">
      <input type="color" value={value || '#111827'} onChange={(event) => onChange(event.target.value)} aria-label={`${label} color picker`} />
      <input className="field-input" value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder="#111827" />
    </span>
  </label>
);

function stylePatch(style: StyleDefinition | undefined, patch: StyleDefinition): StyleDefinition {
  return { ...(style ?? {}), ...patch };
}

function updateTableColumn(table: TableElement, index: number, title: string): TableElement {
  const columns = table.columns.map((column, columnIndex) => columnIndex === index ? { ...column, title } : column);
  const rows = table.rows.map((row, rowIndex) => ({
    ...row,
    cells: row.cells.map((cell, cellIndex) => cellIndex === index && !cell.text ? { ...cell, text: `${title} ${rowIndex + 1}` } : cell)
  }));
  return { ...table, columns, rows };
}

function tablePreset(table: TableElement, preset: 'details' | 'invoice' | 'summary'): TableElement {
  const presets = {
    details: ['Field', 'Value'],
    invoice: ['Code', 'Description', 'Qty', 'Amount'],
    summary: ['Category', 'Total']
  } satisfies Record<typeof preset, string[]>;
  const titles = presets[preset];
  const columns = titles.map((title, index) => table.columns[index] ? { ...table.columns[index], title } : { id: crypto.randomUUID(), title, width: 'relative' as const });
  const rows = table.rows.length ? table.rows.map((row) => ({ ...row, cells: columns.map((column, index) => row.cells[index] ?? { id: crypto.randomUUID(), text: `${column.title} value` }) })) : [{ id: crypto.randomUUID(), cells: columns.map((column) => ({ id: crypto.randomUUID(), text: `${column.title} value` })) }];
  return { ...table, columns, rows };
}

export function PropertiesPanel({ validationIssues = [] }: PropertiesPanelProps) {
  const template = useDesignerStore((state) => state.template);
  const selectedElementId = useDesignerStore((state) => state.selectedElementId);
  const updateElement = useDesignerStore((state) => state.updateElement);
  const duplicateElement = useDesignerStore((state) => state.duplicateElement);
  const deleteElement = useDesignerStore((state) => state.deleteElement);
  const resizeTable = useDesignerStore((state) => state.resizeTable);
  const insertTableRow = useDesignerStore((state) => state.insertTableRow);
  const [jsonOpen, setJsonOpen] = useState(false);
  const selected = useMemo(() => getSelectedElement(template, selectedElementId), [template, selectedElementId]);
  const selectedIssues = validationIssues.filter((issue) => selected?.id && issue.path.join('.').includes(selected.id));

  const updateStyle = (element: ElementNode, patch: StyleDefinition) => updateElement(element.id, { style: stylePatch(element.style, patch) } as Partial<ElementNode>);
  const updateBorder = (element: ElementNode, patch: NonNullable<StyleDefinition['border']>) => updateStyle(element, { border: { ...(element.style?.border ?? {}), ...patch } });

  return (
    <div className="properties-panel">
      <section className="panel-section">
        <h2 className="section-eyebrow">Edit properties</h2>
        {!selected ? <p className="empty-card">Select an element on the canvas or in Element layers. Keyboard users can tab to an element, use arrow keys to nudge it, Shift+arrow for 8pt moves, Delete to remove, and Ctrl/⌘+D to duplicate.</p> : (
          <div className="property-stack">
            <div className="property-card selected-summary">
              <div>
                <span className="context-chip">Page {isAbsoluteElement(selected) ? selected.page ?? 1 : 'flow'}</span>
                <h3>{selected.name || selected.type}</h3>
                <p>{selected.type} selected · {selected.id}</p>
              </div>
              <div className="quick-actions">
                <button type="button" className="secondary-button compact" onClick={() => duplicateElement(selected.id)}>Duplicate</button>
                <button type="button" className="danger-button compact" onClick={() => deleteElement(selected.id)}>Delete</button>
              </div>
              <label className="field-label full-span">
                Friendly name
                <input className="field-input" value={selected.name ?? ''} onChange={(event) => updateElement(selected.id, { name: event.target.value } as Partial<ElementNode>)} placeholder="Friendly layer name" />
              </label>
            </div>

            {selectedIssues.length ? <div className="inline-issues" role="alert"><strong>Fix on this element</strong>{selectedIssues.map((issue) => <span key={`${issue.path.join('.')}-${issue.message}`}>{issue.message}</span>)}</div> : null}

            {isAbsoluteElement(selected) ? (
              <details className="property-card" open>
                <summary>Position</summary>
                <div className="field-grid">
                  <NumberField label="Page" value={selected.page ?? 1} min={1} max={template.pageCount} help="Current page" onChange={(page) => updateElement(selected.id, { page: Math.max(1, Math.min(page, template.pageCount)) } as Partial<ElementNode>)} />
                  <NumberField label="X" value={selected.x} help="pt from left" onChange={(x) => updateElement(selected.id, { x } as Partial<ElementNode>)} />
                  <NumberField label="Y" value={selected.y} help="pt from top" onChange={(y) => updateElement(selected.id, { y } as Partial<ElementNode>)} />
                  <NumberField label="Width" value={selected.width} min={1} onChange={(width) => updateElement(selected.id, { width } as Partial<ElementNode>)} />
                  <NumberField label="Height" value={selected.height} min={1} onChange={(height) => updateElement(selected.id, { height } as Partial<ElementNode>)} />
                </div>
              </details>
            ) : null}

            <details className="property-card" open>
              <summary>Content</summary>
              {selected.type === 'text' ? (
                <label className="field-label">
                  Text
                  <textarea className="field-input text-area" value={selected.text} onChange={(event) => updateElement(selected.id, { text: event.target.value } as Partial<ElementNode>)} />
                  <span className="field-help">Bindings such as {'{{claim.number}}'} are resolved in preview.</span>
                </label>
              ) : null}
              {selected.type === 'line' ? (
                <label className="field-label">
                  Orientation
                  <select className="field-input" value={selected.orientation} onChange={(event) => updateElement(selected.id, { orientation: event.target.value as 'horizontal' | 'vertical' } as Partial<ElementNode>)}>
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                  </select>
                </label>
              ) : null}
              {selected.type !== 'text' && selected.type !== 'line' && selected.type !== 'table' ? <p className="helper-text">This element mostly uses position and appearance controls.</p> : null}
            </details>

            {selected.type === 'table' ? (
              <details className="property-card" open>
                <summary>Table</summary>
                <p className="helper-text">Start with a preset, then edit headers and cell values inline below.</p>
                <div className="preset-row">
                  <button type="button" className="secondary-button compact" onClick={() => updateElement(selected.id, tablePreset(selected, 'details'))}>Details</button>
                  <button type="button" className="secondary-button compact" onClick={() => updateElement(selected.id, tablePreset(selected, 'invoice'))}>Invoice lines</button>
                  <button type="button" className="secondary-button compact" onClick={() => updateElement(selected.id, tablePreset(selected, 'summary'))}>Summary</button>
                </div>
                <div className="field-grid">
                  <NumberField label="Columns" value={selected.columns.length} min={1} onChange={(columnCount) => resizeTable(selected.id, columnCount, selected.rows.length)} />
                  <NumberField label="Rows" value={selected.rows.length} min={1} onChange={(rowCount) => resizeTable(selected.id, selected.columns.length, rowCount)} />
                </div>
                <div className="preset-row">
                  <button type="button" className="secondary-button compact" onClick={() => insertTableRow(selected.id, -1)}>Add row at top</button>
                  <button type="button" className="secondary-button compact" onClick={() => insertTableRow(selected.id, selected.rows.length - 1)}>Add row at bottom</button>
                </div>
                <div className="table-editor">
                  <div className="table-editor-header" style={{ gridTemplateColumns: `repeat(${selected.columns.length}, minmax(96px, 1fr))` }}>
                    {selected.columns.map((column, index) => <input key={column.id} className="field-input" aria-label={`Column ${index + 1} header`} value={column.title} onChange={(event) => updateElement(selected.id, updateTableColumn(selected, index, event.target.value || `Column ${index + 1}`))} />)}
                  </div>
                  {selected.rows.map((row, rowIndex) => (
                    <div key={row.id} className="table-editor-row" style={{ gridTemplateColumns: `repeat(${selected.columns.length}, minmax(96px, 1fr))` }}>
                      {row.cells.map((cell, cellIndex) => <input key={cell.id} className="field-input" aria-label={`Row ${rowIndex + 1} ${selected.columns[cellIndex]?.title ?? `cell ${cellIndex + 1}`}`} value={cell.text ?? ''} onChange={(event) => {
                        const rows = selected.rows.map((currentRow, currentRowIndex) => currentRowIndex === rowIndex ? { ...currentRow, cells: currentRow.cells.map((currentCell, currentCellIndex) => currentCellIndex === cellIndex ? { ...currentCell, text: event.target.value } : currentCell) } : currentRow);
                        updateElement(selected.id, { rows } as Partial<TableElement>);
                      }} />)}
                    </div>
                  ))}
                </div>
              </details>
            ) : null}

            <details className="property-card" open>
              <summary>Appearance</summary>
              <div className="field-grid">
                <NumberField label="Font size" value={selected.style?.fontSize ?? 11} min={1} onChange={(fontSize) => updateStyle(selected, { fontSize })} />
                <NumberField label="Padding" value={typeof selected.style?.padding === 'number' ? selected.style.padding : 0} min={0} onChange={(padding) => updateStyle(selected, { padding })} />
              </div>
              <label className="checkbox-field"><input type="checkbox" checked={selected.style?.fontWeight === 'bold'} onChange={(event) => updateStyle(selected, { fontWeight: event.target.checked ? 'bold' : 'normal' })} /> Bold text</label>
              <ColorField label="Text color" value={selected.style?.color} onChange={(color) => updateStyle(selected, { color })} />
              <ColorField label="Background" value={selected.style?.background} onChange={(background) => updateStyle(selected, { background })} />
            </details>

            <details className="property-card">
              <summary>Advanced</summary>
              <div className="field-grid">
                <NumberField label="Border width" value={selected.style?.border?.width ?? 0} min={0} onChange={(width) => updateBorder(selected, { width })} />
                <NumberField label="Border radius" value={selected.style?.border?.radius ?? 0} min={0} onChange={(radius) => updateBorder(selected, { radius })} />
              </div>
              <ColorField label="Border color" value={selected.style?.border?.color} onChange={(color) => updateBorder(selected, { color })} />
            </details>
          </div>
        )}
      </section>
      <section className="panel-section dev-section">
        <button className="json-toggle" type="button" onClick={() => setJsonOpen((open) => !open)}>JSON preview <span>{jsonOpen ? '−' : '+'}</span></button>
        {jsonOpen ? <pre className="json-preview">{JSON.stringify(template, null, 2)}</pre> : <p className="helper-text">Collapsed by default so design controls stay primary.</p>}
      </section>
    </div>
  );
}
