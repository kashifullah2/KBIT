import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { FileText, Download, Edit2, Send, Check } from 'lucide-react';

export function DataDisplay({ data, onRefine, isRefining }) {
    const [editingId, setEditingId] = useState(null);
    const [instructions, setInstructions] = useState("");

    const handleDownload = (item, format) => {
        const content = format === 'json'
            ? JSON.stringify(item.fields, null, 2)
            : Object.entries(item.fields).map(([k, v]) => `${k},${v}`).join('\n'); // Simple CSV

        const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${item.filename}_extracted.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const submitRefine = (item, index) => {
        onRefine(item, index, instructions);
        setEditingId(null);
        setInstructions("");
    };

    if (!data?.length) return null;

    // Collect all unique keys from all items to build table headers
    const allKeys = Array.from(new Set(data.flatMap(item => Object.keys(item.fields))));

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Extracted Data</h2>
                        <p className="text-sm text-slate-500">
                            {data.length} file{data.length !== 1 && 's'} processed
                        </p>
                    </div>
                    <div className="flex gap-2">
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
                                a.download = `all_extracted_data.csv`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                        <button
                            onClick={() => {
                                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `all_extracted_data.json`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" /> Export JSON
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 w-16">#</th>
                                <th className="px-6 py-4 min-w-[200px]">File Name</th>
                                {allKeys.map(key => (
                                    <th key={key} className="px-6 py-4 min-w-[150px] whitespace-nowrap">
                                        {key.replace(/_/g, ' ')}
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {data.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr className={cn(
                                        "hover:bg-indigo-50/30 transition-colors group relative",
                                        editingId === index && "bg-indigo-50/50"
                                    )}>
                                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-100/50 text-indigo-600 rounded-lg">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-700 truncate max-w-[180px]" title={item.filename}>
                                                        {item.filename}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                                                        {Object.keys(item.fields).length} fields
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {allKeys.map(key => (
                                            <td key={key} className="px-6 py-4 text-slate-600 font-mono text-xs">
                                                <div className="max-w-[200px] truncate" title={String(item.fields[key] || '-')}>
                                                    {item.fields[key] !== undefined ? String(item.fields[key]) : <span className="text-slate-300">-</span>}
                                                </div>
                                            </td>
                                        ))}

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDownload(item, 'json')}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Download JSON"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(editingId === index ? null : index)}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all shadow-sm",
                                                        editingId === index
                                                            ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200"
                                                            : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                                                    )}
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                    {editingId === index ? 'Close' : 'Refine'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expansion Row for Refine */}
                                    <AnimatePresence>
                                        {editingId === index && (
                                            <tr>
                                                <td colSpan={allKeys.length + 3} className="p-0 bg-indigo-50/30">
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-6 flex items-start gap-6">
                                                            <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                                                                <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                                                                    <Edit2 className="w-4 h-4" />
                                                                    Refine Data for {item.filename}
                                                                </h4>
                                                                <div className="flex gap-3">
                                                                    <input
                                                                        type="text"
                                                                        value={instructions}
                                                                        onChange={(e) => setInstructions(e.target.value)}
                                                                        placeholder="Describe corrections, e.g. 'Change the Invoice Date to 2024-01-01'..."
                                                                        className="flex-1 rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2.5 px-3 shadow-sm"
                                                                        autoFocus
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter' && instructions && !isRefining) {
                                                                                submitRefine(item, index);
                                                                            }
                                                                        }}
                                                                    />
                                                                    <button
                                                                        onClick={() => submitRefine(item, index)}
                                                                        disabled={!instructions || isRefining}
                                                                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-indigo-200 transition-all active:scale-95"
                                                                    >
                                                                        {isRefining ? 'Updating...' : 'Send'}
                                                                        {!isRefining && <Send className="w-4 h-4 ml-1" />}
                                                                    </button>
                                                                </div>
                                                                <p className="mt-2 text-xs text-slate-400">
                                                                    AI will re-process the data based on your instructions.
                                                                </p>
                                                            </div>

                                                            {/* Quick Summary View */}
                                                            <div className="w-1/3 text-xs bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 hidden lg:block">
                                                                <h5 className="font-medium text-slate-700 mb-2">Original Text Snippet</h5>
                                                                <p className="text-slate-500 italic">
                                                                    "{item.raw_text ? item.raw_text.substring(0, 150).replace(/\n/g, ' ') + '...' : 'No raw text available'}"
                                                                </p>
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
        </div>
    );
}
