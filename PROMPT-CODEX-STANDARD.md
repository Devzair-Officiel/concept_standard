# Mission Codex — Site de démonstration STANDARD

Tu es un développeur frontend senior avec une forte sensibilité au design éditorial, à l'accessibilité et aux performances. Je veux transformer TROIS maquettes HTML existantes en un VRAI petit site web multi-pages, soigné et déployable sur Vercel ou sur mon VPS derrière Caddy.

## Contexte

Il s'agit d'une proposition de refonte **indépendante, non commandée et non officielle**, destinée à être présentée aux studios Nouveau Standard (design, mobilier) et Atelier Standard (architecture). Leur identité doit être respectée. Je ne te demande pas de modifier leurs sites existants et je ne veux aucune ambiguïté laissant croire que cette démonstration est officielle.

Tu disposes de trois fichiers sources que je fournirai dans le projet :

1. `maquette-standard-galerie-v2.html` — page d'accueil, direction artistique « galerie contemporaine » ;
2. `standard-projet-architecture.html` — page immersive d'un projet d'architecture, Villa KE ;
3. `standard-fiche-mobilier.html` — fiche éditoriale de la Chaise 1989.

**Commence par lire intégralement les trois fichiers et analyser les styles, comportements, textes, visuels et interactions qu'ils contiennent. Ne les intègre pas dans des iframes, et ne transforme pas les pages en captures d'écran.** Les reconstruire en composants réutilisables, avec du HTML sémantique et un CSS maintenable. Conserver le meilleur des trois maquettes et les harmoniser sans réinventer arbitrairement leur direction artistique.

## Objectif produit

Créer exactement trois pages fonctionnelles :

- `/` : accueil galerie contemporaine, avec présentation et navigation entre les deux univers, projets et collections ;
- `/architecture/villa-ke` : page projet immersive, architecture, vues du projet, récit, informations et navigation ;
- `/editions/chaise-1989` : page de mobilier présentée comme une œuvre de collection, avec galerie interactive, matériaux, dimensions et navigation.

Le site doit former une expérience continue. Depuis l'accueil, les cartes concernées mènent aux pages réelles. Depuis chaque page intérieure, on peut revenir à l'accueil et rejoindre l'autre univers. Aucun faux lien interne, aucune modal qui se substitue à une page quand une route dédiée existe, aucun bouton inerte.

## Stack choisie

- Astro en génération statique (SSG), TypeScript, CSS écrit sur mesure (CSS natif, variables de design, composants Astro).
- JavaScript côté client limité aux interactions nécessaires (menu, filtres, galerie, lightbox, éventuelles transitions légères).
- Éviter les bibliothèques UI volumineuses, les dépendances superflues et les animations lourdes.
- Ne pas installer WordPress, de CMS, de base de données, de système de réservation ni de formulaire fonctionnel : ils sont inutiles pour cette démonstration.
- Préparer des builds reproductibles et une arborescence claire (`src/pages/`, `src/layouts/`, `src/components/`, `src/styles/`, `src/data/`, `public/`).

## Direction artistique — à respecter

- Identité de la maquette n°2 : galerie contemporaine, graphisme éditorial, noirs profonds, blanc cassé, contrastes forts, grandes typographies, grands espaces, compositions asymétriques et photographies immersives.
- Bleu vif utilisé comme accent contrôlé, surtout associé à la collection 1989 ; ne pas en faire une couleur envahissante sur les projets d'architecture.
- Accueil : fort impact visuel et équilibre entre les deux studios.
- Architecture : déroulé narratif, rythme respirant, grandes images, immersion dans le lieu, données du projet discrètes.
- Mobilier : traitement galerie / catalogue d'exposition, pièce mise en valeur, zoom et détails des matières ; surtout pas une fiche e-commerce générique.
- Préserver l'esprit des maquettes fournies ; améliorer les points qui posent problème sans simplifier le design à l'excès.

## Images, textes et véracité

Les maquettes contiennent des URL d'images issues de sites tiers, dont les sites des studios. Recenser les images et leurs sources dans un fichier clair, centraliser les données des visuels et vérifier leur disponibilité. Ne pas télécharger, republier ni re-héberger des photographies sans autorisation. Prévoir des images de remplacement autorisées ou un rendu de secours élégant lorsque l'usage ou l'accès à un visuel est incertain. Indiquer clairement dans le README les médias à faire autoriser avant publication de la démonstration.

Reprendre fidèlement les informations déjà vérifiées sur les maquettes ; ne pas inventer de projets réalisés, prix, certifications, numéros d'édition, dates de livraison ou caractéristiques techniques.

Données vérifiables sur les pages officielles et utiles comme repères :
- Villa KE : projet dans le Finistère, surface de plancher 165 m², étude de 2023 au stade esquisse (vérifier les libellés du HTML fourni avant publication).
- Chaise 1989 : L 74 × P 71 × H 79 cm ; inox, inox miroir et satin de laine.

