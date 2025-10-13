import { dbConnect } from './db/index';
import User from './db/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export async function signup({ name, email, password, role }: { 
  name: string; 
  email: string; 
  password: string; 
  role: string; 
}) {
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
    console.log('User created successfully:', user.email);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Update user with token
    user.token = token;
    await user.save();
    
    // Return user without password and with token
    const { password: _, ...userWithoutPassword } = user.toObject();
    return { user: userWithoutPassword, token };
  } catch (error: any) {
    console.log('Signup error:', error);
    return { error: 'Signup failed: ' + error?.message };
  }
}

export async function signin({ email, password }: { 
  email: string; 
  password: string; 
}) {
  await dbConnect();
  try {
    // Explicitly select password for authentication
    const user = await User.findOne({ email }).select('+password');
    console.log('Signin attempt:', { email });
    if (!user) {
      console.log('User not found for email:', email);
      return { error: 'User not found. Please sign up first.' };
    }
    if (!user.password) {
      console.log('No password set for user:', user.email);
      return { error: 'No password set for this user.' };
    }
    console.log('Password comparison starting');
    const valid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', valid);
    if (!valid) {
      return { error: 'Invalid password. Please try again.' };
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Update user with new token
    user.token = token;
    await user.save();
    
    // Return user without password and with token
    const { password: _, ...userWithoutPassword } = user.toObject();
    return { user: userWithoutPassword, token };
  } catch (error: any) {
    console.log('Signin error:', error);
    return { error: 'Signin failed: ' + error?.message };
  }
}
