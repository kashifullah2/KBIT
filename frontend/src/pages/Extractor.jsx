import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { DataDisplay } from '../components/DataDisplay';
import { Loader2, AlertCircle } from 'lucide-react';

import { API_URL } from '../config';

export function Extractor() {
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
                setData(prev => [...prev, ...newData]);
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
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-4xl mx-auto pt-16 md:pt-24 px-4">
                {/* <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-sm text-indigo-700 backdrop-blur-sm mb-4">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
                    AI-Powered Extraction 2.0
                </div> */}

                <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl text-balance">
                    Transform Documents into <br />
                    <span className="text-indigo-600 relative inline-block">
                        Structured Data
                        <svg className="absolute -bottom-2 left-0 w-full h-2 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                        </svg>
                    </span>
                </h2>

                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed text-balance">
                    Stop manual entry. Upload receipts, invoices, or forms and get <span className="font-semibold text-slate-900">pixel-perfect JSON</span> in seconds.
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
        </div>
    );
}
