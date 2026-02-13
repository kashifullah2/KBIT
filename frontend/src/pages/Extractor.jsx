import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { DataDisplay } from '../components/DataDisplay';
import { Loader2, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import { API_URL } from '../config';

export function Extractor() {
    const [data, setData] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [error, setError] = useState(null);

    const handleFilesSelected = async (files, schema, isMerge, ocrEngine) => {
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

        if (ocrEngine) {
            formData.append('ocr_engine', ocrEngine);
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
            <Helmet>
                <title>AI Document Extractor - KBIT</title>
                <meta name="description" content="Extract structured data from PDFs, images, and invoices instantly using KBIT's AI-powered OCR technology." />
                <meta name="keywords" content="OCR, document extraction, AI data extraction, PDF to JSON, image to text" />
            </Helmet>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 text-center px-4">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50/50 to-slate-50"></div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 animate-fade-in-up">
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                    AI-Powered Extraction 2.0
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 animate-fade-in-up delay-100 text-balance">
                    {/* <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-sm text-indigo-700 backdrop-blur-sm mb-4">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
                    AI-Powered Extraction 2.0
                </div> */}

                    Transform Documents into <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                        Structured Data
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance mb-8 animate-fade-in-up delay-200">
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
