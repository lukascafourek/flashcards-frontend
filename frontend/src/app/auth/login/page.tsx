"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import AuthProvider from "@/app/context/authContext";
import Header from "@/app/header";
import Footer from "@/app/footer";

export default function Login() {
  const Render = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      const error = await login(email, password);
      if (error) {
        setError(error);
      }
    };

    const handleGoogleLogin = () => {
      window.location.href = "http://localhost:8080/oauth2/authorization/google";
    }
  
    return (
      <div className="min-h-screen bg-gray-200">
        {/* Header */}
        <Header />
  
        {/* Welcome Text */}
        {/* <div className="bg-gray-900 text-xl text-white text-center py-10">
          Welcome to Flash cards Learning App! To use the app, please sign in below.
        </div> */}
  
        {/* Login Form */}
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-center text-black text-xl font-semibold mb-4">Sign In</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleLogin}>
              <label className="block mb-2 text-black">Email</label>
              <input 
              type="email" 
              className="w-full p-2 mb-4 border rounded text-black" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              />
              
              <label className="block mb-2 text-black">Password</label>
              <div className="relative">
                <input 
                type={showPassword ? "text" : "password"} 
                className="w-full p-2 mb-4 border rounded text-black" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20} />
                </span>
              </div>
                <button 
                type="submit"
                className="w-full p-2 bg-gray-900 text-white rounded"
                disabled={!!(!email || !password)}
                >
                  Sign In
                </button>
            </form>
            
            <div className="mt-4 text-left">
              <Link href="/auth/reset-password" className="text-sm text-blue-500">Forgot password?</Link>
              <br />
              <Link href="/auth/register" className="text-sm text-blue-500">New to the app? Register</Link>
              <button
                type="button"
                className="w-full p-2 bg-blue-500 text-white rounded mt-4"
                onClick={handleGoogleLogin}
              >
                Or Sign In with Google
              </button>
            </div>
          </div>
        </div>
  
        {/* Footer */}
        <Footer />
      </div>
    );
  };

  return <AuthProvider>
    <Render />
  </AuthProvider>
}
