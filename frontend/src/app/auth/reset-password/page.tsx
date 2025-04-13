"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/app/components/elements/header";
import AuthProvider, { doneLoading } from "@/app/context/authContext";
import Footer from "@/app/components/elements/footer";
import { handleChange } from "@/app/components/functions/inputValidation";
import {
  verifyToken,
  resetPassword,
  handleRequest,
} from "@/app/components/fetches/tokenFetches";
import {
  validateEmail,
  checkPasswords,
} from "@/app/components/functions/credentialValidations";
import { LoadingSpinner } from "@/app/components/elements/loadingCircle";

const MAX_CHAR_LIMIT = 255;

// This function handles the password reset process, including sending a token to the user's email, verifying the token, and resetting the password.
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
      const error = await handleRequest(email);
      if (!error) {
        setTokenMessage("New token was sent to your email.");
      } else {
        setTokenMessage(error);
      }
    };

    const handleSendToken = async (e: React.FormEvent) => {
      e.preventDefault();
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

    if (!doneLoading) return <LoadingSpinner />;
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col md:text-xl">
        {/* Header */}
        <Header />

        {/* Password Reset Form */}
        <div className="flex justify-center items-center flex-grow">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md my-8">
            {step === "email" ? (
              <>
                <h2 className="text-center text-black text-xl font-semibold mb-4">
                  Password Reset
                </h2>
                <form onSubmit={handleSendToken}>
                  <label className="block mb-2 text-black">
                    Enter your email to receive a reset token:
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 mb-2 border rounded text-black"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      handleChange(e.target.value, setEmail, MAX_CHAR_LIMIT);
                      setErrorMessage(validateEmail(e.target.value));
                    }}
                  />
                  <button
                    type="submit"
                    className="w-full p-2 bg-gray-900 text-white rounded mb-4"
                    disabled={!email || !!errorMessage}
                  >
                    Send Token
                  </button>
                </form>
                {errorMessage && (
                  <p className="text-red-500">{errorMessage}</p>
                )}
              </>
            ) : step === "verify" ? (
              <>
                <h2 className="text-center text-black text-xl font-semibold mb-4">
                  Password Reset
                </h2>
                <label className="block mb-2 text-black">
                  A reset token was sent to {email}. Please enter the token
                  below.
                </label>
                <button
                  type="button"
                  className="px-2 py-2 bg-blue-500 text-white rounded mb-2"
                  onClick={handleResendToken}
                >
                  Resend Token
                </button>
                <input
                  type="text"
                  className="w-full p-2 mb-2 border rounded text-black"
                  placeholder="Enter the token"
                  value={token}
                  onChange={(e) => {
                    handleChange(e.target.value, setToken, MAX_CHAR_LIMIT);
                    setTokenMessage("");
                  }}
                />
                <p
                  className={`mb-4 ${
                    !tokenMessage.includes("New")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {tokenMessage}
                </p>
                <button
                  type="button"
                  className="w-full p-2 bg-gray-900 text-white rounded"
                  disabled={!token}
                  onClick={handleVerifyToken}
                >
                  Verify
                </button>
              </>
            ) : (
              <>
                <h2 className="text-center text-black text-xl font-semibold mb-4">
                  Set New Password
                </h2>
                <label className="block mb-2 text-black">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 border rounded text-black mb-2"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => {
                      handleChange(e.target.value, setPassword, MAX_CHAR_LIMIT);
                      setPasswordMessage(
                        checkPasswords(e.target.value, confirmPassword)
                      );
                      setResetPasswordError("");
                    }}
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
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 border rounded text-black mb-2"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      handleChange(e.target.value, setConfirmPassword, MAX_CHAR_LIMIT);
                      setPasswordMessage(
                        checkPasswords(password, e.target.value)
                      );
                      setResetPasswordError("");
                    }}
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
                <p className="text-red-500 mb-4">{passwordMessage}</p>
                <button
                  type="button"
                  className="w-full p-2 bg-gray-900 text-white rounded mb-4"
                  disabled={
                    passwordMessage !== "" ||
                    !password.trim() ||
                    !confirmPassword.trim()
                  }
                  onClick={handleResetPassword}
                >
                  Reset Password
                </button>
                {resetPasswordError && (
                  <p className="text-red-500">{resetPasswordError}</p>
                )}
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
