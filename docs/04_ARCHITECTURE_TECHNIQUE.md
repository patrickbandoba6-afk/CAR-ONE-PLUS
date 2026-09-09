# ARCHITECTURE TECHNIQUE — CAR ONE PLUS

## Frontends
- Mobile : Flutter ou React Native.
- Web : Next.js/React.
- Back-office : Next.js/React.

## Backend
Architecture modulaire :
- Identity Service
- User/KYC Service
- Vehicle Service
- Listing Service
- Availability Service
- Pricing Service
- Booking Service
- Payment Service
- Contract Service
- Inspection/Damage Service
- Telematics Service
- Notification Service
- Messaging Service
- Support Service
- Review Service
- Fleet Service
- Reporting Service

Une architecture monolithique modulaire peut être choisie pour le MVP, avec séparation progressive des services à mesure que le volume augmente.

## Données
Base relationnelle : PostgreSQL.
Cache : Redis.
Recherche géographique : PostGIS.
Fichiers : stockage objet compatible S3.
Événements : bus de messages.
Analytics : entrepôt ou solution BI.

## Cartographie
Fournisseur cartographique à sélectionner selon couverture, coût, géocodage, itinéraire et licence.

## Paiement
Prestataire PSP à sélectionner.
Webhooks signés obligatoires.
Aucun stockage de données carte sensibles dans CAR ONE PLUS.

## KYC
Fournisseur spécialisé pour :
- identité ;
- permis ;
- selfie/liveness si retenu ;
- société/UBO pour professionnels.

## Télématique
Créer une couche d'intégration commune afin que plusieurs boîtiers/fournisseurs puissent être utilisés.

## Observabilité
- logs structurés ;
- métriques ;
- traces ;
- alertes ;
- audit métier.

## Sécurité
- OAuth/OIDC ;
- MFA pour comptes sensibles ;
- RBAC ;
- secrets manager ;
- chiffrement ;
- rotation clés ;
- WAF ;
- rate limiting ;
- détection fraude.

## Environnements
- local
- dev
- staging
- production

CI/CD avec tests unitaires, intégration, end-to-end et déploiement contrôlé.
