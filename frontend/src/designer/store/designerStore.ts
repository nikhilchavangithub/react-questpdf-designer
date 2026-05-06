import { create } from 'zustand';
import { defaultTemplate } from '../schema/defaultTemplate';
import { ELEMENT_TYPES, isAbsoluteElement, type DocumentSchema, type ElementNode, type StyleDefinition } from '../schema/documentSchema';

type NewElementType = 'text' | 'box' | 'line' | 'image' | 'table';
type ElementPatch = Partial<ElementNode> & { style?: StyleDefinition };

type DesignerState = {
  template: DocumentSchema;
  selectedElementId?: string;
  addElement: (type: NewElementType) => void;
  updateElement: (id: string, patch: ElementPatch) => void;
  deleteElement: (id: string) => void;
  selectElement: (id?: string) => void;
  duplicateElement: (id: string) => void;
  moveElement: (id: string, x: number, y: number) => void;
  resizeElement: (id: string, width: number, height: number, x?: number, y?: number) => void;
  setTemplate: (template: DocumentSchema) => void;
  resetTemplate: () => void;
};

const cloneTemplate = () => structuredClone(defaultTemplate);
const createId = (type: string) => `${type}-${crypto.randomUUID?.() ?? Date.now().toString(36)}`;

function createElement(type: NewElementType, index: number): ElementNode {
  const base = { id: createId(type), x: 72 + index * 8, y: 180 + index * 8, width: 180, height: 36, style: { fontSize: 11, color: '#111827' } };
  switch (type) {
    case ELEMENT_TYPES.text:
      return { ...base, type, text: 'New text' };
    case ELEMENT_TYPES.box:
      return { ...base, type, width: 180, height: 80, style: { background: '#FFFFFF', border: { width: 1, color: '#94A3B8', radius: 4 } } };
    case ELEMENT_TYPES.line:
      return { ...base, type, width: 180, height: 1, orientation: 'horizontal', style: { border: { width: 1, color: '#111827' } } };
    case ELEMENT_TYPES.image:
      return { ...base, type, width: 160, height: 100, fit: 'contain', style: { background: '#EEF2FF', border: { width: 1, color: '#818CF8' } } };
    case ELEMENT_TYPES.table:
      return { ...base, type, width: 360, height: 120, columns: [{ id: createId('col'), title: 'Code', width: 'relative' }, { id: createId('col'), title: 'Units', width: 'relative' }, { id: createId('col'), title: 'Amount', width: 'relative' }], rows: [{ id: createId('row'), cells: [{ id: createId('cell'), text: '97153' }, { id: createId('cell'), text: '8' }, { id: createId('cell'), text: '$120.00' }] }], style: { border: { width: 1, color: '#CBD5E1' }, fontSize: 10, color: '#111827' } };
  }
}

function updateElements(elements: ElementNode[], id: string, updater: (node: ElementNode) => ElementNode): ElementNode[] {
  return elements.map((node) => {
    if (node.id === id) return updater(node);
    if ('children' in node) return { ...node, children: updateElements(node.children, id, updater) } as ElementNode;
    return node;
  });
}

function removeElement(elements: ElementNode[], id: string): ElementNode[] {
  return elements.filter((node) => node.id !== id).map((node) => ('children' in node ? ({ ...node, children: removeElement(node.children, id) } as ElementNode) : node));
}

function findElement(elements: ElementNode[], id: string): ElementNode | undefined {
  for (const node of elements) {
    if (node.id === id) return node;
    if ('children' in node) {
      const child = findElement(node.children, id);
      if (child) return child;
    }
  }
}

export const useDesignerStore = create<DesignerState>((set, get) => ({
  template: cloneTemplate(),
  selectedElementId: 'title',
  addElement: (type) => set((state) => {
    const element = createElement(type, state.template.elements.length);
    return { template: { ...state.template, elements: [...state.template.elements, element] }, selectedElementId: element.id };
  }),
  updateElement: (id, patch) => set((state) => ({ template: { ...state.template, elements: updateElements(state.template.elements, id, (node) => ({ ...node, ...patch } as ElementNode)) } })),
  deleteElement: (id) => set((state) => ({ template: { ...state.template, elements: removeElement(state.template.elements, id) }, selectedElementId: state.selectedElementId === id ? undefined : state.selectedElementId })),
  selectElement: (id) => set({ selectedElementId: id }),
  duplicateElement: (id) => set((state) => {
    const source = findElement(state.template.elements, id);
    if (!source) return state;
    const copy = structuredClone(source) as ElementNode;
    copy.id = createId(source.type);
    if (isAbsoluteElement(copy)) {
      copy.x += 16;
      copy.y += 16;
    }
    return { template: { ...state.template, elements: [...state.template.elements, copy] }, selectedElementId: copy.id };
  }),
  moveElement: (id, x, y) => get().updateElement(id, { x, y } as ElementPatch),
  resizeElement: (id, width, height, x, y) => get().updateElement(id, { width, height, ...(x !== undefined ? { x } : {}), ...(y !== undefined ? { y } : {}) } as ElementPatch),
  setTemplate: (template) => set({ template, selectedElementId: template.elements[0]?.id }),
  resetTemplate: () => set({ template: cloneTemplate(), selectedElementId: 'title' })
}));

export const getSelectedElement = (template: DocumentSchema, selectedElementId?: string) => selectedElementId ? findElement(template.elements, selectedElementId) : undefined;
