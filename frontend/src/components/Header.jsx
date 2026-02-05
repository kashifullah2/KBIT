import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, LayoutTemplate, FileText, LogOut, Lightbulb, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Header() {
    const { user, logout, isAuthenticated } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
            ? 'text-indigo-600 bg-indigo-50/80'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`;

    const mobileNavLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-base font-medium transition-all ${isActive
            ? 'text-indigo-600 bg-indigo-50 border-l-4 border-indigo-600'
            : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border-l-4 border-transparent'
        }`;

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/60">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-14 md:h-16 flex items-center justify-between">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-1.5 rounded-lg shadow-sm group-hover:shadow-indigo-500/30 transition-all">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={2} />
                        </div>
                        <span className="text-base md:text-lg font-bold tracking-tight text-slate-900">
                            KBIT
                        </span>
                    </NavLink>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink to="/" end className={navLinkClass}>
                            <LayoutTemplate className="w-4 h-4" />
                            Extractor
                        </NavLink>
                        <NavLink to="/cv-builder" className={navLinkClass}>
                            <FileText className="w-4 h-4" />
                            CV Builder
                        </NavLink>
                        <NavLink to="/idea-validator" className={navLinkClass}>
                            <Lightbulb className="w-4 h-4" />
                            Idea Validator
                        </NavLink>
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-600 max-w-[150px] truncate">
                                    {user?.email}
                                </span>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                                >
                                    Log in
                                </NavLink>
                                <NavLink
                                    to="/signup"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                                >
                                    Sign Up
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
                    <nav className="py-2">
                        <NavLink to="/" end className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                            <LayoutTemplate className="w-5 h-5" />
                            Extractor
                        </NavLink>
                        <NavLink to="/cv-builder" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                            <FileText className="w-5 h-5" />
                            CV Builder
                        </NavLink>
                        <NavLink to="/idea-validator" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                            <Lightbulb className="w-5 h-5" />
                            Idea Validator
                        </NavLink>
                    </nav>

                    <div className="border-t border-slate-200 p-4">
                        {isAuthenticated ? (
                            <div className="space-y-3">
                                <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
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
                                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Log in
                                </NavLink>
                                <NavLink
                                    to="/signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
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
