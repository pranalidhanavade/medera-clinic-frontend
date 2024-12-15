"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="w-64 bg-sky-300 shadow-lg p-2">
      <div className="bg-white w-full flex items-center mb-10">
        {/* <div className="px-12">
          <h2 className="text-xl font-semibold">Dr. Pankaj Sharma</h2>
          <p className="text-gray-500">Cardiology</p>
        </div> */}
      </div>
      <nav className="space-y-2">
        <button
          className="flex bg-white items-center w-full p-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className="flex bg-white items-center w-full p-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
          onClick={() => router.push("/prescription")}
        >
          Write Prescription
        </button>
      </nav>
    </div>
  );
}
