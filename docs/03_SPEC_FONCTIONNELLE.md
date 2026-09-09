# SPÉCIFICATION FONCTIONNELLE — CAR ONE PLUS

## Parcours locataire
Accueil → position/date → recherche → carte/liste → filtres → fiche → protection/options → identité → paiement → contrat → réservation → accès → check-in → trajet → assistance → check-out → facture → avis.

## Parcours propriétaire
Créer compte → KYC → ajouter bien → documents → photos → caractéristiques → prix → calendrier → règles → mode d'accès → publication → réservation → notification → préparation → check-in → location → check-out → validation → versement → statistiques.

## Parcours professionnel
Créer organisation → KYC société → ajouter collaborateurs → rôles → importer flotte → documents → règles tarifaires → disponibilité → réservations → contrats → clients → maintenance → sinistres → comptabilité → reporting.

## Rôles professionnels
- Owner/Administrateur
- Fleet manager
- Agent
- Comptabilité
- Support
- Lecture seule

## Règles de disponibilité
Un véhicule ne peut pas être réservé sur une période bloquée, en maintenance, immobilisée, en sinistre ou déjà réservée.
Les modifications tarifaires doivent être historisées.

## Réservation instantanée
Activable par propriétaire/professionnel si toutes les conditions sont satisfaites.
Sinon réservation soumise à validation.

## Annulation
Moteur de règles configurable selon :
- délai avant départ ;
- motif ;
- catégorie ;
- propriétaire/professionnel ;
- protection ;
- incident.

## Dépôt de garantie
Préautorisation ou autre mécanisme compatible avec le prestataire de paiement.
Libération automatique après clôture si aucun dossier n'est ouvert.

## Livraison
Optionnelle :
- point de retrait ;
- adresse ;
- créneau ;
- coût ;
- confirmation ;
- preuve de remise.

## Multi-conducteurs
Ajout de conducteurs autorisés, avec vérification avant prise en main.
Chaque conducteur est rattaché à la réservation.

## Utilitaires
Champs spécifiques :
- longueur ;
- hauteur ;
- volume ;
- charge utile ;
- nombre de palettes ;
- attelage ;
- permis requis ;
- restrictions de circulation.

## Véhicules connectés
Abstraction API télématique permettant :
- lock/unlock ;
- position ;
- batterie/carburant ;
- odomètre ;
- statut portes ;
- événements ;
- diagnostic limité.

## Centre de confiance
Score interne non visible ou partiellement visible :
- identité validée ;
- permis validé ;
- historique ;
- annulations ;
- incidents ;
- paiements ;
- avis.

Ne pas transformer automatiquement ce score en décision juridique ou discriminatoire : règles de risque documentées et contrôlées.

## Support
Ticket lié à utilisateur + réservation + véhicule + événement.
Priorités P1/P2/P3/P4.
