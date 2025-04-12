"use client";

// This file contains the Footer component, which is used to display a footer at the bottom of the page.

const Footer = () => {
  return (
    <footer className="flex justify-center items-center p-4 bg-white text-black w-full bottom-0">
      <div className="flex items-center justify-center gap-4">
        <p className="text-center text-sm">
          © 2025 <i>Lukáš Cafourek</i> Web application with flash card learning
          method. All rights reserved.
        </p>
        <a
          href={process.env.NEXT_PUBLIC_TEST_REPORT_URL}
          target="_blank"
          rel="noopener"
          className="text-blue-500 text-sm"
        >
          Test report
        </a>
        <a
          href={process.env.NEXT_PUBLIC_BUG_REPORT_URL}
          target="_blank"
          rel="noopener"
          className="text-blue-500 text-sm"
        >
          Bug report
        </a>
      </div>
    </footer>
  );
};

export default Footer;
