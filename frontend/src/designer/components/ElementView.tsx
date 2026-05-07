import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Rnd } from 'react-rnd';
import { isAbsoluteElement, type ElementNode, type StyleDefinition } from '../schema/documentSchema';
import { useDesignerStore } from '../store/designerStore';
import { resolveBindings } from '../utils/bindings';
import { CANVAS_ZOOM, ptToPx, pxToPt } from '../utils/units';

type ElementViewProps = { element: ElementNode };
const GRID_SIZE_PT = 8;
const snap = (value: number) => Math.round(value / GRID_SIZE_PT) * GRID_SIZE_PT;

function spacingToCss(value: StyleDefinition['padding']) {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return ptToPx(value);
  return `${ptToPx(value.top ?? 0)}px ${ptToPx(value.right ?? 0)}px ${ptToPx(value.bottom ?? 0)}px ${ptToPx(value.left ?? 0)}px`;
}

function baseStyle(style?: StyleDefinition): CSSProperties {
  return {
    width: '100%',
    height: '100%',
    fontSize: style?.fontSize ? ptToPx(style.fontSize) : ptToPx(11),
    fontWeight: style?.fontWeight === 'bold' ? 700 : 400,
    color: style?.color ?? '#111827',
    background: style?.background,
    padding: spacingToCss(style?.padding),
    border: style?.border?.width ? `${ptToPx(style.border.width)}px solid ${style.border.color ?? '#111827'}` : undefined,
    borderRadius: style?.border?.radius ? ptToPx(style.border.radius) : undefined,
    textAlign: style?.align,
    overflow: 'hidden'
  };
}

function renderContent(element: ElementNode, data: Record<string, unknown>) {
  switch (element.type) {
    case 'text':
      return <div style={baseStyle(element.style)}>{resolveBindings(element.text, data)}</div>;
    case 'box':
      return <div style={baseStyle(element.style)} />;
    case 'line':
      return <div className="line-element" style={{ color: element.style?.border?.color ?? element.style?.color ?? '#111827', width: '100%', height: element.orientation === 'horizontal' ? Math.max(1, ptToPx(element.style?.border?.width ?? 1)) : '100%' }} />;
    case 'image':
      return <div className="image-placeholder" style={baseStyle(element.style)}>Image placeholder</div>;
    case 'table':
      return <div className="canvas-table">
        <div className="canvas-table-header" style={{ gridTemplateColumns: `repeat(${element.columns.length}, 1fr)` }}>{element.columns.map((column) => <div key={column.id}>{column.title}</div>)}</div>
        {element.rows.length ? element.rows.map((row) => <div key={row.id} className="canvas-table-row" style={{ gridTemplateColumns: `repeat(${element.columns.length}, 1fr)` }}>{row.cells.map((cell) => <div key={cell.id}>{resolveBindings(cell.text ?? '', data)}</div>)}</div>) : <div className="canvas-table-empty">Add first row</div>}
      </div>;
    default:
      return <div className="unsupported-element">Unsupported: {element.type}</div>;
  }
}

export function ElementView({ element }: ElementViewProps) {
  const selectedElementId = useDesignerStore((state) => state.selectedElementId);
  const selectElement = useDesignerStore((state) => state.selectElement);
  const moveElement = useDesignerStore((state) => state.moveElement);
  const resizeElement = useDesignerStore((state) => state.resizeElement);
  const deleteElement = useDesignerStore((state) => state.deleteElement);
  const duplicateElement = useDesignerStore((state) => state.duplicateElement);
  const data = useDesignerStore((state) => state.template.data ?? {});
  const [liveRect, setLiveRect] = useState<{ x: number; y: number; width: number; height: number }>();

  if (element.hidden || !isAbsoluteElement(element)) return null;
  const selected = selectedElementId === element.id;
  const feedbackRect = liveRect ?? { x: element.x, y: element.y, width: element.width, height: element.height };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!selected || element.locked) return;
    const distance = event.shiftKey ? GRID_SIZE_PT : 1;
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      deleteElement(element.id);
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'd') {
      event.preventDefault();
      duplicateElement(element.id);
      return;
    }
    const moves: Record<string, [number, number]> = { ArrowUp: [0, -distance], ArrowDown: [0, distance], ArrowLeft: [-distance, 0], ArrowRight: [distance, 0] };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      moveElement(element.id, element.x + move[0], element.y + move[1]);
    }
  };

  return (
    <Rnd
      bounds="parent"
      size={{ width: ptToPx(element.width), height: ptToPx(element.height) }}
      position={{ x: ptToPx(element.x), y: ptToPx(element.y) }}
      scale={CANVAS_ZOOM}
      minWidth={4}
      minHeight={4}
      dragGrid={[ptToPx(GRID_SIZE_PT), ptToPx(GRID_SIZE_PT)]}
      resizeGrid={[ptToPx(GRID_SIZE_PT), ptToPx(GRID_SIZE_PT)]}
      disableDragging={element.locked}
      enableResizing={!element.locked}
      onMouseDown={(event) => { event.stopPropagation(); selectElement(element.id); }}
      onDrag={(_event, position) => setLiveRect({ x: snap(pxToPt(position.x)), y: snap(pxToPt(position.y)), width: element.width, height: element.height })}
      onDragStop={(_event, position) => {
        setLiveRect(undefined);
        moveElement(element.id, snap(pxToPt(position.x)), snap(pxToPt(position.y)));
      }}
      onResize={(_event, _direction, ref, _delta, position) => setLiveRect({ x: snap(pxToPt(position.x)), y: snap(pxToPt(position.y)), width: snap(pxToPt(ref.offsetWidth)), height: snap(pxToPt(ref.offsetHeight)) })}
      onResizeStop={(_event, _direction, ref, _delta, position) => {
        setLiveRect(undefined);
        resizeElement(element.id, snap(pxToPt(ref.offsetWidth)), snap(pxToPt(ref.offsetHeight)), snap(pxToPt(position.x)), snap(pxToPt(position.y)));
      }}
      className={`element-frame ${selected ? 'element-frame-selected' : ''}`}
    >
      <div tabIndex={0} role="button" aria-label={`${element.type} element ${element.name ?? element.id}`} className="element-focus-target" onKeyDown={handleKeyDown}>
        {renderContent(element, data)}
        {selected ? <div className="coordinate-badge">X {feedbackRect.x} · Y {feedbackRect.y} · {feedbackRect.width}×{feedbackRect.height}pt</div> : null}
      </div>
    </Rnd>
  );
}
