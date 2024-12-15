import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const DoctorNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-auto mx-auto flex justify-between items-center px-4 md:px-8">
        {/* Logo Section */}
        <div className="flex items-center ml-4 md:ml-12">
          <Image
            src="/medera_logo_transparent.png"
            alt="Doctor Project Logo"
            layout="intrinsic"
            width={120}
            height={120}
            className="rounded-full"
          />
        </div>

        {/* Navbar Title Section */}
        <div className="hidden md:flex flex-shrink-0">
          <Link href="/" className="text-sky-800 text-2xl md:text-4xl font-bold mr-4 md:mr-12">
            medera clinic dashboard
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-800 focus:outline-none">
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 shadow-md py-4">
          <Link href="/" className="block text-center text-sky-800 text-xl font-semibold py-2">
            medera clinic dashboard
          </Link>
        </div>
      )}
    </nav>
  );
};

export default DoctorNavbar;
