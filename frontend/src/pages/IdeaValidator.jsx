import React, { useState } from 'react';
import { Lightbulb, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { IdeaForm } from '../components/idea/IdeaForm';
import { IdeaResults } from '../components/idea/IdeaResults';
import { ExportOptions } from '../components/idea/ExportOptions';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

export function IdeaValidator() {
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [ideaTitle, setIdeaTitle] = useState('');

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        setError(null);
        setIdeaTitle(formData.title);

        try {
            const response = await fetch(`${API_URL}/idea/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(localStorage.getItem('token') && {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    })
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Validation failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error('Validation error:', err);
            setError(err.message || 'Failed to validate idea. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
        setIdeaTitle('');
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-4xl mx-auto pt-16 md:pt-24 px-4">
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl text-balance">
                    Validate Your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                        Business Idea
                    </span>
                </h2>

                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed text-balance">
                    Get instant AI-powered analysis of your startup idea. Understand market potential, risks, and actionable next steps.
                </p>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4">
                {!result ? (
                    <>
                        {/* Form Card */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl shadow-lg shadow-indigo-500/25">
                                    <Lightbulb className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Describe Your Idea</h3>
                                    <p className="text-sm text-slate-500">Fill in the details below for a comprehensive analysis</p>
                                </div>
                            </div>

                            <IdeaForm onSubmit={handleSubmit} isLoading={isLoading} />

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Features */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: Sparkles, title: 'AI Analysis', desc: 'Powered by advanced LLM for accurate insights' },
                                { icon: ArrowRight, title: 'Actionable Advice', desc: 'Get specific steps to improve your idea' },
                                { icon: RefreshCw, title: 'Iterate & Refine', desc: 'Continuously improve with AI suggestions' }
                            ].map((feature, i) => (
                                <div key={i} className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100">
                                    <feature.icon className="w-8 h-8 text-indigo-600 mb-4" />
                                    <h4 className="font-semibold text-slate-900 mb-2">{feature.title}</h4>
                                    <p className="text-sm text-slate-500">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Results Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">{ideaTitle}</h3>
                                <p className="text-slate-500">Analysis Results</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <ExportOptions
                                    ideaId={result.id}
                                    analysis={result.analysis}
                                    ideaTitle={ideaTitle}
                                />
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    New Idea
                                </button>
                            </div>
                        </div>

                        {/* Save Status */}
                        {result.saved ? (
                            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Analysis saved to your account. Access it anytime from your history.
                            </div>
                        ) : !isAuthenticated && (
                            <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm">
                                💡 Sign in to save your analysis and access it later.
                            </div>
                        )}

                        {/* Results */}
                        <IdeaResults analysis={result.analysis} />
                    </>
                )}
            </div>
        </div>
    );
}
