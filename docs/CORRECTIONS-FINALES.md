# STANDARD — Corrections finales avant présentation

Corrections préparées localement le **20 octobre 2026**, puis validées en Preview et publiées sur le projet Vercel existant après accord explicite. La production a été vérifiée le **21 octobre 2026** sur **https://concept-standard.vercel.app/**.

## Modifications

- Les textes secondaires de 7–10 px passent à **11 px minimum**, sur mobile comme sur desktop. Les mentions de concept, légendes, miniatures et indications clavier restent présentes. Les grands titres, palettes, images, compositions et durées d’animation sont conservés.
- Les deux repères du visuel d’ouverture de Villa KE, dont **« Étude / 2023 »**, reçoivent un fond opaque `#141512`, avec texte `#f3f1e9` : contraste calculé **16,21:1**, supérieur au minimum de 4,5:1. Le contraste reste constant quelle que soit l’illustration située derrière.
- Les retours à la ligne du footer mobile et du CTA de l’accueil sont ajustés à la nouvelle taille de texte. Aucun changement de route ni de logique de navigation.
- Chaque page émet ses propres title, description, canonical, `og:url`, `og:title` et `og:description`. `og:image` est toujours `https://concept-standard.vercel.app/og-concept.png`, avec type PNG, dimensions 1200 × 630 et texte alternatif signalant le caractère non officiel.
- L’URL publique connue est la base par défaut dans Astro. `PUBLIC_SITE_URL` reste une surcharge explicite, lue depuis l’environnement ou `.env`, en cas de changement de domaine. Les métadonnées restent dirigées vers le domaine de présentation, y compris pendant un aperçu local ou Vercel Preview.
- Le meta **`noindex,nofollow`**, X-Robots-Tag, robots.txt autorisant la lecture, les mentions indépendantes et les liens officiels sont conservés.
- Aucune illustration, texture ou police n’a été remplacée. Les six SVG servis sont comparés aux fichiers originaux par SHA-256.

## En-têtes Vercel et CSP

`vercel.json` applique les en-têtes suivants sur toutes les routes :

| En-tête | Valeur / rôle |
| --- | --- |
| `X-Robots-Tag` | `noindex,nofollow` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Caméra, microphone, géolocalisation, paiement et USB désactivés |
| `X-Frame-Options` | `DENY` |
| `Content-Security-Policy` | `frame-ancestors 'none'; base-uri 'self'; object-src 'none'` |
| `Content-Security-Policy-Report-Only` | Politique complète conservée en Report-Only après validation en production |

La protection iframe est **imposée sur la version publiée**. La politique complète limite scripts, styles, images, polices et connexions au domaine du site ; elle refuse les scripts/styles d’attribut, les frames, les objets et l’envoi de formulaire.

Les scripts Astro et les styles sont externalisés au build (`assetsInlineLimit: 0`, `inlineStylesheets: 'never'`). L’unique attribut de style de Media devient une classe CSS équivalente. La politique candidate ne nécessite donc ni `unsafe-inline`, ni `unsafe-eval`, ni hashes fragiles dépendant de la minification. Les scripts des menus, filtres, galeries et lightboxes conservent leur logique.

La CSP complète est testée d’abord en mode Report-Only, puis **effectivement imposée en local** avec `npm run test:csp`. Elle reste en Report-Only dans le fichier Vercel livré, conformément au choix de publication. Les violations sont observables dans la console du navigateur et collectées par les tests ; aucun endpoint de télémétrie ni service tiers de collecte n’est ajouté.

Après validation de l’aperçu et de la production, une activation complète pourra être décidée séparément : remplacer la CSP minimale par la valeur candidate, puis retirer l’en-tête Report-Only. Cette promotion n’est pas effectuée automatiquement. Toute activation future de photographies distantes exigera une nouvelle validation des droits et de la directive `img-src`.

