import { describe, it, expect } from 'vitest';
import { createAnalytics } from '../src/analytics';

function env(overrides: Partial<Parameters<typeof createAnalytics>[0]> = {}) {
  const sent: string[] = [];
  return { sent, env: { url: 'https://sapere.goatcounter.com', dev: false, doNotTrack: false, send: (src: string) => sent.push(src), ...overrides } };
}

describe('analytics', () => {
  it('envia o evento como pixel do GoatCounter, sem cookies', () => {
    const { sent, env: e } = env();
    createAnalytics(e).track('leu_kant');
    expect(sent).toHaveLength(1);
    const url = new URL(sent[0]!);
    expect(url.origin + url.pathname).toBe('https://sapere.goatcounter.com/count');
    expect(url.searchParams.get('p')).toBe('leu_kant');
    expect(url.searchParams.get('e')).toBe('true');
  });

  it.each([
    ['sem URL configurada', { url: '' }],
    ['URL indefinida', { url: undefined }],
    ['em desenvolvimento', { dev: true }],
    ['com Do Not Track', { doNotTrack: true }],
  ])('não envia nada %s', (_, overrides) => {
    const { sent, env: e } = env(overrides);
    createAnalytics(e).track('inicio');
    expect(sent).toEqual([]);
  });

  it('falha no envio nunca derruba o jogo', () => {
    const { env: e } = env({ send: () => { throw new Error('bloqueado'); } });
    expect(() => createAnalytics(e).track('inicio')).not.toThrow();
  });
});
