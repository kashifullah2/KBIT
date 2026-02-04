import React, { useState } from 'react';
import { CVForm } from '../components/cv/CVForm';
import { CVPreview } from '../components/cv/CVPreview';
import { Download, Share2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

export function CVBuilder() {
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
    const printRef = React.useRef();

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: cvData.personal.fullName ? cvData.personal.fullName.split(' ')[0] : 'Resume',
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

    const updateSection = (section, data) => {
        setCvData(prev => ({ ...prev, [section]: data }));
    };

    const [mobileTab, setMobileTab] = useState('editor'); // 'editor' or 'preview'

    return (
        <div className="h-[calc(100vh-4rem)] md:h-full flex flex-col md:flex-row gap-6 overflow-hidden md:overflow-visible relative">
            {/* Mobile Tab Switcher */}
            <div className="md:hidden flex p-1 bg-slate-100 rounded-lg mb-2 shrink-0 mx-4 mt-2">
                <button
                    onClick={() => setMobileTab('editor')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mobileTab === 'editor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >
                    Editor
                </button>
                <button
                    onClick={() => setMobileTab('preview')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mobileTab === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >
                    Preview
                </button>
            </div>

            {/* Left Panel - Editor */}
            <div className={`w-full md:w-1/2 flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden md:flex ${mobileTab === 'editor' ? 'flex' : 'hidden'}`}>
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-700">Editor</h2>
                    <div className="text-xs text-slate-500">Auto-saving...</div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pb-20 md:pb-6">
                    <CVForm data={cvData} onUpdate={updateSection} />
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className={`w-full md:w-1/2 flex-col h-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative min-w-0 md:flex ${mobileTab === 'preview' ? 'flex' : 'hidden'}`}>
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <div className="bg-white rounded-lg p-1 flex shadow-sm border border-slate-200">
                        <button
                            onClick={() => setActiveTemplate('modern')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeTemplate === 'modern' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Modern
                        </button>
                        <button
                            onClick={() => setActiveTemplate('classic')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeTemplate === 'classic' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Classic
                        </button>
                        <button
                            onClick={() => setActiveTemplate('creative')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeTemplate === 'creative' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Creative
                        </button>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 flex items-start justify-center">
                    <div className="transform scale-[0.35] sm:scale-[0.55] md:scale-[0.5] lg:scale-[0.6] xl:scale-[0.75] 2xl:scale-[0.9] origin-top transition-transform duration-300 mb-20 mt-12 md:mt-0">
                        <CVPreview ref={printRef} data={cvData} template={activeTemplate} />
                    </div>
                </div>
            </div>
        </div>
    );
}
