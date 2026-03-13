import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, LayoutTemplate, FileText, LogOut, Menu, X, Library } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`;

    const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-4 py-3 text-base font-medium transition-all ${
            isActive
                ? 'text-emerald-400 bg-emerald-500/10 border-l-4 border-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 border-l-4 border-transparent'
        }`;

    return (
        <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
                <div className="h-14 flex items-center justify-between">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileMenuOpen(false)}>
                        <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                            <Bot className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-base font-bold tracking-tight text-white">
                            KBIT
                        </span>
                    </NavLink>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink to="/" end className={navLinkClass}>
                            <Bot className="w-4 h-4" />
                            AI Assistant
                        </NavLink>
                        <NavLink to="/cv-builder" className={navLinkClass}>
                            <FileText className="w-4 h-4" />
                            CV Builder
                        </NavLink>
                        <NavLink to="/extractor" className={navLinkClass}>
                            <LayoutTemplate className="w-4 h-4" />
                            Extractor
                        </NavLink>
                        <NavLink to="/pdf-merger" className={navLinkClass}>
                            <Library className="w-4 h-4" />
                            PDF Merger
                        </NavLink>
                    </nav>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-400 max-w-[150px] truncate">
                                    {user?.email}
                                </span>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 bg-slate-800 border border-slate-700 rounded-lg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                    Log in
                                </NavLink>
                                <NavLink
                                    to="/signup"
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-500/20"
                                >
                                    Sign Up
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-slate-900 border-t border-slate-800">
                    <nav className="py-2">
                        <NavLink to="/" end className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                            <Bot className="w-5 h-5" />
                            AI Assistant
                        </NavLink>
                        <NavLink to="/cv-builder" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                            <FileText className="w-5 h-5" />
                            CV Builder
                        </NavLink>
                        <NavLink to="/extractor" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                            <LayoutTemplate className="w-5 h-5" />
                            Extractor
                        </NavLink>
                        <NavLink to="/pdf-merger" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                            <Library className="w-5 h-5" />
                            PDF Merger
                        </NavLink>
                    </nav>

                    <div className="border-t border-slate-800 p-4">
                        {isAuthenticated ? (
                            <div className="space-y-3">
                                <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <NavLink
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    Log in
                                </NavLink>
                                <NavLink
                                    to="/signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    Sign Up
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
