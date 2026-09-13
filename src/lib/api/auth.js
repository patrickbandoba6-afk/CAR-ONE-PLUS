import { supabase } from '../supabase';

// Toute la logique "compte" côté Supabase passe par ici — un seul endroit
// qui sait mapper la table `profiles` (source de vérité pour account_type)
// vers/depuis l'état applicatif. Voir supabase/schema.sql pour le schéma et
// les policies RLS qui empêchent un client de contourner account_type.

function mapProfileRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    accountType: row.account_type === 'professional' ? 'professional' : 'individual',
    fullName: row.full_name || '',
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    dateOfBirth: row.date_of_birth || null,
    phone: row.phone || '',
    avatarUri: row.avatar_url || null,
    addressLine: row.address_line || '',
    city: row.city || '',
    postalCode: row.postal_code || '',
    identityVerified: Boolean(row.identity_verified),
    licenceVerified: Boolean(row.licence_verified),
    addressVerified: Boolean(row.address_verified),
  };
}

// Lit le profil applicatif (et donc account_type) depuis la base — jamais
// depuis un état client — après restauration de session ou connexion.
export async function fetchMyProfile(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error || !data) return null;
  return mapProfileRow(data);
}

// Écrit account_type UNE SEULE FOIS, à la création du profil, juste après
// auth.signUp — jamais dans un flux de mise à jour ultérieure (voir le
// trigger `profiles_account_type_immutable` dans supabase/schema.sql qui
// refuse toute tentative de modification côté serveur, même si ce garde-fou
// applicatif était contourné).
export async function createMyProfile({ id, email, accountType, fullName }) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id, account_type: accountType === 'professional' ? 'professional' : 'individual', full_name: fullName || null })
    .select('*')
    .single();
  if (error) throw error;
  return mapProfileRow(data);
}

export async function updateMyProfile(userId, patch) {
  if (!supabase || !userId) return null;
  // account_type volontairement absent des champs mappés ci-dessous : ce
  // endpoint ne doit jamais pouvoir le modifier (voir trigger côté base).
  const row = {};
  if (patch.fullName !== undefined) row.full_name = patch.fullName;
  if (patch.firstName !== undefined) row.first_name = patch.firstName;
  if (patch.lastName !== undefined) row.last_name = patch.lastName;
  if (patch.dateOfBirth !== undefined) row.date_of_birth = patch.dateOfBirth;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.avatarUri !== undefined) row.avatar_url = patch.avatarUri;
  if (patch.addressLine !== undefined) row.address_line = patch.addressLine;
  if (patch.city !== undefined) row.city = patch.city;
  if (patch.postalCode !== undefined) row.postal_code = patch.postalCode;
  if (patch.identityVerified !== undefined) row.identity_verified = patch.identityVerified;
  if (patch.licenceVerified !== undefined) row.licence_verified = patch.licenceVerified;
  if (patch.addressVerified !== undefined) row.address_verified = patch.addressVerified;
  if (Object.keys(row).length === 0) return null;
  const { error } = await supabase.from('profiles').update(row).eq('id', userId);
  if (error) throw error;
  return true;
}

export async function signOutRemote() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
