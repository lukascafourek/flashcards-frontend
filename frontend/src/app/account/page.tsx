"use client";

import Header from "@/app/components/elements/header";
import AuthProvider from "@/app/context/authContext";
import Footer from "../components/elements/footer";
import UserStatistics from "../components/elements/userStatistics";
import AccountInfo from "../components/elements/accountInfo";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "../components/elements/loadingCircle";

// This page is the main entry point for the account information section of the application.
// It imports necessary components and context providers to render the account information and user statistics.
export default function ShowAccountInfo() {
  const Render = () => {
    const { authChecked } = useAuth();

    if (!authChecked) return <LoadingSpinner />;
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col md:text-xl">
        {/* Header */}
        <Header />

        <div className="flex flex-wrap justify-center items-center flex-grow gap-4">
          {/* Account Info Section */}
          <AccountInfo />

          {/* User Statistics Section */}
          <UserStatistics />
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
