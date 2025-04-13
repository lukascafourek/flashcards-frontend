"use client";

import AuthProvider from "@/app/context/authContext";
import Header from "@/app/components/elements/header";
import Footer from "../components/elements/footer";
import LoginForm from "../components/elements/loginForm";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "../components/elements/loadingCircle";

// This is the main page of the app when a user is not logged in. It will be displayed when the user navigates to /home.
export default function Home() {
  const Render = () => {
    const { authChecked } = useAuth();
    
    if (!authChecked) return <LoadingSpinner />;
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col md:text-xl text-black">
        {/* Header */}
        <Header />

        {/* Welcome Text */}
        <div className="bg-gray-900 md:text-xl text-white text-center py-10">
          Welcome to Flash cards Learning App! To use the entire app
          functionalities, please sign in below.
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* About the App Section */}
        <div className="bg-white max-w-6xl w-full mx-auto p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            About Flash Cards Learning App
          </h1>
          <p className="text-lg text-center text-gray-700 mb-4">
            This Flash Cards Learning App is designed to help users improve
            their knowledge and memorization skills. You can create your own
            card sets, explore sets made by others, and track your progress in a
            fun and interactive way. The app offers different learning modes to
            make studying more efficient and engaging.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Contact and Feedback
          </h2>
          <p className="text-lg text-center text-gray-700 mb-4">
            As part of my bachelor&apos;s thesis, I would greatly appreciate your
            feedback to improve the app and get results. If you encounter bugs or issues, please
            fill out the <strong>Bug Report Form</strong>. You can also test the
            app by following several test scenarios and provide your insights in
            the <strong>Test Report Form</strong>.
          </p>
          <p className="text-lg text-center text-gray-700">
            You can contact me and see more about the app in the links below or in the navigation bar:
          </p>
          <div className="flex justify-center items-center gap-4 mt-4 text-lg">
          <Link href={"/contact"} className="text-blue-500 underline">
            Contact Me
          </Link>
          <br />
          <Link href={"/about-app"} className="text-blue-500 underline">
            About the App
          </Link>
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
