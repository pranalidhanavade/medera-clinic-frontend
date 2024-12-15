"use client"
import React, { useEffect, useState } from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';  // Updated import for react-qr-code

export default function PrescriptionForm() {
  const router = useRouter();
  const [connectionId, setConnectionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    connectionId: '',
    medicines: [{
      medicineName: '',
      dosage: '',
      time: '',
      frequency: '',
      instructions: ''
    }],
    patientAge: '',
    patientWeight: '',
    patientSex: '',
  });
  const [credentialUrl, setCredentialUrl] = useState('');  // State to store the credential URL
  const [formSubmitted, setFormSubmitted] = useState(false);  // State to handle form submission

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleMedicineChange = (index, e) => {
    const { name, value } = e.target;
    const newMedicines = [...formData.medicines];
    newMedicines[index][name] = value;
    setFormData(prevState => ({
      ...prevState,
      medicines: newMedicines
    }));
  };

  const addMedicineRow = () => {
    setFormData(prevState => ({
      ...prevState,
      medicines: [...prevState.medicines, {
        medicineName: '',
        dosage: '',
        time: '',
        frequency: '',
        instructions: ''
      }]
    }));
  };

  const removeMedicineRow = (index) => {
    const newMedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData(prevState => ({
      ...prevState,
      medicines: newMedicines
    }));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('connectionId');
    if (id) {
      setConnectionId(id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const patientDetails = JSON.stringify({
      name: formData.patientName,
      age: formData.patientAge,
      weight: formData.patientWeight,
      sex: formData.patientSex,
    });
  
    const prescription = JSON.stringify({
      medicines: formData.medicines,
      connectionId: formData.connectionId,
    });
  
    const payload = {
      patientDetails,
      prescription,
    };
  
    try {
      const response = await fetch("https://medera-backend.onrender.com/doctor/prescribeMed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        setCredentialUrl(data.credentialUrl);  // Set the QR code URL from the response
        setFormSubmitted(true);  // Set form submission state to true
        console.log("Prescription issued successfully.");
      } else {
        console.error("Failed to issue prescription:", response.statusText);
        alert("Failed to issue prescription. Please try again.");
      }
    } catch (error) {
      console.error("Error issuing prescription:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToDashboard = () => {
    router.push('/dashboard');  // Redirect to dashboard
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-300 to-sky-500 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-sky-800 tracking-tight">
            Medical Prescription Form
          </h2>

          {formSubmitted ? (
            <div className="flex justify-center items-center flex-col">
              <h3 className="text-xl font-semibold text-sky-800 mb-4">Your Prescription QR Code</h3>
              <QRCode value={credentialUrl} size={256} /> {/* Display QR Code */}
              <button
                onClick={handleReturnToDashboard}
                className="mt-6 px-8 py-3 rounded-xl bg-sky-600 text-white hover:bg-sky-700 transition duration-300"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="">
                <div className="relative">
                  <label 
                    htmlFor="patientName" 
                    className="block text-sm font-medium text-sky-800 mb-2"
                  >
                    Patient Name
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300 bg-sky-50/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label 
                    htmlFor="patientSex" 
                    className="block text-sm font-medium text-sky-800 mb-2"
                  >
                    Sex
                  </label>
                  <select
                    id="patientSex"
                    name="patientSex"
                    value={formData.patientSex}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300 bg-sky-50/50"
                  >
                    <option value="">Select Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label 
                    htmlFor="patientAge" 
                    className="block text-sm font-medium text-sky-800 mb-2"
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    id="patientAge"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300 bg-sky-50/50"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="patientWeight" 
                    className="block text-sm font-medium text-sky-800 mb-2"
                  >
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="patientWeight"
                    name="patientWeight"
                    value={formData.patientWeight}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300 bg-sky-50/50"
                  />
                </div>
              </div>

              {/* Medicines Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-sky-800">Medicines</h3>
                  <button 
                    type="button" 
                    onClick={addMedicineRow}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors"
                  >
                    <PlusCircle size={20} />
                    Add Medicine
                  </button>
                </div>

                {formData.medicines.map((medicine, index) => (
                  <div 
                    key={index} 
                    className="bg-sky-50/50 border-2 border-sky-300 rounded-2xl shadow-md p-6 relative"
                  >
                    {/* Remove Medicine Button */}
                    {formData.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicineRow(index)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                        title="Remove Medicine"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label 
                          className="block text-sm font-medium text-sky-800 mb-2"
                        >
                          Medicine Name
                        </label>
                        <input
                          type="text"
                          name="medicineName"
                          value={medicine.medicineName}
                          onChange={(e) => handleMedicineChange(index, e)}
                          required
                          className="w-full px-4 py-3 border-2 border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300 bg-sky-50/50"
                        />
                      </div>
                      
                      <div>
                        <label 
                          className="block text-sm font-medium text-sky-800 mb-2"
                        >
                          Dosage
                        </label>
                        <input
                          type="text"
                          name="dosage"
                          value={medicine.dosage}
                          onChange={(e) => handleMedicineChange(index, e)}
                          required
                          className="w-full px-4 py-3 border-2 border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300 bg-sky-50/50"
                        />
                      </div>
                      
                      <div>
                        <label 
                          className="block text-sm font-medium text-sky-800 mb-2"
                        >
                          Time
                        </label>
                        <select
                          name="time"
                          value={medicine.time}
                          onChange={(e) => handleMedicineChange(index, e)}
                          required
                          className="w-full px-4 py-3 border-2 border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300 bg-sky-50/50"
                        >
                          <option value="">Select Time</option>
                          <option value="morning">Morning</option>
                          <option value="afternoon">Afternoon</option>
                          <option value="evening">Evening</option>
                          <option value="morning-evening">Morning & Evening</option>
                          <option value="before-meal">Before Meal</option>
                          <option value="after-meal">After Meal</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label 
                        htmlFor="instructions" 
                        className="block text-sm font-medium text-sky-800 mb-2"
                      >
                        Instructions
                      </label>
                      <textarea
                        name="instructions"
                        value={medicine.instructions}
                        onChange={(e) => handleMedicineChange(index, e)}
                        className="w-full px-4 py-3 border-2 border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300 bg-sky-50/50"
                        rows="3"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  className={`w-full md:w-auto px-8 py-3 rounded-xl transition-all duration-300 shadow-lg ${
                    loading
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-sky-600 text-white hover:bg-sky-700 hover:shadow-xl"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit Prescription"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
