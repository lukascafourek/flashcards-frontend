"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/app/context/authContext";
import Link from "next/link";

const Header = () => {
  const { user, token,  logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 bg-white text-black">
      <h1 className="ml-5 text-xl px-6 py-4 bg-gray-900 rounded-lg text-white">
        Flash cards - Your Way To Study
      </h1>
      <nav>
        {user === null && token !== null ? (
          <></>
        ) : (
          <>
            {user?.loggedIn ? (
                <>
                    <Link href="/collections" className="text-lg px-3 py-2 hover:bg-gray-200 rounded-lg">
                        Collections
                    </Link>
                </>
            ) : (
                <>
                    <Link href="/home" className="text-lg px-3 py-2 hover:bg-gray-200 rounded-lg">
                        Get Started
                    </Link>
                </>
            )}
            
            <Link href="/about-app" className="text-lg ml-5 px-3 py-2 hover:bg-gray-200 rounded-lg">
              About App
            </Link>
            <Link href="/contact" className="text-lg ml-5 px-3 py-2 hover:bg-gray-200 rounded-lg">
              Contact
            </Link>

            {user?.loggedIn ? (
              <div className="relative inline-block ml-5 mr-5">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-lg px-3 py-2 font-semibold bg-gray-300 rounded-lg"
                >
                  {user.username}
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
                    <Link href="/account" className="block px-4 py-2 hover:bg-gray-100">
                      Account
                    </Link>
                    {/* <Link href="/account/user-statistics" className="block px-4 py-2 hover:bg-gray-100">
                      User Statistics
                    </Link> */}
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
                <Link href="/auth/login" className="text-lg ml-5 px-3 py-2 bg-gray-300 rounded-lg border border-solid border-black">
                  Sign in
                </Link>
                <Link href="/auth/register" className="text-lg ml-5 mr-5 px-3 py-2 bg-gray-900 text-white rounded-lg">
                  Register
                </Link>
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
