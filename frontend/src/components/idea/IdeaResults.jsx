import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Target,
    TrendingUp,
    Shield,
    Zap,
    DollarSign,
    Rocket,
    Users,
    BarChart3,
    AlertTriangle,
    CheckCircle,
    Lightbulb,
    Award,
    ClipboardList
} from 'lucide-react';
import { ScoreDisplay, ScoreBreakdown } from './ScoreDisplay';

function ExpandableSection({ title, icon: IconComponent, children, defaultOpen = false, accentColor = 'indigo' }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        amber: 'bg-amber-50 text-amber-600 border-amber-200',
        violet: 'bg-violet-50 text-violet-600 border-violet-200',
        rose: 'bg-rose-50 text-rose-600 border-rose-200',
        cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
        orange: 'bg-orange-50 text-orange-600 border-orange-200',
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${colorClasses[accentColor]}`}>
                        <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-slate-900">{title}</span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
            </button>
            {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                    {children}
                </div>
            )}
        </div>
    );
}

function RiskBadge({ severity }) {
    const colors = {
        high: 'bg-red-100 text-red-700 border-red-200',
        medium: 'bg-amber-100 text-amber-700 border-amber-200',
        low: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[severity] || colors.medium}`}>
            {severity}
        </span>
    );
}

export function IdeaResults({ analysis }) {
    if (!analysis) return null;

    return (
        <div className="space-y-6">
            {/* Header with Score */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScoreDisplay score={analysis.viability_score || 0} />
                <ScoreBreakdown breakdown={analysis.score_breakdown} />
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Idea Summary
                </h3>
                <p className="text-indigo-100 leading-relaxed">{analysis.idea_summary}</p>
            </div>

            {/* Verdict */}
            {analysis.verdict && (
                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" />
                        Final Verdict
                    </h3>
                    <p className="text-slate-300 leading-relaxed">{analysis.verdict}</p>
                </div>
            )}

            {/* Expandable Sections */}
            <div className="space-y-4">
                {/* Market Demand */}
                <ExpandableSection title="Market Demand" icon={TrendingUp} accentColor="emerald" defaultOpen>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Score:</span>
                            <span className="font-bold text-slate-900">{analysis.market_demand?.score}/10</span>
                        </div>
                        <p className="text-slate-600">{analysis.market_demand?.analysis}</p>
                        {analysis.market_demand?.trends && (
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Market Trends</h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.market_demand.trends.map((trend, i) => (
                                        <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                                            {trend}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {analysis.market_demand?.market_size && (
                            <p className="text-sm text-slate-500">
                                <strong>Market Size:</strong> {analysis.market_demand.market_size}
                            </p>
                        )}
                    </div>
                </ExpandableSection>

                {/* Target Customers */}
                <ExpandableSection title="Target Customers" icon={Users} accentColor="cyan">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Primary</h4>
                                <p className="text-slate-600 text-sm">{analysis.target_customers?.primary}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Secondary</h4>
                                <p className="text-slate-600 text-sm">{analysis.target_customers?.secondary}</p>
                            </div>
                        </div>
                        {analysis.target_customers?.pain_points && (
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Pain Points</h4>
                                <ul className="space-y-2">
                                    {analysis.target_customers.pain_points.map((point, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                            <Target className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </ExpandableSection>

                {/* Competition */}
                <ExpandableSection title="Competition Overview" icon={BarChart3} accentColor="violet">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Competition Level:</span>
                            <RiskBadge severity={analysis.competition?.level} />
                        </div>
                        <p className="text-slate-600">{analysis.competition?.differentiation}</p>
                        {analysis.competition?.direct_competitors && (
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Direct Competitors</h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.competition.direct_competitors.map((comp, i) => (
                                        <span key={i} className="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm">
                                            {comp}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {analysis.competition?.competitive_advantage && (
                            <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                                <h4 className="text-sm font-semibold text-violet-700 mb-1">Your Competitive Advantage</h4>
                                <p className="text-violet-600 text-sm">{analysis.competition.competitive_advantage}</p>
                            </div>
                        )}
                    </div>
                </ExpandableSection>

                {/* Risks */}
                <ExpandableSection title="Risk Assessment" icon={Shield} accentColor="rose">
                    <div className="space-y-3">
                        {analysis.risks?.map((risk, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-slate-900">{risk.type}</span>
                                    <RiskBadge severity={risk.severity} />
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{risk.description}</p>
                                <div className="flex items-start gap-2 text-sm">
                                    <Shield className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-emerald-700"><strong>Mitigation:</strong> {risk.mitigation}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ExpandableSection>

                {/* Improvements */}
                <ExpandableSection title="Improvement Suggestions" icon={Zap} accentColor="amber">
                    <ul className="space-y-3">
                        {analysis.improvements?.map((imp, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700">{imp}</span>
                            </li>
                        ))}
                    </ul>
                </ExpandableSection>

                {/* Monetization */}
                <ExpandableSection title="Monetization Strategies" icon={DollarSign} accentColor="emerald">
                    <div className="space-y-3">
                        {analysis.monetization?.map((model, i) => (
                            <div key={i} className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-emerald-900">{model.model}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                                        ${model.potential === 'high' ? 'bg-emerald-200 text-emerald-800' :
                                            model.potential === 'medium' ? 'bg-amber-200 text-amber-800' :
                                                'bg-slate-200 text-slate-700'}`}>
                                        {model.potential} potential
                                    </span>
                                </div>
                                <p className="text-sm text-emerald-700">{model.description}</p>
                                {model.considerations && (
                                    <p className="text-xs text-emerald-600 mt-2 italic">{model.considerations}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </ExpandableSection>

                {/* MVP Recommendation */}
                <ExpandableSection title="MVP Recommendation" icon={Rocket} accentColor="indigo">
                    <div className="space-y-4">
                        {analysis.mvp_recommendation?.timeline && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-500">Timeline:</span>
                                <span className="font-semibold text-slate-900">{analysis.mvp_recommendation.timeline}</span>
                            </div>
                        )}
                        {analysis.mvp_recommendation?.budget_range && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-500">Budget:</span>
                                <span className="font-semibold text-slate-900">{analysis.mvp_recommendation.budget_range}</span>
                            </div>
                        )}
                        {analysis.mvp_recommendation?.core_features && (
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Core Features</h4>
                                <ul className="space-y-2">
                                    {analysis.mvp_recommendation.core_features.map((feat, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                            <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {analysis.mvp_recommendation?.nice_to_have && (
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Nice to Have</h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.mvp_recommendation.nice_to_have.map((feat, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                                            {feat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {analysis.mvp_recommendation?.tech_stack && (
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <h4 className="text-sm font-semibold text-indigo-700 mb-1">Recommended Tech Stack</h4>
                                <p className="text-indigo-600 text-sm">{analysis.mvp_recommendation.tech_stack}</p>
                            </div>
                        )}
                    </div>
                </ExpandableSection>

                {/* Execution Plan */}
                <ExpandableSection title="Execution Plan" icon={ClipboardList} accentColor="rose">
                    <div className="space-y-6">
                        {analysis.execution_plan ? (
                            analysis.execution_plan.map((phase, i) => (
                                <div key={i} className="relative pl-6 border-l-2 border-rose-200 last:border-0 pb-6 last:pb-0">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-rose-100 border-2 border-rose-500"></div>
                                    <h4 className="font-bold text-slate-900 mb-3">{phase.phase}</h4>
                                    <ul className="space-y-3">
                                        {phase.steps.map((step, j) => (
                                            <li key={j} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <div className="bg-white rounded-full p-1 shadow-sm mt-0.5">
                                                    <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-rose-600">
                                                        {j + 1}
                                                    </span>
                                                </div>
                                                <span className="text-slate-700 text-sm">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 italic">No execution plan available for this idea.</p>
                        )}
                    </div>
                </ExpandableSection>

                {/* Growth Strategy */}
                <ExpandableSection title="Growth Strategy" icon={TrendingUp} accentColor="orange">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                <h4 className="text-sm font-semibold text-orange-700 mb-2">Short Term (0-6 mo)</h4>
                                <p className="text-sm text-orange-600">{analysis.growth_strategy?.short_term}</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <h4 className="text-sm font-semibold text-amber-700 mb-2">Medium Term (6-18 mo)</h4>
                                <p className="text-sm text-amber-600">{analysis.growth_strategy?.medium_term}</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <h4 className="text-sm font-semibold text-emerald-700 mb-2">Long Term (18+ mo)</h4>
                                <p className="text-sm text-emerald-600">{analysis.growth_strategy?.long_term}</p>
                            </div>
                        </div>
                        {analysis.growth_strategy?.key_metrics && (
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Key Metrics to Track</h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.growth_strategy.key_metrics.map((metric, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                            {metric}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </ExpandableSection>
            </div>
        </div>
    );
}
