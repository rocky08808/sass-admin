// Opens every page of the production build in a real browser. Run after `npm run build`.
import { chromium } from 'playwright';
import { preview } from 'vite';

const pages = [
  { path: '/tenants', heading: '租户管理', text: '星河科技' },
  { path: '/subscriptions', heading: '订阅套餐', text: '专业版' },
  { path: '/members', heading: '成员管理', text: '林晓' },
];

const server = await preview({ preview: { port: 4180 } });
const baseUrl = server.resolvedUrls.local[0].replace(/\/$/, '');
let browser;
let failed = false;

try {
  browser = await chromium.launch();
  for (const { path, heading, text } of pages) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      await page.goto(`${baseUrl}${path}`);
      await page.getByRole('heading', { name: heading }).waitFor({ timeout: 15000 });
      await page.getByRole('cell', { name: text, exact: true }).waitFor({ timeout: 15000 });
      if (errors.length > 0) throw new Error('page error');
      console.log(`ok   ${path}`);
    } catch (error) {
      failed = true;
      console.error(`FAIL ${path}: ${errors[0] ?? error.message.split('\n')[0]}`);
    }
    await page.close();
  }
} finally {
  await browser?.close();
  await server.close();
}

process.exitCode = failed ? 1 : 0;
