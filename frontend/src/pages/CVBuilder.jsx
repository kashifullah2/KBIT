import React, { useState, useEffect } from 'react';
import { CVForm } from '../components/cv/CVForm.jsx';
import { CVPreview } from '../components/cv/CVPreview.jsx';
import { Download, Save, Loader2, Share2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';

import { AuthModal } from '../components/AuthModal.jsx';

export function CVBuilder() {
    const { token, isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // 'save' or 'print'

    const [cvData, setCvData] = useState({
        personal: {
            fullName: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 234 567 890",
            address: "New York, USA",
            linkedin: "linkedin.com/in/johndoe",
            website: "johndoe.com",
            summary: "Experienced software engineer with a passion for building scalable web applications."
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        customSections: []
    });

    const [activeTemplate, setActiveTemplate] = useState('modern');
    const [mobileTab, setMobileTab] = useState('editor');
    const [isSaving, setIsSaving] = useState(false);
    const printRef = React.useRef();

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
                {/* Floating Toolbar */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 p-1.5 bg-white/90 backdrop-blur-sm shadow-lg shadow-slate-200/50 border border-slate-200/60 rounded-full transition-all hover:scale-[1.01]">
                    <div className="flex items-center px-1 border-r border-slate-200/60 pr-2 mr-1">
                        {['modern', 'classic', 'creative'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setActiveTemplate(t)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all capitalize ${activeTemplate === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative group"
                        title="Save"
                    >
                        <Save className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handlePrint}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-full shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
                    >
                        <Download className="w-3.5 h-3.5" /> Export PDF
                    </button>
                </div>

                {/* Preview Canvas */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 flex justify-center items-start perspective-1000">
                    <div className="transform scale-[0.4] sm:scale-[0.55] md:scale-[0.6] lg:scale-[0.7] xl:scale-[0.8] origin-top transition-all duration-300 mt-16 md:mt-12 shadow-2xl shadow-slate-400/20">
                        <CVPreview ref={printRef} data={cvData} template={activeTemplate} />
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
