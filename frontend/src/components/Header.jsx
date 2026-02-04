import React from 'react';
import { Sparkles, Settings, FileText, LayoutTemplate } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export function Header() {
    const navLinkClass = ({ isActive }) => cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all",
        isActive
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
    );

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 hidden sm:block">
                            KBIT <span className="font-normal text-slate-500">AI Platform</span>
                        </h1>
                    </div>

                    <nav className="flex items-center gap-1">
                        <NavLink to="/" end className={navLinkClass}>
                            <FileText className="w-4 h-4" />
                            <span className="hidden sm:inline">Data Extractor</span>
                        </NavLink>
                        <NavLink to="/cv-builder" className={navLinkClass}>
                            <LayoutTemplate className="w-4 h-4" />
                            <span className="hidden sm:inline">CV Builder</span>
                        </NavLink>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold text-xs border border-indigo-200">
                        KA
                    </div>
                </div>
            </div>
        </header>
    );
}
