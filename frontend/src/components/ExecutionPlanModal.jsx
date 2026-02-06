import React from 'react';
import { X, CheckCircle, ClipboardList } from 'lucide-react';

export function ExecutionPlanModal({ isOpen, onClose, plan, title }) {
    if (!isOpen || !plan) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-scaleIn">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <ClipboardList className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Execution Plan</h3>
                            <p className="text-sm text-slate-500">{title}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {plan.map((phase, i) => (
                        <div key={i} className="relative pl-8 border-l-2 border-emerald-100 last:border-0 pb-8 last:pb-0">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-500"></div>

                            <h4 className="font-bold text-lg text-slate-900 mb-4">{phase.phase}</h4>

                            <div className="space-y-3">
                                {phase.steps.map((step, j) => (
                                    <div key={j} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
                                        <div className="mt-0.5">
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-slate-700 font-medium">{step.action}</p>
                                            {step.tip && (
                                                <p className="text-sm text-slate-500 mt-1">💡 {step.tip}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                    >
                        Close Plan
                    </button>
                </div>
            </div>
        </div>
    );
}
