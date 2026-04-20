export function bindingId(key, modifiers) {
  return [key, ...(modifiers || []).slice().sort()].join('+');
}
