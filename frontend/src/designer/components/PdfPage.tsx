import { useState, type DragEvent } from 'react';
import { useDesignerStore } from '../store/designerStore';
import { ptToPx, pxToPt } from '../utils/units';
import { ElementView } from './ElementView';

type PdfPageProps = { pageNumber: number };
const GRID_SIZE_PT = 8;
const snap = (value: number) => Math.round(value / GRID_SIZE_PT) * GRID_SIZE_PT;

export function PdfPage({ pageNumber }: PdfPageProps) {
  const template = useDesignerStore((state) => state.template);
  const addElement = useDesignerStore((state) => state.addElement);
  const selectElement = useDesignerStore((state) => state.selectElement);
  const selectedPage = useDesignerStore((state) => state.selectedPage);
  const setSelectedPage = useDesignerStore((state) => state.setSelectedPage);
  const [dropActive, setDropActive] = useState(false);
  const [dropPoint, setDropPoint] = useState<{ x: number; y: number }>();
  const pageElements = template.elements.filter((element) => ('page' in element ? (element.page ?? 1) : 1) === pageNumber);

  const updateDropPoint = (event: DragEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropPoint({ x: snap(pxToPt(event.clientX - rect.left)), y: snap(pxToPt(event.clientY - rect.top)) });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropActive(false);
    const type = event.dataTransfer.getData('application/pdf-designer-element');
    if (!type) return;
    const rect = event.currentTarget.getBoundingClientRect();
    addElement(type as 'text' | 'box' | 'line' | 'image' | 'table', {
      page: pageNumber,
      x: snap(pxToPt(event.clientX - rect.left)),
      y: snap(pxToPt(event.clientY - rect.top))
    });
    setSelectedPage(pageNumber);
    setDropPoint(undefined);
  };

  return (
    <div
      className={`pdf-page ${selectedPage === pageNumber ? 'pdf-page-active' : ''}`}
      style={{ width: ptToPx(template.page.width), height: ptToPx(template.page.height) }}
      onMouseDown={() => {
        selectElement(undefined);
        setSelectedPage(pageNumber);
      }}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes('application/pdf-designer-element')) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        setDropActive(true);
        updateDropPoint(event);
      }}
      onDragLeave={() => {
        setDropActive(false);
        setDropPoint(undefined);
      }}
      onDrop={handleDrop}
    >
      <div className="page-grid" />
      <div className="page-badge">Page {pageNumber}</div>
      {dropActive ? (
        <div className="drop-preview">
          <span>Drop on grid{dropPoint ? ` · X ${dropPoint.x}pt Y ${dropPoint.y}pt` : ''}</span>
        </div>
      ) : null}
      {pageElements.map((element) => <ElementView key={element.id} element={element} />)}
    </div>
  );
}
