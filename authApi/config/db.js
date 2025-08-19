import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Attente max 10s si le serveur ne répond pas
      socketTimeoutMS: 45000,          // Timeout de socket pour éviter les connexions mortes
      autoIndex: false,                // Désactive la création automatique d'index en prod
      dbName: process.env.MONGO_DB_NAME, // Facultatif si déjà inclus dans l’URI
    });

    console.log(' MongoDB connecté avec succès');
  } catch (error) {
    console.error(' Échec connexion MongoDB :', error.message);
    process.exit(1);
  }
};

export default connectDB;
