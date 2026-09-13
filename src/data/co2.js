// Facteurs d'émission indicatifs (g CO2e/km) par catégorie — ordre de grandeur
// pour donner un repère au locataire, pas une mesure certifiée (aucun
// partenaire carbone n'est encore sélectionné, voir 04_ARCHITECTURE_TECHNIQUE.md).
// Catégories sans trajet routier mesurable (yacht/aéronef/jet) sont omises :
// leur empreinte se calcule en heures de navigation/vol, pas en km.
export const CO2_FACTORS_G_PER_KM = {
  citadine: 110, compacte: 120, berline: 140, suv: 180, premium: 170, luxe: 190,
  electrique: 15, utilitaire: 220, fourgon: 230, camion: 280,
  moto: 90, scooter: 60, velo: 0, trottinette: 5,
};

// Estimation à partir d'un kilométrage (ex. km inclus/jour × jours de location)
// — retourne des kg de CO2e, ou null si la catégorie n'a pas de facteur routier.
export function estimateTripCo2Kg(category, distanceKm) {
  const factor = CO2_FACTORS_G_PER_KM[category];
  if (factor == null || !distanceKm) return null;
  return Math.round((factor * distanceKm) / 100) / 10;
}
