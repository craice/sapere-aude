import { test, expect, type Page } from '@playwright/test';

const SAVE_KEY = 'sapere-aude:save:v1';

async function continuar(page: Page, titulo: string) {
  await expect(page.getByRole('heading', { name: titulo })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar' }).click();
}

async function configurarAceitandoTudo(page: Page) {
  await continuar(page, 'Configuração');
  await page.getByRole('button', { name: 'Sim, claro!' }).click();
  await page.getByRole('button', { name: 'Ótimo!' }).click();
  await expect(page.getByText('Pode deixar que eu penso nos detalhes.')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar' }).click();
}

test('aceitar tudo: do início à tela final', async ({ page }) => {
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await continuar(page, 'Manhã');
  await expect(page.locator('.msg--bia').first()).toBeVisible();
  await page.getByRole('button', { name: 'Enviar a sugestão do Amparo' }).click();
  await expect(page.locator('.msg--eu')).toContainText('A prefeitura sabe o que faz');
  await expect(page.getByText('sei lá, achei que vc fosse ter uma opinião mais sua kkk')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Fim do capítulo 1' })).toBeVisible();
  await expect(page.getByText('Seu dia está 😊 tranquilo')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Recomeçar' })).toBeVisible();
});

test('o relógio só avança para a hora do capítulo seguinte depois da pausa de leitura', async ({ page }) => {
  await page.goto('./');
  await continuar(page, 'Configuração');
  await page.getByRole('button', { name: 'Sim, claro!' }).click();
  await page.getByRole('button', { name: 'Ótimo!' }).click();
  await expect(page.getByText('Pode deixar que eu penso nos detalhes.')).toBeVisible();
  await expect(page.locator('.status__relogio')).toHaveText('07:30');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.locator('.status__relogio')).toHaveText('07:42');
});

test('pensar: ler a matéria, coletar fichas e compor a resposta', async ({ page }) => {
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await continuar(page, 'Manhã');
  await page.getByRole('button', { name: 'Ler a matéria antes de responder' }).click();
  await expect(page.getByRole('heading', { name: 'Biblioteca do bairro deixará de abrir à noite' })).toBeVisible();
  await page.getByRole('button', { name: /R\$ 18 mil/ }).click();
  await page.getByRole('button', { name: /40% dos empréstimos/ }).click();
  await expect(page.getByText('Fichas guardadas: 2')).toBeVisible();
  await page.getByRole('button', { name: 'Responder à Bia com as minhas fichas' }).click();
  await page.getByRole('button', { name: 'O corte é um erro.' }).click();
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
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Sim, claro!' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Ótimo!' })).toBeFocused();
});

test('toque duplo numa escolha envia uma única mensagem', async ({ page }) => {
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await continuar(page, 'Manhã');
  await page.getByRole('button', { name: 'Enviar a sugestão do Amparo' }).dblclick();
  await expect(page.getByText('sei lá, achei que vc fosse ter uma opinião mais sua kkk')).toBeVisible();
  await expect(page.locator('.msg--eu')).toHaveCount(1);
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Fim do capítulo 1' })).toBeVisible();
});

test('toque duplo em "Sim, claro!" não escolhe também a opção seguinte', async ({ page }) => {
  await page.goto('./');
  await continuar(page, 'Configuração');
  await page.getByRole('button', { name: 'Sim, claro!' }).dblclick();
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
