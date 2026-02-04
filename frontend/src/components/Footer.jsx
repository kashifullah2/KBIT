import React from 'react';

export function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 mt-auto py-8">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="h-px bg-slate-800 w-12" />
                    <span className="text-slate-500 text-xs uppercase tracking-widest font-medium">Built By</span>
                    <div className="h-px bg-slate-800 w-12" />
                </div>
                <p className="text-base text-slate-300 font-medium tracking-wide">
                    Kashif Ullah
                </p>
                <p className="text-xs text-slate-600">
                    &copy; {new Date().getFullYear()} All rights reserved.
                </p>
            </div>
        </footer>
    );
}
