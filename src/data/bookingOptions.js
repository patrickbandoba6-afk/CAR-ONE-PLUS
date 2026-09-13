// Options de réservation — partagées entre OptionsScreen (sélection) et
// PaymentScreen (calcul du prix) pour éviter que les deux divergent.
// unit: 'day' = facturé par jour de location ; 'flat' = forfait unique.
export const BOOKING_OPTIONS = [
  { id: 'protection', label: 'Protection renforcée', desc: 'Réduit votre franchise en cas de dommage', priceMinor: 1500, unit: 'day' },
  { id: 'extra_driver', label: 'Conducteur additionnel', desc: 'Ajoutez un conducteur vérifié', priceMinor: 800, unit: 'day' },
  { id: 'child_seat', label: 'Siège bébé', desc: 'Fourni par le loueur', priceMinor: 500, unit: 'day' },
  {
    id: 'delivery', label: "Livraison à l'adresse", unit: 'flat', priceMinor: 2000, requiresAddress: true,
    desc: "Vous ne récupérez pas le véhicule vous-même : le propriétaire vous le livre à l'adresse de votre choix, en forfait unique facturé en plus de la location.",
  },
];

export function optionPrice(id) {
  return BOOKING_OPTIONS.find((o) => o.id === id)?.priceMinor || 0;
}

// Décompose une liste d'options sélectionnées en montants (minor units) pour
// computePriceBreakdown — protection et livraison restent des postes à part,
// le reste (siège bébé, conducteur additionnel...) est sommé dans optionsMinor.
export function computeOptionsBreakdown(selectedIds = [], days = 1) {
  let protectionMinor = 0;
  let deliveryMinor = 0;
  let optionsMinor = 0;
  selectedIds.forEach((id) => {
    const opt = BOOKING_OPTIONS.find((o) => o.id === id);
    if (!opt) return;
    const amount = opt.unit === 'day' ? opt.priceMinor * days : opt.priceMinor;
    if (id === 'protection') protectionMinor += amount;
    else if (id === 'delivery') deliveryMinor += amount;
    else optionsMinor += amount;
  });
  return { protectionMinor, deliveryMinor, optionsMinor };
}
