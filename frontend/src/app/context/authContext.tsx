"use client";

import { createContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export let isLoggedIn = false;

interface AuthContextType {
    user: { username: string, email: string, provider: string } | null;
    login: (email: string, password: string) => Promise<string | null>;
    register: (email: string, username: string, password: string) => Promise<string | null>;
    logout: () => Promise<string | null>;
    updateUser: (username: string | null, email: string | null, password: string | null, check: string | null) => Promise<string | null>;
    updateEmail: (email: string) => Promise<string | null>;
    updateUsername: (username: string) => Promise<string | null>;
    updatePassword: (password: string) => Promise<string | null>;
    deleteAccount: () => Promise<string | null>;
    checkEmail: (email: string) => Promise<string | null>;
    checkPassword: (oldPassword: string, newEmail: string, newPassword: string) => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {return null;},
    register: async () => {return null;},
    logout: async () => {return null;},
    updateUser: async () => {return null;},
    updateEmail: async () => {return null;},
    updateUsername: async () => {return null;},
    updatePassword: async () => {return null;},
    deleteAccount: async () => {return null;},
    checkEmail: async () => {return null;},
    checkPassword: async () => {return null;},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<{ username: string; email: string; provider: string } | null>(null);
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
                const message = await response.text();
                throw new Error(message);
            }
        } catch (error) {
            return (error as Error).message;
        }
    };

    const logout = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                credentials: "include",
            });
    
            if (response.ok) {
                setUser({ username: "", email: "", provider: "" });
                sessionStorage.clear();
                isLoggedIn = false;
                router.push("/home");
                return null;
            } else {
                const message = await response.text();
                throw new Error(message);
            }
        } catch (error) {
            return (error as Error).message;
        }
    }, [router]);

    const fetchUser = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/me", {
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
        } else {
            setUser({ username: "", email: "", provider: "" });
        }
    }, [fetchUser, logout, fetchedUser]);

    const updateUser = async (username: string | null, email: string | null, password: string | null, check: string | null) => {
        try {
            for (let field of [username, email, password, check]) {
                if (field === "") {
                    field = null;
                }
            }
            if (email !== null || password !== null) {
                if (check === null) {
                    throw new Error("Please enter your current password for verification.");
                }
            }
            const response = await fetch("http://localhost:8080/auth/update-user", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            if (response.ok) {
                fetchUser();
                return null;
            } else {
                const message = await response.text();
                throw new Error(message);
            }
        } catch (error) {
            return (error as Error).message;
        }
    };

    const updateEmail = async (email: string) => {
        try {
            const response = await fetch("http://localhost:8080/auth/update-user", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
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
            const response = await fetch("http://localhost:8080/auth/update-user", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
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
            const response = await fetch("http://localhost:8080/auth/update-user", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
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

    const checkEmail = async (email: string) => {
        try {
            let returnMessage = null;
            const response = await fetch(`http://localhost:8080/auth/email-exists?email=${encodeURIComponent(email)}`, {
              method: "GET",
              credentials: "include",
            });
          if (response.ok) {
            const exists = await response.json();
            if (exists) {
                throw new Error("Email already exists ❌");
            } else {
                returnMessage = updateEmail(email);
                // returnMessage = updateUser(null, email, null);
            }
            return returnMessage;
          } else {
            throw new Error("Failed to check email. Please try again.");
          }
        } catch (error) {
            return (error as Error).message;
        }
      };

      const checkPassword = async (oldPassword: string, newEmail: string, newPassword: string) => {
        try {
            let errorMessage = null;
            const response = await fetch(`http://localhost:8080/auth/check-password?password=${encodeURIComponent(oldPassword)}`, {
                method: "GET",
            });
          if (response.ok) {
            const data = await response.json();
            if (data) {
              if (newEmail !== "") {
                errorMessage = checkEmail(newEmail);
              }
              if (errorMessage === null && newPassword !== "") {
                errorMessage = updatePassword(newPassword);
                // errorMessage = updateUser(null, null, newPassword);
              }
              return errorMessage;
            } else {
              throw new Error("Incorrect password ❌");
            }
          } else {
            throw new Error("Failed to check password. Please try again.");
          }
        } catch (error) {
            return (error as Error).message;
        }
      };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, updateEmail, updateUsername, updatePassword, deleteAccount, checkEmail, checkPassword }}>
            {children}
        </AuthContext.Provider>
    );
}
