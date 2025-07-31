// src/lib/auth/utils.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("❌ JWT_SECRET is not defined in environment variables");

export interface JWTPayload {
  uid: string;
  email: string;
  exp?: number;
  iat?: number;
}

export const generateToken = (
  uid: string,
  email: string,
  rememberMe: boolean = false
): string => {
  const expiresIn = rememberMe ? '30d' : '24h';

 

  const token = jwt.sign({ uid, email }, JWT_SECRET, { expiresIn });

  
  return token;
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    return decoded;
  } catch (error: any) {
    console.error('❌ Token verification failed:', error.message);
    return null;
  }
};

export const getCookieMaxAge = (rememberMe: boolean = false): number => {
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
 
  return maxAge;
};

export const getCookieOptions = (rememberMe: boolean = false) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: getCookieMaxAge(rememberMe),
    path: '/',
  };
 
  return options;
};
