import React from 'react';
import { TemplateProps } from './types';

/**
 * Creative CV Template
 * A modern, colorful design with a gradient header and a distinct dark sidebar for secondary info.
 */
const TemplateCreative: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, certifications, languages } = data;

  return (
    <div className="flex flex-col w-full h-full bg-[#FAFAFA] font-sans text-gray-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-10 flex items-center justify-between shadow-md">
        <div className="flex-1 pr-4">
          <h1 className="text-5xl font-black tracking-tight mb-2 drop-shadow-sm break-words">
            {personalInfo.firstName} <span className="font-light">{personalInfo.lastName}</span>
          </h1>
          <p className="text-lg font-medium tracking-widest uppercase opacity-90 drop-shadow-sm break-words">
            {personalInfo.jobTitle}
          </p>
        </div>
        <div className="text-right text-sm font-medium opacity-90 flex flex-col items-end gap-1.5 w-1/3 shrink-0">
          {personalInfo.email && <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm break-all max-w-[250px] inline-block shadow-sm font-bold">{personalInfo.email}</span>}
          {personalInfo.phone && <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm break-words max-w-[250px] inline-block shadow-sm font-bold">{personalInfo.phone}</span>}
          {personalInfo.address && <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm break-words max-w-[250px] inline-block whitespace-pre-wrap text-left leading-tight shadow-sm font-bold">{personalInfo.address}</span>}
          {(personalInfo.linkedin || personalInfo.github) && (
            <div className="flex gap-2 mt-1">
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="bg-teal-700/50 hover:bg-teal-700 px-3 py-1 rounded-full backdrop-blur-sm break-all max-w-[150px] inline-block shadow-sm font-bold transition-colors">
                  {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              )}
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="bg-emerald-700/50 hover:bg-emerald-700 px-3 py-1 rounded-full backdrop-blur-sm break-all max-w-[150px] inline-block shadow-sm font-bold transition-colors">
                  {personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 p-10 gap-10">
        
        {/* Main Content (Left) */}
        <div className="w-2/3 flex flex-col gap-10">
          
          {/* Summary */}
          {personalInfo.summary && (
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-teal-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">About Me</h2>
              <p className="text-sm text-gray-600 leading-relaxed font-medium whitespace-pre-wrap break-words">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-teal-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Work Experience</h2>
              <div className="space-y-8">
                {experience.map((exp, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                        <p className="text-teal-600 font-bold text-sm tracking-wide uppercase">{exp.company}</p>
                      </div>
                      <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-4 space-y-2">
                      {exp.description?.split('\n')
                        .map(line => line.trim())
                        .filter(Boolean)
                        .map((line, j) => {
                          const text = line.replace(/^- /, '');
                          if (!text) return null;
                          return (
                            <div key={j} className="flex gap-3 break-words whitespace-pre-wrap break-inside-avoid">
                              {line.startsWith('-') && <span className="text-teal-400 mt-0.5 font-black shrink-0">›</span>}
                              <span>{text}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (Right) */}
        <div className="w-1/3 flex flex-col gap-10">
          
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden flex-1 h-full min-h-[500px]">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-teal-500 rounded-full opacity-10 blur-2xl pointer-events-none"></div>
            <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-emerald-500 rounded-full opacity-10 blur-2xl pointer-events-none"></div>
            
            <div className="space-y-10 relative z-10">
              
              {/* Education */}
              {education && education.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-3 tracking-widest uppercase text-slate-100">
                    <span className="bg-teal-500 w-6 h-1 rounded-full block"></span> Education
                  </h2>
                  <div className="space-y-6">
                    {education.map((edu, i) => (
                      <div key={i} className="border-l-2 border-slate-700/50 pl-4 py-1">
                        <h3 className="font-bold text-white text-sm">{edu.degree}</h3>
                        <p className="text-teal-400 text-xs font-bold uppercase tracking-wide mt-1">{edu.school}</p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">{edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills && skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-3 tracking-widest uppercase text-slate-100">
                    <span className="bg-teal-500 w-6 h-1 rounded-full block"></span> Expertise
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 rounded-lg shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages && languages.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-3 tracking-widest uppercase text-slate-100">
                    <span className="bg-teal-500 w-6 h-1 rounded-full block"></span> Languages
                  </h2>
                  <div className="flex flex-col gap-2.5 text-sm font-medium text-slate-300">
                    {languages.map((lang, i) => (
                      <div key={i} className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                         {lang.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications && certifications.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-3 tracking-widest uppercase text-slate-100">
                    <span className="bg-teal-500 w-6 h-1 rounded-full block"></span> Accolades
                  </h2>
                  <div className="space-y-5">
                    {certifications.map((cert, i) => (
                      <div key={i} className="border-l-2 border-slate-700/50 pl-4 py-1">
                        <h3 className="font-bold text-white text-sm">{cert.name}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mt-1">{cert.issuer}</p>
                        {cert.date && <p className="text-xs text-teal-500/80 mt-1 font-bold">{cert.date}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCreative;
