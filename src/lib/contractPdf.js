import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { LEGAL_ENTITY } from '../data/legalEntity';
import { formatMoney, formatDateTime } from '../utils/format';

// Logo réel de la société encodé en data URI — c'est le seul moyen fiable
// d'intégrer une image dans un PDF expo-print sur toutes les plateformes
// (un chemin file:// local n'est pas garanti accessible au moteur de rendu).
// Calculé une seule fois puis mis en cache pour les exports suivants.
let cachedLogoDataUri = null;
async function getLogoDataUri() {
  if (cachedLogoDataUri) return cachedLogoDataUri;
  try {
    const asset = Asset.fromModule(require('../assets/logo-car-one-plus.png'));
    await asset.downloadAsync();
    const base64 = await FileSystem.readAsStringAsync(asset.localUri || asset.uri, { encoding: FileSystem.EncodingType.Base64 });
    cachedLogoDataUri = `data:image/png;base64,${base64}`;
  } catch (e) {
    cachedLogoDataUri = null;
  }
  return cachedLogoDataUri;
}

// Génère le HTML imprimable d'un chemin de signature (tableau de "M x,y L x,y ...")
// capturé par SignaturePad — rendu en SVG inline, compatible expo-print.
function signatureSvg(strokes, documentUri) {
  if (documentUri) {
    // Document signé importé en dehors de l'app (photo/scan) plutôt que
    // tracé au doigt — la preuve réelle reste consultable dans l'app
    // (ContractScreen.js) ; le PDF ne peut pas toujours embarquer un
    // fichier local (uri file://) de façon fiable sur toutes plateformes.
    return '<div class="sig-uploaded">✓ Document signé fourni en pièce jointe dans l\'application</div>';
  }
  if (!strokes?.length) {
    return '<div class="sig-empty">Non signé</div>';
  }
  const paths = strokes.map((d) => `<path d="${d}" stroke="#0A0D14" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  return `<svg viewBox="0 0 320 120" width="100%" height="90">${paths}</svg>`;
}

function docStatusLabel(status) {
  return { verified: '✓ Fourni', pending: '… En cours', missing: '✕ Manquant' }[status] || status;
}

const BASE_STYLE = `
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #111; padding: 32px; }
  h1 { font-size: 20px; margin: 0 0 2px; }
  .legal { color: #666; font-size: 12px; margin-bottom: 22px; }
  .ref { color: #999; font-size: 11px; margin-bottom: 18px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
  td { padding: 6px 0; font-size: 13px; border-bottom: 1px solid #eee; }
  td.label { color: #666; width: 40%; }
  td.value { font-weight: 600; text-align: right; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.4px; color: #B8860B; margin: 22px 0 8px; }
  .docs li { font-size: 13px; margin-bottom: 4px; }
  .sig-row { display: flex; gap: 24px; margin-top: 28px; }
  .sig-box { flex: 1; border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
  .sig-name { font-weight: 700; font-size: 13px; }
  .sig-empty { color: #bbb; font-size: 12px; height: 90px; display: flex; align-items: center; justify-content: center; border: 1px dashed #ccc; border-radius: 6px; }
  .sig-uploaded { color: #2e7d32; font-size: 12px; height: 90px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 0 8px; border: 1px solid #c8e6c9; border-radius: 6px; background: #f1f8f2; }
  .footer { margin-top: 30px; font-size: 10px; color: #999; }
  .letterhead { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
  .letterhead img { width: 56px; height: 56px; object-fit: contain; }
  .letterhead h1 { margin: 0; }
`;

// Le logo apparaît sur chaque contrat généré — pas seulement à l'écran, mais
// aussi dans le PDF exporté/partagé, qui est le document qui a réellement
// une valeur juridique une fois hors de l'application.
function letterheadHtml(logoDataUri, title) {
  const logo = logoDataUri ? `<img src="${logoDataUri}" alt="${LEGAL_ENTITY.brandName}" />` : '';
  return `<div class="letterhead">${logo}<h1>${LEGAL_ENTITY.brandName} — ${title}</h1></div>`;
}

export async function buildContractHtml(contract) {
  const rows = [
    ['Locataire', contract.renterName],
    ['Propriétaire', contract.ownerName],
    ['Période', `${formatDateTime(contract.startsAt)} → ${formatDateTime(contract.endsAt)}`],
    ['Montant', formatMoney(contract.totalMinor, contract.currency)],
  ];
  if (contract.deliveryAddress) rows.push(['Livraison', contract.deliveryAddress]);

  const ownerDocs = (contract.requiredOwnerDocs || []).map((d) => `<li>${d}</li>`).join('');
  const logoDataUri = await getLogoDataUri();

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_STYLE}</style></head><body>
    ${letterheadHtml(logoDataUri, 'Contrat de location')}
    <div class="legal">${LEGAL_ENTITY.legalMention}</div>
    <div class="ref">Contrat n° ${contract.id.toUpperCase()} — édité le ${formatDateTime(new Date().toISOString())}</div>
    <table>${rows.map(([l, v]) => `<tr><td class="label">${l}</td><td class="value">${v}</td></tr>`).join('')}</table>
    ${ownerDocs ? `<h2>Documents requis pour ce bien</h2><ul class="docs">${ownerDocs}</ul>` : ''}
    <h2>Signatures</h2>
    <div class="sig-row">
      <div class="sig-box"><div class="sig-name">${contract.renterName} (locataire)</div>${signatureSvg(contract.renterSignature, contract.renterDocumentUri)}<div>${contract.renterSignedAt ? 'Signé le ' + formatDateTime(contract.renterSignedAt) : 'Non signé'}</div></div>
      <div class="sig-box"><div class="sig-name">${contract.ownerName} (propriétaire)</div>${signatureSvg(contract.ownerSignature, contract.ownerDocumentUri)}<div>${contract.ownerSignedAt ? 'Signé le ' + formatDateTime(contract.ownerSignedAt) : 'Non signé'}</div></div>
    </div>
    <div class="footer">Document généré automatiquement par l'application ${LEGAL_ENTITY.brandName} — ${LEGAL_ENTITY.legalMention}.</div>
  </body></html>`;
}

// Modèle vierge (aperçu) — pour le menu de documents avant toute réservation.
export async function buildTemplateHtml(template) {
  const logoDataUri = await getLogoDataUri();
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_STYLE}</style></head><body>
    ${letterheadHtml(logoDataUri, template.title)}
    <div class="legal">${LEGAL_ENTITY.legalMention}</div>
    <div class="ref">Modèle — à titre indicatif, complété automatiquement à chaque réservation réelle.</div>
    <h2>Objet</h2>
    <p style="font-size:13px; line-height:1.6;">${template.body}</p>
    ${template.clauses ? `<h2>Clauses principales</h2><ul class="docs">${template.clauses.map((c) => `<li>${c}</li>`).join('')}</ul>` : ''}
    <div class="sig-row">
      <div class="sig-box"><div class="sig-name">Locataire</div><div class="sig-empty">Signature à la réservation</div></div>
      <div class="sig-box"><div class="sig-name">Propriétaire</div><div class="sig-empty">Signature à la réservation</div></div>
    </div>
    <div class="footer">Document généré automatiquement par l'application ${LEGAL_ENTITY.brandName} — ${LEGAL_ENTITY.legalMention}.</div>
  </body></html>`;
}

// Génère le PDF et ouvre la feuille de partage (enregistrer / envoyer) — c'est
// ainsi qu'expo-print expose le "téléchargement" côté mobile, il n'y a pas de
// dossier "Téléchargements" universel sur iOS/Android.
export async function exportContractPdf(html) {
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
  }
  return uri;
}
