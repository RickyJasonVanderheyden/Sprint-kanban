import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// WARNING: This is NOT secure! Passwords should be hashed in production
// TODO: Install bcryptjs and implement proper password hashing

// Simple password comparison (NOT SECURE - for development only)
UserSchema.methods.comparePassword = function(candidatePassword: string) {
  return this.password === candidatePassword;
};

const User = models.User || model('User', UserSchema);

export default User;
