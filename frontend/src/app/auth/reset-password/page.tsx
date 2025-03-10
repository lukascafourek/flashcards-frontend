"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/app/header";
import AuthProvider from "@/app/context/authContext";
import Footer from "@/app/footer";

export default function ResetPassword() {
    const Render = () => {
        const [step, setStep] = useState("email");
        const [email, setEmail] = useState("");
        const [token, setToken] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [passwordError, setPasswordError] = useState("");
        const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
        const [showPassword, setShowPassword] = useState(false);
        const [emailError, setEmailError] = useState("");

        const validateEmail = (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setEmailError("Invalid email format ❌");
            } else {
                setEmailError("");
            }
        };

        const handleSendToken = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                const response = await fetch(`http://localhost:8080/auth/email-exists?email=${encodeURIComponent(email)}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const exists = await response.json();
                    if (exists) {
                        setStep("verify");
                    } else {
                        setEmailError("Email not found ❌");
                    }
                } else {
                    alert("There was an issue with the request. Please try again.");
                }
            } catch (error) {
                console.error("Error verifying email:", error);
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
                <Header />

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
                                <form onSubmit={handleSendToken}>
                                    <label className="block mb-2 text-black">Enter your email to receive a reset token:</label>
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
                                    <p className="text-sm mb-2 text-red-500">{emailError}</p>
                                    <button type="submit" className="w-full p-2 bg-gray-900 text-white rounded" disabled={!email || !!emailError}>
                                        Send Token
                                    </button>
                                </form>
                            </>
                        ) : step === "verify" ? (
                        <>
                            <h2 className="text-center text-black text-xl font-semibold mb-4">Password Reset</h2>
                            <label className="block mb-2 text-black">
                                A reset token was sent to {email}. Please enter the token below.
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 mb-4 border rounded text-black"
                                placeholder="Enter the token"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                            />
                            <button className="w-full p-2 bg-gray-900 text-white rounded" onClick={handleVerify} disabled={!token}>
                                Verify
                            </button>
                        </>
                        ) : (
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
