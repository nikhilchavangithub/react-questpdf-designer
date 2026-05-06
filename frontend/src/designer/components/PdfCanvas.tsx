import { useDesignerStore } from '../store/designerStore';
import { CANVAS_ZOOM, ptToPx } from '../utils/units';
import { PdfPage } from './PdfPage';

export function PdfCanvas() {
  const template = useDesignerStore((state) => state.template);
  return (
    <div className="flex min-h-full justify-center">
      <div>
        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <span>Designer preview · {Math.round(CANVAS_ZOOM * 100)}% · point-based coordinates</span>
          <span>{template.mode} mode</span>
        </div>
        <div className="rounded-xl bg-slate-300 p-4 shadow-inner" style={{ width: ptToPx(template.page.width) + 32 }}>
          <PdfPage />
        </div>
      </div>
    </div>
  );
}
