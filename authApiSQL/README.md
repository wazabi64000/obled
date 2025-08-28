| Méthode | Endpoint                           | Body / Params                                                  | Description                      |
| ------- | ---------------------------------- | -------------------------------------------------------------- | -------------------------------- |
| `POST`  | `/api/auth/register`               | `{ name, lastname, email, password, confirmPassword, image? }` | Inscription utilisateur          |
| `POST`  | `/api/auth/login`                  | `{ email, password }`                                          | Connexion utilisateur            |
| `GET`   | `/api/auth/verify/:token`          | URL param `{token}`                                            | Vérification email               |
| `POST`  | `/api/auth/password-reset-request` | `{ email }`                                                    | Demande de reset de mot de passe |
| `POST`  | `/api/auth/reset-password/:token`  | `{ password, confirmPassword }`                                | Réinitialisation du mot de passe |
| `POST`  | `/api/auth/resend-verification`    | `{ email }`                                                    | Renvoyer l’email de vérification |
| `GET`   | `/api/auth/google`                 | -                                                              | Lancer connexion Google          |
| `GET`   | `/api/auth/google/callback`        | query `?code=xxx`                                              | Callback Google OAuth            |
| `GET`   | `/api/auth/user-profile`           | Cookie `token`                                                 | Accéder au profil utilisateur    |
| `GET`   | `/api/auth/admin-panel`            | Cookie `token` (role: admin)                                   | Accès admin                      |
| `GET`   | `/api/auth/moderator-section`      | Cookie `token` (role: moderator/admin)                         | Accès modérateur                 |


