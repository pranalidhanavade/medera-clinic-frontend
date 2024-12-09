"use client"
import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function PrescriptionForm() {
  const router = useRouter();
  const [connectionId, setConnectionId] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
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
    // Get connectionId from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('connectionId');
    if (id) {
      setConnectionId(id);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    const jsonString = JSON.stringify(formData);
    console.log(formData);

    // Simulate processing delay of 2 seconds
    setTimeout(() => {
      setLoading(false); // Stop loading after 2 seconds
      // Redirect after additional 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Medical Prescription Form
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information Section */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label 
                htmlFor="patientName" 
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label 
                htmlFor="connectionId" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Connection ID
              </label>
              <input
                type="text"
                id="connectionId"
                name="connectionId"
                value={formData.connectionId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label 
                htmlFor="patientSex" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sex
              </label>
              <select
                id="patientSex"
                name="patientSex"
                value={formData.patientSex}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="patientAge" 
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label 
                htmlFor="patientWeight" 
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Medicines Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Medicines</h3>
              <button 
                type="button" 
                onClick={addMedicineRow}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Medicine
              </button>
            </div>

            {formData.medicines.map((medicine, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 relative"
              >
                {/* Remove Medicine Button */}
                {formData.medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicineRow(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove Medicine"
                  >
                    <Trash2 size={20} />
                  </button>
                )}

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Medicine Name
                    </label>
                    <input
                      type="text"
                      name="medicineName"
                      value={medicine.medicineName}
                      onChange={(e) => handleMedicineChange(index, e)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Dosage
                    </label>
                    <input
                      type="text"
                      name="dosage"
                      value={medicine.dosage}
                      onChange={(e) => handleMedicineChange(index, e)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Time
                    </label>
                    <select
                      name="time"
                      value={medicine.time}
                      onChange={(e) => handleMedicineChange(index, e)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Time</option>
                      <option value="morning">Morning</option>
                      <option value="evening">Evening</option>
                      <option value="morning-evening">Morning & Evening</option>
                    </select>
                  </div>

                  {/* New Fields for More Detailed Prescription */}
                  <div>
                    <label 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Frequency
                    </label>
                    <select
                      name="frequency"
                      value={medicine.frequency}
                      onChange={(e) => handleMedicineChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Frequency</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="as-needed">As Needed</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Special Instructions
                    </label>
                    <textarea
                      name="instructions"
                      value={medicine.instructions}
                      onChange={(e) => handleMedicineChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="Any special instructions for this medicine"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className={`w-full md:w-auto px-6 py-3 rounded-md transition-colors shadow-md ${
                loading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
              disabled={loading} // Disable button when loading
            >
              {loading ? "Processing..." : "Submit Prescription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}