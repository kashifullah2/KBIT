import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, Code, Check, Settings2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { API_URL } from '../config';

interface FileUploadProps {
    onFilesSelected: (files: File[], schema?: string, isMerge?: boolean, ocrEngine?: string) => void;
    isUploading: boolean;
}

interface OCREngine {
    id: string;
    name: string;
    description: string;
}

export function FileUpload({ onFilesSelected, isUploading }: FileUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [schema, setSchema] = useState("");
    const [isMerge, setIsMerge] = useState(true);
    const [ocrEngine, setOcrEngine] = useState("tesseract");
    const [availableEngines, setAvailableEngines] = useState<OCREngine[]>([]);
    const [enginesLoading, setEnginesLoading] = useState(true);

    useEffect(() => {
        async function fetchEngines() {
            try {
                const res = await fetch(`${API_URL}/ocr/engines`);
                if (res.ok) {
                    const data = await res.json();
                    setAvailableEngines(data.engines || []);
                    if (data.engines?.length > 0) {
                        setOcrEngine(data.engines[0].id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch OCR engines:", err);
                setAvailableEngines([
                    { id: "tesseract", name: "Tesseract OCR", description: "Default OCR engine." }
                ]);
            } finally {
                setEnginesLoading(false);
            }
        }
        fetchEngines();
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const removeFile = (index: number) => {
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
        <div className="w-full max-w-4xl mx-auto my-8 space-y-8">
            {/* Step 1: Dropzone */}
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-[2rem] p-12 md:p-16 transition-all duration-500 ease-out cursor-pointer flex flex-col items-center justify-center gap-6 group overflow-hidden",
                    isDragActive
                        ? "border-emerald-500 bg-emerald-50 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                        : "border-slate-200 bg-slate-50/50 hover:border-emerald-500/50 hover:bg-white shadow-sm"
                )}
            >
                {/* Background Sparkle */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <input {...getInputProps()} />

                <div className={cn(
                    "p-6 rounded-2xl bg-white border border-slate-200 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] group-hover:border-emerald-500/30",
                    isDragActive && "scale-110 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                )}>
                    <UploadCloud className={cn("w-10 h-10 text-slate-400 transition-colors duration-500 group-hover:text-emerald-500 font-light", isDragActive && "text-emerald-500")} />
                </div>
                
                <div className="text-center space-y-3 relative z-10">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">
                        {isDragActive ? "Drop documents here" : "Upload Documents"}
                    </h3>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium">
                        Drag and drop or click to browse.<br />
                        <span className="text-xs text-slate-400 mt-2 block uppercase tracking-widest font-bold">PDF • JPG • PNG</span>
                    </p>
                </div>
            </div>

            {/* Step 2: Preview & Configuration */}
            <AnimatePresence>
                {selectedFiles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-8 overflow-hidden relative"
                    >
                        {/* File List */}
                        <div className="space-y-4">
                            <h4 className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <File className="w-4 h-4 text-emerald-500" />
                                    Queue: {selectedFiles.length} item{selectedFiles.length !== 1 && 's'}
                                </span>
                                <button 
                                    onClick={() => setSelectedFiles([])} 
                                    className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-[0.2em] transition-colors"
                                >
                                    Clear All
                                </button>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {selectedFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-500/30 transition-all">
                                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-emerald-500 shadow-sm">
                                            <File className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-slate-700 font-semibold truncate flex-1">{file.name}</span>
                                        <button
                                            onClick={() => removeFile(idx)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* Configuration */}
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* OCR Engine Selector */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <Settings2 className="w-4 h-4 text-emerald-500" />
                                    OCR Engine
                                </label>
                                <div className="relative group">
                                    <select
                                        value={ocrEngine}
                                        onChange={(e) => setOcrEngine(e.target.value)}
                                        disabled={enginesLoading}
                                        className="w-full px-5 py-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer pr-12 group-hover:border-slate-300 font-medium"
                                    >
                                        {availableEngines.map(engine => (
                                            <option key={engine.id} value={engine.id}>
                                                {engine.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Schema Input */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <Code className="w-4 h-4 text-emerald-500" />
                                    Extraction Schema
                                </label>
                                <input
                                    type="text"
                                    value={schema}
                                    onChange={(e) => setSchema(e.target.value)}
                                    placeholder="e.g. name, date, total"
                                    className="w-full px-5 py-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 transition-all placeholder:text-slate-300 font-medium hover:border-slate-300"
                                />
                            </div>

                            {/* Merge Options */}
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Session</label>
                                <button
                                    onClick={() => setIsMerge(!isMerge)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                                        isMerge 
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                                            : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                                    )}
                                >
                                    <span className="text-xs font-bold uppercase tracking-wide">Merge Results</span>
                                    <div className={cn(
                                        "w-10 h-5 rounded-full relative transition-colors duration-300 ml-4",
                                        isMerge ? "bg-emerald-500" : "bg-slate-300"
                                    )}>
                                        <div className={cn(
                                            "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 shadow-sm",
                                            isMerge ? "left-6" : "left-1"
                                        )} />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Process Button */}
                        <button
                            onClick={handleProcess}
                            disabled={isUploading || selectedFiles.length === 0}
                            className="group relative w-full overflow-hidden py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                {isUploading ? "Running AI..." : `Extract Data from ${selectedFiles.length} Document${selectedFiles.length !== 1 ? 's' : ''}`}
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
