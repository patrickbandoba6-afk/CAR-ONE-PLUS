# MODÈLE DE DONNÉES & API — CAR ONE PLUS

## Entités principales
User
Organization
DriverProfile
Vehicle
VehicleDocument
Listing
Availability
PriceRule
Booking
BookingDriver
Payment
Payout
Deposit
Contract
Inspection
Damage
Incident
InsurancePolicy
MessageThread
Message
Review
Maintenance
SupportTicket
Notification
Promo
AuditLog
TelematicsDevice
TelematicsEvent

## Vehicle
id, owner_id, organization_id, category, make, model, version, year, registration_country, registration_masked, seats, transmission, fuel_type, mileage, location, status, connected_device_id.

## Listing
id, vehicle_id, title, description, photos, pricing_profile, instant_booking, delivery_enabled, pickup_mode, rules, published_at, status.

## Booking
id, listing_id, renter_id, start_at, end_at, status, subtotal, platform_fee, owner_payout, deposit_amount, protection_amount, options_amount, total, currency.

## Inspection
id, booking_id, phase, mileage, fuel_level, battery_level, photos, video, checklist, timestamp, geolocation, validated_by.

## API exemples
POST /v1/auth/register
POST /v1/identity/verify
GET /v1/search
GET /v1/listings/{id}
POST /v1/bookings/quote
POST /v1/bookings
POST /v1/bookings/{id}/payment
POST /v1/bookings/{id}/check-in
POST /v1/bookings/{id}/check-out
POST /v1/vehicles
PATCH /v1/vehicles/{id}
GET /v1/owners/dashboard
GET /v1/fleet/dashboard
POST /v1/incidents
GET /v1/support/tickets

## Webhooks
payment.succeeded
payment.failed
booking.created
booking.confirmed
booking.cancelled
vehicle.locked
vehicle.unlocked
telematics.alert
inspection.completed
payout.paid

## Principes
- API REST/JSON pour le MVP.
- OpenAPI obligatoire.
- Idempotency-Key sur opérations financières.
- RBAC sur toutes les routes privées.
- Journal d'audit sur actions sensibles.
