# Vérifications réellement exécutées

Contrôles effectués le **20 octobre 2026**, heure de Paris, sur le build statique local avec `PUBLIC_USE_OFFICIAL_MEDIA=false`. Au moment de ces contrôles, aucun déploiement, commit ou push Git, changement DNS ou intervention sur un serveur existant n’avait été effectué.

## Construction et liens

- Node 22.23.3, npm 10.9.9, Astro 7.4.1, TypeScript 6.0.3.
- `npm run check` : **0 erreur, 0 avertissement, 0 hint** sur 24 fichiers vérifiés.
- `npm run build` : succès, **exactement trois pages**, sortie `dist/`.
- `npm run audit:links` : **53 liens internes**, 41 références à des ressources locales, aucune cible manquante. Les répétitions entre pages sont comptées.
- Meta `noindex,nofollow`, un H1 par page, titres explicitement non officiels et liens officiels identifiés. Robots.txt ne bloque pas la lecture des pages.
- Build d’environ **286 Kio** au total, avec polices, illustrations et carte Open Graph, hors documentation, captures et node_modules. Il s’agit du poids des fichiers sur disque, pas d’un poids transféré compressé.

## Navigation, responsive et accessibilité

Passage final de `npm test` à **12 h 51**, terminé en **14,3 secondes** : **7 scénarios réussis, 0 échec, 0 ignoré, 0 relance**. Playwright 1.64.1, Chrome système 154 en mode headless, serveur `astro preview` du build sur 127.0.0.1:4322. Un seul worker, un navigateur à la fois. Les tests ne chargent pas les sites externes.

| Contrôle | Résultat observé |
| --- | --- |
| Trois pages × 320, 360, 390, 768, 1024, 1440, 1920 px | Aucun débordement horizontal, titres dans le viewport, aucune carte superposée |
| Images locales | Aucune image manquante après décodage |
| Requêtes tierces et erreurs JavaScript | Aucune sur les pages testées |
| Commutation des univers | Titre, média, CTA et état actif mis à jour |
| Filtres | Architecture, éditions, retour à la sélection complète et compteur vérifiés |
| Navigation | Cartes vers les routes réelles, passage d’un univers à l’autre et retour accueil |
| Menu mobile au clavier | Entrée, Tab, Échap, retour du focus, navigation et fermeture au passage desktop |
| Galerie | Précédent/suivant, bouclage, miniatures, titres, flèches clavier limitées à la galerie |
| Agrandissement | Ouverture par Entrée, focus maintenu dans la fenêtre, fermeture Échap/bouton, retour au déclencheur |
| Lien d’évitement | Accès clavier et focus du contenu principal |
| Sans JavaScript | Navigation mobile visible, trois vues disponibles, routes navigables |
| Mouvements réduits | Défilement automatique et transitions désactivés |
| Image indisponible simulée | SVG de secours, texte alternatif et mention mis à jour |
| Liens externes | Identification du site officiel et rel sécurisé |
| Axe, WCAG 2 A/AA et 2.1 AA, à 390 et 1440 px sur les trois pages | **0 violation automatique détectée** |

Les résultats automatisés ne constituent pas une certification d’accessibilité. Aucun test avec lecteur d’écran humain, Safari, Firefox ou appareil physique n’a été réalisé. Le comportement des photographies distantes n’a pas été testé par téléchargement ; seule leur disponibilité HEAD a été contrôlée.

Le résumé machine est conservé dans [validation-summary.json](validation-summary.json). Le rapport complet Playwright est dans `test-results/report.json` lors d’une exécution locale ; ce dossier temporaire est ignoré par Git.

## Captures et revue visuelle

Six captures complètes ont été produites sur le build testé et relues. L’espacement des cartes desktop a été corrigé puis revérifié par un nouveau passage du scénario de dimensions.

