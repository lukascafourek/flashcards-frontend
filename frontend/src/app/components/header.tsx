"use client";

import { useState } from "react";
import Link from "next/link";
import { isLoggedIn } from "@/app/context/authContext";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 bg-white text-black">
      <h1 className="ml-5 text-xl px-8 py-4 bg-gray-900 rounded-lg text-white">
        Flash cards - Your Way To Study
      </h1>
      <nav>
        {/* {user === null ? (
          <></>
        ) : (
          <> */}
        {isLoggedIn ? (
          <>
            <Link
              href="/collections"
              className="text-lg px-4 py-2 hover:bg-gray-200 rounded-lg"
            >
              Collections
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/home"
              className="text-lg px-4 py-2 hover:bg-gray-200 rounded-lg"
            >
              Get Started
            </Link>
          </>
        )}

        <Link
          href="/about-app"
          className="text-lg ml-5 px-4 py-2 hover:bg-gray-200 rounded-lg"
        >
          About App
        </Link>
        <Link
          href="/contact"
          className="text-lg ml-5 px-4 py-2 hover:bg-gray-200 rounded-lg"
        >
          Contact
        </Link>

        {isLoggedIn ? (
          <div className="relative inline-block ml-5 mr-5">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-lg px-4 py-2 font-semibold bg-gray-300 rounded-lg"
            >
              {user?.username !== undefined
                ? user.username.length > 12
                  ? user.username.slice(0, 12) + "..."
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
                <Link
                  href="/account/user-statistics"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  User Statistics
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
              className="text-lg ml-5 px-4 py-2 bg-gray-300 rounded-lg border border-solid border-black"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="text-lg ml-5 mr-5 px-4 py-2 bg-gray-900 text-white rounded-lg border border-solid border-black"
            >
              Register
            </Link>
          </>
        )}
        {/* </>
        )} */}
      </nav>
    </header>
  );
};

export default Header;
