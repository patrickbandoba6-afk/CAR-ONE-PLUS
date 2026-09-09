# CAHIER DES CHARGES — CAR ONE PLUS

## 1. Objet
Concevoir une application mobile et une plateforme web permettant la location de véhicules entre particuliers et professionnels, avec gestion de flotte, réservation, paiement, vérification, état des lieux, assistance, géolocalisation et revenus propriétaires.

## 2. Objectifs
- Réduire au maximum la friction de réservation.
- Permettre la location autonome lorsque le véhicule est équipé.
- Permettre aussi la remise de clés classique.
- Permettre aux propriétaires de monétiser leurs véhicules.
- Donner aux professionnels un outil de flotte complet.
- Centraliser les contrats, paiements, documents et incidents.
- Préparer l'intégration de véhicules connectés.
- Construire une architecture extensible aux utilitaires et catégories premium.

## 3. Types de comptes

### A. Locataire
Particulier ou entreprise qui réserve un bien.
Fonctions : recherche, filtres, réservation, paiement, documents, conducteur additionnel, état des lieux, assistance, messages, avis.

### B. Propriétaire particulier
Met un ou plusieurs biens en location.
Fonctions : annonce, calendrier, prix, réservation instantanée, revenus, paiements, maintenance, documents, assurance/protection, état des lieux, incidents.

### C. Professionnel / concessionnaire / flotte
Gère un parc et plusieurs collaborateurs.
Fonctions : multi-véhicules, utilisateurs et rôles, contrats, clients, facturation, maintenance, reporting, API, intégration télématique.

Un compte peut demander une évolution vers le profil professionnel après vérification des documents.

## 4. Catalogue
- citadine ;
- compacte ;
- berline ;
- SUV ;
- premium ;
- luxe ;
- électrique ;
- utilitaire ;
- fourgon ;
- camion ;
- moto ;
- scooter ;
- vélo ;
- trottinette ;
- bateau/yacht ;
- aéronef/jet (module réglementé distinct).

Chaque catégorie possède ses propres règles d'éligibilité, permis, assurance, dépôt, documents, limites et parcours.

## 5. Recherche
Recherche par :
- position actuelle ;
- adresse ;
- gare/aéroport ;
- destination ;
- dates/heures ;
- durée ;
- catégorie ;
- budget.

Résultats en liste + carte.
Tri : pertinence, distance, prix, note, disponibilité, réservation instantanée.

## 6. Tarification
Le moteur doit gérer :
- prix minute/heure/jour ;
- prix semaine/mois ;
- tarifs saisonniers ;
- tarification dynamique optionnelle ;
- frais de livraison ;
- frais de service ;
- dépôt de garantie ;
- kilométrage inclus ;
- kilomètres supplémentaires ;
- options ;
- protections ;
- frais d'annulation ;
- frais de nettoyage ;
- frais de retard ;
- frais liés aux dommages selon contrat.

## 7. Commission
Règle de base : 5 % du montant de location applicable à la transaction, avant ou après certaines composantes selon la politique financière définie avec le prestataire de paiement.
Le moteur doit permettre de modifier la règle par catégorie, marché, partenaire ou promotion.

Exemple :
Location 500 € → commission cible 50 € → solde propriétaire 450 €, hors frais qui doivent être définis contractuellement.

## 8. Réservation
Étapes :
1. Recherche
2. Sélection
3. Vérification des conditions
4. Authentification du locataire
5. Options
6. Prix final
7. Paiement/préautorisation
8. Contrat électronique
9. Confirmation
10. Instructions d'accès
11. Check-in
12. Location active
13. Check-out
14. Contrôle
15. Clôture
16. Versement propriétaire
17. Avis.

## 9. Accès au véhicule
Trois modes :
- clé digitale/télématique ;
- remise des clés sur rendez-vous ;
- agence/point partenaire.

La clé digitale n'est disponible que si le véhicule et le dispositif connecté le permettent.

## 10. Géolocalisation
- position des véhicules disponibles ;
- navigation vers le véhicule ;
- géofencing ;
- zone d'utilisation ;
- localisation pendant location selon consentements et base légale ;
- alertes de déplacement anormal ;
- journal d'événements ;
- mode confidentialité hors location lorsque applicable.

## 11. Check-in / check-out
Check-in obligatoire :
- identité ;
- permis ;
- selfie ou contrôle prévu ;
- photos ;
- kilométrage ;
- carburant/batterie ;
- dommages préexistants ;
- validation.

