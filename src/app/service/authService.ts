import * as WebBrowser from 'expo-web-browser';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { supabase } from '../utils/supabase';
import { makeRedirectUri } from 'expo-auth-session';

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) alert(error.message);
};

export const handleSignIn = async () => {
    const redirectUri = makeRedirectUri({ path: "redirect" });
    console.log("Redirect URI:", redirectUri); // Check this in your terminal

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: "https://auth.expo.io/@dextro/hagoc", skipBrowserRedirect: true,  },
  });

  if (error) {
    alert(error.message);
    return;
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, "https://auth.expo.io/@dextro/hagoc");

  if (result.type === 'success') {
    const { code } = QueryParams.getQueryParams(result.url) as {
      code?: string;
    };

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) alert(error.message);
    } else {
      alert('Authorization code not found.');
    }
  }
};
