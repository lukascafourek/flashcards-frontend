"use client";

import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";

// This file contains the MobileMenu component, which is used to display a mobile-friendly menu for the flashcard app.
// The menu includes links to various sections of the app, such as collections, account, and contact information.

const PCMenu = ({
  isLoggedIn,
  isMenuOpen,
  setIsMenuOpen,
}: {
  isLoggedIn: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user, logout } = useAuth();
  
  return (
    <>
      {isLoggedIn ? (
        <>
          <Link
            href="/collections"
            className="px-4 py-2 hover:bg-gray-200 rounded-lg"
          >
            Collections
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/home"
            className="px-4 py-2 hover:bg-gray-200 rounded-lg"
          >
            Get Started
          </Link>
        </>
      )}
      <Link
        href="/about-app"
        className="ml-5 px-4 py-2 hover:bg-gray-200 rounded-lg"
      >
        About App
      </Link>
      <Link
        href="/contact"
        className="ml-5 px-4 py-2 hover:bg-gray-200 rounded-lg"
      >
        Contact
      </Link>
      {isLoggedIn ? (
        <div className="relative inline-block ml-5 mr-5">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-4 py-2 font-semibold bg-gray-300 rounded-lg"
          >
            {user?.username !== undefined
              ? user.username.length > 12
                ? user.username.slice(0, 9) + "..."
                : user.username
              : "User"}
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
              <Link
                href="/account"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Account
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white rounded-b-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link
            href="/auth/login"
            className="ml-5 px-4 py-2 bg-gray-300 rounded-lg border border-solid border-black"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="ml-5 mr-5 px-4 py-2 bg-gray-900 text-white rounded-lg border border-solid border-black"
          >
            Register
          </Link>
        </>
      )}
    </>
  );
};

export default PCMenu;
