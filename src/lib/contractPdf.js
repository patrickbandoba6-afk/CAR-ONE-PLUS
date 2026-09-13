import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { LEGAL_ENTITY } from '../data/legalEntity';
import { formatMoney, formatDateTime } from '../utils/format';

// Génère le HTML imprimable d'un chemin de signature (tableau de "M x,y L x,y ...")
// capturé par SignaturePad — rendu en SVG inline, compatible expo-print.
function signatureSvg(strokes) {
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
  .footer { margin-top: 30px; font-size: 10px; color: #999; }
`;

export function buildContractHtml(contract) {
  const rows = [
    ['Locataire', contract.renterName],
    ['Propriétaire', contract.ownerName],
    ['Période', `${formatDateTime(contract.startsAt)} → ${formatDateTime(contract.endsAt)}`],
    ['Montant', formatMoney(contract.totalMinor, contract.currency)],
  ];
  if (contract.deliveryAddress) rows.push(['Livraison', contract.deliveryAddress]);

  const ownerDocs = (contract.requiredOwnerDocs || []).map((d) => `<li>${d}</li>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_STYLE}</style></head><body>
    <h1>${LEGAL_ENTITY.brandName} — Contrat de location</h1>
    <div class="legal">${LEGAL_ENTITY.legalMention}</div>
    <div class="ref">Contrat n° ${contract.id.toUpperCase()} — édité le ${formatDateTime(new Date().toISOString())}</div>
    <table>${rows.map(([l, v]) => `<tr><td class="label">${l}</td><td class="value">${v}</td></tr>`).join('')}</table>
    ${ownerDocs ? `<h2>Documents requis pour ce bien</h2><ul class="docs">${ownerDocs}</ul>` : ''}
    <h2>Signatures</h2>
    <div class="sig-row">
      <div class="sig-box"><div class="sig-name">${contract.renterName} (locataire)</div>${signatureSvg(contract.renterSignature)}<div>${contract.renterSignedAt ? 'Signé le ' + formatDateTime(contract.renterSignedAt) : 'Non signé'}</div></div>
      <div class="sig-box"><div class="sig-name">${contract.ownerName} (propriétaire)</div>${signatureSvg(contract.ownerSignature)}<div>${contract.ownerSignedAt ? 'Signé le ' + formatDateTime(contract.ownerSignedAt) : 'Non signé'}</div></div>
    </div>
    <div class="footer">Document généré automatiquement par l'application ${LEGAL_ENTITY.brandName} — ${LEGAL_ENTITY.legalMention}.</div>
  </body></html>`;
}

// Modèle vierge (aperçu) — pour le menu de documents avant toute réservation.
export function buildTemplateHtml(template) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_STYLE}</style></head><body>
    <h1>${LEGAL_ENTITY.brandName} — ${template.title}</h1>
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
