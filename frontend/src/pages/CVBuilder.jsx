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
    { name: 'Slate', value: '#334155' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Amber', value: '#d97706' },
    { name: 'Yellow', value: '#ca8a04' },
    { name: 'Lime', value: '#65a30d' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Cyan', value: '#0891b2' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Pink', value: '#db2777' },
    { name: 'Rose', value: '#e11d48' },
];

const SIDEBAR_COLOR_OPTIONS = [
    { name: 'Dark Slate', value: '#1e293b' },
    { name: 'Charcoal', value: '#2d3748' },
    { name: 'Navy', value: '#1e3a8a' },
    { name: 'Forest', value: '#14532d' },
    { name: 'Burgundy', value: '#7f1d1d' },
    { name: 'Eggplant', value: '#581c87' },
    { name: 'Teal Dark', value: '#134e4a' },
    { name: 'Light Gray', value: '#f1f5f9' },
    { name: 'Cream', value: '#fef3c7' },
    { name: 'Ice Blue', value: '#dbeafe' },
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
            photo: "",
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
    const [sidebarColor, setSidebarColor] = useState('#1e293b');
    const [fontFamily, setFontFamily] = useState("'Inter', sans-serif");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showSidebarColorPicker, setShowSidebarColorPicker] = useState(false);
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
            setShowSidebarColorPicker(false);
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

    const customization = {
        primaryColor,
        sidebarColor,
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
                {/* Professional Responsive Toolbar */}
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
                    <div className="px-2 sm:px-4 py-2 flex items-center justify-center">
                        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-wrap sm:flex-nowrap justify-center">
                            {/* Template Selector */}
                            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 sm:p-1">
                                {['modern', 'classic', 'creative', 'executive', 'professional', 'minimal'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setActiveTemplate(t)}
                                        className={`px-2 sm:px-3 lg:px-4 py-1.5 text-[11px] sm:text-xs font-medium rounded-md transition-all capitalize ${activeTemplate === t
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-900'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="hidden sm:block h-6 w-px bg-slate-200" />

                            {/* Accent Color Picker */}
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => {
                                        setShowColorPicker(!showColorPicker);
                                        setShowSidebarColorPicker(false);
                                        setShowFontPicker(false);
                                    }}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-indigo-600 bg-slate-100 sm:bg-transparent hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="Accent Color"
                                >
                                    <Palette className="w-4 h-4" />
                                    <div
                                        className="w-4 h-4 rounded border-2 border-white shadow-sm"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                {showColorPicker && (
                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 min-w-[200px]">
                                        <p className="text-xs font-semibold text-slate-700 mb-3">Accent Color</p>
                                        <div className="grid grid-cols-5 gap-2">
                                            {COLOR_OPTIONS.map((color) => (
                                                <button
                                                    key={color.value}
                                                    onClick={() => {
                                                        setPrimaryColor(color.value);
                                                        setShowColorPicker(false);
                                                    }}
                                                    className={`w-8 h-8 rounded-lg transition-all hover:scale-110 ${primaryColor === color.value ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:shadow-md'}`}
                                                    style={{ backgroundColor: color.value }}
                                                    title={color.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Color Picker (for Creative and Modern templates) */}
                            {(activeTemplate === 'creative' || activeTemplate === 'modern') && (
                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => {
                                            setShowSidebarColorPicker(!showSidebarColorPicker);
                                            setShowColorPicker(false);
                                            setShowFontPicker(false);
                                        }}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-indigo-600 bg-slate-100 sm:bg-transparent hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Sidebar Color"
                                    >
                                        <div className="w-4 h-4 rounded-l-lg border-2 border-white shadow-sm" style={{ backgroundColor: sidebarColor }} />
                                        <ChevronDown className="w-3 h-3" />
                                    </button>
                                    {showSidebarColorPicker && (
                                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 min-w-[200px]">
                                            <p className="text-xs font-semibold text-slate-700 mb-3">Sidebar Color</p>
                                            <div className="grid grid-cols-5 gap-2">
                                                {SIDEBAR_COLOR_OPTIONS.map((color) => (
                                                    <button
                                                        key={color.value}
                                                        onClick={() => {
                                                            setSidebarColor(color.value);
                                                            setShowSidebarColorPicker(false);
                                                        }}
                                                        className={`w-8 h-8 rounded-lg transition-all hover:scale-110 ${sidebarColor === color.value ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:shadow-md'}`}
                                                        style={{ backgroundColor: color.value }}
                                                        title={color.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Font Picker */}
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => {
                                        setShowFontPicker(!showFontPicker);
                                        setShowColorPicker(false);
                                        setShowSidebarColorPicker(false);
                                    }}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-indigo-600 bg-slate-100 sm:bg-transparent hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="Change Font"
                                >
                                    <Type className="w-4 h-4" />
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                {showFontPicker && (
                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 min-w-[160px] z-50">
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

                            <div className="hidden sm:block h-6 w-px bg-slate-200" />

                            {/* Action Buttons */}
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to clear all CV data?')) {
                                        setCvData({
                                            personal: { fullName: '', jobTitle: '', email: '', phone: '', address: '', linkedin: '', website: '', summary: '' },
                                            experience: [],
                                            education: [],
                                            skills: [],
                                            projects: [],
                                            customSections: []
                                        });
                                    }
                                }}
                                className="p-2 text-slate-500 hover:text-red-600 bg-slate-100 sm:bg-transparent hover:bg-red-50 rounded-lg transition-colors"
                                title="Clear All"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="p-2 text-slate-500 hover:text-indigo-600 bg-slate-100 sm:bg-transparent hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Save"
                            >
                                <Save className="w-4 h-4" />
                            </button>

                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm transition-all"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Export PDF</span>
                                <span className="sm:hidden">PDF</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Canvas */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-8 lg:p-12 flex justify-center items-start">
                    <div className="transform scale-[0.4] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.75] xl:scale-[0.85] origin-top transition-all duration-300 shadow-2xl shadow-slate-400/20">
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
        </div>
    );
}
