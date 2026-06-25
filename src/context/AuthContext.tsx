import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, setAccessToken } from "../services/api";

interface AuthContextValue {
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.post<{ accessToken: string }>(
          "/api/auth/refresh"
        );
        setAccessTokenState(data.accessToken);
        setAccessToken(data.accessToken);
      } catch {
        setAccessTokenState(null);
        setAccessToken(null);
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { data } = await api.post<{ accessToken: string }>(
      "/api/auth/login",
      { username, password }
    );
    setAccessTokenState(data.accessToken);
    setAccessToken(data.accessToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setAccessTokenState(null);
      setAccessToken(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated: !!accessToken,
      isInitializing,
      login,
      logout,
    }),
    [accessToken, isInitializing, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
