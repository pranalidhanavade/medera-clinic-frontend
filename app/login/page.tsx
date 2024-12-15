"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DoctorNavbar from "../doctor-navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (email && password) {
      router.push("/dashboard");
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
              Sign in to access your dashboard and manage your patients.
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-sky-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-6 text-white font-medium bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Sign in
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-sky-600 hover:text-sky-700"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
