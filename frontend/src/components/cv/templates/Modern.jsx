import React from 'react';

export const Modern = React.forwardRef(({ data }, ref) => {
    const { personal, experience, education, skills } = data;

    return (
        <div ref={ref} className="w-[210mm] min-h-[297mm] bg-white text-slate-800 p-12 shadow-lg mx-auto">
            {/* Header */}
            <header className="border-b-2 border-slate-800 pb-6 mb-8">
                <h1 className="text-4xl font-bold uppercase tracking-wide text-slate-900 mb-2">
                    {personal.fullName || 'Your Name'}
                </h1>
                <p className="text-xl text-slate-600 font-light mb-4">{personal.jobTitle || 'Professional Title'}</p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>• {personal.phone}</span>}
                    {personal.address && <span>• {personal.address}</span>}
                    {personal.linkedin && <span>• {personal.linkedin}</span>}
                </div>
            </header>

            {/* Summary */}
            {personal.summary && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Professional Summary</h2>
                    <p className="text-slate-700 leading-relaxed">
                        {personal.summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Experience</h2>
                    <div className="space-y-6">
                        {experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-800 text-lg">{exp.title}</h3>
                                    <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                                        {exp.startDate} - {exp.endDate}
                                    </span>
                                </div>
                                <div className="text-indigo-600 font-medium text-sm mb-2">{exp.company}</div>
                                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Education</h2>
                    <div className="space-y-4">
                        {education.map((edu, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-slate-800">{edu.school}</h3>
                                    <span className="text-sm text-slate-500">{edu.year}</span>
                                </div>
                                <div className="text-slate-600 text-sm">{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && skills.some(s => s.trim()) && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            skill.trim() && (
                                <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            )
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
});

Modern.displayName = 'ModernTemplate';
