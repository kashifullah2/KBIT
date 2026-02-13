import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, Code, Check, Settings2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { API_URL } from '../config';

export function FileUpload({ onFilesSelected, isUploading }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [schema, setSchema] = useState("");
    const [isMerge, setIsMerge] = useState(true);
    const [ocrEngine, setOcrEngine] = useState("tesseract");
    const [availableEngines, setAvailableEngines] = useState([]);
    const [enginesLoading, setEnginesLoading] = useState(true);

    // Fetch available OCR engines on mount
    useEffect(() => {
        async function fetchEngines() {
            try {
                const res = await fetch(`${API_URL}/ocr/engines`);
                if (res.ok) {
                    const data = await res.json();
                    setAvailableEngines(data.engines || []);
                    // Default to the first available engine
                    if (data.engines?.length > 0) {
                        setOcrEngine(data.engines[0].id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch OCR engines:", err);
                // Fallback engines
                setAvailableEngines([
                    { id: "tesseract", name: "Tesseract OCR", description: "Default OCR engine." }
                ]);
            } finally {
                setEnginesLoading(false);
            }
        }
        fetchEngines();
    }, []);

    const onDrop = useCallback(acceptedFiles => {
        setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleProcess = () => {
        onFilesSelected(selectedFiles, schema, isMerge, ocrEngine);
        setSelectedFiles([]);
        setSchema("");
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
            'application/pdf': ['.pdf']
        },
        disabled: isUploading
    });

    return (
        <div className="w-full max-w-3xl mx-auto my-8 space-y-8">
            {/* Step 1: Dropzone (Always visible to add more files) */}
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 md:p-12 transition-all duration-200 ease-in-out cursor-pointer flex flex-col items-center justify-center gap-4 group",
                    isDragActive
                        ? "border-indigo-500 bg-indigo-50/50"
                        : "border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-white"
                )}
            >
                <input {...getInputProps()} />

                <div className={cn(
                    "p-4 rounded-full bg-white shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md",
                    isDragActive && "bg-indigo-100 ring-indigo-500/20"
                )}>
                    <UploadCloud className={cn("w-8 h-8 text-slate-400 transition-colors duration-300 group-hover:text-indigo-600", isDragActive && "text-indigo-600")} />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {isDragActive ? "Drop files now" : "Select files to process"}
                    </h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                        Support for PDF, JPG, and PNG documents.
                    </p>
                </div>
            </div>

            {/* Step 2: Preview & Configuration */}
            <AnimatePresence>
                {selectedFiles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl space-y-6"
                    >
                        {/* File List */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-900 flex items-center justify-between">
                                <span>Selected Files ({selectedFiles.length})</span>
                                <button onClick={() => setSelectedFiles([])} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear All</button>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {selectedFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group relative">
                                        <div className="p-2 bg-white rounded-lg border border-slate-200 text-indigo-500">
                                            <File className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-slate-700 truncate flex-1">{file.name}</span>
                                        <button
                                            onClick={() => removeFile(idx)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* Configuration */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* OCR Engine Selector */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <Settings2 className="w-4 h-4 text-indigo-600" />
                                    OCR Engine
                                </label>
                                <div className="relative">
                                    <select
                                        value={ocrEngine}
                                        onChange={(e) => setOcrEngine(e.target.value)}
                                        disabled={enginesLoading}
                                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer pr-10"
                                    >
                                        {availableEngines.map(engine => (
                                            <option key={engine.id} value={engine.id}>
                                                {engine.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                                {availableEngines.find(e => e.id === ocrEngine)?.description && (
                                    <p className="text-xs text-slate-400">
                                        {availableEngines.find(e => e.id === ocrEngine)?.description}
                                    </p>
                                )}
                            </div>

                            {/* Schema Input */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <Code className="w-4 h-4 text-indigo-600" />
                                    Custom Schema
                                </label>
                                <input
                                    type="text"
                                    value={schema}
                                    onChange={(e) => setSchema(e.target.value)}
                                    placeholder="e.g. name: str, age: int"
                                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                />
                                <p className="text-xs text-slate-400">Leave empty for auto-detection.</p>
                            </div>

                            {/* Merge Options */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-slate-800">Processing Options</label>
                                <div
                                    onClick={() => setIsMerge(!isMerge)}
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                                        isMerge ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 border-slate-200 hover:border-indigo-200"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                                        isMerge ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                                    )}>
                                        {isMerge && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn("text-sm font-medium", isMerge ? "text-indigo-900" : "text-slate-700")}>Merge with existing data</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Append new results to current table</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Process Button */}
                        <button
                            onClick={handleProcess}
                            disabled={isUploading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <>Processing Files...</>
                            ) : (
                                <>Extract Data from {selectedFiles.length} File{selectedFiles.length !== 1 && 's'}</>
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
