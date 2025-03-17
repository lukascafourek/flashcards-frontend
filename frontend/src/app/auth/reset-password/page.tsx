"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/app/components/header";
import AuthProvider from "@/app/context/authContext";
import Footer from "@/app/components/footer";
import { /*sendToken, sendNewToken,*/ verifyToken, resetPassword, handleRequest } from "@/app/components/tokenComponents";
import { validateEmail, checkPasswords } from "@/app/components/validationComponents";

export default function ResetPassword() {
    const Render = () => {
        const [step, setStep] = useState("email");
        const [email, setEmail] = useState("");
        const [token, setToken] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [errorMessage, setErrorMessage] = useState("");
        const [passwordMessage, setPasswordMessage] = useState("");
        const [showPassword, setShowPassword] = useState(false);
        const [tokenMessage, setTokenMessage] = useState("");
        const [resetPasswordError, setResetPasswordError] = useState("");

        const handleResendToken = async () => {
            // const error = await sendNewToken(email);
            const error = await handleRequest(email);
            if (!error) {
                setTokenMessage("New token was sent to your email.");
            } else {
                setTokenMessage(error);
            }
        };

        const handleSendToken = async (e: React.FormEvent) => {
            e.preventDefault();
            // const error = await sendToken(email);
            const error = await handleRequest(email);
            if (!error) {
                setStep("verify");
            } else {
                setErrorMessage(error);
            }
        };

        const handleVerifyToken = async () => {
            const error = await verifyToken(email, token);
            if (!error) {
                setStep("newPassword");
            } else {
                setTokenMessage(error);
            }
        };

        const handleResetPassword = async () => {
            const error = await resetPassword(email, password);
            if (!error) {
                window.location.href = "http://localhost:3000/auth/login";
            } else {
                setResetPasswordError(error);
            }
        };
        
        return (
            <div className="min-h-screen bg-gray-200">
                {/* Header */}
                <Header />

                {/* Password Reset Form */}
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
                        {step === "email" ? (
                            <>
                                <h2 className="text-center text-black text-xl font-semibold mb-4">Password Reset</h2>
                                <form onSubmit={handleSendToken}>
                                    <label className="block mb-2 text-black">Enter your email to receive a reset token:</label>
                                    <input
                                        type="email"
                                        className="w-full p-2 mb-2 border rounded text-black"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setErrorMessage(validateEmail(e.target.value));
                                        }}
                                    />
                                    <button type="submit" className="w-full p-2 bg-gray-900 text-white rounded mb-4" disabled={!email || !!errorMessage}>
                                        Send Token
                                    </button>
                                </form>
                                {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
                            </>
                        ) : step === "verify" ? (
                        <>
                            <h2 className="text-center text-black text-xl font-semibold mb-4">Password Reset</h2>
                            <label className="block mb-2 text-black">
                                A reset token was sent to {email}. Please enter the token below.
                            </label>
                            <button type="button" className="px-1 bg-blue-500 text-white rounded mb-2"onClick={handleResendToken}>
                                Resend Token
                            </button>
                            <input
                                type="text"
                                className="w-full p-2 mb-2 border rounded text-black"
                                placeholder="Enter the token"
                                value={token}
                                onChange={(e) => {
                                    setToken(e.target.value);
                                    setTokenMessage("");
                                }}
                            />
                            <p className={`text-sm mb-4 ${!tokenMessage.includes("New") ? "text-red-500" : "text-green-500"}`}>
                                {tokenMessage}
                            </p>
                            <button type="button" className="w-full p-2 bg-gray-900 text-white rounded" disabled={!token} onClick={handleVerifyToken}>
                                Verify
                            </button>
                        </>
                        ) : (
                        <>
                            <h2 className="text-center text-black text-xl font-semibold mb-4">Set New Password</h2>
                            <label className="block mb-2 text-black">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full p-2 border rounded text-black mb-2"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordMessage(checkPasswords(e.target.value, confirmPassword));
                                        setResetPasswordError("");
                                    }}
                                />
                                <span
                                    className="absolute right-3 top-3 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20} />
                                </span>
                            </div>

                            <label className="block mb-2 text-black">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full p-2 border rounded text-black mb-2"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setPasswordMessage(checkPasswords(password, e.target.value));
                                        setResetPasswordError("");
                                    }}
                                />
                                <span
                                    className="absolute right-3 top-3 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20} />
                                </span>
                            </div>
                            <p className="text-sm text-red-500 mb-4">{passwordMessage}</p>
                            <button
                                type="button"
                                className="w-full p-2 bg-gray-900 text-white rounded mb-4"
                                disabled={passwordMessage !== "" || !password || !confirmPassword}
                                onClick={handleResetPassword}
                            >
                                Reset Password
                            </button>
                            {resetPasswordError && <p className="text-sm text-red-500">{resetPasswordError}</p>}
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
