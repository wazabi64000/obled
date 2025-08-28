import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import deleteUserCron from "./middlewares/deleteUser.js";
import auditDependencies from './middlewares/auditDependencies.js'
import limiter from './middlewares/rateLimit.js';
import cors from 'cors';
dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(limiter)
// Démarre le cron
deleteUserCron.start();
auditDependencies.start()


const allowedOrigins = [
  
  "http://localhost:5173",
  "https://obled-l1mqz7ll5-wazabiboys-projects.vercel.app",
  "https://obled-2bmbgtbjn-wazabiboys-projects.vercel.app"
  
];

app.use(cors({
  origin: function(origin, callback){
    // autoriser les requêtes sans origine (ex: Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `L'origine ${origin} n'est pas autorisée par CORS`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // obligatoire pour les cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use('/api/auth',limiter, authRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
