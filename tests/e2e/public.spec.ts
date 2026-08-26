import { expect,test } from '@playwright/test';
import { examBank } from '../../seed/exam';

test('rutas educativas y arcade cargan',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'你最近怎么样？'})).toBeVisible();
  await page.goto('/lesson/1/vocabulary');
  await expect(page.getByRole('heading',{name:'Vocabulario auditable'})).toBeVisible();
  await page.goto('/lesson/1/games');
  await expect(page.getByRole('heading',{name:'28 formas de practicar'})).toBeVisible();
  await page.getByRole('button',{name:/Jugar/}).first().click();
  await expect(page.locator('#arena')).toContainText('Flashcards');
});

test('el flujo real 100/100 genera, almacena y descarga un PNG',async({page})=>{
  await page.goto('/signin-with-chatgpt?return_to=/lesson/1/exam');
  await page.waitForTimeout(800);
  await page.getByRole('button',{name:'Comenzar examen'}).click();
  await expect(page.locator('.exam-question')).toHaveCount(examBank.length);
  for(const question of examBank){
    const card=page.locator('.exam-question').filter({hasText:question.prompt});
    await expect(card).toHaveCount(1);
    if(question.options) await card.getByText(question.answer,{exact:true}).click();
    else await card.locator('input:not([type="radio"])').fill(question.answer);
  }
  await page.getByRole('button',{name:'Enviar examen'}).click();
  await expect(page.getByText('Certificado obtenido')).toBeVisible();
  const code=(await page.locator('.certificate-callout b').textContent())!;
  expect(code).toMatch(/^L1-[A-F0-9]{8}$/);
  const download=await page.request.get(`/api/certificates/${code}?file=1`);
  expect(download.ok()).toBe(true);
  const png=await download.body();
  expect(png.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(png.byteLength).toBeGreaterThan(10_000);
});
