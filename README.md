# obled


# Créer le dossier du projet
mkdir obled-client && cd obled-client

# Initialiser un projet React avec Vite (React + JS)
npm create vite@latest . --template react

# Installer dépendances principales
npm install react-router-dom react-hook-form zod @hookform/resolvers @tailwindcss/forms
npm install @tailwindcss/typography @tailwindcss/aspect-ratio

# Pour reCAPTCHA
npm install react-google-recaptcha-v3

# Pour l'auth et API calls
npm install axios

# Initialiser Tailwind
npx tailwindcss init -p


mkdir -p src/pages/home
mkdir -p src/pages/auth
mkdir -p src/components/auth
mkdir -p src/components/layout
mkdir -p src/utils
mkdir -p src/services
touch src/pages/home/Home.jsx
touch src/pages/auth/Login.jsx
touch src/pages/auth/Register.jsx
touch src/pages/auth/ForgotPassword.jsx
touch src/components/auth/LoginForm.jsx
touch src/components/auth/RegisterForm.jsx
touch src/components/auth/GoogleAuth.jsx
touch src/components/layout/Footer.jsx
touch src/utils/validators.js
touch src/services/api.js

