import { useDesignerStore } from '../store/designerStore';
import { CANVAS_ZOOM, ptToPx } from '../utils/units';
import { PdfPage } from './PdfPage';

export function PdfCanvas() {
  const template = useDesignerStore((state) => state.template);
  const selectedPage = useDesignerStore((state) => state.selectedPage);
  const pages = Array.from({ length: template.pageCount }, (_value, index) => index + 1);

  return (
    <div className="flex min-h-full justify-center">
      <div>
        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <span>Designer preview · {Math.round(CANVAS_ZOOM * 100)}% · point-based coordinates</span>
          <span>{template.mode} mode · Page {selectedPage} of {template.pageCount}</span>
        </div>
        <div className="space-y-6 rounded-xl bg-slate-300 p-4 shadow-inner" style={{ width: ptToPx(template.page.width) + 32 }}>
          {pages.map((pageNumber) => <PdfPage key={pageNumber} pageNumber={pageNumber} />)}
        </div>
      </div>
    </div>
  );
}
