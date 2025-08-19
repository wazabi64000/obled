import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,

    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Chercher l'utilisateur par email
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          // Créer un nouvel utilisateur si inexistant
          user = new User({
            name: profile.name.givenName,
            lastname: profile.name.familyName || "",
            email,
            role: "user",
            isVerified: true, // Google valide déjà l'email
            image: profile.photos[0].value,
          });
          await user.save();
        }

        // Générer un token JWT
        const token = jwt.sign(
          { id: user._id, role: user.role, name: user.name },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((data, done) => {
  done(null, data);
});

passport.deserializeUser((data, done) => {
  done(null, data);
});

export default passport;
