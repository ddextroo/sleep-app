import {create} from "zustand";
import { AuthLogin, AuthSession, AuthSignup, OnboardingState } from "../types/auth";
import { supabase } from "../utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create<AuthLogin>((set) => ({
 email: '',
 password: '',
 setEmail: (email) => set({email}),
 setPassword: (password) => set({password}),
 showPassword: false,
 setShowPassword: (showPassword) => set({showPassword}),
 loading: false,
 error: null,
 setLoading: (loading) => set({loading}),
 setError: (error) => set({error}),
 clearError: () => set({error: null}),
}))

export const useAuthSignup = create<AuthSignup>((set) => ({
 username: '',
 email: '',
 password: '',
 gender: '',
 setUsername: (username) => set({username}),
 setEmail: (email) => set({email}),
 setPassword: (password) => set({password}),
 setGender: (gender) => set({gender}),
 showPassword: false,
 setShowPassword: (showPassword) => set({showPassword}),
 loading: false,
 error: null,
 setLoading: (loading) => set({loading}),
 setError: (error) => set({error}),
 clearError: () => set({error: null}),
}))

export const useAuthSessionStore = create<AuthSession>((set) => ({
    session: null,
    loading: false,
    error: null,
    setSession: (session) => set({session}),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({error}),
    clearError: () => set({error: null}),
    initSession: async () => {
        try {
            set({ loading: true, error: null });
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
                set({ error: error.message, loading: false });
                return;
            }
            
            set({ session: data.session, loading: false });

            supabase.auth.onAuthStateChange((_event, session) => {
                set({ session });
            });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred', loading: false });
        }
    }
}))

export const useOnboardingStore = create<OnboardingState>((set) => ({
    session: null,
    loading: false,
    error: null,
    onboardingComplete: false,
  
    setSession: (session) => set({ session }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
  
    setOnboardingComplete: async (status) => {
      try {
        set({ loading: true, error: null });
        await AsyncStorage.setItem('onboardingComplete', JSON.stringify(status));
        set({ onboardingComplete: status, loading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to save onboarding status', 
          loading: false 
        });
      }
    },
  
    initAuth: async () => {
      try {
        set({ loading: true, error: null });
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          set({ error: error.message, loading: false });
          return;
        }
        
        set({ session: data.session });

        supabase.auth.onAuthStateChange((_event, session) => {
          set({ session });
        });

        const storedOnboarding = await AsyncStorage.getItem('onboardingComplete');
        set({ 
          onboardingComplete: storedOnboarding === 'true',
          loading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to initialize authentication', 
          loading: false 
        });
      }
    },
}));