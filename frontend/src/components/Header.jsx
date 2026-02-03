import React from 'react';
import { Sparkles, Settings } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        KBIT <span className="font-normal text-slate-500">AI Platform</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                        Documentation
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
