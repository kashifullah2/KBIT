import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Star } from 'lucide-react';

export const Modern = React.forwardRef(({ data, customization = {} }, ref) => {
    const { personal, experience, education, skills, customSections } = data;
    const primaryColor = customization.primaryColor || '#4f46e5';
    const fontFamily = customization.fontFamily || "'Inter', sans-serif";

    return (
        <div
            ref={ref}
            style={{ fontFamily }}
            className="w-[210mm] min-h-[297mm] bg-white text-slate-800 print:shadow-none"
        >
            {/* Header with gradient accent */}
            <div
                className="px-10 pt-10 pb-8 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${primaryColor}08 0%, ${primaryColor}15 100%)` }}
            >
                {/* Decorative circles */}
                <div
                    className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-10"
                    style={{ backgroundColor: primaryColor }}
                />
                <div
                    className="absolute -right-10 top-20 w-32 h-32 rounded-full opacity-10"
                    style={{ backgroundColor: primaryColor }}
                />

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-1">
                        {personal.fullName || 'Your Name'}
                    </h1>
                    <p className="text-xl font-medium mb-4" style={{ color: primaryColor }}>
                        {personal.jobTitle || 'Professional Title'}
                    </p>

                    {/* Contact Row */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        {personal.email && (
                            <div className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                                <span>{personal.email}</span>
                            </div>
                        )}
                        {personal.phone && (
                            <div className="flex items-center gap-1.5">
                                <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                                <span>{personal.phone}</span>
                            </div>
                        )}
                        {personal.address && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                                <span>{personal.address}</span>
                            </div>
                        )}
                        {personal.linkedin && (
                            <div className="flex items-center gap-1.5">
                                <Linkedin className="w-4 h-4" style={{ color: primaryColor }} />
                                <span>{personal.linkedin}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-10 py-8">
                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8">
                        <p className="text-slate-700 leading-relaxed text-sm">
                            {personal.summary}
                        </p>
                    </section>
                )}

                {/* Two Column Layout */}
                <div className="flex gap-8">
                    {/* Main Column */}
                    <div className="flex-1 space-y-7">
                        {/* Experience */}
                        {experience && experience.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Briefcase className="w-5 h-5" style={{ color: primaryColor }} />
                                    <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                                        Experience
                                    </h2>
                                    <div className="flex-1 h-px bg-slate-200 ml-2" />
                                </div>
                                <div className="space-y-5">
                                    {experience.map((exp, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-slate-900 text-sm">{exp.title}</h3>
                                                <span
                                                    className="text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap"
                                                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                                                >
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium mb-1.5" style={{ color: primaryColor }}>
                                                {exp.company}
                                            </p>
                                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Custom Sections */}
                        {customSections && customSections.map((section, index) => (
                            <section key={index}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className="w-5 h-5" style={{ color: primaryColor }} />
                                    <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                                        {section.title}
                                    </h2>
                                    <div className="flex-1 h-px bg-slate-200 ml-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {section.items.map((item, idx) => (
                                        <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                            <h3 className="font-semibold text-slate-800 text-xs">{item.title}</h3>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="w-[65mm] space-y-6">
                        {/* Skills */}
                        {skills && skills.length > 0 && skills.some(s => s.trim()) && (
                            <section
                                className="p-4 rounded-xl"
                                style={{ backgroundColor: `${primaryColor}08` }}
                            >
                                <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
                                    Skills
                                </h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.filter(s => s.trim()).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2.5 py-1 text-[10px] font-semibold rounded-full text-white"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education && education.length > 0 && (
                            <section
                                className="p-4 rounded-xl"
                                style={{ backgroundColor: `${primaryColor}08` }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <GraduationCap className="w-4 h-4" style={{ color: primaryColor }} />
                                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                                        Education
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {education.map((edu, index) => (
                                        <div key={index} className="border-l-2 pl-3" style={{ borderColor: primaryColor }}>
                                            <h3 className="font-bold text-slate-800 text-xs leading-tight">{edu.degree}</h3>
                                            <p className="text-[10px] mt-0.5" style={{ color: primaryColor }}>{edu.school}</p>
                                            <p className="text-[10px] text-slate-500">{edu.year}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer accent line */}
            <div
                className="h-1 w-full mt-auto"
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}60)` }}
            />
        </div>
    );
});

Modern.displayName = 'ModernTemplate';
