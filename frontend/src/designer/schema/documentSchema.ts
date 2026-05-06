export const ELEMENT_TYPES = {
  text: 'text',
  box: 'box',
  line: 'line',
  image: 'image',
  table: 'table',
  container: 'container',
  row: 'row',
  column: 'column',
  absolute: 'absolute'
} as const;

export type DocumentSchema = {
  version: string;
  name: string;
  page: PageSettings;
  pageCount: number;
  mode: 'absolute' | 'flow' | 'mixed';
  elements: ElementNode[];
  data?: Record<string, unknown>;
  styles?: Record<string, StyleDefinition>;
};

export type PageSettings = {
  size: 'Letter' | 'A4';
  width: number;
  height: number;
  margin: Spacing;
  unit: 'pt' | 'px';
};

export type Spacing = number | { top?: number; right?: number; bottom?: number; left?: number };

export type ElementNode =
  | TextElement
  | BoxElement
  | LineElement
  | ImageElement
  | TableElement
  | ContainerElement
  | RowElement
  | ColumnElement
  | AbsoluteElement;

export type BaseElement = {
  id: string;
  name?: string;
  type: string;
  locked?: boolean;
  hidden?: boolean;
  style?: StyleDefinition;
  binding?: BindingDefinition;
  visibleWhen?: VisibilityRule;
};

export type AbsolutePlacement = { x: number; y: number; width: number; height: number; page?: number };
export type TextElement = BaseElement & AbsolutePlacement & { type: 'text'; text: string };
export type BoxElement = BaseElement & AbsolutePlacement & { type: 'box' };
export type LineElement = BaseElement & AbsolutePlacement & { type: 'line'; orientation: 'horizontal' | 'vertical' };
export type ImageElement = BaseElement & AbsolutePlacement & { type: 'image'; src?: string; fit?: 'contain' | 'cover' | 'fill' };
export type TableElement = BaseElement & AbsolutePlacement & { type: 'table'; columns: TableColumn[]; rows: TableRow[]; repeatHeader?: boolean; dataBinding?: string };
export type ContainerElement = BaseElement & { type: 'container'; children: ElementNode[] };
export type RowElement = BaseElement & { type: 'row'; children: ElementNode[] };
export type ColumnElement = BaseElement & { type: 'column'; children: ElementNode[] };
export type AbsoluteElement = BaseElement & AbsolutePlacement & { type: 'absolute'; children: ElementNode[] };

export type TableColumn = { id: string; title: string; width: 'relative' | number; binding?: string };
export type TableRow = { id: string; cells: TableCell[] };
export type TableCell = { id: string; text?: string; binding?: string; colSpan?: number; rowSpan?: number; style?: StyleDefinition };
export type BindingDefinition = { path?: string; format?: string };
export type VisibilityRule = { expression: string };
export type StyleDefinition = { fontSize?: number; fontWeight?: 'normal' | 'bold'; color?: string; background?: string; padding?: Spacing; margin?: Spacing; border?: BorderDefinition; align?: 'left' | 'center' | 'right'; verticalAlign?: 'top' | 'middle' | 'bottom' };
export type BorderDefinition = { width?: number; color?: string; radius?: number };

export type AbsoluteElementNode = Extract<ElementNode, AbsolutePlacement>;
export const isAbsoluteElement = (node: ElementNode): node is AbsoluteElementNode =>
  'x' in node && 'y' in node && 'width' in node && 'height' in node;
