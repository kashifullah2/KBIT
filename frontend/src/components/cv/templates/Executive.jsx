import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award, Star } from 'lucide-react';

export const Executive = React.forwardRef(({ data, customization = {} }, ref) => {
    const { personal, experience, education, skills, customSections } = data;
    const primaryColor = customization.primaryColor || '#4f46e5';
    const fontFamily = customization.fontFamily || "'Inter', sans-serif";

    return (
        <div
            ref={ref}
            style={{ fontFamily }}
            className="w-[210mm] min-h-[297mm] bg-white text-slate-800 print:shadow-none"
        >
            {/* Top Accent Bar */}
            <div
                className="h-2 w-full"
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}80)` }}
            />

            {/* Header Section */}
            <div className="px-10 pt-8 pb-6">
                <div className="flex justify-between items-start gap-6">
                    {/* Left: Photo + Name */}
                    <div className="flex items-center gap-5">
                        {personal.photo && (
                            <img
                                src={personal.photo}
                                alt={personal.fullName || 'Profile'}
                                className="w-20 h-20 rounded-xl object-cover shadow-lg border-2"
                                style={{ borderColor: primaryColor }}
                            />
                        )}
                        <div>
                            <h1
                                className="text-4xl font-bold tracking-tight mb-1"
                                style={{ color: primaryColor }}
                            >
                                {personal.fullName || 'Your Name'}
                            </h1>
                            <p className="text-xl text-slate-600 font-medium">
                                {personal.jobTitle || 'Professional Title'}
                            </p>
                        </div>
                    </div>

                    {/* Contact Info - Right Side */}
                    <div className="text-right space-y-1 text-sm text-slate-600 shrink-0">
                        {personal.email && (
                            <div className="flex items-center justify-end gap-2">
                                <span>{personal.email}</span>
                                <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                            </div>
                        )}
                        {personal.phone && (
                            <div className="flex items-center justify-end gap-2">
                                <span>{personal.phone}</span>
                                <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                            </div>
                        )}
                        {personal.address && (
                            <div className="flex items-center justify-end gap-2">
                                <span>{personal.address}</span>
                                <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                            </div>
                        )}
                        {personal.linkedin && (
                            <div className="flex items-center justify-end gap-2">
                                <span>{personal.linkedin}</span>
                                <Linkedin className="w-4 h-4" style={{ color: primaryColor }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary - Full Width */}
                {personal.summary && (
                    <div
                        className="mt-5 p-4 rounded-lg text-sm text-slate-700 leading-relaxed border-l-4"
                        style={{ backgroundColor: `${primaryColor}08`, borderColor: primaryColor }}
                    >
                        {personal.summary}
                    </div>
                )}
            </div>

            {/* Main Content - Two Columns */}
            <div className="px-10 pb-8 flex gap-8">
                {/* Left Column - Main Content (65%) */}
                <div className="flex-1 space-y-6">
                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <section>
                            <div
                                className="flex items-center gap-2 mb-4 pb-2 border-b-2"
                                style={{ borderColor: primaryColor }}
                            >
                                <Briefcase className="w-5 h-5" style={{ color: primaryColor }} />
                                <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                                    Professional Experience
                                </h2>
                            </div>
                            <div className="space-y-5">
                                {experience.map((exp, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-slate-900 text-sm">{exp.title}</h3>
                                            <span
                                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ml-2"
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

                    {/* Custom Sections in Main Area */}
                    {customSections && customSections.map((section, index) => (
                        <section key={index}>
                            <div
                                className="flex items-center gap-2 mb-4 pb-2 border-b-2"
                                style={{ borderColor: primaryColor }}
                            >
                                <Award className="w-5 h-5" style={{ color: primaryColor }} />
                                <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                                    {section.title}
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {section.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 rounded-lg border"
                                        style={{ borderColor: `${primaryColor}30` }}
                                    >
                                        <h3 className="font-semibold text-slate-800 text-xs">{item.title}</h3>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Right Column - Sidebar (35%) */}
                <div className="w-[70mm] space-y-6">
                    {/* Skills */}
                    {skills && skills.length > 0 && skills.some(s => s.trim()) && (
                        <section
                            className="p-5 rounded-xl"
                            style={{ backgroundColor: `${primaryColor}08` }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-4 h-4" style={{ color: primaryColor }} />
                                <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                                    Core Skills
                                </h2>
                            </div>
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
                            className="p-5 rounded-xl"
                            style={{ backgroundColor: `${primaryColor}08` }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <GraduationCap className="w-4 h-4" style={{ color: primaryColor }} />
                                <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                                    Education
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index} className="border-l-2 pl-3" style={{ borderColor: primaryColor }}>
                                        <h3 className="font-bold text-slate-800 text-xs leading-tight">{edu.degree}</h3>
                                        <p className="text-[10px] mt-1" style={{ color: primaryColor }}>{edu.school}</p>
                                        <p className="text-[10px] text-slate-500">{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Quick Stats or Additional Info */}
                    <section
                        className="p-5 rounded-xl text-center"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <div className="text-white">
                            <div className="text-3xl font-bold mb-1">8+</div>
                            <div className="text-xs opacity-90">Years of Experience</div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Bottom Accent */}
            <div
                className="h-1 w-full mt-auto"
                style={{ background: `linear-gradient(90deg, ${primaryColor}80, ${primaryColor})` }}
            />
        </div>
    );
});

Executive.displayName = 'ExecutiveTemplate';
