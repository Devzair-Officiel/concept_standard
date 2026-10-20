import { readFile, writeFile, mkdir } from 'node:fs/promises';

const originals = ['maquette-standard-galerie-v2.html', 'standard-projet-architecture.html', 'standard-fiche-mobilier.html'];
const inventory = new Map();
for (const file of originals) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/https:\/\/[^\s'"<>]+?\.(?:jpg|jpeg|png|webp)/g)) {
    const source = match[0];
    const entry = inventory.get(source) ?? { source, mockups: [] };
    if (!entry.mockups.includes(file)) entry.mockups.push(file);
    inventory.set(source, entry);
  }
}

async function head(url) {
  try {
    const result = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(18000) });
    return { status: result.status, type: result.headers.get('content-type'), bytes: result.headers.get('content-length'), finalURL: result.url };
  } catch (error) {
    const code = error.cause?.code;
    if (code === 'EAI_AGAIN' || code === 'ENOTFOUND') throw error;
    return { status: null, error: error.message };
  }
}

// HEAD only; never download or store photographs. Two requests maximum at a time.
const entries = [...inventory.values()];
for (let i = 0; i < entries.length; i += 2) {
  await Promise.all(entries.slice(i, i + 2).map(async entry => { Object.assign(entry, await head(entry.source)); }));
}
const externalURLs = ['https://atelierstandard.fr/', 'https://atelierstandard.fr/architecture/', 'https://atelierstandard.fr/maison-ke/', 'https://atelierstandard.fr/contact/', 'https://nouveaustandard.fr/'];
const externalLinks = [];
for (const url of externalURLs) externalLinks.push({ url, ...await head(url) });
const report = { checkedAt: new Date().toISOString(), method: 'HEAD only — no photographic body downloaded', availabilityIsNotPermission: true, images: entries, externalLinks };
await mkdir('docs', { recursive: true });
await writeFile('docs/media-audit.json', JSON.stringify(report, null, 2) + '\n');
const rows = entries.map(entry => `| [${entry.source.split('/').pop()}](${entry.source}) | ${entry.status ?? 'Non vérifiable'} | ${entry.type ?? entry.error ?? '—'} | ${entry.mockups.join(', ')} |`);
await writeFile('docs/MEDIAS.md', `# Inventaire des médias\n\nContrôle du ${report.checkedAt}. Requêtes HEAD uniquement : aucune photographie téléchargée, copiée ou mise en cache. Une réponse 200 ne vaut pas autorisation.\n\nToutes les photographies ci-dessous ont des droits à confirmer. Elles sont **désactivées par défaut**. Les URL et textes alternatifs sont centralisés dans src/data/media.ts.\n\n| Source originale | HTTP | Type | Maquettes sources |\n| --- | --- | --- | --- |\n${rows.join('\n')}\n\n## Liens officiels\n\n${externalLinks.map(link => `- [${link.url}](${link.url}) : HTTP ${link.status ?? 'non vérifiable'}`).join('\n')}\n\n## Autorisations et crédits\n\nObtenir l’accord des studios et des auteurs des photographies/perspectives pour l’usage, le recadrage, le zoom, l’hébergement distant et le domaine de cette démonstration. Les noms Paulin Giret contenus dans certains fichiers restent à confirmer ; aucun crédit d’auteur n’est présumé pour les autres médias. Toutes les images ci-dessus doivent être autorisées avant activation. Le hotlink n’accorde aucun droit et dépend de la disponibilité des serveurs tiers.\n\nAprès autorisation seulement : définir PUBLIC_USE_OFFICIAL_MEDIA=true, puis reconstruire. Le composant Media revient aux illustrations locales si une image distante échoue. Aucun traitement d’image Astro, proxy, téléchargement ou srcset non vérifié n’est utilisé pour ces photographies. Les dimensions 683×1024/1024×683 viennent des noms de fichiers ; les autres sont des ratios de réservation de mise en page, pas une mesure des originaux.\n\n## Illustrations locales\n\nSix compositions SVG originales créées par Devzair pour cette démonstration, dans public/illustrations/, générées par scripts/create-illustrations.mjs. Évocations libres et explicitement signalées, elles ne sont ni des reproductions exactes des pièces ni des perspectives du projet Villa KE. Les textures CSS sont également conceptuelles et non contractuelles. Favicon et carte Open Graph sont originaux.\n\nLes polices DM Sans et Space Grotesk sont distribuées sous SIL OFL 1.1, auto-hébergées depuis les paquets Fontsource ; voir public/licenses/. Aucune requête Google Fonts n’est conservée.\n`);
console.log(JSON.stringify({ images: entries.length, available: entries.filter(e => e.status === 200).length, unavailable: entries.filter(e => e.status !== 200).map(e => ({ source: e.source, status: e.status, error: e.error })), externalLinks }, null, 2));
