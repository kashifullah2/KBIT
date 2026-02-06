import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Star, Award } from 'lucide-react';

export const Creative = React.forwardRef(({ data, customization = {} }, ref) => {
    const primaryColor = customization.primaryColor || '#6366f1';
    const sidebarColor = customization.sidebarColor || '#1e293b';
    const fontFamily = customization.fontFamily || "'Inter', sans-serif";

    // Calculate if sidebar is dark or light for text color
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 30, g: 41, b: 59 };
    };

    const getLuminance = (hex) => {
        const rgb = hexToRgb(hex);
        const a = [rgb.r, rgb.g, rgb.b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const isDarkSidebar = getLuminance(sidebarColor) < 0.5;
    const sidebarTextColor = isDarkSidebar ? '#ffffff' : '#1e293b';
    const sidebarSecondaryColor = isDarkSidebar ? '#cbd5e1' : '#64748b';

    return (
        <div
            ref={ref}
            className="w-[210mm] min-h-[297mm] bg-white text-slate-800 flex print:m-0 print:shadow-none"
            style={{ fontFamily }}
        >
            {/* Sidebar */}
            <div
                className="w-[75mm] min-h-full p-8 flex flex-col print:print-color-adjust-exact relative overflow-hidden"
                style={{ backgroundColor: sidebarColor, color: sidebarTextColor }}
            >
                {/* Decorative gradient overlay */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        background: `linear-gradient(135deg, ${primaryColor} 0%, transparent 100%)`
                    }}
                />

                {/* Profile Photo or Avatar */}
                <div className="relative z-10 mb-8">
                    {data.personal.photo ? (
                        <img
                            src={data.personal.photo}
                            alt={data.personal.fullName || 'Profile'}
                            className="w-32 h-32 rounded-2xl mx-auto object-cover shadow-2xl ring-4 ring-white/10"
                        />
                    ) : (
                        <div
                            className="w-32 h-32 rounded-2xl mx-auto flex items-center justify-center text-5xl font-bold shadow-2xl ring-4 ring-white/10"
                            style={{
                                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                                color: '#ffffff'
                            }}
                        >
                            {data.personal.fullName ? data.personal.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                    )}
                </div>

                {/* Contact Section */}
                <div className="mb-8 relative z-10">
                    <h3
                        className="text-xs font-bold tracking-[0.2em] uppercase mb-5 pb-2.5 border-b"
                        style={{
                            color: primaryColor,
                            borderColor: isDarkSidebar ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }}
                    >
                        Contact
                    </h3>
                    <div className="space-y-3.5 text-sm">
                        {data.personal.email && (
                            <div className="flex items-start gap-3 group">
                                <div
                                    className="p-2 rounded-lg mt-0.5 transition-all group-hover:scale-110"
                                    style={{ backgroundColor: `${primaryColor}20` }}
                                >
                                    <Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                </div>
                                <span className="text-xs break-all leading-relaxed" style={{ color: sidebarSecondaryColor }}>
                                    {data.personal.email}
                                </span>
                            </div>
                        )}
                        {data.personal.phone && (
                            <div className="flex items-start gap-3 group">
                                <div
                                    className="p-2 rounded-lg mt-0.5 transition-all group-hover:scale-110"
                                    style={{ backgroundColor: `${primaryColor}20` }}
                                >
                                    <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                </div>
                                <span className="text-xs" style={{ color: sidebarSecondaryColor }}>
                                    {data.personal.phone}
                                </span>
                            </div>
                        )}
                        {data.personal.address && (
                            <div className="flex items-start gap-3 group">
                                <div
                                    className="p-2 rounded-lg mt-0.5 transition-all group-hover:scale-110"
                                    style={{ backgroundColor: `${primaryColor}20` }}
                                >
                                    <MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                </div>
                                <span className="text-xs" style={{ color: sidebarSecondaryColor }}>
                                    {data.personal.address}
                                </span>
                            </div>
                        )}
                        {data.personal.linkedin && (
                            <div className="flex items-start gap-3 group">
                                <div
                                    className="p-2 rounded-lg mt-0.5 transition-all group-hover:scale-110"
                                    style={{ backgroundColor: `${primaryColor}20` }}
                                >
                                    <Linkedin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                </div>
                                <span className="text-xs break-all leading-relaxed" style={{ color: sidebarSecondaryColor }}>
                                    {data.personal.linkedin}
                                </span>
                            </div>
                        )}
                        {data.personal.website && (
                            <div className="flex items-start gap-3 group">
                                <div
                                    className="p-2 rounded-lg mt-0.5 transition-all group-hover:scale-110"
                                    style={{ backgroundColor: `${primaryColor}20` }}
                                >
                                    <Globe className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                </div>
                                <span className="text-xs" style={{ color: sidebarSecondaryColor }}>
                                    {data.personal.website}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills Section */}
                {data.skills && data.skills.length > 0 && data.skills.some(s => s.trim()) && (
                    <div className="mb-8 relative z-10">
                        <h3
                            className="text-xs font-bold tracking-[0.2em] uppercase mb-5 pb-2.5 border-b"
                            style={{
                                color: primaryColor,
                                borderColor: isDarkSidebar ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            }}
                        >
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.filter(s => s.trim()).map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-wide transition-all hover:scale-105"
                                    style={{
                                        background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                                        color: '#ffffff',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education in Sidebar */}
                {data.education && data.education.length > 0 && (
                    <div className="mb-8 relative z-10">
                        <h3
                            className="text-xs font-bold tracking-[0.2em] uppercase mb-5 pb-2.5 border-b"
                            style={{
                                color: primaryColor,
                                borderColor: isDarkSidebar ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            }}
                        >
                            Education
                        </h3>
                        <div className="space-y-5">
                            {data.education.map((edu, index) => (
                                <div key={index} className="relative pl-5">
                                    <div
                                        className="absolute left-0 top-1 w-2 h-2 rounded-full"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                    <div className="flex items-start gap-2 mb-1.5">
                                        <GraduationCap className="w-4 h-4 mt-0.5 shrink-0" style={{ color: primaryColor }} />
                                        <span className="text-xs font-semibold leading-tight" style={{ color: sidebarTextColor }}>
                                            {edu.degree}
                                        </span>
                                    </div>
                                    <p className="text-[10px] ml-6 mb-1" style={{ color: sidebarSecondaryColor }}>
                                        {edu.school}
                                    </p>
                                    <p
                                        className="text-[10px] ml-6 font-medium"
                                        style={{ color: primaryColor }}
                                    >
                                        {edu.year}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Decorative element at bottom */}
                <div className="mt-auto pt-8 relative z-10">
                    <div
                        className="h-1.5 w-full rounded-full"
                        style={{
                            background: `linear-gradient(90deg, ${primaryColor}, transparent)`,
                            opacity: 0.6
                        }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 space-y-8 bg-white">
                {/* Header - Prominent Name & Title */}
                <div className="relative">
                    <div
                        className="absolute left-0 top-0 w-1.5 h-full rounded-full"
                        style={{ backgroundColor: primaryColor }}
                    />
                    <div className="pl-6">
                        <h1
                            className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-2"
                            style={{
                                backgroundImage: `linear-gradient(135deg, #1e293b 0%, ${primaryColor} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            {data.personal.fullName || 'Your Name'}
                        </h1>
                        <p
                            className="text-xl font-semibold tracking-wide"
                            style={{ color: primaryColor }}
                        >
                            {data.personal.jobTitle || 'Professional Title'}
                        </p>
                    </div>
                </div>

                {/* Professional Summary */}
                {data.personal.summary && (
                    <div className="relative">
                        <div
                            className="absolute left-0 top-0 w-1 h-full rounded-full opacity-30"
                            style={{ backgroundColor: primaryColor }}
                        />
                        <div className="pl-6">
                            <h2 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <Award className="w-4 h-4" style={{ color: primaryColor }} />
                                Professional Summary
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {data.personal.summary}
                            </p>
                        </div>
                    </div>
                )}

                {/* Professional Experience */}
                {data.experience && data.experience.length > 0 && (
                    <div>
                        <h2 className="text-base font-bold text-slate-800 mb-5 uppercase tracking-wider flex items-center gap-2">
                            <Briefcase className="w-5 h-5" style={{ color: primaryColor }} />
                            Professional Experience
                        </h2>
                        <div className="space-y-6">
                            {data.experience.map((exp, index) => (
                                <div
                                    key={index}
                                    className="relative pl-8 pb-6 border-l-2"
                                    style={{ borderColor: index === data.experience.length - 1 ? 'transparent' : '#e2e8f0' }}
                                >
                                    {/* Timeline dot */}
                                    <div
                                        className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white"
                                        style={{ backgroundColor: primaryColor }}
                                    />

                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-slate-800 leading-tight">
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
                                            className="text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
                                            style={{
                                                backgroundColor: `${primaryColor}15`,
                                                color: primaryColor,
                                                border: `1px solid ${primaryColor}30`
                                            }}
                                        >
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap mt-3">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Custom Sections */}
                {data.customSections && data.customSections.map((section, index) => (
                    <div key={index}>
                        <h2 className="text-base font-bold text-slate-800 mb-5 uppercase tracking-wider flex items-center gap-2">
                            <Star className="w-5 h-5" style={{ color: primaryColor }} />
                            {section.title}
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {section.items.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="relative p-4 rounded-xl border-l-4 transition-all hover:shadow-md"
                                    style={{
                                        backgroundColor: `${primaryColor}05`,
                                        borderColor: primaryColor
                                    }}
                                >
                                    <h3 className="font-semibold text-slate-800 text-sm mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-slate-600">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

Creative.displayName = 'Creative';
