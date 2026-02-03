import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { DataDisplay } from './components/DataDisplay';
import { Loader2, AlertCircle } from 'lucide-react';

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [data, setData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState(null);

  const handleFilesSelected = async (files, schema, isMerge) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    if (schema && schema.trim()) {
      formData.append('schema', schema);
    }

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      const newData = Array.isArray(result) ? result : [result];

      if (isMerge) {
        setData(prev => [...prev, ...newData]); // Appending new data to the end
      } else {
        setData(newData);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to process files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRefine = async (item, index, instructions) => {
    setIsRefining(true);
    try {
      const response = await fetch(`${API_URL}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_data: item.fields,
          instructions: instructions
        })
      });

      if (!response.ok) throw new Error("Refinement failed");

      const refinedFields = await response.json();

      setData(prev => {
        const newData = [...prev];
        newData[index] = { ...newData[index], fields: refinedFields };
        return newData;
      });

    } catch (err) {
      console.error(err);
      alert("Failed to refine data");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 pb-20 font-sans text-slate-900">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white pointer-events-none" />
      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

          {/* Hero Section */}
          <div className="text-center space-y-4 max-w-2xl mx-auto pt-10">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Turn Images into <span className="text-indigo-600">Structured Data</span>
            </h2>
            <p className="text-lg text-slate-500">
              Upload receipts, invoices, or forms. Our AI extracts the data you need in seconds.
            </p>
          </div>

          {/* Upload Area */}
          <FileUpload onFilesSelected={handleFilesSelected} isUploading={isUploading} />

          {/* Status / Error */}
          {isUploading && (
            <div className="flex justify-center items-center gap-2 text-primary-600 animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium">Processing your files with AI...</span>
            </div>
          )}

          {error && (
            <div className="max-w-md mx-auto p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Results */}
          <DataDisplay data={data} onRefine={handleRefine} isRefining={isRefining} />

        </main>
      </div>
    </div>
  );
}

export default App;
