import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Certisearch() {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const certificateNumber = e.target.certificateNumber.value.trim();

    toast.info("Searching for certificate...", { progress: false, autoClose: false });

    try {
      const response = await fetch(
        `https://arabainsafety.com/cert-verification/api/content/items/certificates?populate=*&filter[certienum]=${certificateNumber}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch certificate data. Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        setCertificate(data[0]);
        toast.success("Certificate found!", { progress: false });
      } else {
        setCertificate(null);
        setError("No certificate found for the provided number.");
        toast.error("No certificate found.", { progress: false });
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      toast.error("Error: " + (err.message || "An unexpected error occurred."), { progress: false });
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen bg-primary flex flex-col items-center py-4 sm:py-6 md:py-8 lg:py-12 px-4 sm:px-8">


      <h2 className="text-3xl font-bold mb-8">Student Search</h2>


      <div className="bg-white px-4 sm:px-8 md:px-[40px] lg:px-[80px] py-6 sm:py-8 md:py-10 lg:py-[60px] rounded-xl text-sx mx-auto">

      <form
        onSubmit={handleSearch}
        className="flex items-center gap-4 text-mx"
        >
    <input
  id="certificateNumber"
  name="certificateNumber"
  type="text"
  placeholder="Search for Student Name or Certificate No.:"
  className="px-2 w-[280px] py-1 border border-gray-500 placeholder:text-xs placeholder:text-gray-500"
  required
/>

        <button
          type="submit"
          className="px-2 font-md text-xl bg-gray-100 hover:bg-gray-200 border border-gray-400 text-black "
          >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
          </div>

      {/* Error Message */}
      {error && <div className="mt-4 text-red-600">{error}</div>}

      {/* Certificate Details */}
      {certificate && (
        <div className="mt-8 w-full max-w-md mx-auto bg-gray-100 p-6 rounded shadow-md">
          <h3 className="text-lg font-semibold">Certificate Details</h3>
          <p><strong>Certificate No:</strong> {certificate.certienum}</p>
          <p><strong>Student Name:</strong> <span className="text-red-500">{certificate.name}</span></p>
          <p><strong>Course Name:</strong> {certificate.coursename}</p>
          <p><strong>Expiry Date:</strong> {certificate.expirydate}</p>
          <p><strong>Status:</strong> {certificate.status ? "Valid" : "Invalid"}</p>
        </div>
      )}



      <ToastContainer />
    </div>
  );
}

export default Certisearch;
