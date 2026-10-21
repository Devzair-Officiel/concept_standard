// Read-only checks after an explicitly authorized deployment. Never deploys.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const target = new URL(process.argv[2] || 'https://concept-standard.vercel.app');
if (!['https:', 'http:'].includes(target.protocol)) throw new Error('URL HTTP(S) requise.');
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const expectedHeaders = config.headers.flatMap(rule => rule.headers);
const errors = [];
const results = [];
const request = async path => fetch(new URL(path, target), { signal: AbortSignal.timeout(25000) });
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
const metadata = html => {
  const tags = [...html.matchAll(/<meta\b[^>]*>/g)].map(match => attributes(match[0]));
  const link = [...html.matchAll(/<link\b[^>]*>/g)].map(match => attributes(match[0])).find(tag => tag.rel === 'canonical');
  const keys = ['description', 'robots', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'og:image:width', 'og:image:height'];
  return { title: html.match(/<title>([^<]*)<\/title>/)?.[1], canonical: link?.href, ...Object.fromEntries(keys.map(key => [key, tags.find(tag => tag.name === key || tag.property === key)?.content])) };
};
const fail = (path, message) => errors.push({ path, message });
const titles = [], descriptions = [];
for (const path of ['/', '/architecture/villa-ke', '/editions/chaise-1989']) {
  try {
    const response = await request(path);
    if (response.status !== 200) fail(path, `HTTP ${response.status}`);
    if (target.protocol === 'https:' && !/max-age=[1-9]\d*/i.test(response.headers.get('strict-transport-security') || '')) fail(path, 'HSTS absent ou sans durée positive.');
    const html = await response.text();
    const original = await readFile(new URL(`../dist/${path === '/' ? '' : path.slice(1) + '/'}index.html`, import.meta.url), 'utf8');
    const actual = metadata(html), expected = metadata(original);
    for (const [key, value] of Object.entries(expected)) {
      if (!value || actual[key] !== value) fail(path, `Métadonnée ${key} différente du build local.`);
    }
    if (actual.robots !== 'noindex,nofollow') fail(path, 'noindex,nofollow manquant.');
    for (const { key, value } of expectedHeaders) {
      if (response.headers.get(key) !== value) fail(path, `En-tête ${key} absent ou différent de vercel.json.`);
    }
    for (const [, src] of html.matchAll(/<img\b[^>]*\bsrc="([^"]*)"/g)) {
      const image = new URL(src, target);
      if (image.origin !== target.origin || !image.pathname.startsWith('/illustrations/')) fail(path, 'Image extérieure aux illustrations locales détectée.');
    }
    titles.push(actual.title); descriptions.push(actual.description);
    results.push({ path, status: response.status, metadata: actual });
  } catch (error) { fail(path, error.message); }
}
if (new Set(titles).size !== 3 || new Set(descriptions).size !== 3) fail('/', 'Titres et descriptions doivent être propres aux trois pages.');
for (const path of ['/og-concept.png', ...['chair', 'chair-interior', 'collection', 'table', 'landscape', 'facade'].map(name => `/illustrations/${name}.svg`)]) {
  try {
    const response = await request(path);
    const body = Buffer.from(await response.arrayBuffer());
    const original = await readFile(new URL(`../public${path}`, import.meta.url));
    const hash = data => createHash('sha256').update(data).digest('hex');
    if (response.status !== 200 || hash(body) !== hash(original)) fail(path, 'Ressource absente ou différente de l’original.');
  } catch (error) { fail(path, error.message); }
}
try {
  const response = await request('/robots.txt');
  const text = await response.text();
  if (response.status !== 200 || /^Disallow:\s*\/\s*$/mi.test(text)) fail('/robots.txt', 'La lecture du meta noindex doit rester autorisée.');
} catch (error) { fail('/robots.txt', error.message); }
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), target: target.origin, results, errors, ok: errors.length === 0 }, null, 2));
if (errors.length) process.exitCode = 1;
