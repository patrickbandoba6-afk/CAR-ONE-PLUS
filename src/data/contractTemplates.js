// Modèles de documents consultables avant toute réservation réelle — chaque
// contrat effectif (voir PaymentScreen.js → createContract) reprend la même
// structure, complétée automatiquement avec les vraies parties/dates/montant.
export const CONTRACT_TEMPLATES = [
  {
    id: 'rental', icon: 'car-sport-outline', title: 'Contrat de location',
    body: "Régit la mise à disposition d'un bien (véhicule, moto, vélo, trottinette, yacht, aéronef, jet privé...) entre le propriétaire/professionnel et le locataire pour la durée réservée.",
    clauses: [
      'Identification des parties et du bien loué',
      'Période, lieu de prise en charge et de restitution',
      'Prix, dépôt de garantie et modalités de paiement',
      'Kilométrage inclus et facturation des dépassements',
      "État des lieux d'entrée et de sortie",
      "Responsabilités et conduite à tenir en cas de dommage",
    ],
  },
  {
    id: 'insurance', icon: 'shield-checkmark-outline', title: 'Conditions d\'assurance / protection',
    body: "Détaille la couverture applicable pendant la location : franchise, protection renforcée optionnelle, exclusions et procédure de déclaration de sinistre.",
    clauses: [
      'Couverture de base incluse dans la location',
      'Option « Protection renforcée » et réduction de franchise',
      'Exclusions de garantie',
      'Procédure de déclaration en cas de sinistre',
    ],
  },
  {
    id: 'professional', icon: 'briefcase-outline', title: 'Contrat professionnel (flotte)',
    body: "Cadre la mise en location de biens par un compte professionnel : commission plateforme, versements, obligations documentaires par catégorie de bien.",
    clauses: [
      'Commission CAR ONE PLUS (5%) prélevée sur chaque location',
      'Fréquence et modalités des versements',
      'Documents obligatoires par catégorie de bien (carte grise, assurance, certificats...)',
      "Modération des annonces avant publication",
    ],
  },
  {
    id: 'extra_driver', icon: 'person-add-outline', title: 'Autorisation conducteur additionnel',
    body: "Autorise une personne supplémentaire, déclarée et vérifiée, à conduire le véhicule loué pendant la durée de la réservation.",
    clauses: [
      'Identité et permis du conducteur additionnel',
      'Responsabilité solidaire avec le titulaire de la réservation',
      "Validité limitée à la durée de la réservation en cours",
    ],
  },
];
