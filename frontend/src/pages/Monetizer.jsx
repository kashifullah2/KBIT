import React, { useState } from 'react';
import {
    TrendingUp,
    Briefcase,
    ShoppingCart,
    Package,
    X,
    Plus,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    DollarSign,
    Target
} from 'lucide-react';
import { ExecutionPlanModal } from '../components/ExecutionPlanModal';
import { Helmet } from 'react-helmet-async';

export function Monetizer() {
    const [skills, setSkills] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [planTitle, setPlanTitle] = useState('');

    const handleAddSkill = (e) => {
        if ((e.key === 'Enter' || e.type === 'click') && currentInput.trim()) {
            if (!skills.includes(currentInput.trim())) {
                setSkills([...skills, currentInput.trim()]);
            }
            setCurrentInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const generateOpportunities = () => {
        if (skills.length === 0) return;

        setIsAnalyzing(true);
        setResults(null);

        // Simulate AI Analysis
        setTimeout(() => {
            const newResults = analyzeSkills(skills);
            setResults(newResults);
            setIsAnalyzing(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Helmet>
                <title>Skill Monetizer - KBIT</title>
                <meta name="description" content="Turn your skills into income streams. Get personalized freelance, digital product, and service suggestions with KBIT's AI." />
                <meta name="keywords" content="skill monetization, freelance ideas, side hustle, digital products, make money online" />
            </Helmet>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 text-center px-4 border-b border-slate-200 bg-white">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/50 via-slate-50/50 to-slate-50"></div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6 animate-fade-in-up">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Income Strategist</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 animate-fade-in-up delay-100 text-balance">
                    Turn Your Skills Into <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                        Income Streams
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance mb-8 animate-fade-in-up delay-200">
                    Stop learning for free. Enter your skills below, and our AI will generate
                    <span className="font-semibold text-slate-900"> 3 concrete paths</span> to start earning money today.
                </p>

                {/* Skill Input Area */}
                <div className="max-w-xl mx-auto">
                    <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                        {skills.map((skill, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-sm animate-fadeIn">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyDown={handleAddSkill}
                            placeholder="Type a skill (e.g. React, Writing, Photoshop) and press Enter"
                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl shadow-sm text-lg outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                        <button
                            onClick={handleAddSkill}
                            className="absolute right-3 top-3 p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={generateOpportunities}
                        disabled={skills.length === 0 || isAnalyzing}
                        className={`mt-6 w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2
                                ${skills.length === 0
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-500/25 hover:-translate-y-0.5'
                            }`}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Analyzing Market Opportunities...
                            </>
                        ) : (
                            <>
                                <TrendingUp className="w-5 h-5" />
                                Generate Income Paths
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {results && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeInUp">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">We found 3 High-Value Opportunities</h2>
                        <p className="text-slate-600">Based on your unique skill combination</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Path 1: Freelance */}
                        <OpportunityCard
                            icon={<Briefcase className="w-6 h-6 text-blue-600" />}
                            color="blue"
                            title="Freelance Path"
                            subtitle="Immediate Cash Flow"
                            data={results.freelance}
                            onViewPlan={() => {
                                setSelectedPlan(results.freelance.executionPlan);
                                setPlanTitle(results.freelance.title);
                            }}
                        />

                        {/* Path 2: Product */}
                        <OpportunityCard
                            icon={<Package className="w-6 h-6 text-purple-600" />}
                            color="purple"
                            title="Digital Product"
                            subtitle="Passive Income Asset"
                            data={results.product}
                            onViewPlan={() => {
                                setSelectedPlan(results.product.executionPlan);
                                setPlanTitle(results.product.title);
                            }}
                        />

                        {/* Path 3: Service */}
                        <OpportunityCard
                            icon={<Target className="w-6 h-6 text-orange-600" />}
                            color="orange"
                            title="Service Bundle"
                            subtitle="High-Ticket Offer"
                            data={results.service}
                            onViewPlan={() => {
                                setSelectedPlan(results.service.executionPlan);
                                setPlanTitle(results.service.title);
                            }}
                        />
                    </div>
                </div>
            )
            }

            <ExecutionPlanModal
                isOpen={!!selectedPlan}
                onClose={() => setSelectedPlan(null)}
                plan={selectedPlan}
                title={planTitle}
            />
        </div >
    );
}

function OpportunityCard({ icon, color, title, subtitle, data, onViewPlan }) {
    const colorClasses = {
        blue: "bg-blue-50 border-blue-100 text-blue-700",
        purple: "bg-purple-50 border-purple-100 text-purple-700",
        orange: "bg-orange-50 border-orange-100 text-orange-700"
    };

    const btnClasses = {
        blue: "bg-blue-600 hover:bg-blue-700",
        purple: "bg-purple-600 hover:bg-purple-700",
        orange: "bg-orange-600 hover:bg-orange-700"
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className={`p-6 border-b ${colorClasses[color]} bg-opacity-40`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{title}</h3>
                        <p className="text-xs font-medium uppercase tracking-wider opacity-80">{subtitle}</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{data.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{data.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                        <div className="mt-1"><DollarSign className="w-4 h-4 text-emerald-600" /></div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase">Potential Earnings</p>
                            <p className="font-bold text-slate-900">{data.earnings}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase">First Step</p>
                            <p className="text-sm text-slate-700">{data.firstStep}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onViewPlan}
                    className={`w-full py-3 rounded-lg text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors ${btnClasses[color]}`}
                >
                    View Execution Plan <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// Logic to generate opportunities based on skills
function analyzeSkills(skills) {
    const s = skills.map(skill => skill.toLowerCase());

    // Default / Fallback
    let result = {
        freelance: {
            title: "Virtual Technical Assistant",
            description: "Offer administrative and technical support to business owners using your diverse skill set.",
            earnings: "$20 - $40 / hour",
            firstStep: "Create a profile on Upwork highlighting your adaptability.",
            executionPlan: [
                {
                    phase: "Week 1: Foundation",
                    steps: [
                        { action: "Optimize LinkedIn Profile", tip: "Highlight 'Technical Virtual Assistant' in your headline." },
                        { action: "Create Upwork Account", tip: "Take relevant skill tests to boost credibility." }
                    ]
                },
                {
                    phase: "Week 2: Outreach",
                    steps: [
                        { action: "Apply to 5 jobs daily", tip: "Customize your cover letter for each application." },
                        { action: "Network regarding VA groups", tip: "Join Facebook groups for VAs and entrepreneurs." }
                    ]
                }
            ]
        },
        product: {
            title: "Beginner's Guide E-Book",
            description: "Write a comprehensive guide on how to get started with your specific set of skills.",
            earnings: "$15 - $30 per sale",
            firstStep: "Outline the chapters based on common beginner questions.",
            executionPlan: [
                {
                    phase: "Phase 1: Drafting",
                    steps: [
                        { action: "Outline core chapters", tip: "Focus on the top 5 questions beginners ask." },
                        { action: "Write 1000 words/day", tip: "Don't edit while writing. Just get it down." }
                    ]
                },
                {
                    phase: "Phase 2: Packaging",
                    steps: [
                        { action: "Design cover on Canva", tip: "Use bold typography and high-contrast colors." },
                        { action: "Format PDF", tip: "Ensure it's readable on mobile devices." }
                    ]
                }
            ]
        },
        service: {
            title: "Project Management Service",
            description: "Manage small projects for clients, ensuring their tasks are completed on time.",
            earnings: "$500 - $1500 per project",
            firstStep: "Offer to manage a small project for a friend or local business for free/discount.",
            executionPlan: [
                {
                    phase: "Phase 1: Portfolio Building",
                    steps: [
                        { action: "Define service scope", tip: "Be clear about what you do and don't do." },
                        { action: "Secure first beta client", tip: "Offer a discount in exchange for a testimonial." }
                    ]
                },
                {
                    phase: "Phase 2: Launch",
                    steps: [
                        { action: "Set up Trello/Asana templates", tip: "Show clients you are organized from day 1." },
                        { action: "Cold outreach to small agencies", tip: "They often need help managing overflow work." }
                    ]
                }
            ]
        }
    };

    // Tech / Dev Focused
    if (s.some(k => ['react', 'python', 'javascript', 'node', 'code', 'web', 'dev'].some(t => k.includes(t)))) {
        result = {
            freelance: {
                title: "Frontend/Backend Bug Fixer",
                description: `Use your ${skills[0]} skills to fix specific bugs or build small components for existing agency projects.`,
                earnings: "$40 - $100 / hour",
                firstStep: "Search for 'urgent bug fix' on Upwork or freelance platforms.",
                executionPlan: [
                    {
                        phase: "Week 1: Setup",
                        steps: [
                            { action: "Create a 'Bug Fixer' portfolio", tip: "Showcase before/after examples of fixes." },
                            { action: "Set up alerts for 'urgent' jobs", tip: "Be the first to apply to urgent postings." }
                        ]
                    }
                ]
            },
            product: {
                title: "Code Starter Kits & Templates",
                description: "Build a 'Boilerplate' or 'Starter Kit' that solves a specific problem you've faced repeatedly.",
                earnings: "$49 - $149 per license",
                firstStep: "Identify a repetitive setup task and automate it.",
                executionPlan: [
                    {
                        phase: "Phase 1: Build",
                        steps: [
                            { action: "Identify pain points", tip: "What code do you rewrite in every project?" },
                            { action: "Clean up the codebase", tip: "Add comments and documentation for users." }
                        ]
                    }
                ]
            },
            service: {
                title: "MVP Development for Founders",
                description: "Offer a 'Zero to MVP in 2 Weeks' package for non-technical founders.",
                earnings: "$3,000 - $8,000 per project",
                firstStep: "Create a landing page showcasing 2-3 demo apps.",
                executionPlan: [
                    {
                        phase: "Phase 1: Offer Design",
                        steps: [
                            { action: "Define the stack", tip: "Stick to what you know best (e.g., MERN, Next.js)." },
                            { action: "Create a pricing PDF", tip: "Offer 3 tiers: Basic, Standard, and Premium." }
                        ]
                    }
                ]
            }
        };
    }
    // Design Focused
    else if (s.some(k => ['design', 'figma', 'ui', 'ux', 'logo', 'photoshop'].some(t => k.includes(t)))) {
        result = {
            freelance: {
                title: "Social Media Asset Designer",
                description: "Create high-quality social media carousels and banners for LinkedIn/Twitter creators.",
                earnings: "$25 - $60 / hour",
                firstStep: "DM 5 active creators offering a free sample design.",
                executionPlan: [
                    {
                        phase: "Week 1: Portfolio",
                        steps: [
                            { action: "Create 3 sample carousels", tip: "Redesign posts from top creators to show improvement." },
                            { action: "Optimize Twitter/LinkedIn profile", tip: "Make it clear you offer design services." }
                        ]
                    }
                ]
            },
            product: {
                title: "Premium UI Kit or Icon Set",
                description: "Design a specific UI kit (e.g., 'Finance App UI Kit') and sell it on UI8 or Gumroad.",
                earnings: "$29 - $89 per download",
                firstStep: "Design the first 5 core screens of your kit.",
                executionPlan: [
                    {
                        phase: "Phase 1: Research & Sketching",
                        steps: [
                            { action: "Research popular kits", tip: "Read reviews to see what users are complaining about." },
                            { action: "Sketch initial components", tip: "Ensure consistency in spacing and typography." }
                        ]
                    }
                ]
            },
            service: {
                title: "Landing Page Redesign Audit",
                description: "Offer a video audit service where you roast and improve landing pages for conversion.",
                earnings: "$299 - $599 per audit",
                firstStep: "Record a free audit for a popular SaaS and tweet it.",
                executionPlan: [
                    {
                        phase: "Phase 1: Lead Gen",
                        steps: [
                            { action: "Find landing pages with issues", tip: "Look for ads with poor landing pages." },
                            { action: "Record a 5-min Loom video", tip: "Give value first before asking for money." }
                        ]
                    }
                ]
            }
        };
    }
    // Writing / Content
    else if (s.some(k => ['writing', 'content', 'copy', 'blog', 'seo'].some(t => k.includes(t)))) {
        result = {
            freelance: {
                title: "SEO Blog Content Writer",
                description: "Write in-depth, research-backed articles for B2B SaaS companies.",
                earnings: "$0.10 - $0.30 per word",
                firstStep: "Write 3 samples on Medium about topics you know well.",
                executionPlan: [
                    {
                        phase: "Week 1: Writing Samples",
                        steps: [
                            { action: "Write 3 high-quality articles", tip: "Target keywords related to SaaS marketing." },
                            { action: "Publish on Medium/LinkedIn", tip: "Share your articles in relevant groups." }
                        ]
                    }
                ]
            },
            product: {
                title: "Cold Email Templates Pack",
                description: "Create a set of high-converting email templates for specific industries.",
                earnings: "$27 - $47 per pack",
                firstStep: "Collect the best earning emails you've received or written.",
                executionPlan: [
                    {
                        phase: "Phase 1: Collection",
                        steps: [
                            { action: "Analyze successful emails", tip: "What made you click? What made you reply?" },
                            { action: "Draft 10 templates", tip: "Create templates for different scenarios (e.g., sales, networking)." }
                        ]
                    }
                ]
            },
            service: {
                title: "Newsletter Management",
                description: "Offer to write, format, and send weekly newsletters for busy executives.",
                earnings: "$500 - $1,500 per month/client",
                firstStep: "Create a mock newsletter for a target client and send it to them.",
                executionPlan: [
                    {
                        phase: "Phase 1: Pitching",
                        steps: [
                            { action: "Identify busy executives", tip: "Look for CEOs who post often but have no newsletter." },
                            { action: "Create a sample issue", tip: "Show them exactly what they are missing." }
                        ]
                    }
                ]
            }
        };
    }

    return result;
}
