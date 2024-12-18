"use client";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  FileText, 
  Bell, 
  Users,
  Stethoscope,
  ClipboardList,
  Mail,
  User,
  Settings,
  Plus,
  ChevronDown,
  LogOut
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DoctorNavbar from "../doctor-navbar";

interface Patient {
  label: string;
  id: string;
}

interface Prescription {
  id: string;
  createdAt: string;
  updatedAt: string;
  patientDetails: string; 
  prescriptionDetails: string;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [loadingQr, setLoadingQr] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoadingPrescriptions, setIsLoadingPrescriptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPrescription, setModalPrescription] = useState<Prescription | null>(null);
  const [prescriptionIds, setPrescriptionIds] = useState<string[]>([]);

  const handleManualPrescription = () => {
    router.push("/prescription");
  };

  const fetchPrescriptionIds = async () => {
    try {
      const response = await fetch("https://medera-backend.onrender.com/doctor/getAllPrescriptions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const ids = data.map((item: { id: string }) => item.id);
        setPrescriptionIds(ids);
      } else {
        console.error("Failed to fetch prescription IDs:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching prescription IDs:", error);
    }
  };

  const fetchPrescriptionDetails = async (prescriptionId: string) => {
    try {
      const response = await fetch(
        `https://medera-backend.onrender.com/doctor/prescriptionByPrescriptionId?PrescriptionId=${prescriptionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const prescription = data.offer?.jsonld?.credential?.credentialSubject;
        const patientDetails = JSON.parse(prescription?.patientDetails || "{}");
        const prescriptionDetails = JSON.parse(prescription?.prescription || "{}");

        setModalPrescription({
          id: prescriptionId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          patientDetails: JSON.stringify(patientDetails, null, 2), 
          prescriptionDetails: JSON.stringify(prescriptionDetails, null, 2),
        });
        setIsModalOpen(true);
      } else {
        console.error("Failed to fetch prescription details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching prescription details:", error);
    }
  };



  const closeModal = () => {
    setIsModalOpen(false);
    setModalPrescription(null);
  };

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
        setQrCodeValue("Error fetching QR Code");
      }
    } catch (error) {
      setQrCodeValue("Error fetching QR Code");
    } finally {
      setLoadingQr(false);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("loggedInEmail");
    if (email) {
      setUserEmail(email);
    } else {
      router.push("/login");
    }
    fetchQrCode();
    fetchPrescriptionIds();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInEmail");
    router.push("/login");
  };

  return (
    <div>
      <DoctorNavbar />
      <div className="min-h-screen bg-gradient-to-r from-sky-300 to-sky-500 flex">
        <div className="w-64 bg-white shadow-lg p-4">
          <div className="flex items-center mb-10 p-4 bg-sky-100 rounded-lg">
            <div>
              <h2 className="text-xl font-semibold">Dr. Pankaj Sharma</h2>
              <p className="text-gray-500 text-sm">Cardiology</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { icon: <Stethoscope size={20} />, label: 'Dashboard', route: '/dashboard' },
              { icon: <FileText size={20} />, label: 'Prescriptions', route: '/prescription' },
              //TODO: 
              { icon: <Users size={20} />, label: 'Patients', route: '/' },
              { icon: <Calendar size={20} />, label: 'Appointments', route: '/' },
              { icon: <ClipboardList size={20} />, label: 'Reports', route: '/' },
              { icon: <Mail size={20} />, label: 'Messages', route: '/' },
              { icon: <User size={20} />, label: 'Profile', route: '/' },
              { icon: <Settings size={20} />, label: 'Settings', route: '/' }
            ].map((item) => (
              <button
                key={item.label}
                className="flex items-center w-full p-3 rounded-lg transition-colors hover:bg-sky-100 text-gray-700"
                onClick={() => router.push(item.route)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-10">
          <div className="md:grid md:grid-cols-2 contents gap-8">
            {/* QR Code Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg shadow-gray-300/50 transition-transform hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col sm:flex-row">
              <div className="flex-shrink-0 sm:mr-6 sm:h-80 flex flex-col items-center">
                <span className="text-2xl font-semibold text-gray-700 mb-4 text-center">Scan QR Code</span>
                {loadingQr ? (
                  <div className="flex justify-center items-center h-auto">
                    <p className="text-gray-700">Loading QR Code...</p>
                  </div>
                ) : qrCodeValue && qrCodeValue !== "Error fetching QR Code" ? (
                  <QRCode value={qrCodeValue} className="lg:h-64 h-44" />
                ) : (
                  <p className="text-red-500">{qrCodeValue}</p>
                )}
              </div>
              
            </div>

            <div
              onClick={handleManualPrescription}
              className="p-6 border rounded-lg bg-white text-gray-700 shadow-lg md:h-auto sm:h-12 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl cursor-pointer relative"
            >
              <h3 className="text-xl font-semibold mb-4">Write Prescription</h3>
              <p className="text-center text-gray-700 mb-6">Click here to manually write a prescription.</p>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-sky-100 md:mb-20 rounded-full p-4 hover:bg-sky-200 flex items-center justify-center w-16 h-16">
                <Plus className="text-sky-700 h-auto w-auto" size={48} />
              </div>
            </div>
          </div>

          {/* Prescription IDs Section */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Prescription IDs</h2>
            {isLoadingPrescriptions ? (
              <p className="text-gray-500">Loading prescription IDs...</p>
            ) : prescriptionIds.length === 0 ? (
              <p className="text-gray-500">No prescriptions available.</p>
            ) : (
              <ul className="space-y-4">
                {prescriptionIds.map((id) => (
                  <li
                    key={id}
                    className="flex justify-between items-center p-3 border-b last:border-b-0"
                  >
                    <div>
                      <h4 className="text-lg font-medium">{id}</h4>
                    </div>
                    <button
                      onClick={() => fetchPrescriptionDetails(id)}
                      className="text-sky-600 hover:text-sky-800 font-medium"
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && modalPrescription && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
      
      {/* Prescription Header */}
      <h3 className="text-2xl font-semibold mb-4 text-center text-sky-700">Prescription Details</h3>
      
      {/* Prescription Information */}
      <div className="mb-6">
        <p className="text-xl font-medium text-gray-700">Prescription:</p>
        {JSON.parse(modalPrescription.prescriptionDetails).medicines.map((medicine: any, index: number) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <p className="text-lg text-gray-800 font-semibold">Medicine Name: <span className="font-normal">{medicine.medicineName}</span></p>
            <p className="text-lg text-gray-800 font-semibold">Dosage: <span className="font-normal">{medicine.dosage}</span></p>
            <p className="text-lg text-gray-800 font-semibold">Time: <span className="font-normal">{medicine.time}</span></p>
          </div>
        ))}
      </div>

      {/* Close Button */}
      <div className="mt-4 text-center">
        <button
          onClick={closeModal}
          className="px-6 py-2 bg-red-500 text-white rounded-full text-lg font-semibold hover:bg-red-600 transition duration-200"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}
