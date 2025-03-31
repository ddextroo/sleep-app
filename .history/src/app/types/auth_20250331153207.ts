import { Session } from '@supabase/supabase-js';

export interface AuthLogin {
    email: string;
    password: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
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
}

export interface AuthSession {
    session: Session | null,
    loading: boolean,
    setSession: (session: Session) => void,
    setLoading: (loading: boolean) => void,
    initSession: () => Promise<void>
}

export interface OnboardingState {
    session: Session | null;
    loading: boolean;
  
    setSession: (session: Session | null) => void;
    setLoading: (loading: boolean) => void;
    setOnboardingComplete: (status: boolean) => Promise<void>;
    initAuth: () => Promise<void>;
  }