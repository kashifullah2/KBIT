// Brain Half Data Display Component
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { FileText, Download, Edit2, Send, Database, Table, Code, Trash2, ChevronRight, X, Settings2 } from 'lucide-react';

interface ExtractedItem {
    filename: string;
    summary: string;
    fields: Record<string, any>;
    raw_text: string;
}

interface DataDisplayProps {
    data: ExtractedItem[];
    onRefine?: (item: ExtractedItem, index: number, instructions: string) => void;
    isRefining?: boolean;
}

export function DataDisplay({ data, onRefine, isRefining = false }: DataDisplayProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [instructions, setInstructions] = useState("");
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

    const handleDownload = (item: ExtractedItem, format: 'json' | 'csv') => {
        const content = format === 'json'
            ? JSON.stringify(item.fields, null, 2)
            : Object.entries(item.fields).map(([k, v]) => `"${k}","${String(v).replace(/"/g, '""')}"`).join('\n');

        const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${item.filename}_extracted.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const submitRefine = (item: ExtractedItem, index: number) => {
        if (onRefine && instructions.trim()) {
            onRefine(item, index, instructions);
            setEditingId(null);
            setInstructions("");
        }
    };

    if (!data?.length) return null;

    const allKeys = Array.from(new Set(data.flatMap(item => Object.keys(item.fields))));

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 pb-32">
            {/* Header Control Panel */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-xl">
                        <Database className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Extracted Insights</h2>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.15em] mt-1">
                            {data.length} document{data.length !== 1 && 's'} in session
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* View Switcher */}
                    <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center gap-1 shadow-sm">
                        <button
                            onClick={() => setViewMode('table')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === 'table' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <Table size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('cards')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === 'cards' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <FileText size={18} />
                        </button>
                    </div>

                    <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block" />

                    <button
                        onClick={() => {
                            const headers = ['File Name', ...allKeys];
                            const csvContent = [
                                headers.join(','),
                                ...data.map(item => {
                                    const row = [item.filename, ...allKeys.map(key => item.fields[key] || '')];
                                    return row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',');
                                })
                            ].join('\n');
                            const blob = new Blob([csvContent], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `brainhalf_extraction_${new Date().toISOString().slice(0, 10)}.csv`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }}
                        className="flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest text-emerald-600 bg-white border border-slate-200 rounded-xl hover:bg-emerald-50 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden group">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-12">No.</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[250px]">Source Identifier</th>
                                    {allKeys.map(key => (
                                        <th key={key} className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[180px] whitespace-nowrap">
                                            {key.replace(/_/g, ' ')}
                                        </th>
                                    ))}
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <tr className={cn(
                                            "hover:bg-slate-50 transition-colors relative group/row",
                                            editingId === index && "bg-emerald-50/30"
                                        )}>
                                            <td className="px-8 py-6 text-slate-400 font-mono text-[11px] font-bold">
                                                {String(index + 1).padStart(2, '0')}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 group-hover/row:border-emerald-500/30 group-hover/row:text-emerald-500 transition-all duration-300 shadow-sm">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-slate-900 truncate max-w-[200px]" title={item.filename}>
                                                            {item.filename}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">
                                                            {Object.keys(item.fields).length} nodes
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {allKeys.map(key => (
                                                <td key={key} className="px-8 py-6">
                                                    <div 
                                                        className="max-w-[220px] truncate font-mono text-[12px] text-slate-600 px-3 py-1.5 bg-white border border-slate-100 rounded-lg group-hover/row:border-slate-200 transition-all shadow-sm" 
                                                        title={String(item.fields[key] || '-')}
                                                    >
                                                        {item.fields[key] !== undefined ? String(item.fields[key]) : <span className="opacity-20">—</span>}
                                                    </div>
                                                </td>
                                            ))}

                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleDownload(item, 'json')}
                                                        className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                        title="Export JSON"
                                                    >
                                                        <Code className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(editingId === index ? null : index)}
                                                        className={cn(
                                                            "flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm",
                                                            editingId === index
                                                                ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                                                : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-500/40 hover:text-emerald-600"
                                                        )}
                                                    >
                                                        {editingId === index ? (
                                                            <>
                                                                <X className="w-3.5 h-3.5" /> Close
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Edit2 className="w-3.5 h-3.5" /> Refine
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Refinement Panel */}
                                        <AnimatePresence>
                                            {editingId === index && (
                                                <tr>
                                                    <td colSpan={allKeys.length + 3} className="p-0 border-none">
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden bg-slate-50/50 border-y border-slate-100"
                                                        >
                                                            <div className="p-10 flex flex-col lg:flex-row gap-10">
                                                                <div className="flex-1 space-y-6">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-200">
                                                                            <Settings2 className="w-4 h-4 text-emerald-500" />
                                                                        </div>
                                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                                                            Refine Intelligent Extraction
                                                                        </h4>
                                                                    </div>
                                                                    
                                                                    <div className="relative group">
                                                                        <textarea
                                                                            value={instructions}
                                                                            onChange={(e) => setInstructions(e.target.value)}
                                                                            placeholder="Describe corrections, e.g. 'Format the phone number...'"
                                                                            className="w-full h-32 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 text-slate-700 text-sm py-5 px-6 placeholder:text-slate-300 transition-all resize-none font-medium shadow-sm"
                                                                            autoFocus
                                                                        />
                                                                        <div className="absolute top-4 right-4 text-slate-300 group-hover:text-emerald-500 transition-colors pointer-events-none">
                                                                            <ChevronRight size={18} />
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center justify-between gap-6">
                                                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide max-w-sm">
                                                                            Our LLM will re-analyze the source document using your specific constraints.
                                                                        </p>
                                                                        <button
                                                                            onClick={() => submitRefine(item, index)}
                                                                            disabled={!instructions.trim() || isRefining}
                                                                            className="px-10 py-4 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-3"
                                                                        >
                                                                            {isRefining ? 'Re-processing...' : 'Apply Correction'}
                                                                            {!isRefining && <Send size={14} />}
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="lg:w-80 shrink-0 space-y-4">
                                                                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Raw context</h5>
                                                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs text-slate-400 leading-relaxed font-mono italic max-h-[220px] overflow-y-auto custom-scrollbar shadow-sm">
                                                                        "{item.raw_text ? item.raw_text.substring(0, 500) + '...' : 'No context.'}"
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Card View */}
            {viewMode === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {data.map((item, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-emerald-500/30 transition-all shadow-xl space-y-6 flex flex-col group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-emerald-600 group-hover:scale-110 transition-transform">
                                    <FileText size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleDownload(item, 'json')} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Download size={16} /></button>
                                    <button onClick={() => setEditingId(index)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit2 size={16} /></button>
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 truncate">{item.filename}</h3>
                                <p className="text-xs text-slate-400 mt-1 uppercase font-black tracking-widest">{item.summary || 'Document Analyzed'}</p>
                                
                                <div className="mt-6 space-y-3">
                                    {Object.entries(item.fields).slice(0, 5).map(([k, v]) => (
                                        <div key={k} className="flex justify-between items-center gap-4 text-xs">
                                            <span className="text-slate-400 font-bold uppercase tracking-tighter truncate max-w-[100px]">{k.replace(/_/g, ' ')}</span>
                                            <span className="text-slate-600 font-mono truncate max-w-[150px]">{String(v)}</span>
                                        </div>
                                    ))}
                                    {Object.keys(item.fields).length > 5 && (
                                        <p className="text-[10px] text-emerald-500 text-center pt-2 font-bold uppercase tracking-widest">+{Object.keys(item.fields).length - 5} more fields</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

