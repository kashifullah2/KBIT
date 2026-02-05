import React, { useState, useEffect } from 'react';
import { CVForm } from '../components/cv/CVForm.jsx';
import { CVPreview } from '../components/cv/CVPreview.jsx';
import { Download, Save, Loader2, Palette, Type, ChevronDown, Trash2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';

import { AuthModal } from '../components/AuthModal.jsx';

// Color and Font Options
const COLOR_OPTIONS = [
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Rose', value: '#e11d48' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Amber', value: '#d97706' },
];

const FONT_OPTIONS = [
    { name: 'Inter', value: "'Inter', sans-serif" },
    { name: 'Roboto', value: "'Roboto', sans-serif" },
    { name: 'Playfair', value: "'Playfair Display', serif" },
    { name: 'Lora', value: "'Lora', serif" },
    { name: 'Montserrat', value: "'Montserrat', sans-serif" },
];

export function CVBuilder() {
    const { token, isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // 'save' or 'print'

    const [cvData, setCvData] = useState({
        personal: {
            fullName: "John Doe",
            jobTitle: "Senior Software Engineer",
            email: "john.doe@example.com",
            phone: "+1 234 567 890",
            address: "San Francisco, CA",
            linkedin: "linkedin.com/in/johndoe",
            website: "johndoe.dev",
            summary: "Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Expertise in React, Node.js, and cloud technologies. Passionate about clean code, agile methodologies, and mentoring junior developers. Successfully delivered 20+ projects that improved user engagement by 40%."
        },
        experience: [
            {
                title: "Senior Software Engineer",
                company: "TechCorp Inc.",
                startDate: "Jan 2021",
                endDate: "Present",
                description: "• Led development of microservices architecture serving 2M+ daily users\n• Reduced API response time by 60% through optimization and caching strategies\n• Mentored team of 5 junior developers, improving code quality by 35%\n• Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes"
            },
            {
                title: "Software Engineer",
                company: "StartupXYZ",
                startDate: "Mar 2018",
                endDate: "Dec 2020",
                description: "• Built React-based dashboard used by 500+ enterprise clients\n• Developed RESTful APIs handling 100K+ requests per hour\n• Collaborated with product team to define technical requirements\n• Achieved 95% unit test coverage across all modules"
            },
            {
                title: "Junior Developer",
                company: "WebAgency",
                startDate: "Jun 2016",
                endDate: "Feb 2018",
                description: "• Developed responsive websites for 30+ small business clients\n• Maintained and updated legacy PHP applications\n• Participated in daily standups and sprint planning sessions"
            }
        ],
        education: [
            {
                degree: "Master of Science in Computer Science",
                school: "Stanford University",
                year: "2016"
            },
            {
                degree: "Bachelor of Science in Software Engineering",
                school: "University of California, Berkeley",
                year: "2014"
            }
        ],
        skills: [
            "React.js",
            "Node.js",
            "TypeScript",
            "Python",
            "AWS",
            "Docker",
            "PostgreSQL",
            "MongoDB",
            "GraphQL",
            "Git"
        ],
        projects: [],
        customSections: [
            {
                title: "Certifications",
                items: [
                    {
                        title: "AWS Solutions Architect Professional",
                        description: "Amazon Web Services • Issued Dec 2023"
                    },
                    {
                        title: "Google Cloud Professional Developer",
                        description: "Google Cloud • Issued Aug 2022"
                    }
                ]
            }
        ]
    });

    const [activeTemplate, setActiveTemplate] = useState('modern');
    const [mobileTab, setMobileTab] = useState('editor');
    const [isSaving, setIsSaving] = useState(false);
    const printRef = React.useRef();

    // Customization state
    const [primaryColor, setPrimaryColor] = useState('#4f46e5');
    const [fontFamily, setFontFamily] = useState("'Inter', sans-serif");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showFontPicker, setShowFontPicker] = useState(false);

    // Load Data only if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const loadCV = async () => {
                try {
                    const response = await axios.get(`${API_URL}/cv/load`);
                    if (response.data.content) {
                        setCvData(response.data.content);
                    }
                } catch (error) {
                    console.error("Failed to load CV", error);
                }
            };
            loadCV();
        }
    }, [isAuthenticated]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowColorPicker(false);
            setShowFontPicker(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const performSave = async () => {
        setIsSaving(true);
        try {
            await axios.post(`${API_URL}/cv/save`, {
                content: cvData,
                filename: "My Resume"
            });
            console.log("CV Saved Successfully");
        } catch (error) {
            console.error("Failed to save CV", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = () => {
        if (!isAuthenticated) {
            setPendingAction('save');
            setIsAuthModalOpen(true);
            return;
        }
        performSave();
    };

    const performPrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: cvData.personal?.fullName ? cvData.personal.fullName.split(' ')[0] : 'Resume',
        pageStyle: `
            @page {
                size: auto;
                margin: 15mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                }
            }
        `,
    });

    const handlePrint = () => {
        if (!isAuthenticated) {
            setPendingAction('print');
            setIsAuthModalOpen(true);
            return;
        }
        performPrint();
    };

    const handleAuthSuccess = () => {
        if (pendingAction === 'save') {
            // We need to wait a bit for token to be set in context/axios
            setTimeout(performSave, 500);
        } else if (pendingAction === 'print') {
            setTimeout(performPrint, 500);
        }
        setPendingAction(null);
    };

    const updateSection = (section, data) => {
        setCvData(prev => ({ ...prev, [section]: data }));
    };

    const clearCV = () => {
        if (window.confirm('Are you sure you want to clear all CV data? This cannot be undone.')) {
            setCvData({
                personal: {
                    fullName: '',
                    jobTitle: '',
                    email: '',
                    phone: '',
                    address: '',
                    linkedin: '',
                    website: '',
                    summary: ''
                },
                experience: [],
                education: [],
                skills: [],
                projects: [],
                customSections: []
            });
        }
    };

    const customization = {
        primaryColor,
        fontFamily
    };

    return (
        <div className="h-[calc(100vh-4rem)] md:h-full flex flex-col md:flex-row overflow-hidden relative bg-slate-50/50">
            {/* Mobile Tab Switcher */}
            <div className="md:hidden flex p-1 bg-white border-b border-slate-200 shrink-0">
                <button
                    onClick={() => setMobileTab('editor')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${mobileTab === 'editor' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
                >
                    Editor
                </button>
                <button
                    onClick={() => setMobileTab('preview')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${mobileTab === 'preview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
                >
                    Preview
                </button>
            </div>

            {/* Left Panel - Editor */}
            <div className={`w-full md:w-[45%] lg:w-[40%] xl:w-[35%] flex-col h-full bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 md:flex ${mobileTab === 'editor' ? 'flex' : 'hidden'}`}>
                <div className="p-5 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-slate-800 text-lg">Editor</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Customize your potential</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isSaving ? (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                            </span>
                        ) : (
                            <span className="text-xs font-medium text-slate-400 px-2.5 py-1">All changes saved</span>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-24 md:pb-8 space-y-6">
                    <CVForm data={cvData} onUpdate={updateSection} />
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className={`flex-1 bg-slate-100/50 relative overflow-hidden flex flex-col ${mobileTab === 'preview' ? 'flex h-full' : 'hidden md:flex'}`}>
                {/* Floating Toolbar - Responsive */}
                <div className="absolute top-3 md:top-6 left-2 right-2 md:left-1/2 md:right-auto md:-translate-x-1/2 z-30">
                    {/* Mobile: Full width scrollable / Desktop: Centered pill */}
                    <div className="flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-sm shadow-lg shadow-slate-200/50 border border-slate-200/60 rounded-xl md:rounded-full overflow-x-auto scrollbar-hide">
                        {/* Template Selector */}
                        <div className="flex items-center shrink-0 border-r border-slate-200/60 pr-1.5 mr-0.5">
                            {['modern', 'classic', 'creative', 'executive'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setActiveTemplate(t)}
                                    className={`px-2 py-1.5 text-[10px] font-medium rounded-lg md:rounded-full transition-all capitalize whitespace-nowrap ${activeTemplate === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Color Picker */}
                        <div className="relative shrink-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowColorPicker(!showColorPicker);
                                    setShowFontPicker(false);
                                }}
                                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg md:rounded-full transition-colors flex items-center gap-1"
                                title="Change Color"
                            >
                                <Palette className="w-4 h-4" />
                                <div
                                    className="w-3 h-3 rounded-full border border-slate-300"
                                    style={{ backgroundColor: primaryColor }}
                                />
                            </button>
                            {showColorPicker && (
                                <div
                                    className="absolute top-full mt-2 left-0 md:left-auto md:right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 min-w-[160px] z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <p className="text-xs font-medium text-slate-500 mb-2">Accent Color</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {COLOR_OPTIONS.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => {
                                                    setPrimaryColor(color.value);
                                                    setShowColorPicker(false);
                                                }}
                                                className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${primaryColor === color.value ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Font Picker */}
                        <div className="relative shrink-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFontPicker(!showFontPicker);
                                    setShowColorPicker(false);
                                }}
                                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg md:rounded-full transition-colors flex items-center gap-0.5"
                                title="Change Font"
                            >
                                <Type className="w-4 h-4" />
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            {showFontPicker && (
                                <div
                                    className="absolute top-full mt-2 left-0 md:left-auto md:right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-2 min-w-[160px] z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <p className="text-xs font-medium text-slate-500 mb-2 px-2">Font Family</p>
                                    {FONT_OPTIONS.map((font) => (
                                        <button
                                            key={font.value}
                                            onClick={() => {
                                                setFontFamily(font.value);
                                                setShowFontPicker(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${fontFamily === font.value ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'}`}
                                            style={{ fontFamily: font.value }}
                                        >
                                            {font.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="shrink-0 h-5 w-px bg-slate-200 hidden md:block" />

                        <button
                            onClick={clearCV}
                            className="shrink-0 p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg md:rounded-full transition-colors"
                            title="Clear All"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="shrink-0 p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg md:rounded-full transition-colors"
                            title="Save"
                        >
                            <Save className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handlePrint}
                            className="shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg md:rounded-full shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap"
                        >
                            <Download className="w-3.5 h-3.5" /> Export
                        </button>
                    </div>
                </div>

                {/* Preview Canvas */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-12 flex justify-center items-start">
                    <div className="transform scale-[0.35] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.7] xl:scale-[0.8] origin-top transition-all duration-300 mt-20 md:mt-16 shadow-2xl shadow-slate-400/20">
                        <CVPreview ref={printRef} data={cvData} template={activeTemplate} customization={customization} />
                    </div>
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => {
                    setIsAuthModalOpen(false);
                    setPendingAction(null);
                }}
                onSuccess={handleAuthSuccess}
            />
        </div >
    );
}
