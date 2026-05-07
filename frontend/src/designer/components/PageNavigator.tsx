import { useDesignerStore } from '../store/designerStore';

export function PageNavigator() {
  const pageCount = useDesignerStore((state) => state.template.pageCount);
  const selectedPage = useDesignerStore((state) => state.selectedPage);
  const selectedElementId = useDesignerStore((state) => state.selectedElementId);
  const setSelectedPage = useDesignerStore((state) => state.setSelectedPage);
  const addPage = useDesignerStore((state) => state.addPage);
  const pages = Array.from({ length: pageCount }, (_value, index) => index + 1);

  return (
    <section className="panel-section" aria-labelledby="page-navigator-title">
      <div className="section-heading-row">
        <div>
          <h2 id="page-navigator-title" className="section-eyebrow">Pages</h2>
          <p className="helper-text">Active page and element stay visible while you work.</p>
        </div>
        <button className="icon-button" type="button" onClick={addPage} aria-label="Add page">+</button>
      </div>
      <div className="page-list" role="list" aria-label="Document pages">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`page-pill ${selectedPage === pageNumber ? 'page-pill-active' : ''}`}
            onClick={() => setSelectedPage(pageNumber)}
            aria-current={selectedPage === pageNumber ? 'page' : undefined}
          >
            <span>Page {pageNumber}</span>
            {selectedPage === pageNumber ? <small>{selectedElementId ? 'Element selected' : 'No selection'}</small> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
