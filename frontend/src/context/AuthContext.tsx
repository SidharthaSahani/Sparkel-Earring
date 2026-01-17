import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import toastService from '../utils/toastService';

// Define a simplified user type since we're not using Supabase anymore
interface User {
  id: string;
  email: string;
}

import { UserProfile } from '../types/types';

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signUpAdmin: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  adminSignIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from session storage or other auth mechanism
    const storedUser = sessionStorage.getItem('user');
    const storedProfile = sessionStorage.getItem('profile');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
    
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      
      const data = await response.json();
      
      // Store user in session storage
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('profile', JSON.stringify(data.profile));
      
      setUser(data.user);
      setProfile(data.profile);
      
      toastService.success('Account created successfully! Welcome to our store.');
    } catch (error) {
      console.error('Registration error:', error);
      toastService.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    }
  };
  
  const signUpAdmin = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch('/api/auth/register-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Admin registration failed');
      }
      
      const data = await response.json();
      
      // Store user in session storage
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('profile', JSON.stringify(data.profile));
      
      setUser(data.user);
      setProfile(data.profile);
      
      toastService.success('Admin account created successfully!');
    } catch (error) {
      console.error('Admin registration error:', error);
      toastService.error(error instanceof Error ? error.message : 'Admin registration failed');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await response.json();
      
      // Store user in session storage
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('profile', JSON.stringify(data.profile));
      
      setUser(data.user);
      setProfile(data.profile);
      
      toastService.success('Login successful! Welcome back.');
    } catch (error) {
      console.error('Login error:', error);
      toastService.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  };

  const adminSignIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Admin login failed');
      }
      
      const data = await response.json();
      
      // Store user in session storage
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('profile', JSON.stringify(data.profile));
      
      setUser(data.user);
      setProfile(data.profile);
      
      toastService.success('Admin login successful! Welcome to the admin panel.');
    } catch (error) {
      console.error('Admin login error:', error);
      toastService.error(error instanceof Error ? error.message : 'Admin login failed');
      throw error;
    }
  };

  const signOut = async () => {
    // Clear user and profile from session storage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('profile');
    
    setUser(null);
    setProfile(null);
    
    toastService.info('You have been signed out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signUpAdmin, signIn, adminSignIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
