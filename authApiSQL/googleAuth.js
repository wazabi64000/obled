import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  "214701415500-iolba39atapplvjj4bdprvnpvegacfma.apps.googleusercontent.com",
  "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",
  "http://localhost:5000" // redirect URI que tu as ajouté dans Google Cloud
);

async function getToken() {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["email", "profile"],
  });
  console.log("Visite ce lien:", url);
}

getToken();
