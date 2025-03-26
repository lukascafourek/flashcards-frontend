"use client";

import AuthProvider from "@/app/context/authContext";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import LoginForm from "@/app/components/loginForm";

export default function Login() {
  const Render = () => {
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col">
        {/* Header */}
        <Header />

        {/* Login Form */}
        <LoginForm />

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
