import React from 'react';

export function Footer() {
    return (
        <footer className="bg-slate-900 mt-auto py-6">
            <div className="max-w-screen-xl mx-auto px-4 text-center">
                <p className="text-sm text-slate-400">
                    &copy; {new Date().getFullYear()} KBIT · Developed by <span className="text-white font-medium">Kashif Ullah</span>
                </p>
            </div>
        </footer>
    );
}
