import { useEffect } from "react";
import supabaseClient from "../lib/supabase";
import { useUserStore } from "../store";

export const useAuthManager = () => {
  const { setUserId, setUserEmail, setIsUserLoggedIn } = useUserStore();

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((_, session) => {
      if (session) {
        setIsUserLoggedIn(true);
        setUserId(session.user.id);
        setUserEmail(session.user.email || null);
      } else {
        setIsUserLoggedIn(false);
        setUserId(null);
        setUserEmail(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
};
