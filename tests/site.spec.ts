import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vercelConfig from '../vercel.json' with { type: 'json' };

const routes = ['/', '/architecture/villa-ke', '/editions/chaise-1989'];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { cspViolations?: string[] }).cspViolations = [];
    document.addEventListener('securitypolicyviolation', event => {
      (window as Window & { cspViolations?: string[] }).cspViolations!.push(`${event.disposition}: ${event.effectiveDirective} ${event.blockedURI}`);
    });
  });
});

test.afterEach(async ({ page }) => {
  if (!page.isClosed()) {
    expect(await page.evaluate(() => (window as Window & { cspViolations?: string[] }).cspViolations ?? []), 'Aucune violation de la CSP sur la page').toEqual([]);
  }
});

test('les trois pages restent lisibles aux sept largeurs et ne chargent aucun tiers', async ({ page, baseURL }) => {
  const externalRequests: string[] = [];
  const pageErrors: string[] = [];
  await mkdir('test-results/captures', { recursive: true });
  page.on('request', request => { if (new URL(request.url()).origin !== new URL(baseURL!).origin) externalRequests.push(request.url()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  for (const route of routes) {
    for (const width of [320, 360, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      const tooSmall = await page.locator('p, span, a, button, dt, dd, figcaption, .concept-banner').evaluateAll(elements => elements.filter(el => el.getClientRects().length && !el.closest('.sr-only') && el.childElementCount === 0 && el.textContent?.trim() && parseFloat(getComputedStyle(el).fontSize) < 11).map(el => ({ text: el.textContent, size: getComputedStyle(el).fontSize })));
      expect(tooSmall, `${route} à ${width}px : textes de moins de 11px`).toEqual([]);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
      await expect(page).toHaveTitle(/Concept non officiel par Devzair/);
      const overflow = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
      expect(overflow.document, `${route} à ${width}px`).toBeLessThanOrEqual(overflow.viewport);
      const headings = await page.locator('h1, h2, h3').evaluateAll(elements => elements.filter(el => el.getClientRects().length).map(el => ({ text: el.textContent, left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right })));
      expect(headings.filter(h => h.left < -1 || h.right > width + 1), `${route} à ${width}px : titres masqués`).toEqual([]);
      const overlappingCards = await page.locator('.project-card').evaluateAll(elements => {
        const boxes = elements.filter(el => el.getClientRects().length).map(el => el.getBoundingClientRect());
        return boxes.flatMap((a, i) => boxes.slice(i + 1).filter(b => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1).map(() => i));
      });
      expect(overlappingCards, `${route} à ${width}px : cartes superposées`).toEqual([]);
      await page.evaluate(async () => {
        document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
        await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
      });
      expect(await page.locator('img[src]').evaluateAll(imgs => imgs.filter(img => !(img as HTMLImageElement).naturalWidth).map(img => (img as HTMLImageElement).src))).toEqual([]);
      if (width === 390 || width === 1440) {
        const slug = route === '/' ? 'accueil' : route.split('/').pop();
        await page.waitForLoadState('networkidle');
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
            window.scrollTo({ top: y, behavior: 'instant' });
            await new Promise(resolve => setTimeout(resolve, 45));
          }
          window.scrollTo({ top: 0, behavior: 'instant' });
          return new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        });
        await page.screenshot({ path: `test-results/captures/${slug}-${width}.png`, fullPage: true });
      }
    }
  }
  expect(pageErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test('les six illustrations servies correspondent aux originaux du projet', async ({ request }) => {
  for (const name of ['chair', 'chair-interior', 'collection', 'table', 'landscape', 'facade']) {
    const path = `/illustrations/${name}.svg`;
    const original = await readFile(new URL(`../public${path}`, import.meta.url));
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const hash = (body: Buffer) => createHash('sha256').update(body).digest('hex');
    expect(hash(await response.body()), path).toBe(hash(original));
  }
});

test('les métadonnées et les protections HTTP correspondent au déploiement prévu', async ({ page }) => {
  const titles: string[] = [];
  const descriptions: string[] = [];
  for (const route of routes) {
    const response = await page.goto(route);
    const headers = await response!.allHeaders();
    const expected = Object.fromEntries(vercelConfig.headers.flatMap(rule => rule.headers.map(header => [header.key.toLowerCase(), header.value])));
    if (process.env.STANDARD_CSP_MODE === 'enforce') {
      expected['content-security-policy'] = expected['content-security-policy-report-only'];
      delete expected['content-security-policy-report-only'];
    }
    for (const [key, value] of Object.entries(expected)) expect(headers[key], `${route}: ${key}`).toBe(value);
    const canonical = `https://concept-standard.vercel.app${route}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://concept-standard.vercel.app/og-concept.png');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Concept non officiel/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
    titles.push(await page.title());
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    descriptions.push(description!);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!);
    expect(await page.locator('script:not([src]), style, [style], [onclick]').count(), 'Pas de script, style ou gestionnaire inline').toBe(0);
  }
  expect(new Set(titles).size).toBe(3);
  expect(new Set(descriptions).size).toBe(3);
});

test('les repères de Villa KE gardent un contraste minimum de 4,5:1', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/architecture/villa-ke');
    const colors = await page.locator('.arch-over-top > span').last().evaluate(el => {
      const style = getComputedStyle(el);
      return { text: style.color, background: style.backgroundColor, size: parseFloat(style.fontSize) };
    });
    const luminance = (color: string) => {
      const rgb = color.match(/[\d.]+/g)!.map(Number);
      const linear = rgb.slice(0, 3).map(value => { const x = value / 255; return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; });
      return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
    };
    expect(colors.background).toBe('rgb(20, 21, 18)');
    const [light, dark] = [luminance(colors.text), luminance(colors.background)].sort((a, b) => b - a);
    expect((light + .05) / (dark + .05)).toBeGreaterThanOrEqual(4.5);
    expect(colors.size).toBeGreaterThanOrEqual(11);
  }
});

test('la commutation des univers et les filtres conservent de vrais liens', async ({ page, baseURL }) => {
  await page.goto('/');
  await page.locator('[data-mode="architecture"]').click();
  await expect(page.locator('[data-hero-name]')).toHaveText('Atelier');
  await expect(page.locator('[data-hero-link]')).toHaveAttribute('href', '/architecture/villa-ke');
  await expect(page.locator('[data-mode="architecture"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-mode="editions"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-hero-name]')).toHaveText('Nouveau');
  await page.locator('[data-filter="architecture"]').click();
  await expect(page.locator('.project-card:visible')).toHaveCount(2);
  await expect(page.locator('.filter-count')).toHaveText('02 créations');
  await page.locator('[data-filter="all"]').click();
  await expect(page.locator('.project-card:visible')).toHaveCount(4);
  await page.locator('.project-card a[href="/architecture/villa-ke"]').click();
  await expect(page).toHaveURL(/architecture\/villa-ke$/);
  await page.locator('.desktop-nav a[href="/editions/chaise-1989"]').click();
  await expect(page).toHaveURL(/editions\/chaise-1989$/);
  await page.locator('.header-inner .site-logo').click();
  await expect(page).toHaveURL(new URL('/', baseURL).href);
  await page.locator('[data-filter="editions"]').click();
  await expect(page.locator('.project-card:visible')).toHaveCount(2);
  await page.locator('.project-card a[href="/editions/chaise-1989"]').click();
  await expect(page).toHaveURL(/editions\/chaise-1989$/);
});

test('le menu mobile répond au clavier, à Échap et à la navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.menu-toggle');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(page.locator('#mobile-menu a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await page.locator('#mobile-menu a[href="/architecture/villa-ke"]').click();
  await expect(page).toHaveURL(/architecture\/villa-ke$/);
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  await page.locator('.menu-toggle').click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('#mobile-menu')).toBeHidden();
});

test('la galerie, les miniatures et la lightbox sont utilisables au clavier', async ({ page }) => {
  await page.goto('/editions/chaise-1989');
  const gallery = page.locator('[data-gallery]');
  await expect(gallery.locator('[data-slide-panel]:visible')).toHaveCount(1);
  await gallery.locator('[data-next]').click();
  await expect(gallery.locator('[data-gallery-counter]')).toHaveText('02 / 03');
  await gallery.locator('[data-prev]').click();
  await expect(gallery.locator('[data-gallery-counter]')).toHaveText('01 / 03');
  await gallery.locator('[data-slide="2"]').click();
  await expect(gallery.locator('[data-gallery-title]')).toHaveText('Un ensemble.');
  await page.keyboard.press('ArrowRight');
  await expect(gallery.locator('[data-gallery-counter]')).toHaveText('01 / 03');
  const zoom = gallery.locator('[data-slide-panel]:visible [data-lightbox]');
  await zoom.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Fermer le visuel agrandi' })).toBeFocused();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(zoom).toBeFocused();
  await page.locator('.header-inner .site-logo').focus();
  await page.keyboard.press('ArrowRight');
  await expect(gallery.locator('[data-gallery-counter]')).toHaveText('01 / 03');
  await page.goto('/architecture/villa-ke');
  await page.locator('[data-lightbox]').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Fermer le visuel agrandi' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('les pages passent les contrôles automatiques WCAG AA sur mobile et desktop', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), `${route} à ${width}px`).toEqual([]);
    }
  }
});

test('le contenu reste navigable sans JavaScript et respecte les mouvements réduits', async ({ browser, page, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noJSPage = await context.newPage();
  for (const route of routes) {
    await noJSPage.goto(route);
    await expect(noJSPage.locator('#mobile-menu a[href="/"]')).toBeVisible();
    await expect(noJSPage.locator('h1')).toBeVisible();
  }
  await expect(noJSPage.locator('[data-slide-panel]')).toHaveCount(3);
  for (const panel of await noJSPage.locator('[data-slide-panel]').all()) await expect(panel).toBeVisible();
  await noJSPage.locator('#mobile-menu a[href="/architecture/villa-ke"]').click();
  await expect(noJSPage).toHaveURL(/architecture\/villa-ke$/);
  await context.close();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  expect(await page.locator('.hero-art img').first().evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
});

test('un visuel absent reçoit un secours lisible et les liens externes sont identifiés', async ({ page }) => {
  await page.goto('/editions/chaise-1989');
  await page.locator('.object-hero-art img').evaluate(img => { (img as HTMLImageElement).src = '/visuel-inexistant.jpg'; });
  await expect(page.locator('.object-hero-art img')).toHaveAttribute('src', '/illustrations/chair.svg');
  await expect(page.locator('.object-hero-art [data-media-note]')).toContainText('Visuel indisponible');
  for (const route of routes) {
    await page.goto(route);
    const unsafe = await page.locator('a[target="_blank"]').evaluateAll(links => links.filter(link => !link.getAttribute('rel')?.includes('noopener') || !link.textContent?.match(/officiel|catalogue/)).map(link => link.getAttribute('href')));
    expect(unsafe).toEqual([]);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  }
});
