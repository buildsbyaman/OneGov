import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api, Profile, getAuthToken } from "../lib/api";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userData: Partial<Profile>,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const profileData = await api.profile.get();
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile();
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await api.auth.getUser();
          setUser(userData);
          await fetchProfile();
        } catch (error) {
          console.error("Error checking auth:", error);
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<Profile>,
  ) => {
    const response = await api.auth.signUp(email, password, userData);
    setUser(response.user);
    setProfile(response.user);
  };

  const signIn = async (email: string, password: string) => {
    const response = await api.auth.signIn(email, password);
    setUser(response.user);
    setProfile(response.user);
  };

  const signOut = async () => {
    await api.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
