import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 mt-auto py-5 border-t border-slate-800">
            <div className="max-w-screen-xl mx-auto px-4 text-center">
                <p className="text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Brain Half · Developed by <span className="text-emerald-400 font-medium">Kashif Ullah</span>
                </p>
            </div>
        </footer>
    );
}
