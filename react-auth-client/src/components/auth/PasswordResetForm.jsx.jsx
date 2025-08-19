import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api.js";

export default function PasswordResetForm() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch } = useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordValue = watch("password", "");

  // Fonctions de validation
  const rules = {
    minLength: (pw) => pw.length >= 8,
    uppercase: (pw) => /[A-Z]/.test(pw),
    lowercase: (pw) => /[a-z]/.test(pw),
    number: (pw) => /\d/.test(pw),
    specialChar: (pw) => /[\W_]/.test(pw),
  };

  const validatePassword = (pw) => Object.values(rules).every((rule) => rule(pw));

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");

    if (!token) {
      setError("Token manquant dans l'URL !");
      return;
    }

    if (!validatePassword(data.password)) {
      setError(
        "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await api.resetPassword(token, {
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      setSuccess(res.data.message);
      reset();

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Erreur API:", err.response?.data);
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(" "));
      } else {
        setError(err.response?.data?.message || "Erreur lors de la réinitialisation.");
      }
    }
  };

  return (
    <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", margin: "auto" }}>
      <h3 className="card-title text-center mb-4">Nouveau mot de passe</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            {...register("password", { required: true })}
            className="form-control"
          />
          <small className="text-muted d-block mb-2 " >
            Le mot de passe doit contenir :
          </small>
          <ul className="list-unstyled mb-0  form-text  " style={{ fontSize: "0.8rem" }}>
            <li style={{ color: rules.uppercase(passwordValue) ? "green" : "red" }}>
              {rules.uppercase(passwordValue) ? "✅" : "❌" } Une majuscule
            </li>
            <li style={{ color: rules.lowercase(passwordValue) ? "green" : "red" }}>
              {rules.lowercase(passwordValue) ? "✅" : "❌"} Une minuscule
            </li>
            <li style={{ color: rules.number(passwordValue) ? "green" : "red" }}>
              {rules.number(passwordValue) ? "✅" : "❌"} Un chiffre
            </li>
            <li style={{ color: rules.specialChar(passwordValue) ? "green" : "red" }}>
              {rules.specialChar(passwordValue) ? "✅" : "❌"} Un caractère spécial
            </li>
            <li style={{ color: rules.minLength(passwordValue) ? "green" : "red" }}>
              {rules.minLength(passwordValue) ? "✅" : "❌"} Minimum 8 caractères
            </li>
          </ul>
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            {...register("confirmPassword", { required: true })}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Réinitialiser le mot de passe
        </button>
      </form>
    </div>
  );
}
