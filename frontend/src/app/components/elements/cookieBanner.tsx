"use client";

import { useState, useEffect } from "react";

// This file contains the CookieBanner component, which is used to display a cookie consent banner at the bottom of the page.
// The banner informs users about the use of cookies and allows them to accept or decline cookie usage.

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent") === "true";
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
      <p className="text-sm">
        This website uses cookies to enhance the user experience. By continuing
        to browse, you agree to our use of cookies.
      </p>
      <button
        onClick={acceptCookies}
        className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
      >
        OK
      </button>
    </div>
  );
};

export default CookieBanner;
