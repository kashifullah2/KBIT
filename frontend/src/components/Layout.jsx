import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { cn } from '../lib/utils';

import { useLocation } from 'react-router-dom';

export function Layout() {
    const location = useLocation();
    const isCVBuilder = location.pathname === '/cv-builder';

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 font-sans text-slate-900 flex flex-col">
            <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white pointer-events-none" />
            <div className="relative z-10 flex flex-col flex-1">
                <Header />
                <main className={cn(
                    "w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1",
                    isCVBuilder ? "overflow-hidden py-6" : "max-w-7xl py-10"
                )}>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}

