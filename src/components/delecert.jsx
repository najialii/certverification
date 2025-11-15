import React, { useState } from "react";

const BulkDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_URL = "http://localhost/cert-verification/api/content/items/certificates"; // Your collection endpoint
  const API_KEY = "Bearer API-158efee4d6c061202c846eb7f17d598755d790e2"; // Your Cockpit API key

  // Function to fetch all entries with pagination
  const fetchEntries = async () => {
    let allEntries = [];
    let skip = 0;
    const limit = 1000; // You can adjust this based on the maximum items in a page
    
    while (true) {
      console.log(`Fetching entries with skip=${skip} and limit=${limit}`); // Log the pagination parameters
      const response = await fetch(`${API_URL}?token=${API_KEY}&limit=${limit}&skip=${skip}`);
      const data = await response.json();

      console.log("API Response:", data); // Log the API response

      if (!data.entries || data.entries.length === 0) {
        break; // Stop if no entries or 'entries' is missing
      }

      allEntries = [...allEntries, ...data.entries];
      skip += limit; // Continue to next chunk of entries
    }

    console.log("All Entries Fetched:", allEntries); // Log all the entries fetched
    return allEntries;
  };

  // Function to delete a single entry by ID
  const deleteEntry = async (entryId) => {
    const response = await fetch(`${API_URL}/${entryId}?token=${API_KEY}`, {
      method: 'DELETE',
      headers: {
        "api-key": API_KEY // Use the API key for authentication
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete entry with ID: ${entryId}`);
    }
    return response.json(); // Return response if successful
  };

  // Function to delete all entries
  const deleteAllEntries = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const entries = await fetchEntries(); // Fetch all entries

      if (entries.length === 0) {
        setSuccess("No entries to delete.");
        setLoading(false);
        return;
      }

      // Loop through entries and delete each by ID
      for (const entry of entries) {
        console.log(`Deleting entry with ID: ${entry._id}`); // Log each deletion
        await deleteEntry(entry._id); // Assuming _id is the unique identifier for the entries
      }

      setSuccess("All entries deleted successfully!");
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Bulk Delete</h1>
        <p className="text-gray-600 mt-2">Delete all entries from the collection.</p>
      </header>

      <div className="w-full max-w-2xl mt-8">
        <button
          onClick={deleteAllEntries}
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? `Deleting...` : "Delete All Entries"}
        </button>

        {loading && <div className="mt-2 text-blue-500">Deleting entries...</div>}
      </div>

      {error && <div className="mt-4 text-red-500 font-semibold">{error}</div>}
      {success && <div className="mt-4 text-green-500 font-semibold">{success}</div>}
    </div>
  );
};

export default BulkDelete;