Insérer une mention discrète mais visible sur **chaque page** : « Concept indépendant de refonte — maquette non officielle réalisée par Devzair » (ou formulation équivalente). Le titre du document, les métadonnées et le pied de page ne doivent pas faire passer ce site pour le site officiel. Conserver des liens identifiés vers les véritables sites officiels. Ne pas inventer des coordonnées du propriétaire ou prétendre parler en leur nom.

## Fonctionnalités attendues

1. Header et footer communs, identité ST/ND propre à la maquette, navigation desktop et mobile, lien retour accueil.
2. Cartes et CTA associés aux deux pages intérieures. Les éléments non implémentés doivent rediriger clairement vers les sites officiels ou être supprimés proprement ; pas de `href="#"` sans rôle réel.
3. Filtres / commutation des univers conservés lorsque pertinents ; comportement intuitif, état visuel actif, gestion accessible au clavier.
4. Galerie mobilier avec commandes précédente/suivante, miniatures, intitulés et agrandissement accessible.
5. Micro-interactions soignées, mais respect strict de `prefers-reduced-motion`.
6. Mise en page robuste à 320, 360, 390, 768, 1024, 1440 px et plus, sans débordements horizontaux ni textes masqués.
7. Navigation cohérente au clavier, focus visibles, `alt` utiles, attributs ARIA seulement quand nécessaires, contraste et hiérarchie des titres.
8. Liens externes identifiables, sécurisés si `target="_blank"`.
9. Favicon, métadonnées par page, aperçu Open Graph explicitement marqué « concept non officiel » si un visuel autorisé est disponible.
10. `meta name="robots" content="noindex,nofollow"` sur toutes les pages de la démo, pour éviter leur indexation. Ne pas bloquer la lecture du meta noindex via un robots.txt contradictoire.

## Performances et qualité

Une capture Lighthouse réalisée sur la page d'accueil actuelle de Nouveau Standard affichait **64 en performance, 96 en accessibilité, 100 en bonnes pratiques et 92 en SEO**. C'est une mesure ponctuelle, pas un audit complet, et ce n'est pas un reproche sur leur technologie. Cette démonstration doit viser un site léger et très soigné, mais sans annoncer de score garanti.

- HTML sémantique, CSS rationalisé, JavaScript minimal.
- Gestion des tailles d'images et proportions pour éviter le CLS ; responsive `srcset` / `sizes` si les visuels autorisés le permettent ; priorité au visuel LCP, chargement différé des images situées hors écran.
- Éviter les animations bloquantes, les grandes dépendances et le chargement de médias inutiles.
- Polices limitées, optimisées et hébergées localement seulement si les licences le permettent ; font-display adapté.
- Aucun service de suivi, analytics ou cookie non nécessaire.
- Objectif indicatif : très bonne expérience mobile et Lighthouse idéalement >= 90 après optimisation, mais rapporter les scores réellement mesurés, les conditions et les limites liées aux images externes.

## Déploiement

Préparer deux modes :

**A. Vercel, prioritaire :** repo Git autonome, `npm install`, `npm run dev`, `npm run build`, Astro statique reconnu par Vercel, sortie `dist/`. Ajouter dans le README les étapes pour connecter le repo à Vercel, obtenir l'URL `*.vercel.app`, et relier éventuellement `concept-standard.devzair.fr` selon les paramètres DNS réellement fournis par Vercel. Ne pas inventer la valeur du DNS.

**B. VPS + Caddy, optionnel :** build statique `dist/` directement servi par Caddy ; donner un exemple de configuration Caddy à adapter au domaine et au chemin local, sans toucher à la configuration Caddy de mon serveur.

Ne modifier aucun site existant, aucun DNS, aucune configuration de production et ne déclencher aucun déploiement public sans me le demander explicitement.

## Validation et ressources machine

Avant de coder : donner un résumé concis de l'architecture envisagée et les éventuels points bloquants. Ensuite, réaliser le code, pas seulement un plan.

À la fin :
- `npm run build` doit réussir ; ajouter `npm run check` si les outils de vérification appropriés sont présents ;
- tester les liens internes, les menus, les interactions essentielles, la navigation clavier et les trois pages ;
- vérifier un viewport mobile et un viewport desktop au minimum, idéalement les largeurs listées ;
- identifier les images manquantes et les liens externes ;
- fournir les commandes exactes de lancement local et de déploiement, plus le résumé des fichiers créés ;
- documenter les points qui exigent ma décision (notamment droits sur les images et URL finale) ;
- ne pas inventer de tests, de captures ou de scores Lighthouse non réellement exécutés ;
- pour économiser la RAM, éviter les audits lourds lancés en parallèle, les batteries de tests superflues et plusieurs navigateurs de test simultanés.

Ne fais ni commit, ni push Git, ni déploiement sans mon accord. Livre le site local prêt à être prévisualisé, construit et publié après mon feu vert.
