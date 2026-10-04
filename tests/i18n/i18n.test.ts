import { describe, it, expect } from 'vitest';
import { t, characterName } from '../../src/i18n';
import { CHARACTERS } from '../../src/tags/protocol';

describe('i18n', () => {
  it('traduz chaves simples', () => {
    expect(t('capitulo.continuar')).toBe('Continuar');
  });

  it('interpola variáveis', () => {
    expect(t('digitando', { nome: 'Bia' })).toBe('Bia está digitando…');
    expect(t('leitor.fichas', { n: 2 })).toBe('Fichas guardadas: 2');
  });

  it('mantém o marcador se a variável faltar', () => {
    expect(t('digitando')).toBe('{nome} está digitando…');
  });

  it('todo personagem do protocolo tem nome', () => {
    for (const id of CHARACTERS) expect(characterName(id)).not.toBe('');
  });
});
