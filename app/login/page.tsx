"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DoctorNavbar from "../doctor-navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (email && password) {
      setIsLoading(true); // Start the loader
      setTimeout(() => {
        setIsLoading(false); // Stop the loader after 2 seconds
        router.push("/dashboard");
      }, 2000); // Simulate a delay of 2 seconds
    } else {
      alert("Please enter both email and password");
    }
  };

  return (
    <div>
      <DoctorNavbar />
      <div className="flex items-center justify-center bg-gradient-to-r from-sky-300 to-sky-500">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 m-36">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-sky-800">Doctor Login</h2>
            <p className="mt-2 text-sm text-sky-600">
              Sign in to access and manage your dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-6 py-3 mt-2 border border-sky-300 rounded-lg shadow-md placeholder-sky-500 text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-6 py-3 mt-2 border border-sky-300 rounded-lg shadow-md placeholder-sky-500 text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 mt-6 text-white font-medium rounded-lg focus:outline-none focus:ring-2 ${
                isLoading
                  ? "bg-sky-400 cursor-not-allowed"
                  : "bg-sky-600 hover:bg-sky-700 focus:ring-sky-500"
              }`}
              disabled={isLoading} // Disable button during loading
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="w-5 h-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span className="ml-2">Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
