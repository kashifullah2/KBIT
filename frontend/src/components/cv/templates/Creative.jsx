import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

export const Creative = React.forwardRef(({ data }, ref) => {
    return (
        <div ref={ref} className="w-[210mm] min-h-[297mm] bg-white text-slate-800 flex print:m-0 print:shadow-none">
            {/* Sidebar - Dark/Colorful */}
            <div className="w-[70mm] bg-[#1e293b] text-white p-8 flex flex-col gap-8 print:bg-[#1e293b] print:print-color-adjust-exact">
                {/* Profile Picture Placeholder (optional) */}
                <div className="w-32 h-32 bg-indigo-500 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-4">
                    {data.personal.fullName ? data.personal.fullName.charAt(0) : 'U'}
                </div>

                {/* Contact Info */}
                <div className="space-y-4 text-sm">
                    <h3 className="text-indigo-400 font-bold tracking-widest uppercase mb-4 border-b border-gray-600 pb-2">
                        Contact
                    </h3>
                    {data.personal.email && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <Mail className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="opacity-90">{data.personal.email}</span>
                        </div>
                    )}
                    {data.personal.phone && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <Phone className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="opacity-90">{data.personal.phone}</span>
                        </div>
                    )}
                    {data.personal.address && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <MapPin className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="opacity-90">{data.personal.address}</span>
                        </div>
                    )}
                    {data.personal.website && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <Globe className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="opacity-90">{data.personal.website}</span>
                        </div>
                    )}
                    {data.personal.linkedin && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <Linkedin className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="opacity-90 truncate max-w-[150px]">{data.personal.linkedin}</span>
                        </div>
                    )}
                </div>

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <div>
                        <h3 className="text-indigo-400 font-bold tracking-widest uppercase mb-4 border-b border-gray-600 pb-2">
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, index) => (
                                <span key={index} className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-semibold">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 space-y-8 bg-white">
                {/* Header */}
                <div className="border-l-4 border-indigo-600 pl-6">
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">
                        {data.personal.fullName}
                    </h1>
                    <p className="text-xl text-indigo-600 font-medium tracking-wide">
                        {data.personal.jobTitle}
                    </p>
                </div>

                {/* Summary */}
                {data.personal.summary && (
                    <div className="text-slate-600 leading-relaxed text-[15px]">
                        {data.personal.summary}
                    </div>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="relative pl-8 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200 last:before:hidden">
                                    <div className="absolute left-0 top-2 w-4 h-4 bg-indigo-100 border-2 border-indigo-600 rounded-full"></div>
                                    <h3 className="text-lg font-bold text-slate-800">{exp.title}</h3>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-indigo-600 font-medium">{exp.company}</div>
                                        <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                            {exp.startDate} - {exp.endDate}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                            Education
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {data.education.map((edu, index) => (
                                <div key={index} className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-500">
                                    <h3 className="font-bold text-slate-800">{edu.degree}</h3>
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-indigo-600 font-medium">{edu.school}</span>
                                        <span className="text-slate-500 font-semibold">{edu.year}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Custom Sections */}
                {data.customSections && data.customSections.map((section, index) => (
                    <div key={index}>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {section.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="bg-slate-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-slate-700">{item.title}</h3>
                                    <p className="text-sm text-slate-600 mt-1">{item.description}</p>
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