Références : [Vercel — security headers](https://vercel.com/docs/cdn-security/security-headers), [MDN — CSP Report-Only](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only).

## Vérifications locales réalisées

- `npm run check` : **aucune erreur, aucun avertissement**.
- `npm run build` : succès, **exactement les trois routes existantes**.
- `npm run audit:links` : aucune cible manquante.
- `npm test` : **10 scénarios réussis** sur le build final avec les en-têtes prévus pour Vercel ; durée d’environ 14,4 s.
- `npm run test:csp` : **10 scénarios réussis** avec la politique complète imposée en local ; durée d’environ 14,2 s. Après l’ajustement final du CTA mobile, les contrôles responsive et axe sont également repassés sous cette politique : **2 réussites**.
- Trois pages vérifiées à **390 et 1440 px**, ainsi qu’à 320, 360, 768, 1024 et 1920 px : aucun débordement horizontal, aucune superposition de cartes, aucun texte visible de moins de 11 px.
- Menu mobile, filtres, changement d’univers, précédent/suivant, miniatures, lightbox, Échap, focus, lien d’évitement, navigation entre pages, absence de JavaScript et mouvements réduits vérifiés.
- **Aucune erreur JavaScript ni violation CSP détectée** dans les contrôles ; aucune requête tierce dans les pages testées. Axe : aucune violation automatique sur les trois pages à 390 et 1440 px. Cela ne constitue pas une certification d’accessibilité.
- Contraste des repères Villa KE vérifié par calcul sur les couleurs CSS réellement appliquées, à 390 et 1440 px : **16,21:1**.
- Les six SVG servis correspondent aux originaux du projet. Aucune modification de `public/` et aucune activation des photographies tierces.
- La commande `verify:deployment` a été exécutée avec succès contre le serveur QA local : trois pages, métadonnées, en-têtes, robots.txt, carte PNG et six SVG vérifiés. Son contrôle HSTS s’applique uniquement à une cible HTTPS réelle.

Les captures actuelles sont générées dans `test-results/captures/`, non versionnées. Les rapports Playwright sont temporaires ; les résultats des phases de cette session sont également conservés dans `/tmp/standard-corrections-finales/`. Les anciens rapports Lighthouse de `docs/VERIFICATIONS.md` restent historiques : aucun nouveau score n’est annoncé pour ces corrections.

Le serveur QA lit les en-têtes de `vercel.json` et sert uniquement `dist/` sur 127.0.0.1:4322. Il permet de vérifier de vraies réponses HTTP locales, sans prétendre simuler l’ensemble de l’infrastructure Vercel. `npm run preview` reste l’aperçu Astro standard, sans ces en-têtes.

## Validation de Preview et de production — 21 octobre 2026

- Preview validée : **https://concept-standard-jwti40p4j-devzair1.vercel.app/**, déploiement `dpl_5Bq7GfysiGVzG2HiZC9ztwZxPWDq`, cible Preview. L’autre adresse initialement repérée, `concept-standard-2zur5lgim-devzair1.vercel.app`, correspondait à l’ancien déploiement de production.
- Publication autorisée avec **`npx vercel --prod`** sur `devzair1/concept-standard` : déploiement `dpl_AzBjMHVv252dqU7dKse1LmZVVFhw`, cible production, état READY. Adresse technique : `https://concept-standard-6ukb2zu0b-devzair1.vercel.app` ; domaine public de présentation : **https://concept-standard.vercel.app/**.
- Avant publication, les **28 fichiers** du nouveau build local correspondaient exactement à la Preview validée, par SHA-256. Après publication, les **28 fichiers de production** correspondent également au build local, sans authentification ni omission de la barre Vercel.
- Les trois pages publiques répondent en **HTTP 200 sans authentification Vercel**.
- `npm run verify:deployment -- https://concept-standard.vercel.app` : **réussi**, aucune erreur sur les métadonnées, les en-têtes, robots.txt, le PNG Open Graph et les six illustrations.
- `PLAYWRIGHT_BASE_URL=https://concept-standard.vercel.app npm test` : **10 scénarios sur 10 réussis**, aucun échec ni scénario ignoré, **27,3 secondes**, un seul worker. Les contrôles couvrent notamment 390 et 1440 px, les menus, filtres, galerie, lightbox, navigation au clavier, contraste et identité des illustrations.
- Un contrôle tactile supplémentaire avec un User-Agent Chrome mobile habituel confirme le fonctionnement des interactions et l’absence de débordement, d’exception JavaScript, d’erreur réseau ou de violation CSP dans les parcours contrôlés.
- Les métadonnées Open Graph propres aux pages, leurs URL absolues et **`noindex,nofollow`** sont conservés. Les protections HTTP sont conformes, notamment HSTS, `nosniff`, les politiques de référent et de permissions, et la protection iframe. La CSP complète reste en **Report-Only**.
- La barre Vercel présente en navigation habituelle sur la Preview génère des signalements CSP liés à `vercel.live`, aux styles injectés et aux frames. Elle est **absente du domaine public**, où ces signalements ne se reproduisent pas. Aucun assouplissement de CSP ni désactivation de la protection de Preview n’a été appliqué pour résoudre cette réserve.
- Les six SVG et le PNG de partage sont les originaux du projet. Aucun nouveau score Lighthouse n’est annoncé. Aucun changement DNS n’a été effectué.

Les rapports détaillés et captures de cette validation sont des artefacts non versionnés dans `test-results/production-validation/`. Les prochaines exécutions de Playwright peuvent remplacer le contenu de `test-results/`.

## Procédure pour une prochaine publication autorisée

1. Valider ces modifications, puis autoriser explicitement le commit/push ou le déploiement CLI. Un push sur une branche connectée à Vercel peut déclencher une publication automatique.
2. Utiliser le projet Vercel existant **concept-standard**. Conserver `PUBLIC_USE_OFFICIAL_MEDIA=false` et la base `PUBLIC_SITE_URL=https://concept-standard.vercel.app` en Preview et Production, ou retirer cette dernière variable pour utiliser le défaut connu.
3. Créer d’abord une prévisualisation, puis vérifier le rendu et les en-têtes sur son URL réelle. Les commandes ci-dessous sont à lancer **après accord pour une nouvelle publication** :

```bash
npm ci
npm run check
npm run build
npm test
npm run test:csp
# Relier au projet existant si nécessaire, puis créer l'aperçu :
npx vercel
```

4. Contrôler cet aperçu, en remplaçant l’URL d’exemple par celle réellement fournie par Vercel. Les canonical et `og:url` restent volontairement dirigés vers le domaine de présentation public :

```bash
npm run verify:deployment -- https://URL-REELLE-DE-L-APERCU.vercel.app
PLAYWRIGHT_BASE_URL=https://URL-REELLE-DE-L-APERCU.vercel.app npm test
```

Si l’aperçu est protégé par Vercel, il faut disposer de l’accès approprié pour l’inspecter ; ne pas conclure à un défaut de page sur la seule base d’un accès refusé. Le navigateur de test n’a pas besoin de serveur local lorsque `PLAYWRIGHT_BASE_URL` est renseignée.

5. Après validation et accord de publication en production :

```bash
npx vercel --prod
```

6. **Après ce déploiement**, vérifier effectivement le domaine public :

```bash
npm run verify:deployment -- https://concept-standard.vercel.app
PLAYWRIGHT_BASE_URL=https://concept-standard.vercel.app npm test
```

Le vérificateur est strictement en lecture seule. Il compare les métadonnées au build local, vérifie les en-têtes du fichier Vercel, le HSTS de la cible HTTPS, noindex, robots.txt, la carte de partage et les empreintes des illustrations. Toute différence provoque un code de sortie non nul. Les tests navigateur contrôlent aussi les interactions, les tailles de texte et la CSP sur la cible publiée.
