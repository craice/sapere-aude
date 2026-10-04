import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import trechos from '../../content/pt-BR/kant/trechos.json';

const texto = fs.readFileSync(fileURLToPath(new URL('../../content/pt-BR/kant/esclarecimento.md', import.meta.url)), 'utf8');
const normalizar = (s: string) => s.replace(/\*/g, '').replace(/\s+/g, ' ').trim();

describe('conteúdo de Kant', () => {
  it('tem trechos para os capítulos 1 a 4', () => {
    expect(Object.keys(trechos).sort()).toEqual(['cap1', 'cap2', 'cap3', 'cap4']);
  });

  it('todo fragmento dos cartões aparece literalmente na tradução completa', () => {
    const completo = normalizar(texto);
    for (const [cap, fragmentos] of Object.entries(trechos)) {
      expect(fragmentos.length, cap).toBeGreaterThan(0);
      for (const fragmento of fragmentos) expect(completo, `${cap}: ${fragmento}`).toContain(normalizar(fragmento));
    }
  });

  it('declara que a tradução é assistida por IA e pendente de revisão', () => {
    expect(texto).toMatch(/assistida por IA/);
    expect(texto).toMatch(/revisão/);
  });
});