| Page | Mobile 390 px | Desktop 1440 px |
| --- | --- | --- |
| Accueil | [Capture](captures/accueil-390.png) | [Capture](captures/accueil-1440.png) |
| Villa KE | [Capture](captures/villa-ke-390.png) | [Capture](captures/villa-ke-1440.png) |
| Chaise 1989 | [Capture](captures/chaise-1989-390.png) | [Capture](captures/chaise-1989-1440.png) |

## Lighthouse de l’accueil

Mesure unique du **20 octobre 2026 à 12 h 53, Europe/Paris**, sur `http://127.0.0.1:4322/`, build statique local. Lighthouse **13.5.0**, Headless Chrome **154**, profil mobile **412 × 823**, DPR 1,75. Simulation réseau : RTT 150 ms, débit 1638,4 kbit/s ; ralentissement CPU ×4. Aucune photographie distante, aucun navigateur de test en parallèle.

| Catégorie | Score mesuré |
| --- | ---: |
| Performance | **100** |
| Accessibilité | **100** |
| Bonnes pratiques | **100** |
| SEO | **66** |

FCP **1,2 s**, LCP **1,5 s**, TBT **0 ms**, CLS **0,011**. Aucun avertissement de mesure. Le contrôle SEO échoué est `is-crawlable` : l’indexation est volontairement désactivée selon le brief. Le score SEO n’est donc pas un objectif à augmenter en retirant noindex. Lighthouse signale aussi un chemin critique CSS/polices et des requêtes bloquant le rendu ; le budget local reste léger.

[Rapport HTML complet](lighthouse-accueil-mobile.report.html) · [Données JSON](lighthouse-accueil-mobile.report.json)

Ces chiffres décrivent un passage sur cette machine et des médias locaux. Ils ne sont ni une garantie de production ni une comparaison contrôlée avec les mesures des sites officiels. Ils peuvent changer avec les médias distants, le réseau, l’hébergement et l’appareil. Aucun score Lighthouse desktop ou des pages intérieures n’est annoncé.

Commande utilisée après installation de Lighthouse dans un dossier temporaire, sans l’ajouter aux dépendances du projet :

```bash
npm install --prefix /tmp/concept-standard-lighthouse lighthouse@13.5.0 --no-audit --no-fund
npm run preview -- --port 4322 --ignore-lock
# Dans un autre terminal, après démarrage du serveur :
node /tmp/concept-standard-lighthouse/node_modules/lighthouse/cli/index.js \
  http://127.0.0.1:4322/ \
  --chrome-path=/usr/bin/google-chrome \
  --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html \
  --output-path=docs/lighthouse-accueil-mobile --quiet
```

Le serveur d’aperçu a été arrêté après la mesure. Adapter le chemin de Chrome sur une autre machine.

## Médias et informations

`npm run audit:media` : **12/12 URL d’images HTTP 200** avec type image, **5/5 liens officiels HTTP 200**, le 20 octobre 2026 à 12 h 40, Paris. Requêtes HEAD uniquement : aucune photographie récupérée. Les réponses peuvent changer et ne valent pas autorisation. Voir [l’inventaire](MEDIAS.md) et le [rapport brut](media-audit.json).

Les dimensions et matériaux de la Chaise 1989 ont été revérifiés sur le [catalogue officiel](https://nouveaustandard.fr/). La page officielle Maison KE répond, mais ses libellés de projet n’étaient pas exposés dans le HTML lisible lors de la vérification ; les repères du brief et de la maquette sont conservés et restent à revalider avec le studio. Aucun état actuel d’avancement n’est inventé.

## Limites de déploiement

Configuration Vercel et exemple Caddy préparés, sans déploiement réel. Caddy n’étant pas installé ici, aucune validation de sa configuration par le binaire n’est annoncée. Les directives suivent la [documentation file_server](https://caddyserver.com/docs/caddyfile/directives/file_server) et [try_files](https://caddyserver.com/docs/caddyfile/directives/try_files). Vercel, DNS, TLS et rendu d’aperçu sur les plateformes de partage restent à vérifier après votre feu vert et attribution d’une URL réelle.
