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

    return (
        <div className="h-full flex flex-col md:flex-row gap-6">
            {/* Left Panel - Editor */}
            <div className="w-full md:w-1/2 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-700">Editor</h2>
                    <div className="text-xs text-slate-500">Auto-saving...</div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <CVForm data={cvData} onUpdate={updateSection} />
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-full md:w-1/2 flex flex-col h-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative min-w-0">
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
                    </div>
                    <button
                        onClick={handlePrint}
                        className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex items-start justify-center">
                    <div className="transform scale-[0.45] sm:scale-[0.55] md:scale-[0.5] lg:scale-[0.6] xl:scale-[0.75] 2xl:scale-[0.9] origin-top transition-transform duration-300 mb-20">
                        <CVPreview ref={printRef} data={cvData} template={activeTemplate} />
                    </div>
                </div>
            </div>
        </div>
    );
}
