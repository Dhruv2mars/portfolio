/**
 * Command menu open-state — module-level pub/sub so the header trigger
 * and the mounted menu share one store without a context tree.
 */
let open = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function setCommandMenuOpen(value: boolean) {
  if (open === value) return;
  open = value;
  emit();
}

export function toggleCommandMenu() {
  setCommandMenuOpen(!open);
}

export function subscribeCommandMenu(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getCommandMenuOpen(): boolean {
  return open;
}
