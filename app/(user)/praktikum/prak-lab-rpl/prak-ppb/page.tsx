"use client";

import React, { useEffect, useState } from "react";

function PrakPPBPage() {
  const [message, setMessage] = useState("Loading...");
  const [modules, setModules] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/praktikum/prak-ppb")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessage(data.message || "No message found");
        setModules(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setMessage("Error loading data");
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Praktikum PPB</h1>
      <div className="text-lg text-gray-800 mb-6">{message}</div>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          List of Modules
        </h2>
        {modules.length > 0 ? (
          <ul className="space-y-2">
            {modules.map((module, index) => (
              <li
                key={index}
                className="bg-gray-100 px-4 py-2 rounded-md shadow-sm text-gray-700"
              >
                {module}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No modules available</p>
        )}
      </div>
    </div>
  );
}

export default PrakPPBPage;
