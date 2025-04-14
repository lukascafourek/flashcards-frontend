"use client";

import Header from "@/app/components/elements/header";
import AuthProvider from "../context/authContext";
import Footer from "../components/elements/footer";

// This is the main page for the contact. It will be displayed when the user navigates to /contact.
export default function ShowContact() {
  const Render = () => {
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col md:text-xl text-black">
        {/* Header */}
        <Header />

        {/* Contact Info */}
        <div className="flex justify-center items-center flex-grow md:text-xl">
          <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-md my-8">
            <div className="flex-grow flex flex-col items-center justify-center py-6 space-y-6">
              <h1 className="text-3xl font-bold text-center text-gray-800">
                Contact
              </h1>

              <div className="space-y-2">
                <p className="text-center">
                  You can reach me via email or fill out our forms below:
                </p>

                {/* Emails */}
                <div className="space-y-2">
                  <p>
                    Preferred email:{" "}
                    <a
                      href="mailto:cafoulu1@fel.cvut.cz"
                      className="text-blue-500"
                    >
                      cafoulu1@fel.cvut.cz
                    </a>
                  </p>
                  <p>
                    Backup email:{" "}
                    <a
                      href="mailto:lukascafourek2002@gmail.com"
                      className="text-blue-500"
                    >
                      lukascafourek2002@gmail.com
                    </a>
                  </p>
                </div>

                {/* Google Forms Links */}
                <div className="space-y-2">
                  <p>
                    Test Report Form:{" "}
                    <a
                      href={process.env.NEXT_PUBLIC_TEST_REPORT_URL}
                      target="_blank"
                      rel="noopener"
                      className="text-blue-500"
                    >
                      Fill out
                    </a>
                  </p>
                  <p>
                    Bug Report Form:{" "}
                    <a
                      href={process.env.NEXT_PUBLIC_BUG_REPORT_URL}
                      target="_blank"
                      rel="noopener"
                      className="text-blue-500"
                    >
                      Fill out
                    </a>
                  </p>
                </div>
              </div>
            </div>
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
