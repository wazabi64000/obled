import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { blockEmail } from '../middlewares/emailVerifier.js';
import pool from '../config/db.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

export async function register(req, res) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { name, lastname, email, password, confirmPassword } = req.body;
    const image = req.file?.path ?? null; // jamais undefined

    // Vérification des champs obligatoires (sans bloquer sur image si tu veux le rendre optionnel)
    if (!name || !lastname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    // Vérification correspondance mot de passe
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    // Vérif email via Kickbox (si clé API valide)
    const verification = await blockEmail(email);
    if (!verification.valid) {
      return res.status(400).json({ 
        error: verification.reason,
        code: "INVALID_EMAIL"
      });
    }

    // Vérification email déjà existant
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Validation des données
    User.validateUserData({
      name,
      lastname,
      email,
      password: hashedPassword,
      isGoogleUser: false
    });

    // Création de l’utilisateur en SQL (null au lieu de undefined)
    const userId = await User.create({
      name: name ?? null,
      lastname: lastname ?? null,
      email: email ?? null,
      password: hashedPassword ?? null,
      role: "user",
      isVerified: false,
      image: image ?? null,
      isGoogleUser: false
    });

    // Génération du token de vérification
    const verificationToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
    const verificationUrl = `${CLIENT_URL}/verify/${verificationToken}`;

    // Envoi email
    await sendEmail({
      to: email,
      subject: "Vérifiez votre compte",
      html: `Bonjour ${name},<br><br>
             Merci de vérifier votre compte en cliquant sur ce lien :
             <a href="${verificationUrl}" target="_blank">Vérifier mon compte</a><br><br>
             Ce lien est valable 24h.`,
    });

    await connection.commit();

    res.status(201).json({
      message: "Utilisateur créé. Un email de vérification a été envoyé.",
    });

  } catch (error) {
    await connection.rollback();

    if (error.message.includes('required')) {
      return res.status(400).json({ message: error.message });
    }

    console.error("Register error:", error);
    res.status(500).json({ message: "Impossible d'enregistrer l'utilisateur." });
  } finally {
    connection.release();
  }
}


export async function verifyEmail(req, res) {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.id) {
      return res.status(400).json({ message: "Token invalide." });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Utilisateur introuvable." });
    }
    if (user.is_verified) {
      return res.status(400).json({ message: "Compte déjà vérifié." });
    }

    await User.verifyEmail(decoded.id);

    res.json({ message: "Compte vérifié avec succès." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token invalide ou expiré." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé." });
    }
    if (!user.is_verified) {
      return res.status(401).json({ message: "Merci de vérifier votre email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Connexion réussie.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.image,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

export async function requestPasswordReset(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email requis." });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Création d'un token unique pour reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHashed = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Sauvegarde dans la DB avec expiration 1h
    await User.update(user.id, {
      resetPasswordToken: resetTokenHashed,
      resetPasswordExpire: new Date(Date.now() + 3600000) // 1 heure
    });

    // URL de reset
    const resetUrl = `${CLIENT_URL}/password-reset/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      html: `<p>Bonjour,</p>
             <p>Pour réinitialiser votre mot de passe, cliquez sur ce lien :</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>Ce lien expire dans 1 heure.</p>`,
    });

    res.json({ message: "Email de réinitialisation envoyé." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
  }

  try {
    // Hash le token reçu pour le comparer en DB
    const resetTokenHashed = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Trouver l'utilisateur avec token valide et non expiré
    const user = await User.findByResetToken(resetTokenHashed);
    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }

    // Hash du nouveau password et mise à jour
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.updatePassword(user.id, hashedPassword);

    res.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

export async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "L'email est obligatoire." });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: "Compte déjà vérifié." });
    }

    const verificationToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const verificationUrl = `${CLIENT_URL}/verify/${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Vérifiez votre compte",
      html: `Bonjour ${user.name},<br><br>Merci de vérifier votre compte en cliquant sur ce lien : <a href="${verificationUrl}" target="_blank">Vérifier mon compte</a><br><br>Ce lien est valable 24h.`,
    });

    res.status(200).json({
      message: "Email de vérification renvoyé.",
    });
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).json({ message: "Impossible de renvoyer l'email." });
  }
}

// Google Auth
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const googleAuthRedirect = (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["email", "profile"],
  });
  res.redirect(url);
};

export const googleAuthCallback = async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).json({ message: "Code manquant dans la requête." });
    }

    // Récupération des tokens depuis Google
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Récupération des infos utilisateur depuis Google
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture } = payload;

    // Vérification si l'utilisateur existe déjà
    let user = await User.findByEmail(email);

    if (!user) {
      // Création d'un nouvel utilisateur si inexistant
      const userId = await User.create({
        name: given_name,
        lastname: family_name,
        email,
        image: picture,
        role: "user",
        isVerified: true,
        isGoogleUser: true
      });
      
      user = await User.findById(userId);
    }

    // Création du JWT pour la session
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Envoi du cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirection vers le front-end
    res.redirect(`${CLIENT_URL}/home`);
  } catch (error) {
    console.error("Google Auth Callback Error:", error);
    res.status(500).json({ message: "Erreur lors de l'authentification Google." });
  }
};