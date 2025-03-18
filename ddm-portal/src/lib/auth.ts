import jwt from 'jsonwebtoken';
import { getUserByEmail, validatePassword, createUser } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export async function signToken(userId: string, email: string, role: string) {
  return jwt.sign(
    { 
      userId, 
      email,
      role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(email: string, password: string) {
  // Find user by email
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  // Validate password
  const isValid = await validatePassword(user, password);
  if (!isValid) {
    return null;
  }

  // Generate token
  const token = await signToken(user.id, user.email, user.role);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
}

export async function registerUser(name: string, email: string, password: string) {
  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return null;
  }

  // Create new user
  const user = await createUser(name, email, password);

  // Generate token
  const token = await signToken(user.id, user.email, user.role);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
} 