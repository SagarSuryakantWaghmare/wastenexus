import { dbConnect } from './db/index';
import User from './db/models/User';
import bcrypt from 'bcryptjs';

export async function signup({ name, email, password, role }) {
  await dbConnect();
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return { error: 'User already exists' };
    }
    if (!password) {
      return { error: 'Password is required.' };
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashed,
      role,
      points: 0,
    });
    await user.save();
    console.log('User created with hashed password:', user.email, user.password);
    return { user };
  } catch (error) {
    console.log('Signup error:', error);
    return { error: 'Signup failed: ' + error?.message };
  }
}

export async function signin({ email, password }) {
  await dbConnect();
  try {
    const user = await User.findOne({ email });
    console.log('Signin attempt:', { email });
    if (!user) {
      console.log('User not found for email:', email);
      return { error: 'User not found. Please sign up first.' };
    }
    if (!user.password) {
      console.log('No password set for user:', user.email);
      return { error: 'No password set for this user.' };
    }
    console.log('Stored hash:', user.password);
    const valid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', valid);
    if (!valid) {
      return { error: 'Invalid password. Please try again.' };
    }
    return { user };
  } catch (error) {
    console.log('Signin error:', error);
    return { error: 'Signin failed: ' + error?.message };
  }
}
