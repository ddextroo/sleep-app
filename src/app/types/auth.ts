import { Session } from '@supabase/supabase-js';

export interface AuthLogin {
    email: string;
    password: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    showPassword: boolean;
    setShowPassword: (showPassword: boolean) => void;
    loading: boolean;
    error: string | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export interface AuthSignup {
    username: string;
    email: string;
    password: string;
    gender: string;
    setUsername: (username: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setGender: (gender: string) => void;    
    showPassword: boolean;
    setShowPassword: (showPassword: boolean) => void;
    loading: boolean;
    error: string | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export interface AuthSession {
    session: Session | null;
    loading: boolean;
    error: string | null;
    setSession: (session: Session) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    initSession: () => Promise<void>;
}

export interface OnboardingState {
    session: Session | null;
    loading: boolean;
    error: string | null;
    onboardingComplete: boolean;
  
    setSession: (session: Session | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    setOnboardingComplete: (status: boolean) => Promise<void>;
    initAuth: () => Promise<void>;
}

export interface ValidationErrors {
    email?: string;
    password?: string;
    username?: string;
    gender?: string;
}