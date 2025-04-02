"use client";

import Header from "@/app/components/header";
import AuthProvider from "@/app/context/authContext";
import Footer from "@/app/components/footer";

export default function BaseMethod() {
  const Render = () => {
    return (
      <div className="min-h-screen flex flex-col bg-gray-200">
        {/* Header */}
        <Header />

        {/* Welcome Text */}
        {/* <div className="bg-gray-900 text-xl text-white text-center py-10">
          Welcome to Flash cards Learning App! To use the app, please sign in below.
        </div> */}

        {/* Main Content */}
        <div className="flex-grow"></div>

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
