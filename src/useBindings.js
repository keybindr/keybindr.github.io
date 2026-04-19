import { useState, useEffect } from 'react';
import { DEFAULT_BINDINGS } from './defaultBindings';

const STORAGE_KEY = 'keybindr_bindings';

export function bindingId(key, modifiers) {
  return [key, ...(modifiers || []).slice().sort()].join('+');
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function save(bindings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bindings));
}

export function useBindings() {
  const [bindings, setBindings] = useState(() => load() ?? DEFAULT_BINDINGS);

  useEffect(() => {
    save(bindings);
  }, [bindings]);

  function addOrUpdate(key, modifiers, action) {
    const id = bindingId(key, modifiers);
    setBindings(prev => {
      const filtered = prev.filter(b => bindingId(b.key, b.modifiers) !== id);
      return [...filtered, { key, modifiers: modifiers.slice().sort(), action }];
    });
  }

  function remove(key, modifiers) {
    const id = bindingId(key, modifiers);
    setBindings(prev => prev.filter(b => bindingId(b.key, b.modifiers) !== id));
  }

  function updateAction(key, modifiers, action) {
    const id = bindingId(key, modifiers);
    setBindings(prev =>
      prev.map(b => bindingId(b.key, b.modifiers) === id ? { ...b, action } : b)
    );
  }

  function replaceBindings(newBindings) {
    setBindings(newBindings);
  }

  function resetBindings() {
    localStorage.removeItem(STORAGE_KEY);
    setBindings(DEFAULT_BINDINGS);
  }

  function hasConflict(key, modifiers, excludeId = null) {
    const id = bindingId(key, modifiers);
    return bindings.some(b => {
      const bid = bindingId(b.key, b.modifiers);
      return bid === id && bid !== excludeId;
    });
  }

  return { bindings, addOrUpdate, remove, updateAction, hasConflict, replaceBindings, resetBindings };
}
