"use client";

import AuthProvider from "@/app/context/authContext";
import Header from "@/app/components/header";
import Footer from "../components/footer";
import LoginForm from "../components/loginForm";

export default function Home() {
  const Render = () => {
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col">
        {/* Header */}
        <Header />

        {/* Welcome Text */}
        <div className="bg-gray-900 text-xl text-white text-center py-10">
          Welcome to Flash cards Learning App! To use the app, please sign in
          below.
        </div>

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
