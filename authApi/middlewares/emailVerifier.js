import axios from 'axios';
import blockedDomainsData from './blocked-domains.json' with { type: 'json' };

// Clé Kickbox
const KICKBOX_API_KEY = process.env.KICKBOX_API_KEY;  

// Liste principale de domaines jetables connus
const LOCAL_BLOCKED_DOMAINS = blockedDomainsData.blockedDomains;

export async function blockEmail(email) {
  // 1. Validation basique du format
  if (!email || !email.includes("@")) {
    return { 
      valid: false, 
      reason: "Format d'email invalide." 
    };
  }

  // 2. Vérification locale rapide
  const emailDomain = email.split("@")[1].toLowerCase();
  const isLocallyBlocked = LOCAL_BLOCKED_DOMAINS.some(
    domain => emailDomain === domain || emailDomain.endsWith(`.${domain}`)
  );

  if (isLocallyBlocked) {
    return { 
      valid: false, 
      reason: "L'utilisation d'emails temporaires ou jetables n'est pas autorisée. Veuillez utiliser une adresse email valide et permanente." 
    };
  }

  // 3. Vérification via Kickbox uniquement si non bloqué localement
  if (!KICKBOX_API_KEY) {
    // Pas de clé API, on se contente de la validation locale
    return { valid: true };
  }

  try {
    const response = await axios.get(
      `https://api.kickbox.com/v2/verify?email=${encodeURIComponent(email)}&apikey=${KICKBOX_API_KEY}`,
      { timeout: 3000 }
    );

    const { result, disposable, role } = response.data;

    if (result === "undeliverable" || disposable) {
      return { 
        valid: false, 
        reason: "L'utilisation d'emails temporaires ou jetables n'est pas autorisée. Veuillez utiliser une adresse email valide et permanente." 
      };
    }

    if (role) {
      return { 
        valid: false, 
        reason: "Les emails génériques (contact@, support@) ne sont pas acceptés. Veuillez utiliser votre adresse personnelle." 
      };
    }

    return { valid: true };
  } catch (error) {
    console.error("Erreur Kickbox:", error.message);
    // En cas d'erreur Kickbox, on considère l'email valide si non bloqué localement
    return { valid: true };
  }
}