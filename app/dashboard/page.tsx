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

interface Patient {
  label: string;
  id: string;
}

interface Prescription {
  id: string;
  createdAt: string;
  updatedAt: string;
  patientName?: string;
  medicineDetails?: string;
  dosage?: string;
  instructions?: string;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [loadingQr, setLoadingQr] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [connectedPatients, setConnectedPatients] = useState<Patient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoadingPrescriptions, setIsLoadingPrescriptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPrescription, setModalPrescription] = useState<Prescription | null>(null);

  // Function to navigate to the prescription page
  const handleManualPrescription = () => {
    router.push("/prescription");
  };

  const handleViewPatient = async (patient: Patient) => {
    setSelectedPatient(patient);
    setPrescriptions([]); // Reset prescriptions
    setModalPrescription(null); // Reset modal prescription
    setIsLoadingPrescriptions(true); // Show loader for prescriptions
  
    try {
      const payload = { connectionId: patient.id };
      const prescriptionIdsResponse = await fetch(
        "https://medera-backend.onrender.com/doctor/prescriptionsByPatient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!prescriptionIdsResponse.ok) {
        console.error("Failed to fetch prescription IDs:", prescriptionIdsResponse.statusText);
        return;
      }
  
      const prescriptionIds: Prescription[] = await prescriptionIdsResponse.json();
      console.log("🚀 ~ +++++++++++++=121111111111111111111111", prescriptionIds)
  
      if (prescriptionIds.length > 0) {
        const mostRecentPrescription = prescriptionIds.reduce((latest, current) =>
          new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest
      );
      console.log("🚀 ~ _________222222222222+======", mostRecentPrescription)
  
        const { id: recentPrescriptionId } = mostRecentPrescription;
  
        const prescriptionDetailsResponse = await fetch(
          `https://medera-backend.onrender.com/doctor/prescriptionByPrescriptionId?PrescriptionId=${recentPrescriptionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!prescriptionDetailsResponse.ok) {
          console.error("Failed to fetch prescription details:", prescriptionDetailsResponse.statusText);
          return;
        }
  
        const prescriptionData = await prescriptionDetailsResponse.json();
        const prescriptionDetails = JSON.parse(
          prescriptionData.proposal.jsonld.credential.credentialSubject.prescription
        );
  
        setModalPrescription({
          id: recentPrescriptionId,
          updatedAt: mostRecentPrescription.updatedAt,
          medicineDetails: prescriptionDetails.medicines
            .map(
              (med: { medicineName: string; dosage: string; time: string; instructions: string }) =>
                `${med.medicineName} (${med.dosage}): ${med.time} - ${med.instructions}`
            )
            .join(", "),
          createdAt: "",
        });
  
        setIsModalOpen(true); // Open the modal
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setIsLoadingPrescriptions(false); // Hide loader
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

  const fetchConnectedPatients = async () => {
    setIsLoadingPatients(true);
    try {
      const response = await fetch("https://medera-backend.onrender.com/doctor/patientList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const processedPatients = data.reduce((acc: any, patient: any) => {
          const existingPatient = acc.find((p: any) => p.label === patient.label);
          if (!existingPatient) {
            acc.push({ label: patient.label, id: patient.id });
          } else {
            const existingIndex = acc.findIndex((p: any) => p.label === patient.label);
            if (new Date(patient.id) > new Date(acc[existingIndex].id)) {
              acc[existingIndex].id = patient.id;
            }
          }
          return acc;
        }, []);
        setConnectedPatients(processedPatients);
      } else {
        console.error("Failed to fetch connected patients:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching connected patients:", error);
    } finally {
      setIsLoadingPatients(false);
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
    fetchConnectedPatients();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInEmail");
    router.push("/login");
  };

  return (
    <div>
      <header className="bg-white shadow-lg">
        <div className="max-w-auto mx-auto flex justify-between items-center px-4">
          <div className="flex items-center ml-12">
            <Image
              src="/medera_logo_transparent.png"
              alt="Doctor Project Logo"
              width={140}
              height={140}
              className="rounded-full"
            />
          </div>
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-sky-800 text-4xl font-bold mr-12">
              Medera Clinic Dashboard
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center bg-sky-100 px-4 py-2 rounded-lg hover:bg-sky-200 transition-colors"
              >
                <User className="mr-2" size={20} />
                Welcome, {userEmail || "Doctor"}
                <ChevronDown className="ml-2" size={16} />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="mr-2" size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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
              { icon: <Users size={20} />, label: 'Patients', route: '/patients' },
              { icon: <Calendar size={20} />, label: 'Appointments', route: '/appointments' },
              { icon: <ClipboardList size={20} />, label: 'Reports', route: '/reports' },
              { icon: <Mail size={20} />, label: 'Messages', route: '/messages' },
              { icon: <User size={20} />, label: 'Profile', route: '/profile' },
              { icon: <Settings size={20} />, label: 'Settings', route: '/settings' }
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
              <div className="flex-grow flex flex-col justify-center mt-4 sm:mt-0">
                {qrCodeValue && (
                  <p className="text-gray-600 text-xl text-center font-bold">
                    Scan this QR code to verify doctor.
                  </p>
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

          {/* Connected Patients */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Connected Patients</h2>
            {isLoadingPatients ? (
              <p className="text-gray-500">Loading connected patients...</p>
            ) : connectedPatients.length === 0 ? (
              <p className="text-gray-500">No connected patients yet.</p>
            ) : (
              <ul className="space-y-4">
                {connectedPatients.map((patient) => (
                  <li
                    key={patient?.id}
                    className="flex justify-between items-center p-3 border-b last:border-b-0"
                  >
                    <div>
                      <h4 className="text-lg font-medium">{patient?.label}</h4>
                    </div>
                    <button
                      onClick={() => handleViewPatient(patient)}
                      className="text-sky-600 hover:text-sky-800"
                    >
                      View Previous Prescriptions
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && modalPrescription && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg max-w-xl w-full">
          <h2 className="text-xl font-semibold mb-4">Prescription Details</h2>
          {isLoadingPrescriptions ? (
            <p>Loading prescription details...</p>
          ) : (
            <>
              <p className="mb-4"><strong>Medicines:</strong> {modalPrescription?.medicineDetails}</p>
              <p className="mb-4"><strong>Dosage:</strong> {modalPrescription?.dosage}</p>
              <p className="mb-4"><strong>Instructions:</strong> {modalPrescription?.instructions}</p>
            </>
          )}
          <button
            onClick={closeModal}
            className="text-white bg-red-500 px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    )}
    </div>
  );
}
