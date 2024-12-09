'use client';

import React, { useState } from "react";

export default function Appointments() {
  // Mock data for completed, pending appointments, and previous patients
  const completedAppointments = [
    { id: 1, patientName: "John Doe", date: "2024-12-01", time: "10:00 AM", notes: "Regular follow-up for hypertension." },
    { id: 2, patientName: "Jane Smith", date: "2024-12-03", time: "2:30 PM", notes: "Post-surgery checkup." },
    { id: 3, patientName: "Alice Johnson", date: "2024-12-05", time: "11:15 AM", notes: "Consultation for chest pain." },
  ];

  const pendingAppointments = [
    { id: 4, patientName: "Bob Brown", date: "2024-12-07", time: "9:00 AM", notes: "Initial consultation for diabetes." },
    { id: 5, patientName: "Emma White", date: "2024-12-07", time: "12:00 PM", notes: "Follow-up for post-operation recovery." },
  ];

  const previousPatients = [
    { id: 6, name: "Michael Green", lastVisit: "2024-11-25", notes: "Treated for high cholesterol." },
    { id: 7, name: "Sophia Blue", lastVisit: "2024-11-22", notes: "Annual health check-up." },
  ];

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Function to handle opening the modal
  const handleViewDetails = (appointment: React.SetStateAction<null>) => {
    setSelectedAppointment(appointment);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setSelectedAppointment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Pending Appointments Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-yellow-600 mb-6">Pending Appointments</h2>
          {pendingAppointments.length > 0 ? (
            <ul className="space-y-4">
              {pendingAppointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                    <p className="text-sm text-gray-600">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <button
                    className="py-1 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No pending appointments found.</p>
          )}
        </div>
        {/* Completed Appointments Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">Completed Appointments</h2>
          {completedAppointments.length > 0 ? (
            <ul className="space-y-4">
              {completedAppointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                    <p className="text-sm text-gray-600">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <button
                    className="py-1 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No completed appointments found.</p>
          )}
        </div>

        

        {/* Previous Patients Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-green-600 mb-6">Previous Patients</h2>
          {previousPatients.length > 0 ? (
            <ul className="space-y-4">
              {previousPatients.map((patient) => (
                <li
                  key={patient.id}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{patient.name}</h3>
                    <p className="text-sm text-gray-600">
                      Last Visit: {patient.lastVisit}
                    </p>
                  </div>
                  <button
                    className="py-1 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={() => handleViewDetails(patient)}
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No previous patients found.</p>
          )}
        </div>

        {/* Modal for Appointment/Patient Details */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-1/2">
              <h3 className="text-xl font-bold text-indigo-600 mb-4">Details</h3>
              <p className="mb-2">
                <strong>Name:</strong> {selectedAppointment.patientName || selectedAppointment.name}
              </p>
              {selectedAppointment.date && (
                <p className="mb-2">
                  <strong>Date:</strong> {selectedAppointment.date}
                </p>
              )}
              {selectedAppointment.time && (
                <p className="mb-2">
                  <strong>Time:</strong> {selectedAppointment.time}
                </p>
              )}
              <p className="mb-4">
                <strong>Notes:</strong> {selectedAppointment.notes}
              </p>
              <button
                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
