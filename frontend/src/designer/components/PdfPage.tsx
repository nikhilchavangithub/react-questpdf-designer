import { useState, type DragEvent } from 'react';
import { useDesignerStore } from '../store/designerStore';
import { ptToPx, pxToPt } from '../utils/units';
import { ElementView } from './ElementView';

type PdfPageProps = { pageNumber: number };

export function PdfPage({ pageNumber }: PdfPageProps) {
  const template = useDesignerStore((state) => state.template);
  const addElement = useDesignerStore((state) => state.addElement);
  const selectElement = useDesignerStore((state) => state.selectElement);
  const selectedPage = useDesignerStore((state) => state.selectedPage);
  const setSelectedPage = useDesignerStore((state) => state.setSelectedPage);
  const [dropActive, setDropActive] = useState(false);
  const pageElements = template.elements.filter((element) => ('page' in element ? (element.page ?? 1) : 1) === pageNumber);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropActive(false);
    const type = event.dataTransfer.getData('application/pdf-designer-element');
    if (!type) return;
    const rect = event.currentTarget.getBoundingClientRect();
    addElement(type as 'text' | 'box' | 'line' | 'image' | 'table', {
      page: pageNumber,
      x: pxToPt(event.clientX - rect.left),
      y: pxToPt(event.clientY - rect.top)
    });
    setSelectedPage(pageNumber);
  };

  return (
    <div
      className={`relative overflow-hidden bg-white shadow-2xl ring-1 ${selectedPage === pageNumber ? 'ring-blue-400' : 'ring-slate-300'}`}
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
      }}
      onDragLeave={() => setDropActive(false)}
      onDrop={handleDrop}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:17px_17px] opacity-30" />
      <div className="absolute left-3 top-3 rounded-full bg-slate-900/85 px-2 py-1 text-[11px] font-semibold text-white">Page {pageNumber}</div>
      {dropActive ? <div className="pointer-events-none absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-100/40" /> : null}
      {pageElements.map((element) => <ElementView key={element.id} element={element} />)}
    </div>
  );
}
