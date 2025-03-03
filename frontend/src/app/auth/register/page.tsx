"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("✅ Register button clicked");
        try {
            console.log("📤 Calling register function...");
            await register(email, username, password);
            console.log("✅ Register function executed");
        } catch {
            setError("Registration failed.");
            console.error("❌ Passwords do not match");
        }
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setEmailError("Invalid email format ❌");
        } else {
          setEmailError("");
        }
    };

    const validateUsername = (username: string) => {
        if (username.length < 3) {
            setUsernameError("Username must be at least 3 characters ❌");
        } else {
            setUsernameError("");
        }
    }
    
    const checkPasswords = (pass: string, confirmPass: string) => {
        if (pass.length < 8) {
            setPasswordError("Password must be at least 8 characters ❌");
        } else {
            setPasswordError("");
        }

        if (pass && confirmPass) {
            if (pass === confirmPass) {
                setPasswordMatchMessage("Passwords match ✅");
            } else {
                setPasswordMatchMessage("Passwords do not match ❌");
            }
        } else {
            setPasswordMatchMessage("");
        }
    };

    return (
    <div className="min-h-screen bg-gray-200">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white text-black">
            <h1 className="ml-5 text-xl px-6 py-4 bg-gray-900 rounded-lg text-white">Flash cards - Your Way To Study</h1>
            <nav>
                <Link href="/home" className="text-lg px-3 py-2 hover:bg-gray-200 rounded-lg">Get Started</Link>
                <Link href="/about-app" className="text-lg ml-5 px-3 py-2 hover:bg-gray-200 rounded-lg">About App</Link>
                <Link href="/contact" className="text-lg ml-5 px-3 py-2 hover:bg-gray-200 rounded-lg">Contact</Link>
                <Link href="/auth/login" className="text-lg ml-5 px-3 py-2 bg-gray-300 rounded-lg border border-solid border-black">Sign in</Link>
                <Link href="/auth/register" className="text-lg ml-5 mr-5 px-3 py-2 bg-gray-900 text-white rounded-lg">Register</Link>
            </nav>
        </header>

      {/* Welcome Text */}
      {/* <div className="bg-gray-900 text-xl text-white text-center py-10">
        Welcome to Flash cards Learning App! To use the app, please sign in below.
      </div> */}

        {/* Register Form */}
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-center text-black text-xl font-semibold mb-4">Register</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-black">Email</label>
                    <input 
                    type="email" 
                    className="w-full p-2 mb-2 border rounded text-black" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        validateEmail(e.target.value);
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
                        setUsername(e.target.value);
                        validateUsername(e.target.value);
                    }}
                    required
                    />
                    <p className="text-sm text-red-500 mb-2">{usernameError}</p>
                    
                    <label className="block mb-2 text-black">Password</label>
                    <div className="relative mb-4">
                        <input
                        type={showPassword ? "text" : "password"}
                        className="w-full p-2 border rounded text-black"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            checkPasswords(e.target.value, confirmPassword);
                        }}
                        required
                        />
                        <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20}/>
                        </span>
                    </div>
                    <p className="text-sm text-red-500 mb-4">{passwordError}</p>

                    <label className="block mb-2 text-black">Confirm Your Password</label>
                    <div className="relative mb-4">
                        <input
                        type={showPassword ? "text" : "password"}
                        className="w-full p-2 border rounded text-black"
                        placeholder="Enter your password again"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            checkPasswords(password, e.target.value);
                        }}
                        required
                        />
                        <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20}/>
                        </span>
                    </div>
                    <p className={`text-sm mb-8 ${passwordMatchMessage.includes("do not match") ? "text-red-500" : "text-green-500"}`}>
                        {passwordMatchMessage}
                    </p>
                    <button 
                    type="submit"
                    className="w-full p-2 bg-gray-900 text-white rounded" 
                    disabled={!!(emailError || passwordError || passwordMatchMessage.includes("❌") || !email || !password || !confirmPassword)}
                    >
                    Sign Up
                    </button>
                </form>
            </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-center items-center p-4 bg-white text-black w-full absolute bottom-0">
            <p className="text-center text-sm">© 2025 <i>Lukáš Cafourek</i> Web application with flash card learning method. All rights reserved.</p>
        </footer>
    </div>
  );
}
