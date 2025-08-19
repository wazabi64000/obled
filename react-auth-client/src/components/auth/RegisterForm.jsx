import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../services/api.js";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("lastname", data.lastname);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);

      // Gestion du fichier image
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      } else {
        throw new Error("La photo de profil est obligatoire");
      }

      await api.register(formData);

        setSuccess(
        "Inscription réussie ! Un email de confirmation a été envoyé."
      );

 
      reset();
     // Redirection après 3 secondes
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 shadow-sm" style={{ maxWidth: "500px", margin: "auto" }}>
      <h3 className="card-title text-center mb-4">Inscription</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Prénom"
            {...register("name", { required: "Le prénom est obligatoire" })}
            className="form-control"
          />
          {errors.name && <small className="text-danger">{errors.name.message}</small>}
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Nom"
            {...register("lastname", { required: "Le nom est obligatoire" })}
            className="form-control"
          />
          {errors.lastname && <small className="text-danger">{errors.lastname.message}</small>}
        </div>

        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "L'email est obligatoire" })}
            className="form-control"
          />
          {errors.email && <small className="text-danger">{errors.email.message}</small>}
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Mot de passe"
            {...register("password", { required: "Le mot de passe est obligatoire" })}
            className="form-control"
          />
          {errors.password && <small className="text-danger">{errors.password.message}</small>}
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Confirmer mot de passe"
            {...register("confirmPassword", { required: "La confirmation est obligatoire" })}
            className="form-control"
          />
          {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword.message}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Photo de profil</label>
          <input
            type="file"
            {...register("image", { required: "La photo de profil est obligatoire" })}
            className="form-control"
            accept="image/*"
          />
          {errors.image && <small className="text-danger">{errors.image.message}</small>}
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </button>

        <div className="text-center mt-3">
          <span>Vous avez déjà un compte ? </span>
          <a href="/login" className="text-decoration-none">Se connecter</a>
        </div>
      </form>
    </div>
  );
}
