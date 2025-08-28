// middlewares/validationSchemas.js
import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Le nom est obligatoire.",
    "string.min": "Le nom doit contenir au moins 2 caractères.",
    "string.max": "Le nom doit contenir au maximum 50 caractères.",
  }),
  lastname: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Le prénom est obligatoire.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email invalide.",
    "string.empty": "L'email est obligatoire.",
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.empty": "Le mot de passe est obligatoire.",
      "string.min": "Le mot de passe doit contenir au moins 8 caractères.",
      "string.pattern.base":
        "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.",
    }),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Les mots de passe ne correspondent pas.",
      "any.required": "La confirmation du mot de passe est obligatoire.",
    }),
});


// middlewares/validationSchemas.js (ajouter ceci)
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "L'email est obligatoire.",
    "string.email": "Email invalide.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Le mot de passe est obligatoire.",
  }),
});


// middlewares/validationSchemas.js (ajouter ceci)
export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.empty": "Le mot de passe est obligatoire.",
      "string.min": "Le mot de passe doit contenir au moins 8 caractères.",
      "string.pattern.base":
        "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.",
    }),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Les mots de passe ne correspondent pas.",
      "any.required": "La confirmation du mot de passe est obligatoire.",
    }),
});

 // middlewares/validationSchemas.js (ajouter ceci)
export const resetPasswordRequestSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "L'email est obligatoire.",
    "string.email": "Email invalide.",
  }),
});

 