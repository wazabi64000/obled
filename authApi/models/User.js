// models/User.js
import mongoose from 'mongoose';

const rolesEnum = ['admin', 'user'];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lastname: { type: String, trim: true }, // plus required ici
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // plus required ici
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: rolesEnum, default: 'user' },
  image: { type: String },
  isGoogleUser: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
}, { timestamps: true });

// validation personnalisée avant enregistrement
userSchema.pre('save', function(next) {
  if (!this.isGoogleUser) {
    if (!this.lastname) {
      return next(new Error('Lastname is required for non-Google users'));
    }
    if (!this.password) {
      return next(new Error('Password is required for non-Google users'));
    }
  }
  next();
});

export default mongoose.model('User', userSchema);
