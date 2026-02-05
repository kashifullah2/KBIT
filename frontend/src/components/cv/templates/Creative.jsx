import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Star } from 'lucide-react';

export const Creative = React.forwardRef(({ data, customization = {} }, ref) => {
    const primaryColor = customization.primaryColor || '#6366f1';
    const fontFamily = customization.fontFamily || "'Inter', sans-serif";

    return (
        <div
            ref={ref}
            className="w-[210mm] min-h-[297mm] bg-white text-slate-800 flex print:m-0 print:shadow-none"
            style={{ fontFamily }}
        >
            {/* Sidebar */}
            <div
                className="w-[75mm] min-h-full text-white p-6 flex flex-col print:print-color-adjust-exact"
                style={{ backgroundColor: '#1e293b' }}
            >
                {/* Profile Photo or Avatar */}
                {data.personal.photo ? (
                    <img
                        src={data.personal.photo}
                        alt={data.personal.fullName || 'Profile'}
                        className="w-28 h-28 rounded-full mx-auto object-cover shadow-xl mb-4 border-4 border-white/20"
                    />
                ) : (
                    <div
                        className="w-28 h-28 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white shadow-xl mb-4 border-4 border-white/20"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {data.personal.fullName ? data.personal.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                )}

                {/* Name (Mobile-friendly in sidebar) */}
                <div className="text-center mb-6">
                    <h2 className="text-lg font-bold text-white leading-tight">
                        {data.personal.fullName || 'Your Name'}
                    </h2>
                    <p className="text-sm mt-1" style={{ color: primaryColor }}>
                        {data.personal.jobTitle || 'Professional Title'}
                    </p>
                </div>

                {/* Contact Section */}
                <div className="mb-6">
                    <h3
                        className="text-xs font-bold tracking-widest uppercase mb-4 pb-2 border-b border-slate-600"
                        style={{ color: primaryColor }}
                    >
                        Contact
                    </h3>
                    <div className="space-y-3 text-sm">
                        {data.personal.email && (
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 rounded-lg mt-0.5" style={{ backgroundColor: `${primaryColor}30` }}>
                                    <Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                </div>
                                <span className="text-slate-300 text-xs break-all leading-relaxed">{data.personal.email}</span>
                            </div>
                        )}
                        {data.personal.phone && (
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 rounded-lg mt-0.5" style={{ backgroundColor: `${primaryColor}30` }}>
                                    <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                </div>
                                <span className="text-slate-300 text-xs">{data.personal.phone}</span>
                            </div>
                        )}
                        {data.personal.address && (
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 rounded-lg mt-0.5" style={{ backgroundColor: `${primaryColor}30` }}>
                                    <MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                </div>
                                <span className="text-slate-300 text-xs">{data.personal.address}</span>
                            </div>
                        )}
                        {data.personal.linkedin && (
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 rounded-lg mt-0.5" style={{ backgroundColor: `${primaryColor}30` }}>
                                    <Linkedin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                </div>
                                <span className="text-slate-300 text-xs break-all leading-relaxed">{data.personal.linkedin}</span>
                            </div>
                        )}
                        {data.personal.website && (
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 rounded-lg mt-0.5" style={{ backgroundColor: `${primaryColor}30` }}>
                                    <Globe className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                </div>
                                <span className="text-slate-300 text-xs">{data.personal.website}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills Section */}
                {data.skills && data.skills.length > 0 && data.skills.some(s => s.trim()) && (
                    <div className="mb-6">
                        <h3
                            className="text-xs font-bold tracking-widest uppercase mb-4 pb-2 border-b border-slate-600"
                            style={{ color: primaryColor }}
                        >
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                            {data.skills.filter(s => s.trim()).map((skill, index) => (
                                <span
                                    key={index}
                                    className="text-white px-2.5 py-1 rounded-full text-[10px] font-semibold"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education in Sidebar */}
                {data.education && data.education.length > 0 && (
                    <div className="mb-6">
                        <h3
                            className="text-xs font-bold tracking-widest uppercase mb-4 pb-2 border-b border-slate-600"
                            style={{ color: primaryColor }}
                        >
                            Education
                        </h3>
                        <div className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <GraduationCap className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                        <span className="text-white text-xs font-semibold">{edu.degree}</span>
                                    </div>
                                    <p className="text-slate-400 text-[10px] ml-5">{edu.school}</p>
                                    <p className="text-[10px] ml-5" style={{ color: primaryColor }}>{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Decorative element at bottom */}
                <div className="mt-auto pt-6">
                    <div
                        className="h-1 w-full rounded-full opacity-50"
                        style={{ backgroundColor: primaryColor }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 space-y-6 bg-white">
                {/* Header */}
                <div className="border-l-4 pl-5 mb-6" style={{ borderColor: primaryColor }}>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-1">
                        {data.personal.fullName}
                    </h1>
                    <p className="text-xl font-medium tracking-wide" style={{ color: primaryColor }}>
                        {data.personal.jobTitle}
                    </p>
                </div>

                {/* Summary */}
                {data.personal.summary && (
                    <div className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border-l-4" style={{ borderColor: primaryColor }}>
                        {data.personal.summary}
                    </div>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5" style={{ color: primaryColor }} />
                            Professional Experience
                        </h2>
                        <div className="space-y-5">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="relative pl-6 border-l-2 border-slate-200">
                                    <div
                                        className="absolute left-[-5px] top-1 w-2 h-2 rounded-full"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-base font-bold text-slate-800">{exp.title}</h3>
                                        <span
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                                            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                                        >
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium mb-2" style={{ color: primaryColor }}>{exp.company}</p>
                                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
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
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5" style={{ color: primaryColor }} />
                            {section.title}
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                            {section.items.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="p-3 rounded-lg border-l-4"
                                    style={{ backgroundColor: `${primaryColor}08`, borderColor: primaryColor }}
                                >
                                    <h3 className="font-semibold text-slate-700 text-sm">{item.title}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
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
