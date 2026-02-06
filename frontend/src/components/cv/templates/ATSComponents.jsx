/**
 * ATS-Friendly CV Components
 * 
 * Modular, reusable components for building ATS-compatible CVs
 * These components follow strict ATS guidelines:
 * - No icons, graphics, or images
 * - Single-column layout
 * - Simple text formatting
 * - Proper semantic HTML
 * - High contrast, readable typography
 */

import React from 'react';

/**
 * Section Header Component
 * Renders a clean, ATS-friendly section header
 */
export const ATSSectionHeader = ({ title, textColor = '#000000' }) => (
    <h2
        className="text-[14px] font-bold uppercase tracking-wide mb-4 pb-1 border-b border-gray-300"
        style={{ color: textColor }}
    >
        {title}
    </h2>
);

/**
 * Contact Information Component
 * Displays contact details in ATS-friendly format
 */
export const ATSContactInfo = ({ personal, textColor = '#374151' }) => {
    if (!personal) return null;

    const contactItems = [
        { label: 'Phone', value: personal.phone },
        { label: 'Email', value: personal.email },
        { label: 'Location', value: personal.address },
        { label: 'LinkedIn', value: personal.linkedin },
        { label: 'GitHub', value: personal.github },
        { label: 'Website', value: personal.website }
    ].filter(item => item.value);

    if (contactItems.length === 0) return null;

    return (
        <section className="mb-6 pb-4 border-b border-gray-300">
            <div className="text-[11px] leading-relaxed" style={{ color: textColor }}>
                {contactItems.map((item, index) => (
                    <div key={index}>
                        {item.label}: {item.value}
                    </div>
                ))}
            </div>
        </section>
    );
};

/**
 * Professional Summary Component
 */
export const ATSSummary = ({ summary, textPrimary = '#000000', textSecondary = '#374151' }) => {
    if (!summary) return null;

    return (
        <section className="mb-6">
            <h2
                className="text-[14px] font-bold uppercase tracking-wide mb-4 pb-1 border-b border-gray-300"
                style={{ color: textPrimary }}
            >
                PROFESSIONAL SUMMARY
            </h2>
            <p
                className="text-[11px] leading-[1.5]"
                style={{ color: textSecondary }}
            >
                {summary}
            </p>
        </section>
    );
};

/**
 * Experience Entry Component
 * Renders individual work experience entry
 */
export const ATSExperienceEntry = ({
    exp,
    textPrimary = '#000000',
    textSecondary = '#374151',
    textMuted = '#6b7280'
}) => (
    <div className="break-inside-avoid">
        {/* Job Title and Date */}
        <div className="flex justify-between items-baseline mb-1">
            <h3
                className="text-[12px] font-bold"
                style={{ color: textPrimary }}
            >
                {exp.title}
            </h3>
            <span
                className="text-[11px] ml-4 whitespace-nowrap"
                style={{ color: textMuted }}
            >
                {exp.startDate} – {exp.endDate}
            </span>
        </div>

        {/* Company Name and Location */}
        <div
            className="text-[11px] font-semibold mb-2"
            style={{ color: textSecondary }}
        >
            {exp.company}
            {exp.location && ` | ${exp.location}`}
        </div>

        {/* Description with bullet points */}
        {exp.description && (
            <div
                className="text-[11px] leading-[1.4] whitespace-pre-line"
                style={{ color: textSecondary }}
            >
                {exp.description}
            </div>
        )}
    </div>
);

/**
 * Work Experience Section Component
 */
export const ATSExperience = ({
    experience,
    textPrimary = '#000000',
    textSecondary = '#374151',
    textMuted = '#6b7280'
}) => {
    if (!experience || experience.length === 0) return null;

    return (
        <section className="mb-6">
            <h2
                className="text-[14px] font-bold uppercase tracking-wide mb-4 pb-1 border-b border-gray-300"
                style={{ color: textPrimary }}
            >
                WORK EXPERIENCE
            </h2>
            <div className="space-y-5">
                {experience.map((exp, index) => (
                    <ATSExperienceEntry
                        key={index}
                        exp={exp}
                        textPrimary={textPrimary}
                        textSecondary={textSecondary}
                        textMuted={textMuted}
                    />
                ))}
            </div>
        </section>
    );
};

/**
 * Project Entry Component
 */
export const ATSProjectEntry = ({
    project,
    textPrimary = '#000000',
    textSecondary = '#374151',
    textMuted = '#6b7280'
}) => (
    <div className="break-inside-avoid">
        {/* Project Title */}
        <h3
            className="text-[12px] font-bold mb-1"
            style={{ color: textPrimary }}
        >
            {project.name}
        </h3>

        {/* Project Technologies */}
        {project.technologies && (
            <div
                className="text-[11px] font-medium mb-1"
                style={{ color: textSecondary }}
            >
                Technologies: {project.technologies}
            </div>
        )}

        {/* Project Description */}
        {project.description && (
            <p
                className="text-[11px] leading-[1.4]"
                style={{ color: textSecondary }}
            >
                {project.description}
            </p>
        )}

        {/* Project Link */}
        {project.link && (
            <div
                className="text-[10px] mt-1"
                style={{ color: textMuted }}
            >
                Link: {project.link}
            </div>
        )}
    </div>
);

/**
 * Projects Section Component
 */
