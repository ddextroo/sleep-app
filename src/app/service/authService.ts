import {supabase} from "~/app/utils/supabase"
import { useAuthSessionStore } from "../store/authStore"
import { Alert } from "react-native"

export const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (error) {
        console.log(error)
        throw new Error(error.message)
    }
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
        Alert.alert(error.message);
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
                Alert.alert("Error saving user user.");
                throw new Error(userError.message);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
      }
    
      setSession(session);
      setLoading(false);
    
      return session;
}
export const signOut = async () => {
    const { setSession } = useAuthSessionStore.getState();

    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error during sign out:", error);
            throw new Error(error.message);
        }

        // Clear session in the store
        setSession(null);

        console.log("User successfully signed out.");
    } catch (err) {
        console.error("Unexpected error during sign out:", err);
        throw new Error("Failed to sign out.");
    }
};

export const getUserDetails = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        throw new Error(userError?.message || "User not found");
      }

      const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    throw new Error(profileError.message);
  }

  return {  profile };
}