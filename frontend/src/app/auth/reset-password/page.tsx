"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ResetPassword() {
    const [step, setStep] = useState("email");
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSendToken = () => {
        // Simulace odeslání emailu (reálně by se volal backend)
        if (email.includes("@") && email.includes(".")) {
            alert(`A reset token has been sent to ${email}`);
            setStep("verify");
        } else {
            alert("Please enter a valid email address.");
        }
    };

    const handleVerify = () => {
        // Simulace ověření tokenu (reálně by se ověřovalo na backendu)
        if (token === "123456") {
            setStep("newPassword");
        } else {
            alert("Invalid token, please try again.");
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
                <Link href="/home" className="text-lg px-3 py-2 bg-gray-300 rounded-lg">Get Started</Link>
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

            {/* Password Reset Form */}
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                    {step === "email" ? (
                        <>
                            <h2 className="text-center text-black text-xl font-semibold mb-4">Password Reset</h2>
                            <label className="block mb-2 text-black">Enter your email to receive a reset token:</label>
                            <input
                                type="email"
                                className="w-full p-2 mb-4 border rounded text-black"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className="w-full p-2 bg-gray-900 text-white rounded" onClick={handleSendToken}>
                                Send Token
                            </button>
                        </>
                    ) : step === "verify" ? (
                    // První krok - ověření tokenu
                    <>
                        <h2 className="text-center text-black text-xl font-semibold mb-4">Password Reset</h2>
                        <label className="block mb-2 text-black">
                            A message with a temporary token was sent to your email. Please enter the token below.
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 mb-4 border rounded text-black"
                            placeholder="Enter the token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                        <button className="w-full p-2 bg-gray-900 text-white rounded" onClick={handleVerify}>
                            Verify
                        </button>
                    </>
                    ) : (
                    // Druhý krok - zadání nového hesla
                    <>
                        <h2 className="text-center text-black text-xl font-semibold mb-4">Set New Password</h2>
                        
                        <label className="block mb-2 text-black">New Password</label>
                        <div className="relative mb-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-2 border rounded text-black"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    checkPasswords(e.target.value, confirmPassword);
                                }}
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20} />
                            </span>
                        </div>
                        <p className="text-sm text-red-500">{passwordError}</p>

                        <label className="block mb-2 text-black">Confirm Password</label>
                        <div className="relative mb-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-2 border rounded text-black"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                checkPasswords(password, e.target.value);
                                }}
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20} />
                            </span>
                        </div>
                        <p className={`text-sm ${passwordMatchMessage.includes("do not match") ? "text-red-500" : "text-green-500"}`}>
                            {passwordMatchMessage}
                        </p>

                        <Link href="/auth/login">
                            <button
                                className="w-full p-2 bg-gray-900 text-white rounded mt-4"
                                disabled={!!passwordError || passwordMatchMessage.includes("❌") || !password || !confirmPassword}
                            >
                                Reset Password
                            </button>
                        </Link>
                    </>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="flex justify-center items-center p-4 bg-white text-black w-full absolute bottom-0">
                <p className="text-center text-sm">© 2025 <i>Lukáš Cafourek</i> Web application with flash card learning method. All rights reserved.</p>
            </footer>
        </div>
    );
}
