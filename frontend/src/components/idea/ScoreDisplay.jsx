import React from 'react';

export function ScoreDisplay({ score, size = 'large' }) {
    const getScoreColor = (score) => {
        if (score >= 8) return { bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-500/20' };
        if (score >= 6) return { bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-500/20' };
        if (score >= 4) return { bg: 'bg-orange-500', text: 'text-orange-600', ring: 'ring-orange-500/20' };
        return { bg: 'bg-red-500', text: 'text-red-600', ring: 'ring-red-500/20' };
    };

    const getScoreLabel = (score) => {
        if (score >= 8) return 'Excellent';
        if (score >= 6) return 'Good';
        if (score >= 4) return 'Fair';
        return 'Needs Work';
    };

    const colors = getScoreColor(score);
    const percentage = (score / 10) * 100;

    if (size === 'small') {
        return (
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{score}</span>
                </div>
                <span className={`text-sm font-medium ${colors.text}`}>{getScoreLabel(score)}</span>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm ring-4 ${colors.ring}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Viability Score</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.bg} text-white`}>
                    {getScoreLabel(score)}
                </span>
            </div>

            {/* Circular Progress */}
            <div className="flex items-center gap-6">
                <div className="relative w-28 h-28">
                    <svg className="w-28 h-28 transform -rotate-90">
                        <circle
                            cx="56"
                            cy="56"
                            r="48"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-slate-100"
                        />
                        <circle
                            cx="56"
                            cy="56"
                            r="48"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${percentage * 3.02} 302`}
                            strokeLinecap="round"
                            className={colors.text}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-3xl font-black ${colors.text}`}>{score}</span>
                    </div>
                </div>

                <div className="flex-1 text-sm text-slate-600">
                    <p>This score represents the overall viability of your business idea based on market potential, competition, risks, and execution feasibility.</p>
                </div>
            </div>
        </div>
    );
}

export function ScoreBreakdown({ breakdown }) {
    if (!breakdown) return null;

    const items = [
        { key: 'market_opportunity', label: 'Market Opportunity' },
        { key: 'execution_feasibility', label: 'Execution Feasibility' },
        { key: 'uniqueness', label: 'Uniqueness' },
        { key: 'revenue_potential', label: 'Revenue Potential' },
        { key: 'scalability', label: 'Scalability' }
    ];

    const getBarColor = (score) => {
        if (score >= 8) return 'bg-emerald-500';
        if (score >= 6) return 'bg-amber-500';
        if (score >= 4) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Score Breakdown</h3>
            <div className="space-y-4">
                {items.map(item => {
                    const score = breakdown[item.key] || 0;
                    return (
                        <div key={item.key}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">{item.label}</span>
                                <span className="font-semibold text-slate-900">{score}/10</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${getBarColor(score)} rounded-full transition-all duration-500`}
                                    style={{ width: `${score * 10}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
