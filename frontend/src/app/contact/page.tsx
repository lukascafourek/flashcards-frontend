"use client";

import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";

export default function ShowContact() {
//   const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white text-black">
        <h1 className="ml-5 text-xl px-6 py-4 bg-gray-900 rounded-lg text-white">Flash cards - Your Way To Study</h1>
        <nav>
          <Link href="/home" className="text-lg px-3 py-2 hover:bg-gray-200 rounded-lg">Get Started</Link>
          <Link href="/about-app" className="text-lg ml-5 px-3 py-2 hover:bg-gray-200 rounded-lg">About App</Link>
          <Link href="/contact" className="text-lg ml-5 px-3 py-2 bg-gray-300 rounded-lg">Contact</Link>
          <Link href="/auth/login" className="text-lg ml-5 px-3 py-2 bg-gray-300 rounded-lg border border-solid border-black">Sign in</Link>
          <Link href="/auth/register" className="text-lg ml-5 mr-5 px-3 py-2 bg-gray-900 text-white rounded-lg">Register</Link>
        </nav>
      </header>

      {/* Welcome Text */}
      {/* <div className="bg-gray-900 text-xl text-white text-center py-10">
        Welcome to Flash cards Learning App! To use the app, please sign in below.
      </div> */}

      {/* Password Reset Form */}
      {/* <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-center text-black text-xl font-semibold mb-4">Sign In</h2>
          <form>
            <label className="block mb-2 text-black">Email</label>
            <input type="email" className="w-full p-2 mb-4 border rounded text-black" placeholder="Enter your email"/>
            
            <label className="block mb-2 text-black">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} className="w-full p-2 mb-4 border rounded text-black" placeholder="Enter your password"/>
              <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20} />
              </span>
            </div>
            <Link href="/">
              <button className="w-full p-2 bg-gray-900 text-white rounded">Sign In</button>
            </Link>
          </form>
          
          <div className="mt-4 text-left">
            <Link href="#" className="text-sm text-blue-500">Forgot password?</Link>
            <br />
            <Link href="/register" className="text-sm text-blue-500">New to the app? Register</Link>
          </div>
        </div>
      </div> */}

      {/* Footer */}
      <footer className="flex justify-center items-center p-4 bg-white text-black w-full absolute bottom-0">
        <p className="text-center text-sm">© 2025 <i>Lukáš Cafourek</i> Web application with flash card learning method. All rights reserved.</p>
      </footer>
    </div>
  );
}
