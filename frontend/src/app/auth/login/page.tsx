"use client";

import AuthProvider from "@/app/context/authContext";
import Header from "@/app/components/elements/header";
import Footer from "@/app/components/elements/footer";
import LoginForm from "@/app/components/elements/loginForm";
import { useAuth } from "@/app/hooks/useAuth";
import { LoadingSpinner } from "@/app/components/elements/loadingCircle";

// This is the main login page for the application.
// It uses other components like other pages and LoginForm to create the login page.
export default function Login() {
  const Render = () => {
    const { authChecked } = useAuth();

    if (!authChecked) return <LoadingSpinner />;
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
