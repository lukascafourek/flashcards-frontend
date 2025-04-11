import { useContext } from "react";
import { AuthContext } from "../context/authContext";

// This hook provides access to the authentication context, which contains the authentication state and functions.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
