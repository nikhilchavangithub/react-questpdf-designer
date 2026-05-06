import type { CSSProperties } from 'react';
import { Rnd } from 'react-rnd';
import { isAbsoluteElement, type ElementNode, type StyleDefinition } from '../schema/documentSchema';
import { useDesignerStore } from '../store/designerStore';
import { resolveBindings } from '../utils/bindings';
import { CANVAS_ZOOM, ptToPx, pxToPt } from '../utils/units';

type ElementViewProps = { element: ElementNode };

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
      return <div className="bg-current" style={{ color: element.style?.border?.color ?? element.style?.color ?? '#111827', width: '100%', height: element.orientation === 'horizontal' ? Math.max(1, ptToPx(element.style?.border?.width ?? 1)) : '100%' }} />;
    case 'image':
      return <div className="flex items-center justify-center text-xs text-indigo-500" style={baseStyle(element.style)}>Image placeholder</div>;
    case 'table':
      return <div className="h-full w-full overflow-hidden rounded border border-slate-300 bg-white text-[10px] text-slate-700">
        <div className="grid bg-slate-100 font-semibold" style={{ gridTemplateColumns: `repeat(${element.columns.length}, 1fr)` }}>{element.columns.map((column) => <div key={column.id} className="border-r border-slate-300 p-1 last:border-r-0">{column.title}</div>)}</div>
        {element.rows.map((row) => <div key={row.id} className="grid border-t border-slate-200" style={{ gridTemplateColumns: `repeat(${element.columns.length}, 1fr)` }}>{row.cells.map((cell) => <div key={cell.id} className="border-r border-slate-200 p-1 last:border-r-0">{resolveBindings(cell.text ?? '', data)}</div>)}</div>)}
      </div>;
    default:
      return <div className="flex h-full items-center justify-center border border-red-300 bg-red-50 text-xs text-red-600">Unsupported: {element.type}</div>;
  }
}

export function ElementView({ element }: ElementViewProps) {
  const selectedElementId = useDesignerStore((state) => state.selectedElementId);
  const selectElement = useDesignerStore((state) => state.selectElement);
  const moveElement = useDesignerStore((state) => state.moveElement);
  const resizeElement = useDesignerStore((state) => state.resizeElement);
  const data = useDesignerStore((state) => state.template.data ?? {});

  if (element.hidden || !isAbsoluteElement(element)) return null;
  const selected = selectedElementId === element.id;

  return (
    <Rnd
      bounds="parent"
      size={{ width: ptToPx(element.width), height: ptToPx(element.height) }}
      position={{ x: ptToPx(element.x), y: ptToPx(element.y) }}
      scale={CANVAS_ZOOM}
      minWidth={4}
      minHeight={4}
      disableDragging={element.locked}
      enableResizing={!element.locked}
      onMouseDown={(event) => { event.stopPropagation(); selectElement(element.id); }}
      onDragStop={(_event, data) => moveElement(element.id, pxToPt(data.x), pxToPt(data.y))}
      onResizeStop={(_event, _direction, ref, _delta, position) => resizeElement(element.id, pxToPt(ref.offsetWidth), pxToPt(ref.offsetHeight), pxToPt(position.x), pxToPt(position.y))}
      className={selected ? 'outline outline-2 outline-offset-1 outline-blue-500' : 'hover:outline hover:outline-1 hover:outline-blue-300'}
    >
      {renderContent(element, data)}
    </Rnd>
  );
}
