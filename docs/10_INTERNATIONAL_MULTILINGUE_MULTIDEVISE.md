# CAR ONE PLUS — INTERNATIONAL / MULTILINGUE / MULTI-DEVISE

## Vision
CAR ONE PLUS est conçu comme une plateforme mondiale de location et de mise à disposition de véhicules, avec déploiement progressif par pays. L'application doit pouvoir fonctionner en Europe, en Afrique, au Moyen-Orient, en Amérique et dans d'autres marchés.

## Langues
Architecture i18n dès le MVP.
Langues initiales recommandées :
- Français
- Anglais
- Arabe
- Espagnol
- Portugais
- Allemand
- Italien

Prévoir l'ajout de langues africaines et régionales selon les marchés, notamment :
- Wolof
- Lingala
- Swahili
- Bambara
- Haoussa
- Yoruba
- Amharique

Le contenu doit être traduit via des clés de traduction et non codé en dur.
Support RTL obligatoire pour l'arabe.

## Devises
Le moteur financier doit gérer plusieurs devises, notamment :
- EUR
- USD
- GBP
- CHF
- CAD
- XOF
- XAF
- MAD
- DZD
- TND
- NGN
- GHS
- KES
- ZAR
- AED

La devise affichée par défaut dépend de la région de l'utilisateur, mais le prix réellement facturé et la devise de règlement du propriétaire doivent être clairement distingués.

## Conversion des prix
La conversion affichée peut utiliser un taux de change provenant d'un fournisseur financier.
Le taux et l'heure du taux doivent être enregistrés pour chaque devis.
Pour une transaction, le montant final facturé doit être figé avant paiement.

## Commission mondiale
Commission CAR ONE PLUS : 5 % par location comme règle de base.

Exemple :
- Location : 500 €
- Commission CAR ONE PLUS : 25 €
- Part propriétaire : 475 €
avant autres frais applicables.

Le back-office doit permettre de configurer des exceptions par pays, catégorie, partenaire ou contrat, tout en gardant 5 % comme règle commerciale par défaut.

## Afrique
Le produit doit permettre :
- recherche de véhicules par ville/pays ;
- réservation locale ;
- paiement adapté au marché ;
- devise locale ;
- numéros de téléphone internationaux ;
- documents et permis locaux ;
- assurance locale ;
- assistance locale ;
- propriétaires particuliers ;
- sociétés de location ;
- concessionnaires ;
- flottes professionnelles.

Les moyens de paiement doivent être sélectionnés marché par marché, avec prise en charge éventuelle des cartes, wallets et solutions de paiement mobile lorsque disponibles et juridiquement adaptées.

## Pays
Créer une configuration par pays :
CountryConfig
- country_code
- supported_languages
- default_currency
- supported_currencies
- driving_side
- phone_prefix
- document_rules
- licence_rules
- insurance_rules
- tax_rules
- payment_methods
- cancellation_rules
- age_rules
- vehicle_categories
- legal_documents
- active_status

## Prix
Un véhicule peut avoir :
- prix local ;
- prix de base ;
- prix par heure/jour/semaine/mois ;
- taxes ;
- frais ;
- dépôt ;
- protection ;
- commission 5 % ;
- conversion d'affichage.

L'utilisateur doit voir clairement :
Prix de location
+ frais
+ protection éventuelle
+ taxes applicables
= Total à payer

## Documents et permis
La plateforme ne doit pas supposer qu'un permis français, européen ou autre est automatiquement valable partout.
Chaque pays et catégorie doit avoir une règle d'éligibilité configurable.
Des documents supplémentaires peuvent être demandés selon le pays.

## Identité et téléphones
Support :
- indicatif international ;
- OTP ;
- vérification d'identité ;
- document de voyage si nécessaire ;
- profil entreprise pour les professionnels.

## Cartographie
Recherche mondiale par :
- pays ;
- ville ;
- adresse ;
- aéroport ;
- gare ;
- point d'intérêt ;
- position actuelle.

## Fuseaux horaires
Toutes les dates sont stockées en UTC.
L'interface affiche l'heure locale du lieu de prise en charge.
Les contrats et confirmations indiquent explicitement le fuseau.

## Fiscalité
Le moteur fiscal doit être paramétrable par pays.
Ne jamais appliquer automatiquement une règle française à un autre marché.

## Données personnelles
Une architecture mondiale doit prévoir les règles applicables aux transferts internationaux de données. Pour les données relevant du RGPD, les transferts hors EEE nécessitent une base et des garanties appropriées, par exemple une décision d'adéquation ou des mécanismes contractuels appropriés. citeturn0search0turn0search4

## Déploiement
Phase 1 : France / Europe
Phase 2 : Afrique francophone
Phase 3 : Afrique anglophone et lusophone
Phase 4 : Moyen-Orient
Phase 5 : Amériques et autres marchés

Cette roadmap est indicative : chaque ouverture de pays doit être conditionnée à la validation des assurances, paiements, fiscalité, réglementation de location, permis et protection des données.

## Expérience
L'utilisateur choisit au premier lancement :
Pays / région → langue → devise.
Ces paramètres restent modifiables dans Compte > Préférences.

## Principe produit
CAR ONE PLUS doit donner l'impression d'une seule application mondiale, mais son moteur interne doit appliquer les règles locales du pays où la location a lieu.
