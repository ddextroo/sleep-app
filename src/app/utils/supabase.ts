import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fivneiunnsbodehcledx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpdm5laXVubnNib2RlaGNsZWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDU3MzUsImV4cCI6MjA1NzM4MTczNX0.cehM60EWbDJU1lBF2I-gHGV8pCihNji96TYUcyxDagk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
