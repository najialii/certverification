import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BulkCertUpload() {
  const [fileContent, setFileContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n");
      const parsedData = rows.map((row) => {
        const columns = row.split(",");
        return {
          name: columns[0]?.trim() || "",
          certienum: columns[1]?.trim() || "",
          coursename: columns[2]?.trim() || "",
          expirydate: columns[3]?.trim() || "", // expirydate key used here
          status: true, // Assuming status is always true for valid entries
        };
      });
      setFileContent(parsedData);
      toast.success("File parsed successfully!");
    };
    reader.readAsText(file);
  };

  const handleBulkUpload = async () => {
    if (fileContent.length === 0) {
      toast.error("No data to upload. Please upload a valid CSV file.");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const totalEntries = fileContent.length;
    try {
      for (let i = 0; i < fileContent.length; i++) {
        const entry = fileContent[i];

        // Debugging: Log the payload before sending
        console.log("Uploading entry:", JSON.stringify({ data: entry }));

        const response = await fetch("http://localhost/cert-verification/api/content/item/certificates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer API-d931fb2f0b68d5d8dbca61beb701fd77b6c59e19",
          },
          body: JSON.stringify({
            data: {
              ...entry,
              expirydate: entry.expirydate.toString(), // Ensure expirydate is included
            },
          }),
        });

        const responseBody = await response.text();
        console.log("Response Status:", response.status);
        console.log("Response Body:", responseBody);

        if (!response.ok) {
          toast.warn(`Failed to upload entry: ${entry.certienum}`);
        }

        setUploadProgress(((i + 1) / totalEntries) * 100);
      }

      toast.success("Bulk upload completed!");
    } catch (err) {
      console.error("Error during bulk upload:", err);
      toast.error("An error occurred during bulk upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Bulk Certificate Upload</h1>
        <p className="text-gray-600 mt-2">Upload multiple certificates at once using a CSV file.</p>
      </header>

      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4 w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleBulkUpload}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? `Uploading... ${Math.round(uploadProgress)}%` : "Start Upload"}
        </button>

        <div className="mt-4">
          <h2 className="text-lg font-semibold">Preview Data</h2>
          <ul className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
            {fileContent.map((entry, index) => (
              <li key={index} className="text-sm text-gray-700 mb-1">
                <strong>{entry.certienum}</strong>: {entry.name}, {entry.coursename}, Expiry: {entry.expirydate}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnFocusLoss pauseOnHover />
    </div>
  );
}

export default BulkCertUpload;
