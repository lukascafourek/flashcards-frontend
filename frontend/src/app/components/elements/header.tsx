"use client";

import { useState } from "react";
import { useEffect } from "react";
import MobileMenu from "./mobileMenu";
import PCMenu from "./pcMenu";

// This file contains the Header component, which is used to display the header of the flashcard app.
// The header includes the app title and a navigation menu that changes based on the screen size (mobile or desktop).

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const checkScreenWidth = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  useEffect(() => {
    window.addEventListener("resize", checkScreenWidth);
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-white text-black xl:text-xl md:text-lg sm:text-base text-sm">
      <h1
        className="px-8 py-4 bg-gray-900 rounded-lg text-white"
      >
        Flash cards - Your Way To Study
      </h1>
      <nav>
        {isMobile ? (
          <MobileMenu
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        ) : (
          <PCMenu
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        )}
      </nav>
    </header>
  );
};

export default Header;
