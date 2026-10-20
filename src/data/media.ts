/** Original URLs inventoried from all three supplied mockups. No photo is copied.
 * Rights must be cleared before enabling remote display. See docs/MEDIAS.md. */
export type Media = {
  id: string;
  source: string;
  sourcePage: string;
  alt: string;
  width: number;
  height: number;
  fallback: string;
  fallbackAlt: string;
  credit: string;
};

const chairFallback = '/illustrations/chair.svg';
const architectureFallback = '/illustrations/landscape.svg';
const ns = 'https://nouveaustandard.fr/';
const at = 'https://atelierstandard.fr/';

export const media = {
  chair: { id: 'chair', source: `${ns}wp-content/uploads/2026/09/NS1989-WEB-13-683x1024.jpg`, sourcePage: ns, alt: 'Chaise 1989 de Nouveau Standard, métal et textile bleu', width: 683, height: 1024, fallback: chairFallback, fallbackAlt: 'Illustration d’intention d’une assise bleue et métallique ; ne représente pas fidèlement la Chaise 1989', credit: 'Nouveau Standard — auteur à confirmer' },
  chairInterior: { id: 'chairInterior', source: `${ns}wp-content/uploads/2026/01/1989-VueChaise-683x1024.jpeg`, sourcePage: ns, alt: 'Chaise 1989 présentée dans un intérieur de collection', width: 683, height: 1024, fallback: '/illustrations/chair-interior.svg', fallbackAlt: 'Composition conceptuelle d’une assise dans un espace abstrait ; aucun intérieur réel représenté', credit: 'Nouveau Standard — auteur à confirmer' },
  collection: { id: 'collection', source: `${ns}wp-content/uploads/2026/09/NS1989-WEB-25_CreditPhotoPaulin-Giret-1024x683.jpg`, sourcePage: ns, alt: 'Ensemble de mobilier de la collection 1989', width: 1024, height: 683, fallback: '/illustrations/collection.svg', fallbackAlt: 'Composition graphique de formes bleues et métalliques, évocation libre de mobilier', credit: 'Paulin Giret (nom dans le fichier, crédit à confirmer)' },
  table: { id: 'table', source: `${ns}wp-content/uploads/2025/08/NS_1976-28-WEB-1024x683.jpg`, sourcePage: ns, alt: 'Table 1976, bois sombre et pierre de lave', width: 1024, height: 683, fallback: '/illustrations/table.svg', fallbackAlt: 'Illustration d’intention d’une table sculpturale ; ne représente pas fidèlement la Table 1976', credit: 'Nouveau Standard — auteur à confirmer' },
  chair76: { id: 'chair76', source: `${ns}wp-content/uploads/2025/08/NS_1976-15-WEB_CreditPhotoPaulinGiret-683x1024.jpg`, sourcePage: ns, alt: 'Chaise 1976, bois et textile', width: 683, height: 1024, fallback: '/illustrations/table.svg', fallbackAlt: 'Étude graphique de matière bois ; photographie non affichée', credit: 'Paulin Giret (nom dans le fichier, crédit à confirmer)' },
  desk: { id: 'desk', source: `${ns}wp-content/uploads/2026/01/1989-VueBureauNPS-1024x640.jpeg`, sourcePage: ns, alt: 'Bureau de la collection 1989', width: 1024, height: 640, fallback: '/illustrations/collection.svg', fallbackAlt: 'Composition d’intention de mobilier métallique ; photographie non affichée', credit: 'Nouveau Standard — auteur à confirmer' },
  villa: { id: 'villa', source: `${at}wp-content/uploads/2024/06/Vue-01-1.jpg`, sourcePage: `${at}maison-ke/`, alt: 'Perspective du projet Villa KE, Atelier Standard', width: 1600, height: 1000, fallback: architectureFallback, fallbackAlt: 'Paysage architectural conceptuel ; illustration libre, distincte des perspectives réelles de Villa KE', credit: 'Atelier Standard — auteur de la perspective à confirmer' },
  villaDetail: { id: 'villaDetail', source: `${at}wp-content/uploads/2024/06/Vue-03.jpg`, sourcePage: `${at}maison-ke/`, alt: 'Perspective de la façade et du paysage du projet Villa KE', width: 1600, height: 1000, fallback: '/illustrations/facade.svg', fallbackAlt: 'Étude abstraite de façade et de lumière ; ne représente pas le projet Villa KE', credit: 'Atelier Standard — auteur à confirmer' },
  villaSide: { id: 'villaSide', source: `${at}wp-content/uploads/2024/06/Vue-02-.jpg`, sourcePage: `${at}maison-ke/`, alt: 'Perspective latérale du projet Villa KE', width: 1600, height: 1000, fallback: '/illustrations/landscape.svg', fallbackAlt: 'Composition architecturale et végétale d’intention ; aucun bâtiment réel représenté', credit: 'Atelier Standard — auteur à confirmer' },
  domaineDA: { id: 'domaineDA', source: `${at}wp-content/uploads/2024/06/Vue-3.jpg`, sourcePage: `${at}architecture/`, alt: 'Projet Domaine DA, Atelier Standard', width: 1600, height: 1000, fallback: architectureFallback, fallbackAlt: 'Paysage architectural conceptuel ; photographie non affichée', credit: 'Atelier Standard — auteur à confirmer' },
  villaCH: { id: 'villaCH', source: `${at}wp-content/uploads/2026/06/Vue-Sud-Keret.png`, sourcePage: `${at}architecture/`, alt: 'Projet Villa CH à Sarzeau', width: 1600, height: 1000, fallback: '/illustrations/facade.svg', fallbackAlt: 'Étude abstraite de façade ; photographie non affichée', credit: 'Atelier Standard — auteur à confirmer' },
  domaineDE: { id: 'domaineDE', source: `${at}wp-content/uploads/2025/04/Maquette2-copie.jpg`, sourcePage: `${at}architecture/`, alt: 'Maquette architecturale du Domaine DE', width: 1600, height: 1000, fallback: architectureFallback, fallbackAlt: 'Composition d’intention ; maquette réelle non affichée', credit: 'Atelier Standard — auteur à confirmer' },
} satisfies Record<string, Media>;

export const useOfficialMedia = import.meta.env.PUBLIC_USE_OFFICIAL_MEDIA === 'true';

export function displayMedia(item: Media) {
  return {
    src: useOfficialMedia ? item.source : item.fallback,
    alt: useOfficialMedia ? item.alt : item.fallbackAlt,
    note: useOfficialMedia ? `Source : ${item.credit}` : 'Illustration d’intention · Devzair',
  };
}

export const chairSlides = [
  { media: media.chair, title: 'La pièce.', label: 'La silhouette', description: 'Le métal, le textile. Une rencontre de lignes et de volumes.' },
  { media: media.chairInterior, title: 'En situation.', label: 'L’espace', description: 'Changer de point de vue. Un objet se lit aussi dans l’espace qui l’entoure.' },
  { media: media.collection, title: 'Un ensemble.', label: 'La collection', description: 'Élargir le regard aux autres pièces de la collection 1989.' },
];
