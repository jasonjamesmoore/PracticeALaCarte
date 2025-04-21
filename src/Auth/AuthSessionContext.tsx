import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";

type AuthSessionContextValue = {
  session: Session | null;
  loading: boolean;
};

const AuthSessionContext = createContext<AuthSessionContextValue>(
  {} as AuthSessionContextValue
);

type AuthSessionProviderProps = {
  children: ReactNode;
};

export const AuthSessionProvider = ({ children }: AuthSessionProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("AuthSessionProvider: Mounted");
    const auth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setSession((prev) => {
          if (prev?.access_token === data.session?.access_token) return prev;
          return data.session;
        });
      } else {
        console.log(error);
      }
      setLoading(false);
    };
    auth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession((prevSession) => {
          if (prevSession?.access_token === newSession?.access_token)
            return prevSession; // Prevent unnecessary updates
          return newSession;
        });
        setLoading(false);
      }
    );

    return () => {
      // console.log("AuthSessionProvider: Unmounted");
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const contextValue = useMemo(() => {
    // console.log("AuthSessionProvider: contextValue recalculated");
    return { session, loading };
  }, [session, loading]);

  return (
    <AuthSessionContext.Provider value={contextValue}>
      {children}
    </AuthSessionContext.Provider>
  );
};

export const useAuthSession = () => useContext(AuthSessionContext);
