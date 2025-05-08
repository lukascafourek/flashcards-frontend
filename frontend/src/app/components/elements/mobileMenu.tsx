"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import Cookies from "js-cookie";

// This file contains the MobileMenu component, which is used to display a mobile-friendly menu for the flashcard app.
// The menu includes links to various sections of the app, such as collections, account, and contact information.

const MobileMenu = ({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { logout } = useAuth();
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2"
        title="Toggle Menu"
      >
        <Image src="/menu-three-lines.png" alt="Menu" width={20} height={20} />
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 text-center">
          {Cookies.get('jwt') && Cookies.get('jwt')?.trim() !== "" ? (
            <>
              <Link
                href="/collections"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Collections
              </Link>
            </>
          ) : (
            <>
              <Link href="/home" className="block px-4 py-2 hover:bg-gray-100">
                Get Started
              </Link>
            </>
          )}
          <Link href="/about-app" className="block px-4 py-2 hover:bg-gray-100">
            About App
          </Link>
          <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100">
            Contact
          </Link>
          {Cookies.get('jwt') && Cookies.get('jwt')?.trim() !== "" ? (
            <>
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
                className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white rounded-b-lg text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
