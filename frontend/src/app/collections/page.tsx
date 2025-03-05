"use client";

import Header from "@/app/header";
import AuthProvider from "../context/authContext";

export default function Collections() {
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
        <footer className="flex justify-center items-center p-4 bg-white text-black w-full absolute bottom-0">
          <p className="text-center text-sm">© 2025 <i>Lukáš Cafourek</i> Web application with flash card learning method. All rights reserved.</p>
        </footer>
      </div>
    );
  };

  return (
    <AuthProvider>
      <Render />
    </AuthProvider>
  );
}
