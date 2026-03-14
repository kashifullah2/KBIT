import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { cn } from '../lib/utils';

export const Layout: React.FC = () => {
    const location = useLocation();
    const isCVBuilder = location.pathname === '/cv-builder';
    const isCVBuilderEdit = location.pathname === '/cv-builder/edit';
    const isAIAssistant = location.pathname === '/ai-assistant' || location.pathname === '/';
    const isLoginOrSignup = location.pathname === '/login' || location.pathname === '/signup';
    const isFullViewport = isCVBuilderEdit || isAIAssistant;

    return (
        <div className={cn(
            "min-h-screen selection:bg-emerald-100 selection:text-emerald-900 font-sans flex flex-col",
            isLoginOrSignup
                ? "bg-slate-950 text-white"
                : isFullViewport
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50 text-slate-900"
        )}>
            {!isFullViewport && !isLoginOrSignup && (
                <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/50 via-white to-white pointer-events-none" />
            )}
            <div className="relative z-10 flex flex-col flex-1">
                {!isLoginOrSignup && <Header />}
                <main className={cn(
                    "w-full flex-1",
                    isLoginOrSignup
                        ? ""
                        : isFullViewport
                            ? ""
                            : isCVBuilder
                                ? "mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden py-6"
                                : "mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10"
                )}>
                    <Outlet />
                </main>
                {!isFullViewport && !isLoginOrSignup && <Footer />}
            </div>
        </div>
    );
}
