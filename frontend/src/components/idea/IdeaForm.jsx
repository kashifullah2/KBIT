import React, { useState } from 'react';
import {
    Lightbulb,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Target,
    TrendingUp,
    Shield,
    Zap,
    DollarSign,
    Rocket,
    Users,
    BarChart3
} from 'lucide-react';

const INDUSTRY_OPTIONS = [
    "Technology / SaaS",
    "E-commerce / Retail",
    "Healthcare / MedTech",
    "FinTech / Finance",
    "EdTech / Education",
    "Food & Beverage",
    "Real Estate / PropTech",
    "Transportation / Logistics",
    "Entertainment / Media",
    "Agriculture / AgTech",
    "Travel / Hospitality",
    "Manufacturing",
    "Energy / CleanTech",
    "Social Impact / Non-profit",
    "Other"
];

export function IdeaForm({ onSubmit, isLoading }) {
    const [formData, setFormData] = useState({
        title: '',
        problem: '',
        target_users: '',
        industry: 'Technology / SaaS',
        business_model: '',
        target_market: '',
        additional_notes: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.problem.trim()) newErrors.problem = 'Problem description is required';
        if (!formData.target_users.trim()) newErrors.target_users = 'Target users are required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const inputClass = (field) => `
        w-full px-4 py-3 rounded-xl border transition-all duration-200
        ${errors[field]
            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-200 bg-white focus:border-indigo-500 focus:ring-indigo-500/20'
        }
        focus:outline-none focus:ring-4 text-slate-900 placeholder:text-slate-400
    `;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Business Idea Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., AI-Powered Personal Finance Assistant"
                    className={inputClass('title')}
                />
                {errors.title && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.title}
                    </p>
                )}
            </div>

            {/* Problem */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Problem Being Solved <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    rows={3}
                    placeholder="What pain point or problem does your idea address?"
                    className={inputClass('problem')}
                />
                {errors.problem && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.problem}
                    </p>
                )}
            </div>

            {/* Target Users */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Target Users/Customers <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="target_users"
                    value={formData.target_users}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Who are your ideal customers? Be specific about demographics, behaviors, etc."
                    className={inputClass('target_users')}
                />
                {errors.target_users && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.target_users}
                    </p>
                )}
            </div>

            {/* Industry & Market Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Industry Category
                    </label>
                    <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className={inputClass('industry') + ' cursor-pointer'}
                    >
                        {INDUSTRY_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Target Market/Country
                    </label>
                    <input
                        type="text"
                        name="target_market"
                        value={formData.target_market}
                        onChange={handleChange}
                        placeholder="e.g., USA, Europe, Global"
                        className={inputClass('target_market')}
                    />
                </div>
            </div>

            {/* Business Model */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Business Model <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                    type="text"
                    name="business_model"
                    value={formData.business_model}
                    onChange={handleChange}
                    placeholder="e.g., SaaS subscription, Marketplace, Freemium"
                    className={inputClass('business_model')}
                />
            </div>

            {/* Additional Notes */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Additional Notes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                    name="additional_notes"
                    value={formData.additional_notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Any other context, unique advantages, or specific concerns?"
                    className={inputClass('additional_notes')}
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl 
                    shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 
                    transition-all duration-300 hover:-translate-y-0.5
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                    flex items-center justify-center gap-3"
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing Your Idea...
                    </>
                ) : (
                    <>
                        <Lightbulb className="w-5 h-5" />
                        Validate My Idea
                    </>
                )}
            </button>
        </form>
    );
}
