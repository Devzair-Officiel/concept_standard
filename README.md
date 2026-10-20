# STANDARD — Concept indépendant par Devzair

Site Astro statique de démonstration, non commandé, non officiel, sans affiliation avec Atelier Standard ou Nouveau Standard. Trois pages, aucun CMS, serveur applicatif, formulaire, analytics ou cookie. Aucun déploiement public n’a été effectué.

## Lancer localement

Node.js **22.22.0 minimum** (version de développement : 22.23.3), npm. Depuis ce dossier :

```bash
npm install
npm run dev
```

Ouvrir l’URL locale affichée, normalement http://127.0.0.1:4321. Les commandes npm désactivent la télémétrie d’Astro. Pour une installation strictement conforme au lockfile, utiliser `npm ci` à la place de `npm install`.

```bash
npm run check
npm run build
npm run audit:links
npm run preview
```

Le build produit uniquement trois pages dans `dist/` :

- `/` : galerie, choix d’univers, filtres et sélection ;
- `/architecture/villa-ke` : récit, vues agrandissables et repères ;
- `/editions/chaise-1989` : galerie à trois vues, miniatures, agrandissement, matériaux et dimensions.

Les cartes Chaise 1989 et Villa KE conduisent à ces pages. Table 1976 et Domaine DA conduisent aux catalogues officiels, clairement signalés. Header, footer et transitions permettent de revenir à l’accueil ou de rejoindre l’autre univers.

## Images et informations à autoriser

**Par défaut, aucune photographie tierce n’est chargée.** Les visuels sont six compositions SVG originales, signalées « Illustration d’intention · Devzair ». Ce ne sont pas des représentations fidèles des pièces ou du projet. Les textures de matières sont également des évocations.

L’[inventaire des médias](docs/MEDIAS.md) recense les 12 URL issues des trois maquettes, leurs fichiers sources et leurs réponses HTTP. La vérification utilise uniquement HEAD, sans récupérer le corps des photographies. Les données sont centralisées dans `src/data/media.ts`. Les autorisations d’affichage, recadrage, zoom et domaine, ainsi que les crédits, restent à obtenir auprès des studios et auteurs. Une URL publique et un statut 200 ne donnent aucun droit de réutilisation.

Après obtention des autorisations pour tous les médias affichés : copier `.env.example` vers `.env`, définir `PUBLIC_USE_OFFICIAL_MEDIA=true`, redémarrer le serveur ou reconstruire. Cette option affiche les fichiers distants directement ; elle ne les télécharge pas dans le projet. En cas d’erreur, un secours local remplace le visuel et son texte alternatif. Ne pas activer globalement l’option si seuls certains médias sont autorisés : adapter d’abord le manifeste. Le `srcset` des photographies n’est pas inventé ; les SVG sont indépendants de la résolution. Pour une future version photographique, ajouter des variantes uniquement avec autorisation et dimensions vérifiées.

