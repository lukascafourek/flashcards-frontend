"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "../components/elements/loadingCircle";

export let isLoggedIn = false;

interface AuthContextType {
  user: { username: string; email: string; provider: string } | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<string | null>;
  logout: () => Promise<string | null>;
  updateUser: (
    username: string | null,
    email: string | null,
    password: string | null,
    check: string | null
  ) => Promise<string | null>;
  deleteAccount: () => Promise<string | null>;
  fetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {
    return null;
  },
  register: async () => {
    return null;
  },
  logout: async () => {
    return null;
  },
  updateUser: async () => {
    return null;
  },
  deleteAccount: async () => {
    return null;
  },
  fetchUser: async () => {
    return;
  },
});

// This is a authentication provider component that wraps around the app and provides authentication context to all components.
// It uses the AuthContext to provide user information and authentication functions to the rest of the app.
// It also handles the loading state and checks if the user is logged in or not.
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{
    username: string;
    email: string;
    provider: string;
  } | null>(null);
  const router = useRouter();
  const fetchedUser = useRef(false);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (response.ok) {
        fetchUser();
        return null;
      } else {
        throw new Error("Invalid email or password ❌");
      }
    } catch (error) {
      return (error as Error).message;
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
        credentials: "include",
      });
      if (response.ok) {
        await login(email, password);
        return null;
      } else {
        const message = await response.text();
        throw new Error(message);
      }
    } catch (error) {
      return (error as Error).message;
    }
  };

  const logout = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setUser({ username: "", email: "", provider: "" });
        sessionStorage.clear();
        isLoggedIn = false;
        window.location.href = "/home";
        return null;
      } else {
        const message = await response.text();
        throw new Error(message);
      }
    } catch (error) {
      return (error as Error).message;
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const userData = await response.json();
        sessionStorage.setItem("user", JSON.stringify(userData));
        setUser({
          username: userData.username,
          email: userData.email,
          provider: userData.provider,
        });
        isLoggedIn = true;
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      await logout();
    }
  }, [logout]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const checkedUser = sessionStorage.getItem("checkedUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        isLoggedIn = true;
        setUser({
          username: parsedUser.username,
          email: parsedUser.email,
          provider: parsedUser.provider,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to parse stored user", error);
        logout();
      }
    } else if (!checkedUser && !fetchedUser.current) {
      fetchedUser.current = true;
      sessionStorage.setItem("checkedUser", "true");
      fetchUser();
    } else {
      setUser({ username: "", email: "", provider: "" });
      setLoading(false);
    }
  }, [fetchUser, logout, fetchedUser]);

  const updateUser = async (
    username: string | null,
    email: string | null,
    password: string | null,
    check: string | null
  ) => {
    try {
      if (username === "") username = null;
      if (email === "") email = null;
      if (password === "") password = null;
      if (check === "") check = null;
      if (email !== null || password !== null) {
        if (check === null) {
          throw new Error(
            "Please enter your current password for verification."
          );
        }
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update-user`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, check }),
      });
      if (response.ok) {
        await fetchUser();
        return null;
      } else {
        const message = await response.text();
        throw new Error(message);
      }
    } catch (error) {
      return (error as Error).message;
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/delete-account`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setUser({ username: "", email: "", provider: "" });
        sessionStorage.clear();
        isLoggedIn = false;
        router.push("/home");
        return null;
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      return (error as Error).message;
    }
  };

  if (loading) return <LoadingSpinner />;
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        deleteAccount,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
