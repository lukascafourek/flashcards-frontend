"use client";

import Header from "@/app/components/header";
import AuthProvider from "../context/authContext";
import Footer from "../components/footer";

export default function ShowContact() {
  const Render = () => {
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col">
        {/* Header */}
        <Header />

        {/* Welcome Text */}
        {/* <div className="bg-gray-900 text-xl text-white text-center py-10">
          Welcome to Flash cards Learning App! To use the app, please sign in below.
        </div> */}
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
