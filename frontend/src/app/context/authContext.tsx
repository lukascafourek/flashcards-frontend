"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: unknown;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: async () => {},
    register: async () => {},
    logout: () => {},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<unknown>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("jwt");
        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        }
    }, []);

    const fetchUser = async (token: string) => {
        try {
            const response = await fetch("http://localhost:8080/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            }
        } catch (error) {
            console.error("Failed to fetch user", error);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("jwt", data.token);
                setToken(data.token);
                fetchUser(data.token);
                router.push("/collections/my-collections");
            } else {
                console.error("Login failed");
            }
        } catch (error) {
            console.error("Error logging in", error);
        }
    };

    const register = async (email: string, username: string, password: string) => {
        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password }),
            });
            if (response.ok) {
                await login(email, password);
            } else {
                console.error("Registration failed");
            }
        } catch (error) {
            console.error("Error registering", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("jwt");
        setToken(null);
        setUser(null);
        router.push("/home");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
