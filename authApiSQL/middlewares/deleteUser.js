import cron from "node-cron";
import User from "../models/User.js";

async function deleteUnverifiedUsers() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  try {
    const result = await User.deleteMany({
      isVerified: false,
      createdAt: { $lt: oneYearAgo },
    });

    console.log(`Suppression effectuée : ${result.deletedCount} utilisateurs non vérifiés supprimés.`);
  } catch (error) {
    console.error("Erreur suppression utilisateurs non vérifiés :", error);
  }
}

// Cron job : tous les jours à minuit
const task = cron.schedule("0 0 * * *", () => {
  console.log("Cron job démarré pour supprimer les utilisateurs non vérifiés...");
  deleteUnverifiedUsers();
});

export default task;
