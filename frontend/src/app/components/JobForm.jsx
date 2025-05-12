import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';

export default function JobForm() {
  const [showForm, setShowForm] = useState(false);
  const [jobValue, setJobValue] = useState({
    company: '',
    description: '',
    location: '',
    skills: [],
    title: ''
  })
  const inputRef = useRef(null);

  useEffect(() => {
    if (showForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showForm]);

  return (
    <div className=" min-h-screen mt-16 relative">
      {/* Header */}
      <div className={`px-6 py-6 border-b border-gray-300 bg-gray-100 flex items-center justify-between transition-all duration-300 ${showForm ? 'pointer-events-none' : ''}`}>
        <h1 className="text-3xl font-bold text-gray-800">Jobs</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow-md transition duration-300"
        >
          <PlusCircle size={20} />
          Create a Job
        </button>
      </div>

      {/* Background content placeholder (blurred when form is active) */}
      <div className={`p-6 transition-all duration-300 ${showForm ? ' pointer-events-none' : ''}`}>
        <p className="text-gray-600">Liste des jobs ou autres contenus ici...</p>
      </div>

      {/* Overlay + Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-white/60  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-xl mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Job</h2>
            <form className="space-y-5">

              <div>
                <label className="block text-gray-700 font-medium mb-1">Titre</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Titre"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Company</label>
                <input
                  type="text"
                  ref={inputRef}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full Campany Name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Job Description"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Location</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Company Location"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Skills</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Skills"
                />
              </div>

              <div className="flex justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
