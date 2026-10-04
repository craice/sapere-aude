import { test, expect, type Page } from '@playwright/test';

const SAVE_KEY = 'sapere-aude:save:v1';

/** Espera o botão aceitar ativação (ver armButton) e toca nele, como uma pessoa faria. */
async function tocar(page: Page, name: string | RegExp) {
  const button = page.getByRole('button', { name });
  await expect(button).toHaveAttribute('data-pronto', '');
  await button.click();
}

/** Espera o botão focado ficar pronto e pressiona Enter. */
async function enter(page: Page, name: string) {
  const button = page.getByRole('button', { name });
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute('data-pronto', '');
  await page.keyboard.press('Enter');
}

async function continuar(page: Page, titulo: string) {
  await expect(page.getByRole('heading', { name: titulo })).toBeVisible();
  await tocar(page, 'Continuar');
}

async function configurarAceitandoTudo(page: Page) {
  await continuar(page, 'Configuração');
  await tocar(page, 'Sim, claro!');
  await tocar(page, 'Ótimo!');
  await expect(page.getByText('Pode deixar que eu penso nos detalhes.')).toBeVisible();
  await tocar(page, 'Continuar');
}

test('aceitar tudo: do início à tela final', async ({ page }) => {
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await continuar(page, 'Manhã');
  await expect(page.locator('.msg--bia').first()).toBeVisible();
  await tocar(page, 'Enviar a sugestão do Amparo');
  await expect(page.locator('.msg--eu')).toContainText('A prefeitura sabe o que faz');
  await expect(page.getByText('sei lá, achei que vc fosse ter uma opinião mais sua kkk')).toBeVisible();
  await tocar(page, 'Continuar');
  await expect(page.getByRole('heading', { name: 'Fim do capítulo 1' })).toBeVisible();
  await expect(page.getByText('Seu dia está 😊 tranquilo')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Recomeçar' })).toBeVisible();
});

test('o relógio só avança para a hora do capítulo seguinte depois da pausa de leitura', async ({ page }) => {
  await page.goto('./');
  await continuar(page, 'Configuração');
  await tocar(page, 'Sim, claro!');
  await tocar(page, 'Ótimo!');
  await expect(page.getByText('Pode deixar que eu penso nos detalhes.')).toBeVisible();
  await expect(page.locator('.status__relogio')).toHaveText('07:30');
  await tocar(page, 'Continuar');
  await expect(page.locator('.status__relogio')).toHaveText('07:42');
});

test('pensar: ler a matéria, coletar fichas e compor a resposta', async ({ page }) => {
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await continuar(page, 'Manhã');
  await tocar(page, 'Ler a matéria antes de responder');
  await expect(page.getByRole('heading', { name: 'Biblioteca do bairro deixará de abrir à noite' })).toBeVisible();
  await tocar(page, /R\$ 18 mil/);
  await tocar(page, /40% dos empréstimos/);
  await expect(page.getByText('Fichas guardadas: 2')).toBeVisible();
  await tocar(page, 'Responder à Bia com as minhas fichas');
  await tocar(page, 'O corte é um erro.');
  await expect(page.locator('.msg--eu')).toContainText('Li a matéria.');
  await expect(page.locator('.msg--eu')).toContainText('Acho que cortar é um erro.');
  await expect(page.getByText('Seu dia está 🙂 ok')).toBeVisible();
});

test('recarregar retoma no último capítulo alcançado', async ({ page }) => {
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await expect(page.getByRole('heading', { name: 'Manhã' })).toBeVisible();
  await page.reload();
  await continuar(page, 'Manhã');
  await expect(page.getByRole('button', { name: 'Enviar a sugestão do Amparo' })).toBeVisible();
});

test('save corrompido: começa do zero sem travar', async ({ page }) => {
  await page.addInitScript((key) => window.localStorage.setItem(key, '{lixo'), SAVE_KEY);
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Configuração' })).toBeVisible();
});

test('teclado: Continuar e a sugestão do Amparo já vêm focados', async ({ page }) => {
  await page.goto('./');
  await enter(page, 'Continuar');
  await enter(page, 'Sim, claro!');
  await expect(page.getByRole('button', { name: 'Ótimo!' })).toBeFocused();
});

test('Enter duplo não escolhe também a opção seguinte nem pula a pausa', async ({ page }) => {
  await page.goto('./');
  await enter(page, 'Continuar');
  await enter(page, 'Sim, claro!');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Perfeito! Deixa comigo. 😊')).toBeVisible();
  await expect(page.getByText('Combinado!')).toHaveCount(0);
});

test('segurar Enter (repetição de tecla) não atravessa as escolhas', async ({ page }) => {
  await page.goto('./');
  await enter(page, 'Continuar');
  const sim = page.getByRole('button', { name: 'Sim, claro!' });
  await expect(sim).toBeFocused();
  await expect(sim).toHaveAttribute('data-pronto', '');
  await page.keyboard.down('Enter');
  const otimo = page.getByRole('button', { name: 'Ótimo!' });
  await expect(otimo).toBeFocused();
  await expect(otimo).toHaveAttribute('data-pronto', '');
  await page.keyboard.down('Enter');
  await page.keyboard.up('Enter');
  await expect(page.getByText('Combinado!')).toHaveCount(0);
});

test('toque duplo numa escolha envia uma única mensagem', async ({ page }) => {
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await continuar(page, 'Manhã');
  const sugestao = page.getByRole('button', { name: 'Enviar a sugestão do Amparo' });
  await expect(sugestao).toHaveAttribute('data-pronto', '');
  await sugestao.dblclick();
  await expect(page.getByText('sei lá, achei que vc fosse ter uma opinião mais sua kkk')).toBeVisible();
  await expect(page.locator('.msg--eu')).toHaveCount(1);
  await tocar(page, 'Continuar');
  await expect(page.getByRole('heading', { name: 'Fim do capítulo 1' })).toBeVisible();
});

test('toque duplo em "Sim, claro!" não escolhe também a opção seguinte', async ({ page }) => {
  await page.goto('./');
  await continuar(page, 'Configuração');
  const sim = page.getByRole('button', { name: 'Sim, claro!' });
  await expect(sim).toHaveAttribute('data-pronto', '');
  await sim.dblclick();
  await expect(page.getByRole('button', { name: 'Ótimo!' })).toBeEnabled();
  await expect(page.getByText('Combinado!')).toHaveCount(0);
});

test('tela de 320 px não tem rolagem horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await continuar(page, 'Manhã');
  const larguraExtra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(larguraExtra).toBeLessThanOrEqual(0);
});
