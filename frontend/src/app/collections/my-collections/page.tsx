"use client";

import Link from "next/link";

export default function MyCollections() {
  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white text-black">
        <h1 className="ml-5 text-xl px-6 py-4 bg-gray-900 rounded-lg text-white">Flash cards - Your Way To Study</h1>
        <nav>
          <Link href="/home" className="text-lg px-3 py-2 bg-gray-300 rounded-lg">Collections</Link>
          <Link href="/about-app" className="text-lg ml-5 px-3 py-2 hover:bg-gray-200 rounded-lg">About App</Link>
          <Link href="/contact" className="text-lg ml-5 px-3 py-2 hover:bg-gray-200 rounded-lg">Contact</Link>
          <Link href="/auth/login" className="text-lg ml-5 px-3 py-2 bg-gray-300 rounded-lg border border-solid border-black">Sign in</Link> {/* will be changed */}
          <Link href="/auth/register" className="text-lg ml-5 mr-5 px-3 py-2 bg-gray-900 text-white rounded-lg">Register</Link>  {/* will be changed */}
        </nav>
      </header>

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
}
