import { z } from 'zod';

const hexColor = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Use a valid hex color, e.g. #111827');
const spacingSchema = z.union([z.number(), z.object({ top: z.number().optional(), right: z.number().optional(), bottom: z.number().optional(), left: z.number().optional() })]);
const styleSchema = z.object({
  fontSize: z.number().positive().optional(),
  fontWeight: z.enum(['normal', 'bold']).optional(),
  color: hexColor.optional(),
  background: hexColor.optional(),
  padding: spacingSchema.optional(),
  margin: spacingSchema.optional(),
  border: z.object({ width: z.number().nonnegative().optional(), color: hexColor.optional(), radius: z.number().nonnegative().optional() }).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  verticalAlign: z.enum(['top', 'middle', 'bottom']).optional()
});

const absolutePlacement = { x: z.number(), y: z.number(), width: z.number().positive(), height: z.number().positive(), page: z.number().int().positive().optional() };
const baseElement = { id: z.string().min(1), name: z.string().optional(), locked: z.boolean().optional(), hidden: z.boolean().optional(), style: styleSchema.optional() };

export const elementSchema: z.ZodTypeAny = z.lazy(() => z.discriminatedUnion('type', [
  z.object({ ...baseElement, ...absolutePlacement, type: z.literal('text'), text: z.string() }),
  z.object({ ...baseElement, ...absolutePlacement, type: z.literal('box') }),
  z.object({ ...baseElement, ...absolutePlacement, type: z.literal('line'), orientation: z.enum(['horizontal', 'vertical']) }),
  z.object({ ...baseElement, ...absolutePlacement, type: z.literal('image'), src: z.string().optional(), fit: z.enum(['contain', 'cover', 'fill']).optional() }),
  z.object({ ...baseElement, ...absolutePlacement, type: z.literal('table'), repeatHeader: z.boolean().optional(), dataBinding: z.string().optional(), columns: z.array(z.object({ id: z.string().min(1), title: z.string(), width: z.union([z.literal('relative'), z.number().positive()]), binding: z.string().optional() })), rows: z.array(z.object({ id: z.string().min(1), cells: z.array(z.object({ id: z.string().min(1), text: z.string().optional(), binding: z.string().optional(), colSpan: z.number().optional(), rowSpan: z.number().optional(), style: styleSchema.optional() })) })) }),
  z.object({ ...baseElement, type: z.literal('container'), children: z.array(elementSchema) }),
  z.object({ ...baseElement, type: z.literal('row'), children: z.array(elementSchema) }),
  z.object({ ...baseElement, type: z.literal('column'), children: z.array(elementSchema) }),
  z.object({ ...baseElement, ...absolutePlacement, type: z.literal('absolute'), children: z.array(elementSchema) })
]));

export const documentSchemaValidator = z.object({
  version: z.string().min(1),
  name: z.string().min(1),
  pageCount: z.number().int().positive(),
  mode: z.enum(['absolute', 'flow', 'mixed']),
  page: z.object({ size: z.enum(['Letter', 'A4']), width: z.number().positive(), height: z.number().positive(), margin: spacingSchema, unit: z.enum(['pt', 'px']) }),
  elements: z.array(elementSchema),
  data: z.record(z.string(), z.unknown()).optional(),
  styles: z.record(z.string(), styleSchema).optional()
}).superRefine((doc, ctx) => {
  const ids = new Set<string>();
  const visit = (items: Array<{ id: string; children?: unknown }>) => items.forEach((node) => {
    if (ids.has(node.id)) ctx.addIssue({ code: 'custom', message: `Duplicate element id: ${node.id}`, path: ['elements'] });
    ids.add(node.id);
    if (Array.isArray(node.children)) visit(node.children as Array<{ id: string; children?: unknown }>);
  });
  const elements = doc.elements as Array<{ page?: number | null; id: string; children?: unknown }>;
  visit(elements);
  elements.forEach((element, index) => {
    if ('page' in element && element.page != null && element.page > doc.pageCount) {
      ctx.addIssue({ code: 'custom', message: `Element page ${element.page} exceeds pageCount ${doc.pageCount}`, path: ['elements', index, 'page'] });
    }
  });
});

export const validateDocument = (template: unknown) => documentSchemaValidator.safeParse(template);
