import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award } from 'lucide-react';

/**
 * Professional CV Template - Redesigned
 * 
 * Modern, visually appealing design while maintaining ATS compatibility:
 * - Single-column layout (ATS-safe)
 * - Enhanced typography and spacing
 * - Subtle visual accents and borders
 * - Clean, professional aesthetic
 * - Full customization support
 */

export const Professional = React.forwardRef(({ data, customization = {} }, ref) => {
    const { personal, experience, education, skills, projects, customSections } = data;

    // Customization with professional defaults
    const fontFamily = customization.fontFamily || "'Inter', sans-serif";
    const primaryColor = customization.primaryColor || '#2563eb';

    // Text colors - professional palette
    const textPrimary = '#111827';
    const textSecondary = '#4b5563';
    const textMuted = '#6b7280';

    return (
        <div
            ref={ref}
            style={{ fontFamily }}
            className="w-[210mm] min-h-[297mm] bg-white text-slate-900"
        >
            {/* Main Content */}
            <div className="px-12 py-10">

                {/* HEADER - Name & Title */}
                <header className="mb-6 pb-5 border-b-2" style={{ borderColor: `${primaryColor}30` }}>
                    <h1
                        className="text-4xl font-bold tracking-tight mb-2"
                        style={{ color: textPrimary }}
                    >
                        {personal.fullName || 'Your Name'}
                    </h1>
                    <p
                        className="text-xl font-semibold tracking-wide"
                        style={{ color: primaryColor }}
                    >
                        {personal.jobTitle || 'Professional Title'}
                    </p>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 mt-4 text-sm" style={{ color: textSecondary }}>
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
                        {personal.website && (
                            <div className="flex items-center gap-1.5">
                                <Globe className="w-4 h-4" style={{ color: primaryColor }} />
                                <span>{personal.website}</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* PROFESSIONAL SUMMARY */}
                {personal.summary && (
                    <section className="mb-7">
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="w-1 h-6 rounded-full"
                                style={{ backgroundColor: primaryColor }}
                            />
                            <h2
                                className="text-lg font-bold uppercase tracking-wider"
                                style={{ color: primaryColor }}
                            >
                                Professional Summary
                            </h2>
                        </div>
                        <p
                            className="text-sm leading-relaxed ml-4"
                            style={{ color: textSecondary }}
                        >
                            {personal.summary}
                        </p>
                    </section>
                )}

                {/* SKILLS */}
                {skills && skills.length > 0 && skills.some(s => s.trim()) && (
                    <section className="mb-7">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-1 h-6 rounded-full"
                                style={{ backgroundColor: primaryColor }}
                            />
                            <h2
                                className="text-lg font-bold uppercase tracking-wider"
                                style={{ color: primaryColor }}
                            >
                                Core Skills
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-4">
                            {skills.filter(s => s.trim()).map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 text-xs font-medium rounded-full border"
                                    style={{
                                        backgroundColor: `${primaryColor}08`,
                                        borderColor: `${primaryColor}30`,
                                        color: primaryColor
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* PROFESSIONAL EXPERIENCE */}
                {experience && experience.length > 0 && (
                    <section className="mb-7">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-1 h-6 rounded-full"
                                style={{ backgroundColor: primaryColor }}
                            />
                            <h2
                                className="text-lg font-bold uppercase tracking-wider"
                                style={{ color: primaryColor }}
                            >
                                Professional Experience
                            </h2>
                        </div>
                        <div className="space-y-5 ml-4">
                            {experience.map((exp, index) => (
                                <div
                                    key={index}
                                    className="relative pl-5 pb-5 border-l-2"
                                    style={{
                                        borderColor: index === experience.length - 1 ? 'transparent' : `${primaryColor}20`
                                    }}
                                >
                                    {/* Timeline dot */}
                                    <div
                                        className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white"
                                        style={{ backgroundColor: primaryColor }}
                                    />

                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <div className="flex-1">
                                            <h3
                                                className="text-base font-bold leading-tight"
                                                style={{ color: textPrimary }}
                                            >
                                                {exp.title}
                                            </h3>
                                            <p
                                                className="text-sm font-semibold mt-1"
                                                style={{ color: primaryColor }}
                                            >
                                                {exp.company}
                                            </p>
                                        </div>
                                        <span
                                            className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap shrink-0"
                                            style={{
                                                backgroundColor: `${primaryColor}10`,
                                                color: primaryColor
                                            }}
                                        >
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                    </div>

                                    <p
                                        className="text-xs leading-relaxed whitespace-pre-line"
                                        style={{ color: textSecondary }}
                                    >
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* PROJECTS */}
                {projects && projects.length > 0 && (
                    <section className="mb-7">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-1 h-6 rounded-full"
                                style={{ backgroundColor: primaryColor }}
                            />
                            <h2
                                className="text-lg font-bold uppercase tracking-wider"
                                style={{ color: primaryColor }}
                            >
                                Projects
                            </h2>
                        </div>
                        <div className="space-y-4 ml-4">
                            {projects.map((project, index) => (
                                <div key={index} className="break-inside-avoid">
                                    <h3
                                        className="text-sm font-bold mb-1"
                                        style={{ color: textPrimary }}
                                    >
                                        {project.name}
                                    </h3>
                                    {project.technologies && (
                                        <p
                                            className="text-xs font-medium mb-1"
                                            style={{ color: primaryColor }}
                                        >
                                            Technologies: {project.technologies}
                                        </p>
                                    )}
                                    {project.description && (
                                        <p
                                            className="text-xs leading-relaxed"
                                            style={{ color: textSecondary }}
                                        >
                                            {project.description}
                                        </p>
                                    )}
                                    {project.link && (
                                        <p
                                            className="text-xs mt-1"
                                            style={{ color: textMuted }}
                                        >
                                            Link: {project.link}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* EDUCATION */}
                {education && education.length > 0 && (
                    <section className="mb-7">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-1 h-6 rounded-full"
                                style={{ backgroundColor: primaryColor }}
                            />
                            <h2
                                className="text-lg font-bold uppercase tracking-wider"
                                style={{ color: primaryColor }}
                            >
                                Education
                            </h2>
                        </div>
                        <div className="space-y-3 ml-4">
                            {education.map((edu, index) => (
                                <div key={index} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline gap-4">
                                        <h3
                                            className="text-sm font-bold"
                                            style={{ color: textPrimary }}
                                        >
                                            {edu.degree}
                                        </h3>
                                        <span
                                            className="text-xs font-medium whitespace-nowrap"
                                            style={{ color: primaryColor }}
                                        >
                                            {edu.year}
                                        </span>
                                    </div>
                                    <p
                                        className="text-xs mt-0.5"
                                        style={{ color: textSecondary }}
                                    >
                                        {edu.school}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* CUSTOM SECTIONS */}
                {customSections && customSections.map((section, index) => (
                    <section key={index} className="mb-7">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-1 h-6 rounded-full"
                                style={{ backgroundColor: primaryColor }}
                            />
                            <h2
                                className="text-lg font-bold uppercase tracking-wider"
                                style={{ color: primaryColor }}
                            >
                                {section.title}
                            </h2>
                        </div>
                        <div className="space-y-3 ml-4">
                            {section.items.map((item, idx) => (
                                <div key={idx} className="break-inside-avoid">
                                    <h3
                                        className="text-sm font-bold"
                                        style={{ color: textPrimary }}
                                    >
                                        {item.title}
                                    </h3>
                                    {item.description && (
                                        <p
                                            className="text-xs mt-0.5 leading-relaxed"
                                            style={{ color: textSecondary }}
                                        >
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

            </div>

            {/* Footer accent */}
            <div
                className="h-1.5 w-full mt-auto"
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}60)` }}
            />
        </div>
    );
});

Professional.displayName = 'ProfessionalTemplate';
