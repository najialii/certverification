import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

function Certiupload() {
  const [certienum, setCertienum] = useState("");
  const [name, setName] = useState("");
  const [expirydate, setExpirydate] = useState("");
  const [coursename, setCoursename] = useState("");
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      certienum,
      name,
      expirydate,
      coursename,
      status,
    };

    try {
      const response = await axios.post(
        "https://arabainsafety.com/cert-verification/api/content/item/certificates",
        { data: formData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer API-d931fb2f0b68d5d8dbca61beb701fd77b6c59e19",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Failed to upload data. HTTP status: ${response.status}`);
      }

      toast.success("Certificate uploaded successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-200 to-white flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Upload Certificate</h1>
        <p className="text-gray-600 mt-2">Add a new certificate to the collection.</p>
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <label htmlFor="certienum" className="block text-gray-700 font-semibold mb-2">Certificate No</label>
        <input
          id="certienum"
          type="text"
          placeholder="e.g., 123456"
          value={certienum}
          onChange={(e) => setCertienum(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
        />

        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Student Name</label>
        <input
          id="name"
          type="text"
          placeholder="e.g., John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
        />

        <label htmlFor="coursename" className="block text-gray-700 font-semibold mb-2">Course Name</label>
        <input
          id="coursename"
          type="text"
          placeholder="e.g., Course Name"
          value={coursename}
          onChange={(e) => setCoursename(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
        />

        <label htmlFor="expirydate" className="block text-gray-700 font-semibold mb-2">Certificate Expiry Date</label>
        <input
          id="expirydate"
          type="date"
          value={expirydate}
          onChange={(e) => setExpirydate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <label htmlFor="status" className="flex items-center text-gray-700 font-semibold mb-4">
          <input
            id="status"
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
            className="mr-2"
          />
          Status (Valid)
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Certificate"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeButton pauseOnFocusLoss pauseOnHover />
    </div>
  );
}

export default Certiupload;
