import { useDesignerStore } from '../store/designerStore';
import { ptToPx } from '../utils/units';
import { ElementView } from './ElementView';

export function PdfPage() {
  const template = useDesignerStore((state) => state.template);
  const selectElement = useDesignerStore((state) => state.selectElement);
  return (
    <div className="relative overflow-hidden bg-white shadow-2xl ring-1 ring-slate-300" style={{ width: ptToPx(template.page.width), height: ptToPx(template.page.height) }} onMouseDown={() => selectElement(undefined)}>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:17px_17px] opacity-30" />
      {template.elements.map((element) => <ElementView key={element.id} element={element} />)}
    </div>
  );
}
