import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, LayoutTemplate, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Header() {
    const { user, logout, isAuthenticated } = useAuth();

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
            ? 'text-indigo-600 bg-indigo-50/80 ring-1 ring-indigo-200 shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`;

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-8">
                    <NavLink to="/" className="flex items-center gap-2.5 group">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-1.5 rounded-lg shadow-sm group-hover:shadow-indigo-500/20 transition-all duration-300">
                            <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                            KBIT
                        </span>
                    </NavLink>

                    <nav className="flex items-center gap-1 hidden md:flex">
                        <NavLink to="/" end className={navLinkClass}>
                            <LayoutTemplate className="w-4 h-4" />
                            Extractor
                        </NavLink>
                        <NavLink to="/cv-builder" className={navLinkClass}>
                            <FileText className="w-4 h-4" />
                            CV Builder
                        </NavLink>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-600 hidden sm:inline-block">
                                {user?.email}
                            </span>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-red-600 transition-colors shadow-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className="px-5 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                            >
                                Log in
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all shadow-sm shadow-slate-200 hover:shadow-md"
                            >
                                Sign Up
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
