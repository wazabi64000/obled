import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); // Charge les variables d’environnement depuis un fichier .env

// Récupération de la clé secrète utilisée pour signer/valider les tokens JWT
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware de protection des routes.
 * Vérifie si un token JWT est présent dans les cookies et s'il est valide.
 * Si oui, les informations du token sont ajoutées à `req.user`, sinon la requête est rejetée.
 */
export const protect = (req, res, next) => {
  // Récupération du token depuis les cookies (généralement envoyé après authentification)
  const token = req.cookies.token || '';

  // Si aucun token n’est présent, l’accès est refusé
  if (!token) {
    return res.status(401).json({ message: 'Non authentifié, token manquant' });
  }

  try {
    // Vérification et décodage du token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Les données utiles (id, nom, rôle, etc.) sont stockées dans `req.user`
    req.user = decoded;

    next();
    // On continue vers la route protégée ou le middleware suivant
  } catch (error) {
    // Token invalide ou expiré
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

/**
 * Middleware d'autorisation basé sur le rôle utilisateur.
 * Usage : authorize('admin'), authorize('admin', 'moderator'), etc.
 * Vérifie que l'utilisateur authentifié a le droit d'accéder à la ressource.
 */
export const authorize = (...roles) => (req, res, next) => {
  // Si l'utilisateur n'est pas défini dans req.user (probablement non authentifié)
  if (!req.user) return res.status(401).json({ message: 'Non authentifié' });

  // Si le rôle de l'utilisateur n'est pas autorisé à accéder à cette ressource
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès interdit: rôle insuffisant' });
  }

  // Le rôle est valide, on autorise l'accès
  next();
};
