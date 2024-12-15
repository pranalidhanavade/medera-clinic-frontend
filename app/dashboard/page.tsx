"use client";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code"; // Ensure react-qr-code is installed
import { useRouter } from "next/navigation";
import Sidebar from "../doc-sidebar";
import DoctorNavbar from "../doctor-navbar";

export default function DoctorDashboard() {
  const router = useRouter();
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [connectedPatients, setConnectedPatients] = useState<
    { connectionId: string; name: string }[]
  >([]);
  const [loadingQr, setLoadingQr] = useState(true);

  // Fetch QR code value from API
  const fetchQrCode = async () => {
    setLoadingQr(true);
    try {
      const response = await fetch("https://medera-backend.onrender.com/doctor/connectionQr", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setQrCodeValue(data.invitationUrl);
      } else {
        console.error("Failed to fetch QR code:", response.statusText);
        setQrCodeValue("Error fetching QR Code");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
      setQrCodeValue("Error fetching QR Code");
    } finally {
      setLoadingQr(false);
    }
  };

  // Trigger fetching QR code on component mount
  useEffect(() => {
    fetchQrCode();
  }, []);

  const handleManualPrescription = () => {
    router.push("/prescription");
  };

  return (
    <div>
      <DoctorNavbar />
 <div className="min-h-screen bg-gradient-to-r from-sky-300 to-sky-500 flex">
      
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-extrabold mb-8 text-white tracking-tight">
          Doctor Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-8">
          {/* QR Code Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg shadow-gray-300/50 transition-transform hover:scale-105 hover:shadow-xl cursor-pointer">
            <span className="text-xl flex font-semibold text-gray-700 mb-4">Scan QR Code</span>
            {loadingQr ? (
              <div className="flex justify-center items-center h-36">
                <p className="text-gray-700">Loading QR Code...</p>
              </div>
            ) : qrCodeValue && qrCodeValue !== "Error fetching QR Code" ? (
              <QRCode value={qrCodeValue} height={150} />
            ) : (
              <p className="text-red-500">{qrCodeValue}</p>
            )}
          </div>

          {/* Manual Prescription Button */}
          <div
            onClick={handleManualPrescription}
            className="p-6 border rounded-lg bg-white text-gray-700 shadow-lg flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            <h3 className="text-xl font-semibold mb-4">Write Prescription</h3>
            <p className="text-center text-gray-700">Click here to manually write a prescription.</p>
          </div>

          <div className="grid gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105 hover:shadow-xl cursor-pointer">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Connected Patients</h2>
            {connectedPatients.length > 0 ? (
              <ul className="space-y-4">
                {connectedPatients.map((patient) => (
                  <li
                    key={patient.connectionId}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-700">{patient.name}</h3>
                      <p className="text-gray-500">ID: {patient.connectionId}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-600">
                <p>No connected patients.</p>
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Connected Patients Section */}
        
      </div>
    </div>
    </div>
    
   
  );
}
