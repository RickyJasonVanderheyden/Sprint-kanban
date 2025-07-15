import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';


// Secret key for JWT (keep it secure in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development';

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET not found in environment variables. Using fallback secret.');
}

// Function to create a JWT token
export const createJwtToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Function to verify JWT from cookie
export const verifyJwtToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};


// Function to set JWT as a cookie
export const setJwtCookie = (res: any, token: string) => {
  res.setHeader('Set-Cookie', cookie.serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
  }));
};

// Function to clear JWT cookie
export const clearJwtCookie = (res: any) => {
  res.setHeader('Set-Cookie', cookie.serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: -1, // Immediately expires the cookie
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
  }));
};

