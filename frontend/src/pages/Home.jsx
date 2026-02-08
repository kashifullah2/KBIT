import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    LayoutTemplate,
    FileText,
    Lightbulb,
    Trophy,
    TrendingUp,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Zap
} from 'lucide-react';

export function Home() {
    const features = [
        {
            title: "Data Extractor",
            description: "Extract structured data from documents (PDFs, Images) using advanced OCR and AI.",
            icon: <LayoutTemplate className="w-6 h-6 text-blue-600" />,
            link: "/extractor",
            color: "bg-blue-50 border-blue-100 hover:border-blue-300"
        },
        {
            title: "CV Builder",
            description: "Create professional, ATS-friendly resumes with AI-powered suggestions and modern templates.",
            icon: <FileText className="w-6 h-6 text-emerald-600" />,
            link: "/cv-builder",
            color: "bg-emerald-50 border-emerald-100 hover:border-emerald-300"
        },
        {
            title: "Idea Validator",
            description: "Validate your startup ideas with AI market analysis, SWOT, and viability scoring.",
            icon: <Lightbulb className="w-6 h-6 text-amber-600" />,
            link: "/idea-validator",
            color: "bg-amber-50 border-amber-100 hover:border-amber-300"
        },
        {
            title: "Career Simulator",
            description: "Test your workplace decision-making skills in a high-stakes 7-day role simulation.",
            icon: <Trophy className="w-6 h-6 text-purple-600" />,
            link: "/career-simulator",
            color: "bg-purple-50 border-purple-100 hover:border-purple-300"
        },
        {
            title: "Skill Monetizer",
            description: "Discover how to turn your skills into income streams with personalized gig suggestions.",
            icon: <TrendingUp className="w-6 h-6 text-rose-600" />,
            link: "/monetizer",
            color: "bg-rose-50 border-rose-100 hover:border-rose-300"
        }
    ];

    return (
        <>
            <Helmet>
                <title>KBIT - The Ultimate AI Productivity Platform</title>
                <meta name="description" content="Boost your productivity with KBIT's suite of AI tools: Document Extractor, CV Builder, Idea Validator, Career Simulator, and Skill Monetizer." />
                <meta name="keywords" content="AI tools, CV builder, OCR, business idea validator, career simulation, productivity platform" />
            </Helmet>

            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50/50 to-slate-50"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8 animate-fade-in-up">
                            <Sparkles className="w-4 h-4" />
                            <span>Powering the Next Generation of Work</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 animate-fade-in-up delay-100">
                            Your All-in-One <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                                AI Productivity Suite
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
                            KBIT brings together powerful AI tools to help you extract data, build careers, validate ideas, and monetize your skills—all in one place.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                            <Link
                                to="/cv-builder"
                                className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2"
                            >
                                <Zap className="w-5 h-5 fill-current" />
                                Build Your CV
                            </Link>
                            <Link
                                to="/idea-validator"
                                className="px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2"
                            >
                                Validate Idea
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need to Succeed</h2>
                            <p className="text-lg text-slate-500">Explore our suite of intelligent tools designed to accelerate your growth.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, idx) => (
                                <Link
                                    key={idx}
                                    to={feature.link}
                                    className={`group p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${feature.color}`}
                                >
                                    <div className="mb-6 inline-block p-4 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        {feature.title}
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust/Social Proof Section (Optional but good for SEO/Credibility) */}
                <section className="py-20 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Why Choose KBIT?</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">AI-Powered</h3>
                                <p className="text-slate-500 text-sm">Leveraging state-of-the-art LLMs for accurate results.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Privacy First</h3>
                                <p className="text-slate-500 text-sm">Your data is processed securely and never shared.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Free to Use</h3>
                                <p className="text-slate-500 text-sm">Access powerful tools without subscription fees.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
