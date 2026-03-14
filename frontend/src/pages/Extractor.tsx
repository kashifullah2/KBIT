// Brain Half Extractor Page
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUpload } from '../components/FileUpload';
import { DataDisplay } from '../components/DataDisplay';
import { Loader2, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import { API_URL } from '../config';

export const Extractor: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFilesSelected = async (files: File[], schema?: string, isMerge?: boolean, ocrEngine?: string) => {
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
        } catch (err: any) {
            console.error(err);
            setError("Failed to process files. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRefine = async (item: any, index: number, instructions: string) => {
        setIsUploading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/refine`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_data: item.fields,
                    raw_text: item.raw_text,
                    instructions: instructions
                }),
            });

            if (!response.ok) throw new Error("Refinement failed");
            const result = await response.json();
            
            const updatedData = [...data];
            updatedData[index] = { ...updatedData[index], fields: result.fields, summary: result.summary };
            setData(updatedData);
        } catch (err) {
            setError("Could not refine data. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
            <Helmet>
                <title>AI Document Extractor - Brain Half</title>
                <meta name="description" content="Extract structured data from PDFs, images, and invoices instantly using Brain Half's AI-powered OCR technology." />
            </Helmet>

            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-16 pb-24">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-8"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                        Next-Gen OCR Intelligence
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8"
                    >
                        Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">Data Extraction</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium"
                    >
                        Instantly transform messy documents into structured JSON. Upload invoices, IDs, or forms and let Brain Half do the manual work for you.
                    </motion.p>
                </div>

                {/* Upload Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <FileUpload onFilesSelected={handleFilesSelected} isUploading={isUploading} />
                </motion.div>

                {/* Status / Error */}
                <AnimatePresence>
                    {isUploading && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center gap-4 py-12"
                        >
                            <div className="relative">
                                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                            </div>
                            <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs animate-pulse">
                                AI is analyzing your documents...
                            </span>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl mx-auto mt-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-4 shadow-sm"
                        >
                            <AlertCircle className="w-6 h-6 shrink-0" />
                            <p className="font-medium text-sm">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Section */}
                {data.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-16"
                    >
                        <DataDisplay 
                            data={data} 
                            onRefine={handleRefine} 
                            isRefining={isUploading} 
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
}

