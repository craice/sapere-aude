type Child = Node | string;

interface Props {
  className?: string;
  text?: string;
  attrs?: Record<string, string>;
}

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, props: Props = {}, children: Child[] = []): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props.className) el.className = props.className;
  if (props.text !== undefined) el.textContent = props.text;
  for (const [name, value] of Object.entries(props.attrs ?? {})) el.setAttribute(name, value);
  el.append(...children);
  return el;
}

export function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Pausa de apresentação. Vira zero com movimento reduzido. Nunca usada para falhar por tempo. */
export function wait(ms: number): Promise<void> {
  if (prefersReducedMotion()) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}
