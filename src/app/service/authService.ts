import {supabase} from "~/app/utils/supabase"
import { useAuthSessionStore } from "../store/authStore"
import { Alert, Platform, ToastAndroid } from "react-native"

const showToast = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(message);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (error) {
        console.log(error)
        showToast(error.message)
        throw new Error(error.message)
    }
    showToast("Successfully signed in!")
    return data
}

export const signUpWithEmail = async (email: string, password: string, username: string, gender: string ) => {
    const { setSession, setLoading } = useAuthSessionStore.getState();

    setLoading(true);  

    const {data: {session, user}, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: username
            }
        }
    })
    if (error) {
        console.log(error)
        showToast(error.message);
        setLoading(false);
        throw new Error(error.message);
      }

      if (user) {
        try {
            const {error: userError} = await supabase.from("users").insert([
                {
                    id: user.id,
                    username: username,
                    gender: gender,
                    email_address: user.email,
                }
            ]);

            if (userError) {
                console.error("Error saving user:", userError);
                showToast("Error saving user details");
                throw new Error(userError.message);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            showToast("An unexpected error occurred");
        }
      }
    
      setSession(session);
      setLoading(false);
      showToast("Successfully signed up!");
      return session;
}

export const signOut = async () => {
    const { setSession } = useAuthSessionStore.getState();

    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error during sign out:", error);
            showToast("Error signing out");
            throw new Error(error.message);
        }

        // Clear session in the store
        setSession(null);
        showToast("Successfully signed out!");

    } catch (err) {
        console.error("Unexpected error during sign out:", err);
        showToast("Failed to sign out");
        throw new Error("Failed to sign out.");
    }
};

export const getUserDetails = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        showToast("Error fetching user details");
        throw new Error(userError?.message || "User not found");
      }

      const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    showToast("Error fetching user profile");
    throw new Error(profileError.message);
  }

  return { profile };
}