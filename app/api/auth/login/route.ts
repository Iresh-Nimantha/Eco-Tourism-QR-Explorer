import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/lib/firebase/config';
import { generateToken, getCookieOptions } from '@/app/lib/auth/utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

   
    const token = generateToken(user.uid, user.email!, rememberMe);
    
    

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        rememberMe,
        displayName: user.displayName
      }
    });

    

    // Set HTTP-only cookie
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 24 hours
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAge,
      path: '/'
    });

    

    return response;
    
  } catch (error: any) {
    console.error('Login error:', error);
   
    let errorMessage = 'Login failed';
    
    // Handle Firebase Auth error codes
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later';
    } else if (error.code === 'auth/invalid-credential') {
     
      errorMessage = 'Invalid email or password. Please check your credentials and try again';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your connection and try again';
    }


    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 401 }
    );
  }
}