La [lecture des maquettes](docs/ANALYSE-MAQUETTES.md) explique ce qui a été conservé et harmonisé. Les dimensions et matériaux de la chaise ont été revérifiés sur le [catalogue officiel](https://nouveaustandard.fr/). Les repères de Villa KE reprennent les libellés du HTML fourni et du brief : Finistère, 165 m² de surface de plancher, étude 2023, esquisse. Le [dossier officiel](https://atelierstandard.fr/maison-ke/) répond en HTTP 200 mais n’expose pas ces libellés dans le HTML accessible lors du contrôle : les revalider avec le studio avant publication. Aucun état d’avancement actuel n’est présumé. Les paragraphes narratifs sont des propositions éditoriales.

Polices DM Sans et Space Grotesk : fichiers WOFF2 locaux issus de Fontsource, graisse variable normale, `font-display: swap`. Licences SIL OFL conservées dans `public/licenses/`. Aucune requête vers Google Fonts.

## Vérifications

```bash
npx playwright install chromium
npm test
npm run audit:media
```

Les tests utilisent **un seul worker et un navigateur à la fois**. Ils démarrent le serveur du build sur 127.0.0.1:4322 puis l’arrêtent. Exécuter `npm run build` avant les tests. Chrome est utilisé automatiquement s’il existe à `/usr/bin/google-chrome` ; sinon le Chromium de Playwright est utilisé. Un chemin personnalisé peut aussi être fourni :

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm test
```

Les contrôles couvrent les trois routes aux largeurs 320, 360, 390, 768, 1024, 1440 et 1920, le débordement horizontal, la superposition des cartes, les images, les liens, le menu, les filtres, la galerie, le focus, Échap, l’accessibilité automatique axe WCAG AA, l’absence de requêtes tierces, le mode sans JavaScript et les mouvements réduits. Les contrôles automatisés ne remplacent pas une revue avec lecteur d’écran. Passage final : **7 scénarios réussis**. Lighthouse mobile sur l’accueil local : performance **100**, accessibilité **100**, bonnes pratiques **100**, SEO **66** (indexation volontairement bloquée). Conditions, limites, captures et rapports dans [docs/VERIFICATIONS.md](docs/VERIFICATIONS.md).

`npm run audit:media` nécessite le réseau et actualise l’inventaire daté. Les liens externes peuvent évoluer. Le meta robots `noindex,nofollow` est présent partout ; robots.txt autorise leur lecture. Ce mécanisme ne constitue pas un contrôle d’accès : utiliser la protection de déploiement de l’hébergeur pour une présentation confidentielle.

## Vercel — mode prioritaire, après feu vert

Le projet utilise le rendu statique natif d’Astro : aucun adaptateur serveur n’est requis. `vercel.json` déclare Astro, `npm ci`, `npm run build`, `dist/`, les URL sans extension et un en-tête X-Robots-Tag. Voir la [documentation officielle Astro sur Vercel](https://vercel.com/docs/frameworks/frontend/astro).

1. Après votre accord pour le push, publier le dépôt Git local autonome sur votre forge. Les sources, le lockfile et `.gitignore` sont prêts ; aucun push n’a été effectué.
2. Dans Vercel : **Add New → Project → Import Git Repository**, choisir ce dépôt et la racine du projet.
3. Vérifier : framework **Astro**, installation `npm ci`, build `npm run build`, sortie `dist`, Node 22 compatible avec le minimum ci-dessus.
4. Garder `PUBLIC_USE_OFFICIAL_MEDIA=false` tant que les droits ne sont pas confirmés. Lancer **Deploy** seulement après validation : Vercel fournit alors une URL `*.vercel.app`.
5. Définir `PUBLIC_SITE_URL` avec cette URL HTTPS réelle et reconstruire pour émettre l’URL absolue de l’aperçu Open Graph. Sans valeur, les métadonnées texte restent présentes et aucun domaine n’est inventé.
6. Pour `concept-standard.devzair.fr`, ajouter ce nom dans **Project Settings → Domains**. Recopier uniquement les enregistrements DNS réellement demandés par Vercel auprès de votre fournisseur, puis attendre la validation et le certificat. [Procédure officielle des domaines](https://vercel.com/docs/domains/working-with-domains/add-a-domain). Aucun DNS n’a été modifié.

Alternative en ligne de commande, à exécuter uniquement après accord de publication :

```bash
npm ci
npm run check
npm run build
npx vercel
# Puis, lorsque la prévisualisation est validée :
npx vercel --prod
```

Ces deux dernières commandes créent des déploiements ; elles n’ont pas été lancées. Le fichier `public/og-concept.png` est une carte originale de 1200 × 630 pixels marquée « concept non officiel », exportée depuis le SVG fourni. Aucun visuel tiers n’est utilisé pour l’Open Graph.

## VPS + Caddy — option, après validation

Le serveur sert uniquement `dist/`, sans Node ni processus npm en production. [Exemple Caddy](deploy/Caddyfile.example), à adapter au domaine et au chemin réels ; aucune configuration serveur n’a été touchée. Documentation : [Caddy file_server](https://caddyserver.com/docs/caddyfile/directives/file_server).

Commandes d’exemple **à adapter et à lancer seulement après votre accord** :

```bash
npm ci
npm run check
npm run build
# Remplacer utilisateur, hote et le chemin ; vérifier les permissions du serveur.
rsync -av dist/ utilisateur@hote:/var/www/concept-standard/dist/
# Sur le VPS, intégrer le bloc d'exemple à la configuration existante, puis :
caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Aucune synchronisation, connexion SSH ou recharge Caddy n’a été exécutée. Le bloc d’exemple n’intercepte pas les autres sites et ne réécrit pas les routes inconnues vers l’accueil.

## Fichiers

```text
src/pages/             Les trois pages Astro
src/layouts/           Document HTML et métadonnées communes
src/components/        Header, footer, médias, galerie, lightbox, liens et repères
src/data/              Informations vérifiées, routes, sources et visuels
src/styles/            Variables et CSS commun, accueil et pages intérieures
public/                Illustrations SVG, licences, favicon, carte OG et robots.txt
scripts/               Audit des liens et médias, génération des illustrations
tests/                 Scénarios navigateur Playwright et axe
docs/                  Analyse des maquettes, inventaire et résultats
deploy/                Exemple Caddy non appliqué
dist/                  Build statique généré, ignoré par Git
```

Les originaux HTML sont conservés à la racine pour comparaison. `package-lock.json` fixe les versions ; `.nvmrc` documente Node. Le dépôt Git local est autonome ; sa publication sur votre forge reste une étape à faire après accord.

Décisions restantes : autorisations et crédits des médias, validation des repères Villa KE et des textes éditoriaux, URL finale, choix de protection de l’aperçu et feu vert de publication.
