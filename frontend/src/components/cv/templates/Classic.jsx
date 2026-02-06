import React from 'react';

export const Classic = React.forwardRef(({ data, customization = {} }, ref) => {
    const { personal, experience, education, skills, customSections } = data;
    const primaryColor = customization.primaryColor || '#1e293b';
    const fontFamily = customization.fontFamily || "'Playfair Display', serif";

    return (
        <div ref={ref} className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-12 shadow-lg mx-auto print-p-0" style={{ fontFamily }}>
            {/* Header */}
            <header className="border-b pb-4 mb-6 text-center break-inside-avoid" style={{ borderColor: primaryColor }}>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                    {personal.fullName || 'Your Name'}
                </h1>
                <p className="text-lg italic mb-2" style={{ color: primaryColor }}>{personal.jobTitle || 'Professional Title'}</p>

                <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-600">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>| {personal.phone}</span>}
                    {personal.address && <span>| {personal.address}</span>}
                    {personal.linkedin && <span>| {personal.linkedin}</span>}
                </div>
            </header>

            {/* Summary */}
            {personal.summary && (
                <section className="mb-6 break-inside-avoid">
                    <h2 className="text-lg font-bold border-b mb-2 pb-1 uppercase tracking-wide" style={{ borderColor: primaryColor, color: primaryColor }}>Professional Summary</h2>
                    <p className="text-slate-800 leading-relaxed text-sm">
                        {personal.summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold border-b mb-3 pb-1 uppercase tracking-wide" style={{ borderColor: primaryColor, color: primaryColor }}>Experience</h2>
                    <div className="space-y-4">
                        {experience.map((exp, index) => (
                            <div key={index} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-bold text-slate-900 text-base">{exp.title}</h3>
                                    <span className="text-sm text-slate-600 italic">
                                        {exp.startDate} - {exp.endDate}
                                    </span>
                                </div>
                                <div className="text-slate-700 font-semibold text-sm mb-1">{exp.company}</div>
                                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold border-b mb-3 pb-1 uppercase tracking-wide" style={{ borderColor: primaryColor, color: primaryColor }}>Education</h2>
                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={index} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-slate-900">{edu.school}</h3>
                                    <span className="text-sm text-slate-600 italic">{edu.year}</span>
                                </div>
                                <div className="text-slate-700 text-sm">{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && skills.some(s => s.trim()) && (
                <section className="mb-6 break-inside-avoid">
                    <h2 className="text-lg font-bold border-b mb-3 pb-1 uppercase tracking-wide" style={{ borderColor: primaryColor, color: primaryColor }}>Skills</h2>
                    <div className="text-sm text-slate-800 leading-relaxed">
                        {skills.filter(s => s.trim()).join(' • ')}
                    </div>
                </section>
            )}

            {/* Custom Sections */}
            {customSections && customSections.map((section, index) => (
                <section key={index} className="mb-6">
                    <h2 className="text-lg font-bold border-b mb-3 pb-1 uppercase tracking-wide" style={{ borderColor: primaryColor, color: primaryColor }}>{section.title}</h2>
                    <div className="space-y-3">
                        {section.items.map((item, idx) => (
                            <div key={idx} className="break-inside-avoid">
                                <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
});

Classic.displayName = 'ClassicTemplate';
