"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import AuthProvider from "@/app/context/authContext";
import Header from "@/app/components/elements/header";
import Footer from "@/app/components/elements/footer";
import { handleChange } from "@/app/components/functions/inputValidation";
import {
  validateEmail,
  validateUsername,
  checkPasswords,
} from "@/app/components/functions/credentialValidations";

const MAX_CHAR_LIMIT = 255;

interface PasswordCredentialData {
  id: string;
  password: string;
}

// This is a register page that allows users to register with their email, username, and password. It also includes a Google login option.
export default function Register() {
  const Render = () => {
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const error = await register(email, username, password);
      if (error) {
        setError(error);
        return;
      }
      if ("credentials" in navigator && "PasswordCredential" in window) {
        try {
          const credential = new (window.PasswordCredential as unknown as new (
            data: PasswordCredentialData
          ) => Credential)({
            id: email,
            password: password,
          });
          await navigator.credentials.store(credential);
        } catch (err) {
          console.error("Failed to store credentials:", err);
        }
      } else {
        console.warn(
          "Credential Management API is not supported in this browser."
        );
      }
      window.location.href = "/collections";
    };

    const handleGoogleLogin = () => {
      window.location.href =
        "http://localhost:8080/oauth2/authorization/google";
    };

    return (
      <div className="min-h-screen bg-gray-200 flex flex-col">
        {/* Header */}
        <Header />

        {/* Register Form */}
        <div className="flex justify-center items-center flex-grow md:text-xl">
          <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-md my-8">
            <h2 className="text-center text-black text-xl font-semibold mb-4">
              Register
            </h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-black">Email</label>
              <input
                type="email"
                className="w-full p-2 mb-2 border rounded text-black"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  handleChange(e.target.value, setEmail, MAX_CHAR_LIMIT);
                  setEmailError(validateEmail(e.target.value));
                }}
                required
              />
              <p className="text-sm text-red-500 mb-2">{emailError}</p>

              <label className="block mb-2 text-black">Username</label>
              <input
                type="username"
                className="w-full p-2 mb-2 border rounded text-black"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  handleChange(e.target.value, setUsername, MAX_CHAR_LIMIT);
                  setUsernameError(validateUsername(e.target.value));
                }}
                required
              />
              <p className="text-sm text-red-500 mb-2">{usernameError}</p>

              <label className="block mb-2 text-black">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2 border rounded text-black mb-4"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    handleChange(e.target.value, setPassword, MAX_CHAR_LIMIT);
                    setPasswordError(
                      checkPasswords(e.target.value, confirmPassword)
                    );
                  }}
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Image
                    src="/eye.png"
                    alt="Toggle Password Visibility"
                    width={20}
                    height={20}
                  />
                </span>
              </div>

              <label className="block mb-2 text-black">
                Confirm Your Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2 border rounded text-black mb-2"
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(e) => {
                    handleChange(
                      e.target.value,
                      setConfirmPassword,
                      MAX_CHAR_LIMIT
                    );
                    setPasswordError(checkPasswords(password, e.target.value));
                  }}
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Image
                    src="/eye.png"
                    alt="Toggle Password Visibility"
                    width={20}
                    height={20}
                  />
                </span>
              </div>
              <p className="text-sm text-red-500 mb-4">{passwordError}</p>
              <button
                type="submit"
                className="w-full p-2 bg-gray-900 text-white rounded"
                disabled={
                  !!(
                    emailError !== "" ||
                    passwordError !== "" ||
                    !email.trim() ||
                    !password.trim() ||
                    !confirmPassword.trim()
                  )
                }
              >
                Sign Up
              </button>
            </form>
            <div className="mt-4 text-left">
              <button
                type="button"
                className="w-full p-2 bg-blue-500 text-white rounded"
                onClick={handleGoogleLogin}
              >
                Or Sign Up with Google
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  };

  return (
    <AuthProvider>
      <Render />
    </AuthProvider>
  );
}
