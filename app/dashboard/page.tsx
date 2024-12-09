"use client";

import React, { useState } from "react";
import QRCode from "react-qr-code"; // Ensure react-qr-code is installed
import { useRouter } from "next/navigation";

export default function DoctorDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");

  // Mock data
  const doctorProfile = {
    name: "Dr. Pankaj Sharma",
    specialty: "Cardiology",
  };

  const dashboardStats = {
    todayPatients: 12,
    pendingAppointments: 5,
    completedAppointments: 7,
  };

  const [connectedPatients, setConnectedPatients] = useState<
    { connectionId: string; name: string }[]
  >([]);

  const handleScanQRCode = (connectionId: string) => {
    setConnectedPatients((prev) => [
      ...prev,
      { connectionId, name: `Patient ${connectionId}` },
    ]);
  };

  const handleGiveMedicines = (connectionId: string) => {
    router.push(`/prescription?connectionId=${connectionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <div className="flex items-center mb-10">
          <div>
            <h2 className="text-xl font-semibold">{doctorProfile.name}</h2>
            <p className="text-gray-500">{doctorProfile.specialty}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { name: "Dashboard", section: "dashboard" }
            
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveSection(item.section)}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                activeSection === item.section
                  ? "bg-indigo-100 text-indigo-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-semibold mb-4">Doctor Dashboard</h1>
        {/* QR Code */}
        <div className="grid grid-cols-2">
        <div className="bg-white p-6 rounded-xl mx-12 shadow-lg shadow-gray-300/50">
            <h2 className="text-xl font-semibold">Scan QR Code</h2>
            <QRCode value="PatientConnectionQRCode" size={150} />
            <button
              className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg"
              onClick={() => handleScanQRCode("12345")}
            >
              Simulate Scan QR Code
            </button>
          </div>

          <div
          key="CompletedAppointments"
          onClick={() => router.push("/completed-appointments")}
          className={`p-6 border rounded-lg bg-blue-100 text-blue-600 shadow-lg flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl cursor-pointer`}
        >
          <h3 className="text-xl font-semibold mb-4">Appointment details</h3>
          <p className="text-5xl font-bold">{dashboardStats.completedAppointments}</p>
        </div>



        </div>
                {/* QR Code and Connected Patients */}
        <div className="grid  gap-8">
          

          {/* Connected Patients */}
          <div className="bg-white p-6 mt-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Connected Patients</h2>
            <ul className="space-y-4">
              {connectedPatients.map((patient) => (
                <li
                  key={patient.connectionId}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-gray-500">ID: {patient.connectionId}</p>
                  </div>
                  <button
                    className="py-1 px-3 bg-indigo-500 text-white rounded-lg"
                    onClick={() => handleGiveMedicines(patient.connectionId)}
                  >
                    Give Medicines
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
