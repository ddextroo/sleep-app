import {create} from "zustand";
import { AuthLogin, AuthSession, AuthSignup, OnboardingState } from "../types/auth";
import { supabase } from "../utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create<AuthLogin>((set) => ({
 email: '',
 password: '',
 setEmail: (email) => set({email: email}),
 setPassword: (password) => set({password}),
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
}))

export const useAuthSessionStore = create<AuthSession>((set) => ({
    session: null,
    loading: false,
    setSession: (session) => set({session}),
    setLoading: (loading) => set({ loading }),
    initSession: async () => {
        const { data: {session}} = await supabase.auth.getSession();
        set({session})

        supabase.auth.onAuthStateChange((_event, session) => {
            set({session})
        })
    }
}))

export const useOnboardingStore = create<OnboardingState>((set) => ({
    session: null,
    loading: false,
    onboardingComplete: false,
  
    setSession: (session) => set({ session }),
    setLoading: (loading) => set({ loading }),
  
    setOnboardingComplete: async (status) => {
      await AsyncStorage.setItem('onboardingComplete', JSON.stringify(status));
      set({ onboardingComplete: status });
    },
  
    initAuth: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session });
  
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session });
      });
  
      const storedOnboarding = await AsyncStorage.getItem('onboardingComplete');
      set({ onboardingComplete: storedOnboarding === 'true' });
    },
  }));