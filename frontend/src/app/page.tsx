"use client";

import Link from "next/link";

// This is the main page of the flash cards app. It contains a welcome message and a button to navigate to the home page.
// The site is normally not displayed to user at all because the user is always redirected by middleware to the home page.
export default function Main() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">
            Welcome to Flash Cards App
          </h1>
          <Link href="/home">
            <button className="px-4 py-2 bg-black text-white rounded">
              Go to Home
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
