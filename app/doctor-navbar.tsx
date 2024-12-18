import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Stethoscope, Menu, X } from 'lucide-react';

const DoctorNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: "/blog", label: "Blog" },
    { href: "/patients", label: "Patients" },
    { href: "/schedule", label: "Schedule" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <nav className="bg-white border-b-2 border-blue-100 shadow-sm" style={{
      padding: 5
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and Title Section */}
          <div className="flex items-center">
            <Image
              src="/medera_logo_transparent.png"
              alt="Medera Clinic Logo"
              width={80}
              height={80}
              className="rounded-full shadow-md transition-transform hover:scale-105"
            />
            <div className="ml-4 flex items-center">
              <Stethoscope className="text-blue-600 mr-2" size={24} />
              <Link 
                href="/" 
                className="text-blue-800 text-2xl font-semibold tracking-tight hover:text-blue-600 transition-colors"
              >
                Medera Clinic
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-blue-700 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu} 
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md rounded-b-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default DoctorNavbar;