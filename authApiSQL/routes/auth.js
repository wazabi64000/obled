import express from "express";
import {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  googleAuthCallback,
  googleAuthRedirect,
  resendVerificationEmail,
} from "../controllers/authController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { loginSchema, registerSchema, resetPasswordRequestSchema, resetPasswordSchema } from "../middlewares/validationSchemas.js";
import { validateRequest } from "../middlewares/validateRequest.js";
 

const router = express.Router();

router.post("/register", validateRequest(registerSchema), upload.single("image"), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/verify/:token", verifyEmail);

router.post("/password-reset-request",  validateRequest(resetPasswordRequestSchema), requestPasswordReset);
router.post("/reset-password/:token",  validateRequest(resetPasswordSchema), resetPassword);

 // routes/authRoutes.js
router.post("/resend-verification", resendVerificationEmail);



// Routes Google OAuth
router.get("/google", googleAuthRedirect); // pour lancer l'auth
router.get("/google/callback", googleAuthCallback); // callback après Google




router.get("/user-profile", protect, (req, res) => {
  res.json({ message: `Bienvenue ${req.user.name}` });
});



router.get("/admin-panel", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Bienvenue dans le panneau admin" });
});

router.get(
  "/moderator-section",
  protect,
  authorize("moderator", "admin"),
  (req, res) => {
    res.json({ message: "Bienvenue dans la section modérateur" });
  }
);

export default router;
