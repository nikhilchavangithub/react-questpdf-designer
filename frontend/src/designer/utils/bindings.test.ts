import { describe, expect, it } from 'vitest';
import { resolveBindings } from './bindings';

describe('resolveBindings', () => {
  it('replaces handlebars style tokens from flat and nested data', () => {
    expect(resolveBindings('Client: {{ClientName}} / {{Claim.Code}}', { ClientName: 'John Doe', Claim: { Code: '97153' } })).toBe('Client: John Doe / 97153');
  });

  it('uses an empty string for missing values', () => {
    expect(resolveBindings('Missing: {{Missing}}', {})).toBe('Missing: ');
  });
});
