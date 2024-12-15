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
  id: string;
  name: string;
  age: number;
  condition: string;
}


export default function DoctorDashboard() {
  const router = useRouter();
  const [qrCodeValue, setQrCodeValue] = useState("");
    
  const [loadingQr, setLoadingQr] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [connectedPatients, setConnectedPatients] = useState<Patient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);



  // Dummy data for dashboard
  const [todayAppointments, setTodayAppointments] = useState(7);
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'New patient consultation request', time: '10 mins ago' },
    { id: '2', message: 'Prescription approved', time: '2 hours ago' },
    { id: '3', message: 'Upcoming patient follow-up', time: 'Yesterday' }
  ]);

  // Dummy patient list
  const dummyPatients = [
    { id: '1', name: 'John Doe', age: 45, condition: 'Hypertension' },
    { id: '2', name: 'Sarah Smith', age: 32, condition: 'Diabetes' },
    { id: '3', name: 'Michael Johnson', age: 55, condition: 'Cardiac Issue' }
  ];

  // Recent consultations
  const recentConsultations = [
    { id: '1', patient: 'John Doe', date: '12 Dec 2024', status: 'Completed' },
    { id: '2', patient: 'Sarah Smith', date: '10 Dec 2024', status: 'Pending Report' },
    { id: '3', patient: 'Michael Johnson', date: '08 Dec 2024', status: 'Reviewed' }
  ];

  const fetchQrCode = async () => {
    setLoadingQr(true);
    try {
        const response = await fetch("https://medera-backend.onrender.com/pharmacy/connectionQr", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log("QR Code URL:", data.invitationUrl); // Debug log
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

  const fetchConnectedPatients = async () => {
    setIsLoadingPatients(true); // Start loading patients
    try {
      const response = await fetch("https://medera-backend.onrender.com/doctor/patientList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setConnectedPatients(data); // Update patient data
      } else {
        console.error("Failed to fetch connected patients:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching connected patients:", error);
    } finally {
      setIsLoadingPatients(false); // Stop loading patients
    }
  };
  


  useEffect(() => {
    fetchQrCode();
    fetchConnectedPatients();
  }, []);

  const handleManualPrescription = () => {
    router.push("/prescription");
  };

  const handleLogout = () => {
    // Clear any authentication tokens or user data from local storage
    localStorage.removeItem('authToken');
    // Redirect to login page
    router.push('/login');
  };
  

  return (
    <div>
      {/* Header */}
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
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center bg-sky-100 px-4 py-2 rounded-lg hover:bg-sky-200 transition-colors"
              >
                <User className="mr-2" size={20} />
                Dr. Pankaj Sharma
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

        {/* Main Content */}
        <div className="flex-1 p-10">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm">Today's Appointments</h3>
                  <p className="text-2xl font-bold text-blue-600">{todayAppointments}</p>
                </div>
                <Calendar className="text-blue-500" size={32} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm">Notifications</h3>
                  <p className="text-2xl font-bold text-red-600">{notifications.length}</p>
                </div>
                <Bell className="text-red-500" size={32} />
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-2 gap-8">
            {/* QR Code Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg shadow-gray-300/50 transition-transform hover:scale-105 hover:shadow-xl cursor-pointer flex">
              <div className="flex-shrink-0 mr-6">
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
              <div className="flex-grow flex flex-col justify-center">
                <p className="text-gray-600 text-sm">
                  Scan this QR code to quickly invite patients to your Medera Clinic profile. 
                  It provides instant access to your professional network and streamlines patient onboarding.
                </p>
              </div>
            </div>

            <div
              onClick={handleManualPrescription}
              className="p-6 border rounded-lg bg-white text-gray-700 shadow-lg flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl cursor-pointer relative"
            >
              <h3 className="text-xl font-semibold mb-4">Write Prescription</h3>
              <p className="text-center text-gray-700 mb-6">Click here to manually write a prescription.</p>
              
              {/* Icon Container */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-sky-100 mb-12 rounded-full p-4 hover:bg-sky-200 flex items-center justify-center w-16 h-16">
                <Plus className="text-sky-700" size={48} />
              </div>
            </div>

          </div>

          {/* Recent Patients and Consultations */}
          <div className="mt-8 grid grid-cols-2 gap-8">
            
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4">Connected Patients</h2>
  {isLoadingPatients ? (
    <p className="text-gray-500">Loading connected patients...</p>
  ) : connectedPatients.length === 0 ? (
    <p className="text-gray-500">No connected patients yet.</p>
  ) : (
    <ul className="space-y-4">
      {connectedPatients.map((patient) => (
        <li key={patient?.id} className="flex justify-between items-center p-3 border-b last:border-b-0 hover:bg-gray-50">
          <div>
            <h3 className="font-medium">{patient.label}</h3>
            <p className="text-sm text-gray-500">ID: {patient.id}</p>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>
        </div>
      </div>
    </div>
  );
}