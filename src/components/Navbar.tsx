import React from "react";
import Link from "next/link";
import { useScrollDirection } from "@/hooks/useScrollDirection";

const Navbar = () => {
  const scrollDirection = useScrollDirection();

  return (
    <nav
      className={`fixed w-full bg-opacity-20 backdrop-blur-sm bg-black/30 z-50 transition-all duration-500 ${
        scrollDirection === "down" ? "-top-20" : "top-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white text-xl font-bold">
              Bidzy
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/about"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
              >
                Contact
              </Link>
              <Link href="/Sign-Up" className="bg-gray-800 text-gray-200 px-4 py-2 rounded-md border border-blue-500 hover:bg-gray-700 hover:border-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20">
                Sign-Up
              </Link>
              <Link href="/login" className="bg-gray-800 text-gray-200 px-4 py-2 rounded-md border border-blue-500 hover:bg-gray-700 hover:border-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
