"use client";

import { createContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export let isLoggedIn = false;

interface AuthContextType {
    user: { username: string, email: string, provider: string } | null;
    // token: string | null;
    login: (email: string, password: string) => Promise<string | null>;
    register: (email: string, username: string, password: string) => Promise<string | null>;
    logout: () => Promise<void>;
    updateEmail: (email: string) => Promise<string | null>;
    updateUsername: (username: string) => Promise<string | null>;
    updatePassword: (password: string) => Promise<string | null>;
    deleteAccount: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    // token: null,
    login: async () => {return null;},
    register: async () => {return null;},
    logout: async () => {},
    updateEmail: async () => {return null;},
    updateUsername: async () => {return null;},
    updatePassword: async () => {return null;},
    deleteAccount: async () => {return null;},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<{ username: string; email: string; provider: string } | null>(null);
    // const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const fetchedUser = useRef(false);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });
            if (response.ok) {
                // const data = await response.json();
                // Cookies.set("jwt", data.token, { expires: 1 });
                // setToken(data.token);
                fetchUser();
                isLoggedIn = true;
                router.push("/collections");
                return null;
            } else {
                throw new Error("Invalid email or password");
            }
        } catch (error) {
            return (error as Error).message;
        }
    };

    const register = async (email: string, username: string, password: string) => {
        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password }),
                credentials: "include",
            });
            if (response.ok) {
                await login(email, password);
                return null;
            } else {
                throw new Error("Registration failed");
            }
        } catch (error) {
            return (error as Error).message;
        }
    };

    const logout = useCallback(async () => {
        // Cookies.remove("jwt");
        // setToken(null);
        // setUser(null);
        // router.push("/home");
        try {
            const response = await fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                credentials: "include",
            });
    
            if (response.ok) {
                setUser(null);
                sessionStorage.clear();
                isLoggedIn = false;
                router.push("/home");
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error logging out", error);
        }
    }, [router]);

    const fetchUser = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/me", {
                // headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });
            if (response.ok) {
                const userData = await response.json();
                sessionStorage.setItem("user", JSON.stringify(userData));
                setUser({ username: userData.username, email: userData.email, provider: userData.provider });
            }
        } catch (error) {
            console.error("Failed to fetch user", error);
            logout();
        }
    }, [logout]);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        const checkedUser = sessionStorage.getItem("checkedUser");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                isLoggedIn = true;
                setUser({ username: parsedUser.username, email: parsedUser.email, provider: parsedUser.provider });
            } catch (error) {
                console.error("Failed to parse stored user", error);
                logout();
            }
        } else if (!checkedUser && !fetchedUser.current) {
            fetchedUser.current = true;
            sessionStorage.setItem("checkedUser", "true");
            fetchUser();
        }
    }, [fetchUser, logout, fetchedUser]);

    const updateEmail = async (email: string) => {
        try {
            const response = await fetch(`http://localhost:8080/auth/update-email?email=${encodeURIComponent(email)}`, {
                method: "PUT",
                // headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });
            if (response.ok) {
                fetchUser();
                return null;
            } else {
                throw new Error("Failed to update email");
            }
        } catch (error) {
            return (error as Error).message;
        }
    };

    const updateUsername = async (username: string) => {
        try {
            const response = await fetch(`http://localhost:8080/auth/update-username?username=${encodeURIComponent(username)}`, {
                method: "PUT",
                // headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });
            if (response.ok) {
                fetchUser();
                return null;
            } else {
                throw new Error("Failed to update username");
            }
        } catch (error) {
            return (error as Error).message;
        }
    };

    const updatePassword = async (password: string) => {
        try {
            const response = await fetch(`http://localhost:8080/auth/update-password?password=${encodeURIComponent(password)}`, {
                method: "PUT",
                // headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });
            if (response.ok) {
                return null;
            } else {
                throw new Error("Failed to update password");
            }
        } catch (error) {
            return (error as Error).message;
        }
    };

    const deleteAccount = async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/delete-account", {
                method: "DELETE",
                // headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });
            if (response.ok) {
                setUser(null);
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

    return (
        <AuthContext.Provider value={{ user, /*token,*/ login, register, logout, updateEmail, updateUsername, updatePassword, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
}
