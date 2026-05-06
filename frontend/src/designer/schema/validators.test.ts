import { describe, expect, it } from 'vitest';
import { defaultTemplate } from './defaultTemplate';
import { validateDocument } from './validators';

describe('document schema validation', () => {
  it('accepts the default template', () => {
    expect(validateDocument(defaultTemplate).success).toBe(true);
  });

  it('rejects duplicate element ids', () => {
    const template = { ...defaultTemplate, elements: [defaultTemplate.elements[0], { ...defaultTemplate.elements[1], id: defaultTemplate.elements[0].id }] };
    const result = validateDocument(template);
    expect(result.success).toBe(false);
  });
});