Check-out :
- photos ;
- kilométrage ;
- carburant/batterie ;
- dommages ;
- nettoyage ;
- retard ;
- verrouillage ;
- clôture.

## 12. Dommages et sinistres
Un centre de résolution doit permettre :
- déclaration ;
- photos/vidéo ;
- chronologie ;
- localisation ;
- témoins/documents ;
- estimation ;
- validation ;
- communication ;
- décision selon contrat et assurance ;
- suivi du dossier ;
- archivage.

## 13. Paiements
- carte bancaire ;
- portefeuille interne éventuel ;
- préautorisation dépôt ;
- remboursement ;
- versement propriétaire ;
- factures ;
- reçus ;
- TVA/facturation professionnelle ;
- rapprochement comptable.

Le choix du prestataire de paiement devra être fait après étude juridique et tarifaire.

## 14. Messagerie
Messagerie liée à chaque réservation :
- locataire/propriétaire ;
- professionnel/client ;
- support CAR ONE PLUS ;
- pièces jointes ;
- messages automatiques ;
- modèles de réponse ;
- journalisation.

## 15. Notifications
Push, email et SMS selon événement :
- réservation ;
- paiement ;
- rappel ;
- accès ;
- retour ;
- incident ;
- paiement propriétaire ;
- document expirant ;
- maintenance ;
- message.

## 16. Avis
Après chaque location :
- note globale ;
- propreté ;
- exactitude de l'annonce ;
- communication ;
- ponctualité ;
- véhicule ;
- commentaire ;
- droit de réponse ;
- modération.

## 17. Assistance
Centre 24/7 avec :
- panne ;
- accident ;
- crevaison ;
- perte de clé ;
- véhicule introuvable ;
- problème d'accès ;
- urgence ;
- remorquage via partenaire ;
- procédure sinistre.

## 18. Back-office CAR ONE PLUS
Dashboard :
- locations en cours ;
- chiffre d'affaires ;
- commission ;
- incidents ;
- véhicules actifs ;
- utilisateurs ;
- alertes ;
- remboursements ;
- paiements en attente.

Gestion :
- utilisateurs ;
- véhicules ;
- annonces ;
- réservations ;
- paiements ;
- contrats ;
- assurances ;
- sinistres ;
- litiges ;
- promotions ;
- contenu ;
- support ;
- partenaires ;
- audit.

## 19. Sécurité
- authentification forte ;
- chiffrement en transit et au repos ;
- séparation des rôles ;
- journal d'audit ;
- limitation des accès administrateurs ;
- détection fraude ;
- contrôle appareil/session ;
- sauvegardes ;
- plan de reprise ;
- suppression/export des données selon règles applicables.

## 20. Conformité
Le produit doit être validé avec juristes, assureurs et partenaires spécialisés avant commercialisation. Les règles d'assurance, de permis, de fiscalité, de location professionnelle, de données personnelles, de signature électronique et de télématique doivent être adaptées au pays et à chaque catégorie de bien.

## 21. Non-fonctionnel
Objectifs :
- app fluide ;
- disponibilité élevée ;
- API versionnée ;
- observabilité ;
- logs centralisés ;
- tests automatisés ;
- temps de réponse cible < 2 secondes sur les écrans courants hors dépendances externes ;
- architecture scalable.

## 22. Plateformes
- iOS ;
- Android ;
- web locataire ;
- web propriétaire ;
- web professionnel ;
- back-office.

## 23. Langues
V1 : français.
Architecture prête pour anglais, espagnol, italien, allemand et autres marchés.

## 24. MVP
Priorité :
1. comptes ;
2. vérification ;
3. catalogue ;
4. carte ;
5. recherche ;
6. réservation ;
7. paiement ;
8. contrats ;
9. check-in/out ;
10. annonces propriétaires ;
11. revenus ;
12. support ;
13. back-office ;
14. avis.

## 25. V2
- clé digitale ;
- télématique ;
- livraison ;
- tarification dynamique ;
- abonnement ;
- flotte professionnelle avancée ;
- API partenaires.

## 26. V3
- utilitaires/camions avancés ;
- marketplace multi-pays ;
- catégorie premium ;
- intégrations constructeurs ;
- scoring de risque ;
- automatisation avancée.
