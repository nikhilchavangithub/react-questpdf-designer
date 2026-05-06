export function resolveBindings(input: string, data: Record<string, unknown> = {}) {
  return input.replace(/{{\s*([\w.]+)\s*}}/g, (_match, path: string) => {
    const value = path.split('.').reduce<unknown>((current, segment) => {
      if (current && typeof current === 'object' && segment in current) {
        return (current as Record<string, unknown>)[segment];
      }
      return undefined;
    }, data);
    return value == null ? '' : String(value);
  });
}
