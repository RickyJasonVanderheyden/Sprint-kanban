import mongoose, { Schema, models, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    console.log('Hashing password for user:', this.email);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully');
    next();
  } catch (error) {
    console.error('Password hashing error:', error);
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  try {
    console.log('Comparing password for user:', this.email);
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', result);
    return result;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

const User = models.User || model('User', UserSchema);

export default User;
