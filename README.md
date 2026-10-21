# STANDARD — Concept indépendant par Devzair

Site Astro statique de démonstration, non commandé, non officiel, sans affiliation avec Atelier Standard ou Nouveau Standard. Trois pages, aucun CMS, serveur applicatif, formulaire, analytics ou cookie. Version publique de référence : https://concept-standard.vercel.app/. Les corrections finales décrites dans [docs/CORRECTIONS-FINALES.md](docs/CORRECTIONS-FINALES.md) ont été publiées et validées en production le **21 octobre 2026**.

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

Après obtention des autorisations pour tous les médias affichés : copier `.env.example` vers `.env`, définir `PUBLIC_USE_OFFICIAL_MEDIA=true`, adapter `img-src` aux seuls hôtes autorisés, puis retester la CSP avant de reconstruire et publier. Cette option affiche les fichiers distants directement ; elle ne les télécharge pas dans le projet. En cas d’erreur, un secours local remplace le visuel et son texte alternatif. Ne pas activer globalement l’option si seuls certains médias sont autorisés : adapter d’abord le manifeste. Le `srcset` des photographies n’est pas inventé ; les SVG sont indépendants de la résolution. Pour une future version photographique, ajouter des variantes uniquement avec autorisation et dimensions vérifiées.

La [lecture des maquettes](docs/ANALYSE-MAQUETTES.md) explique ce qui a été conservé et harmonisé. Les dimensions et matériaux de la chaise ont été revérifiés sur le [catalogue officiel](https://nouveaustandard.fr/). Les repères de Villa KE reprennent les libellés du HTML fourni et du brief : Finistère, 165 m² de surface de plancher, étude 2023, esquisse. Le [dossier officiel](https://atelierstandard.fr/maison-ke/) répond en HTTP 200 mais n’expose pas ces libellés dans le HTML accessible lors du contrôle : les revalider avec le studio avant publication. Aucun état d’avancement actuel n’est présumé. Les paragraphes narratifs sont des propositions éditoriales.

Polices DM Sans et Space Grotesk : fichiers WOFF2 locaux issus de Fontsource, graisse variable normale, `font-display: swap`. Licences SIL OFL conservées dans `public/licenses/`. Aucune requête vers Google Fonts.

## Vérifications

```bash
npx playwright install chromium
npm test
npm run audit:media
```

Les tests utilisent **un seul worker et un navigateur à la fois**. Ils démarrent un serveur QA du build sur 127.0.0.1:4322 avec les en-têtes de `vercel.json`, puis l’arrêtent. `npm run preview` reste l’aperçu Astro standard ; il n’applique pas les en-têtes Vercel. Exécuter `npm run build` avant les tests. Chrome est utilisé automatiquement s’il existe à `/usr/bin/google-chrome` ; sinon le Chromium de Playwright est utilisé. Un chemin personnalisé peut aussi être fourni :

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/google-chrome npm test
```

Les contrôles couvrent les trois routes aux largeurs 320, 360, 390, 768, 1024, 1440 et 1920, le débordement horizontal, la superposition des cartes, la taille minimale de 11 px, les images, les liens, le menu, les filtres, la galerie, le focus, Échap, l’accessibilité automatique axe WCAG AA, l’absence de requêtes tierces, le mode sans JavaScript et les mouvements réduits. Ils vérifient aussi les métadonnées, les en-têtes, le contraste des repères Villa KE et l’identité des six illustrations. Les captures actuelles sont écrites dans `test-results/captures/` (ignoré par Git). Les contrôles automatisés ne remplacent pas une revue avec lecteur d’écran.

```bash
# Politique CSP complète imposée uniquement sur le serveur de test local :
npm run test:csp
```

Les résultats historiques Lighthouse et les premières captures sont conservés dans [docs/VERIFICATIONS.md](docs/VERIFICATIONS.md). Ils ne sont pas des mesures de la version corrigée. Les résultats locaux, de Preview et de production des corrections sont dans [docs/CORRECTIONS-FINALES.md](docs/CORRECTIONS-FINALES.md), avec la procédure pour une prochaine publication autorisée.

`npm run audit:media` nécessite le réseau et actualise l’inventaire daté. Les liens externes peuvent évoluer. Le meta robots `noindex,nofollow` est présent partout ; robots.txt autorise leur lecture. Ce mécanisme ne constitue pas un contrôle d’accès : utiliser la protection de déploiement de l’hébergeur pour une présentation confidentielle.

## Vercel — mode prioritaire, après feu vert

Le projet utilise le rendu statique natif d’Astro : aucun adaptateur serveur n’est requis. `vercel.json` déclare Astro, `npm ci`, `npm run build`, `dist/`, les URL sans extension, X-Robots-Tag et les protections HTTP. Une CSP minimale protège déjà l’encadrement, les objets et l’URL de base ; la politique complète est en **Report-Only** pour validation sur l’hébergement réel. Voir la [procédure des corrections finales](docs/CORRECTIONS-FINALES.md) et la [documentation officielle Astro sur Vercel](https://vercel.com/docs/frameworks/frontend/astro).

1. Après votre accord pour le commit/push ou le déploiement CLI, publier les corrections dans le projet Vercel **existant** `concept-standard`. Un push vers une branche connectée peut déclencher un déploiement automatique.
2. Préparer d’abord une prévisualisation et la vérifier avant promotion en production. La version actuelle a été validée en Preview, puis publiée et vérifiée sur le domaine public le 21 octobre 2026.
3. Vérifier : framework **Astro**, installation `npm ci`, build `npm run build`, sortie `dist`, Node 22 compatible avec le minimum ci-dessus.
4. Garder `PUBLIC_USE_OFFICIAL_MEDIA=false` tant que les droits ne sont pas confirmés. Lancer **Deploy** seulement après validation : Vercel fournit alors une URL `*.vercel.app`.
5. La base des métadonnées est désormais l’URL publique connue `https://concept-standard.vercel.app`. `PUBLIC_SITE_URL` peut la remplacer en cas de changement explicite de domaine. Les canonical et `og:url` restent propres à chaque route et `og:image` utilise `/og-concept.png` en URL absolue.
6. Pour `concept-standard.devzair.fr`, ajouter ce nom dans **Project Settings → Domains**. Recopier uniquement les enregistrements DNS réellement demandés par Vercel auprès de votre fournisseur, puis attendre la validation et le certificat. [Procédure officielle des domaines](https://vercel.com/docs/domains/working-with-domains/add-a-domain). Aucun DNS n’a été modifié.

Alternative en ligne de commande, à exécuter uniquement après accord de publication :

```bash
npm ci
npm run check
npm run build
npx vercel
# Puis, lorsque la prévisualisation est validée :
npx vercel --prod
# Après publication autorisée :
npm run verify:deployment -- https://concept-standard.vercel.app
PLAYWRIGHT_BASE_URL=https://concept-standard.vercel.app npm test
```

Les commandes `npx vercel` et `npx vercel --prod` créent des déploiements ; les commandes `verify:deployment` et Playwright vérifient le site publié. Ces étapes ont été réalisées avec accord pour la version actuelle. Le fichier `public/og-concept.png` est une carte originale de 1200 × 630 pixels marquée « concept non officiel », exportée depuis le SVG fourni. Aucun visuel tiers n’est utilisé pour l’Open Graph.

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

Les originaux HTML sont conservés à la racine pour comparaison. `package-lock.json` fixe les versions ; `.nvmrc` documente Node. Le dépôt Git local utilise le dépôt distant `Devzair-Officiel/concept_standard` ; les commits et push nécessitent l’accord du propriétaire.

Pour une éventuelle version avec photographies tierces, les autorisations et crédits des médias restent à obtenir. Les repères Villa KE et les textes éditoriaux restent à revalider avec les studios.
