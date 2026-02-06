import React from 'react';
import { Grid, FileText, Palette, Sparkles } from 'lucide-react';

const TABS = [
    { id: 'overview', label: 'Overview', icon: Grid },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'customize', label: 'Customize', icon: Palette },
    { id: 'ai-tools', label: 'AI Tools', icon: Sparkles }
];

export function BuilderTabs({ activeTab, onTabChange }) {
    return (
        <div className="flex gap-1 border-b border-slate-200 bg-white px-6">
            {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all
                            ${isActive
                                ? 'border-pink-600 text-pink-600'
                                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                            }
                        `}
                    >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
