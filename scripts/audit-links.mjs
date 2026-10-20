import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
const root = 'dist';
async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(file));
    else if (file.endsWith('.html')) result.push(file);
  }
  return result;
}
const pages = new Map();
for (const file of await walk(root)) {
  const route = file.slice(root.length).replace(/\/index\.html$/, '').replace(/\.html$/, '') || '/';
  pages.set(route, await readFile(file, 'utf8'));
}
const errors = [], external = new Set();
let internal = 0, assets = 0;
for (const [route, html] of pages) {
  if (!html.includes('content="noindex,nofollow"')) errors.push(`${route}: meta noindex manquant`);
  if ([...html.matchAll(/<h1\b/g)].length !== 1) errors.push(`${route}: nombre de H1 incorrect`);
  for (const [, href] of html.matchAll(/\bhref="([^"]*)"/g)) {
    if (!href || href === '#') { errors.push(`${route}: lien vide`); continue; }
    if (/^https?:/.test(href)) { external.add(href); continue; }
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const [path, hash] = href.split('#');
    const target = path || route;
    if (pages.has(target)) {
      internal++;
      if (hash && !pages.get(target).includes(`id="${hash}"`)) errors.push(`${route}: ancre ${href} manquante`);
    } else {
      try { await stat(join(root, target)); assets++; } catch { errors.push(`${route}: cible ${href} introuvable`); }
    }
  }
  for (const [, src] of html.matchAll(/\bsrc="(\/[^"#]*)"/g)) {
    try { await stat(join(root, src)); assets++; } catch { errors.push(`${route}: ressource ${src} introuvable`); }
  }
}
const expected = ['/', '/architecture/villa-ke', '/editions/chaise-1989'];
if (pages.size !== 3 || expected.some(route => !pages.has(route))) errors.push('Les trois routes attendues ne correspondent pas au build.');
console.log(JSON.stringify({ pages: [...pages.keys()], internalLinks: internal, localAssets: assets, externalLinks: [...external], errors }, null, 2));
if (errors.length) process.exitCode = 1;
