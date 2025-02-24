"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setEmailError("Invalid email format ❌");
        } else {
          setEmailError("");
        }
    };
    
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
                <Link href="/login" className="text-lg ml-5 px-3 py-2 bg-gray-300 rounded-lg border border-solid border-black">Sign in</Link>
                <Link href="/register" className="text-lg ml-5 mr-5 px-3 py-2 bg-gray-900 text-white rounded-lg">Register</Link>
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
                <form>
                    <label className="block mb-2 text-black">Email</label>
                    <input 
                    type="email" 
                    className="w-full p-2 mb-4 border rounded text-black" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        validateEmail(e.target.value);
                    }}
                    />
                    <p className="text-sm text-red-500">{emailError}</p>
                    
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
                        />
                        <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20}/>
                        </span>
                    </div>
                    <p className={`text-sm mb-8 ${passwordMatchMessage.includes("do not match") ? "text-red-500" : "text-green-500"}`}>
                        {passwordMatchMessage}
                    </p>
                    
                    <Link href="/">
                        <button 
                        className="w-full p-2 bg-gray-900 text-white rounded" 
                        disabled={!!(emailError || passwordError || passwordMatchMessage.includes("❌") || !email || !password || !confirmPassword)}
                        >
                        Sign Up
                        </button>
                    </Link>
                </form>
                
                {/* <div className="mt-4 text-left">
                <Link href="#" className="text-sm text-blue-500">Forgot password?</Link>
                <br />
                <Link href="#" className="text-sm text-blue-500">New to the app? Register</Link>
                </div> */}
            </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-center items-center p-4 bg-white text-black w-full absolute bottom-0">
            <p className="text-center text-sm">© 2025 <i>Lukáš Cafourek</i> Web application with flash card learning method. All rights reserved.</p>
        </footer>
    </div>
  );
}