export const ATSProjects = ({
    projects,
    textPrimary = '#000000',
    textSecondary = '#374151',
    textMuted = '#6b7280'
}) => {
    if (!projects || projects.length === 0) return null;

    return (
        <section className="mb-6">
            <h2
                className="text-[14px] font-bold uppercase tracking-wide mb-4 pb-1 border-b border-gray-300"
                style={{ color: textPrimary }}
            >
                PROJECTS
            </h2>
            <div className="space-y-4">
                {projects.map((project, index) => (
                    <ATSProjectEntry
                        key={index}
                        project={project}
                        textPrimary={textPrimary}
                        textSecondary={textSecondary}
                        textMuted={textMuted}
                    />
                ))}
            </div>
        </section>
    );
};

/**
 * Education Entry Component
 */
export const ATSEducationEntry = ({
    edu,
    textPrimary = '#000000',
    textSecondary = '#374151',
    textMuted = '#6b7280'
}) => (
    <div className="break-inside-avoid">
        <div className="flex justify-between items-baseline">
            <h3
                className="text-[12px] font-bold"
                style={{ color: textPrimary }}
            >
                {edu.degree}
            </h3>
            <span
                className="text-[11px] ml-4 whitespace-nowrap"
                style={{ color: textMuted }}
            >
                {edu.year}
            </span>
        </div>
        <div
            className="text-[11px] mt-0.5"
            style={{ color: textSecondary }}
        >
            {edu.school}
        </div>
        {edu.location && (
            <div
                className="text-[10px]"
                style={{ color: textMuted }}
            >
                {edu.location}
            </div>
        )}
    </div>
);

/**
 * Education Section Component
 */
export const ATSEducation = ({
    education,
    textPrimary = '#000000',
    textSecondary = '#374151',
    textMuted = '#6b7280'
}) => {
    if (!education || education.length === 0) return null;

    return (
        <section className="mb-6">
            <h2
                className="text-[14px] font-bold uppercase tracking-wide mb-4 pb-1 border-b border-gray-300"
                style={{ color: textPrimary }}
            >
                EDUCATION
            </h2>
            <div className="space-y-3">
                {education.map((edu, index) => (
                    <ATSEducationEntry
                        key={index}
                        edu={edu}
                        textPrimary={textPrimary}
                        textSecondary={textSecondary}
                        textMuted={textMuted}
                    />
                ))}
            </div>
        </section>
    );
};

/**
 * Skills Section Component
 * Displays skills as comma-separated text for ATS compatibility
 */
export const ATSSkills = ({
    skills,
    textPrimary = '#000000',
    textSecondary = '#374151',
    groupedSkills = null
}) => {
    // Support both array and grouped object format
    const hasSkills = (skills && skills.length > 0 && skills.some(s => s.trim())) ||
        (groupedSkills && Object.keys(groupedSkills).length > 0);

    if (!hasSkills) return null;

    return (
        <section className="mb-6">
            <h2
                className="text-[14px] font-bold uppercase tracking-wide mb-4 pb-1 border-b border-gray-300"
                style={{ color: textPrimary }}
            >
                SKILLS
            </h2>

            {/* Grouped skills format */}
            {groupedSkills && Object.keys(groupedSkills).length > 0 ? (
                <div className="space-y-2">
                    {Object.entries(groupedSkills).map(([category, skillList], index) => (
                        <div key={index}>
                            <span
                                className="text-[11px] font-semibold"
                                style={{ color: textPrimary }}
                            >
                                {category}:{' '}
                            </span>
                            <span
                                className="text-[11px]"
                                style={{ color: textSecondary }}
                            >
                                {Array.isArray(skillList) ? skillList.join(', ') : skillList}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                /* Simple array format */
                <div
                    className="text-[11px] leading-[1.5]"
                    style={{ color: textSecondary }}
                >
                    {skills.filter(s => s.trim()).join(' • ')}
                </div>
            )}
        </section>
    );
};

/**
 * Custom Section Component
 * Renders certifications, achievements, or other custom sections
 */
export const ATSCustomSection = ({
    section,
    textPrimary = '#000000',
    textSecondary = '#374151'
}) => {
    if (!section || !section.items || section.items.length === 0) return null;

    return (
        <section className="mb-6">
            <h2
                className="text-[14px] font-bold uppercase tracking-wide mb-4 pb-1 border-b border-gray-300"
                style={{ color: textPrimary }}
            >
                {section.title}
            </h2>
            <div className="space-y-3">
                {section.items.map((item, index) => (
                    <div key={index} className="break-inside-avoid">
                        <h3
                            className="text-[12px] font-bold"
                            style={{ color: textPrimary }}
                        >
                            {item.title}
                        </h3>
                        {item.description && (
                            <p
                                className="text-[11px] mt-0.5"
                                style={{ color: textSecondary }}
                            >
                                {item.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

/**
 * Page Header Component
 * Name and job title
 */
export const ATSHeader = ({ personal, textPrimary = '#000000', textSecondary = '#374151' }) => {
    if (!personal || !personal.fullName) return null;

    return (
        <header className="mb-4">
            <h1
                className="text-[26px] font-bold leading-tight tracking-tight uppercase"
                style={{ color: textPrimary }}
            >
                {personal.fullName}
            </h1>
            {personal.jobTitle && (
                <p
                    className="text-[14px] font-medium mt-1"
                    style={{ color: textSecondary }}
                >
                    {personal.jobTitle}
                </p>
            )}
        </header>
    );
};

/**
 * Utility function to group skills by category
 * Example: groupSkills(['React', 'Vue'], { 'Languages': 'Python, JavaScript' })
 */
export const groupSkills = (skillsArray) => {
    // This is a helper function that can be used to transform a flat array
    // into grouped categories if needed
    // For now, it returns the array as-is, but can be extended
    return skillsArray;
};
