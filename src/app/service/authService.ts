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

export const signUpWithEmail = async (email: string, password: string) => {
    const { setSession, setLoading } = useAuthSessionStore.getState();

    setLoading(true);  

    const {data: {session}, error} = await supabase.auth.signUp({
        email,
        password,
    })
    if (error) {
        console.log(error)
        Alert.alert(error.message);
        setLoading(false);
        throw new Error(error.message);
      }
    
      setSession(session);
      setLoading(false);
    
      return session;
}
