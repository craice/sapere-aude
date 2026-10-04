export type ComfortKey = 'conforto.tranquilo' | 'conforto.ok' | 'conforto.agitado';

/** Traduz a variável Ink `conforto` (0–100) no estado mostrado pelo widget do Amparo. */
export function comfortKey(value: number): ComfortKey {
  if (value >= 70) return 'conforto.tranquilo';
  if (value >= 40) return 'conforto.ok';
  return 'conforto.agitado';
}
