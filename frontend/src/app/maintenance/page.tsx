"use client";

import React from "react";
import AuthProvider from "../context/authContext";

// This component is displayed when the site is temporarily down
// It informs users that the site is paused to conserve compute hours
// and provides a contact link for support

export default function Maintenance() {
  const Render = () => {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-center p-4">
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Temporarily Down
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Our site is currently paused to conserve compute hours due to the
            limitations of our free hosting plan.
            <br />
            Please check back later. Thanks for your patience!
          </p>
          <p className="text-gray-500">
            Need help?{" "}
            <a
              href="mailto:cafoulu1@fel.cvut.cz"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <AuthProvider>
      <Render />
    </AuthProvider>
  )
}
