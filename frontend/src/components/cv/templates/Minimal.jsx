import React from 'react';

/**
 * Minimal CV Template - Redesigned
 * 
 * Clean, modern minimalist design with ATS compatibility:
 * - Single-column layout (ATS-safe)
 * - Refined typography and generous spacing
 * - Subtle visual accents (thin borders only)
 * - Clean, uncluttered aesthetic
 * - Full customization support
 * 
 * Philosophy: Less is more - every element serves a purpose
 */

export const Minimal = React.forwardRef(({ data, customization = {} }, ref) => {
    const { personal, experience, education, skills, projects, customSections } = data;

    // Customization with minimalist defaults
    const fontFamily = customization.fontFamily || "'Inter', sans-serif";
    const primaryColor = customization.primaryColor || '#2563eb';

    // Text colors - clean palette
    const textPrimary = '#111827';
    const textSecondary = '#4b5563';
    const textMuted = '#9ca3af';

    return (
        <div
            ref={ref}
            style={{ fontFamily }}
            className="w-[210mm] min-h-[297mm] bg-white text-slate-900"
        >
            {/* Main Content */}
            <div className="px-16 py-12">

                {/* HEADER - Name & Contact */}
                <header className="mb-8 pb-6 border-b" style={{ borderColor: '#e5e7eb' }}>
                    <h1
                        className="text-3xl font-bold tracking-tight mb-1"
                        style={{ color: textPrimary }}
                    >
                        {personal.fullName || 'Your Name'}
                    </h1>
                    <p
                        className="text-base font-medium mb-4"
                        style={{ color: primaryColor }}
                    >
                        {personal.jobTitle || 'Professional Title'}
                    </p>

                    {/* Contact Info - Horizontal Layout */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: textSecondary }}>
                        {personal.email && <span>{personal.email}</span>}
                        {personal.phone && <span>•</span>}
                        {personal.phone && <span>{personal.phone}</span>}
                        {personal.address && <span>•</span>}
                        {personal.address && <span>{personal.address}</span>}
                        {personal.linkedin && <span>•</span>}
                        {personal.linkedin && <span>{personal.linkedin}</span>}
                        {personal.website && <span>•</span>}
                        {personal.website && <span>{personal.website}</span>}
                    </div>
                </header>

                {/* PROFESSIONAL SUMMARY */}
                {personal.summary && (
                    <section className="mb-8">
                        <h2
                            className="text-sm font-bold uppercase tracking-wider mb-3 pb-2 border-t pt-3"
                            style={{ color: primaryColor, borderColor: primaryColor }}
                        >
                            Professional Summary
                        </h2>
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: textSecondary }}
                        >
                            {personal.summary}
                        </p>
                    </section>
                )}

                {/* PROFESSIONAL EXPERIENCE */}
                {experience && experience.length > 0 && (
                    <section className="mb-8">
                        <h2
                            className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-t pt-3"
                            style={{ color: primaryColor, borderColor: primaryColor }}
                        >
                            Professional Experience
                        </h2>
                        <div className="space-y-5">
                            {experience.map((exp, index) => (
                                <div key={index} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3
                                            className="text-base font-bold"
                                            style={{ color: textPrimary }}
                                        >
                                            {exp.title}
                                        </h3>
                                        <span
                                            className="text-xs font-medium whitespace-nowrap ml-4"
                                            style={{ color: textMuted }}
                                        >
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                    </div>
                                    <p
                                        className="text-sm font-medium mb-2"
                                        style={{ color: primaryColor }}
                                    >
                                        {exp.company}
                                    </p>
                                    <p
                                        className="text-sm leading-relaxed whitespace-pre-line"
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
                    <section className="mb-8">
                        <h2
                            className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-t pt-3"
                            style={{ color: primaryColor, borderColor: primaryColor }}
                        >
                            Projects
                        </h2>
                        <div className="space-y-4">
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
                                            {project.technologies}
                                        </p>
                                    )}
                                    {project.description && (
                                        <p
                                            className="text-sm leading-relaxed"
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
                                            {project.link}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* EDUCATION */}
                {education && education.length > 0 && (
                    <section className="mb-8">
                        <h2
                            className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-t pt-3"
                            style={{ color: primaryColor, borderColor: primaryColor }}
                        >
                            Education
                        </h2>
                        <div className="space-y-3">
                            {education.map((edu, index) => (
                                <div key={index} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline">
                                        <h3
                                            className="text-sm font-bold"
                                            style={{ color: textPrimary }}
                                        >
                                            {edu.degree}
                                        </h3>
                                        <span
                                            className="text-xs font-medium whitespace-nowrap ml-4"
                                            style={{ color: textMuted }}
                                        >
                                            {edu.year}
                                        </span>
                                    </div>
                                    <p
                                        className="text-sm mt-0.5"
                                        style={{ color: textSecondary }}
                                    >
                                        {edu.school}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SKILLS */}
                {skills && skills.length > 0 && skills.some(s => s.trim()) && (
                    <section className="mb-8">
                        <h2
                            className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-t pt-3"
                            style={{ color: primaryColor, borderColor: primaryColor }}
                        >
                            Skills
                        </h2>
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: textSecondary }}
                        >
                            {skills.filter(s => s.trim()).join(' • ')}
                        </p>
                    </section>
                )}

                {/* CUSTOM SECTIONS */}
                {customSections && customSections.map((section, index) => (
                    <section key={index} className="mb-8">
                        <h2
                            className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-t pt-3"
                            style={{ color: primaryColor, borderColor: primaryColor }}
                        >
                            {section.title}
                        </h2>
                        <div className="space-y-3">
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
                                            className="text-sm mt-0.5 leading-relaxed"
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
        </div>
    );
});

Minimal.displayName = 'MinimalTemplate';
