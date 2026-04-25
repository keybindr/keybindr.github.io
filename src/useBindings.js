// Uses ASCII unit-separator (0x1F) so key IDs and modifier names (which never
// contain this character) can never collide across segment boundaries.
export function bindingId(key, modifiers) {
  return [key, ...(modifiers || []).slice().sort()].join('\x1F');
}
