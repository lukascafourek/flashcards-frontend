"use client";

import Header from "@/app/header";
import AuthProvider from "../context/authContext";
import Footer from "../footer";

export default function ShowInfoAboutApp() {
  const Render = () => {
    return (
      <div className="min-h-screen bg-gray-200">
        {/* Header */}
        <Header />

        {/* Welcome Text */}
        {/* <div className="bg-gray-900 text-xl text-white text-center py-10">
          Welcome to Flash cards Learning App! To use the app, please sign in below.
        </div> */}

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
