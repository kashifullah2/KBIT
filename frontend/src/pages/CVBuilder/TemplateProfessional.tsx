import React from 'react';
import { TemplateProps } from './types';

const TemplateProfessional: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience = [], education = [], projects = [], skills = [], certifications = [], languages = [], customFields = [] } = data;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 px-[20mm] py-[20mm] flex flex-col font-serif relative print:shadow-none print:m-0">
      
      {/* Structural Accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800" />

      {/* Header */}
      <header className="mb-8 border-b-2 border-slate-100 pb-8 overflow-hidden">
        <div className="flex flex-col items-center">
          <h1 className="text-[38px] font-bold text-slate-900 uppercase tracking-tighter leading-tight mb-2 text-center">
            {personalInfo.firstName} <span className="text-slate-500 font-medium">{personalInfo.lastName}</span>
          </h1>
          
          <div className="text-[14px] font-sans font-bold uppercase tracking-[3px] text-slate-500 mb-6 px-4 py-1 border-x border-slate-200">
            {personalInfo.jobTitle || 'Professional Title'}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-y-2 gap-x-6 text-[12px] font-sans text-slate-600 font-medium">
            {personalInfo.email && (
              <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.address && (
              <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors max-w-[300px] truncate">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                {personalInfo.address}
              </span>
            )}
          </div>

          {(personalInfo.linkedin || personalInfo.github) && (
            <div className="mt-3 flex items-center gap-4 text-[11px] font-sans text-slate-400 font-bold uppercase tracking-widest">
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
                  LinkedIn
                </a>
              )}
              {personalInfo.linkedin && personalInfo.github && <span className="text-slate-200">/</span>}
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
                  GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 space-y-8">
        
        {/* Professional Summary */}
        {personalInfo.summary && (
          <section className="break-inside-avoid">
            <div className="flex gap-6">
              <div className="w-40 shrink-0">
                <h2 className="text-[13px] font-sans font-extrabold uppercase tracking-[0.2em] text-slate-800 pt-1">
                  Profile
                </h2>
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-sans leading-relaxed text-slate-700 text-left whitespace-pre-wrap">
                  {personalInfo.summary}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <section>
            <div className="flex gap-6">
              <div className="w-40 shrink-0">
                <h2 className="text-[13px] font-sans font-extrabold uppercase tracking-[0.2em] text-slate-800 pt-1">
                  Experience
                </h2>
              </div>
              <div className="flex-1 space-y-6">
                {experience.map((exp, i) => (
                  <div key={i} className="break-inside-avoid group">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[16px] font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                        {exp.title}
                      </h3>
                      <span className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider italic">
                        {exp.startDate} — {exp.endDate || 'Present'}
                      </span>
                    </div>
                    <div className="text-[12px] font-sans font-extrabold text-slate-600 uppercase tracking-widest mb-3">
                      {exp.company}
                    </div>
                    <div className="text-[13px] font-sans leading-relaxed text-slate-700 space-y-1.5 ml-4">
                      {exp.description?.split('\n')
                        .map(line => line.trim())
                        .filter(Boolean)
                        .map((line, j) => (
                          <div key={j} className="relative pl-4">
                            <span className="absolute left-0 top-[8px] w-1.5 h-1.5 bg-slate-300 rounded-full" />
                            {line.startsWith('-') ? line.substring(1).trim() : line}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <div className="flex gap-6">
              <div className="w-40 shrink-0">
                <h2 className="text-[13px] font-sans font-extrabold uppercase tracking-[0.2em] text-slate-800 pt-1">
                  Education
                </h2>
              </div>
              <div className="flex-1 space-y-5">
                {education.map((edu, i) => (
                  <div key={i} className="break-inside-avoid flex justify-between items-start">
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-900">{edu.school}</h3>
                      <p className="text-[12px] font-sans font-bold text-slate-500 uppercase tracking-wide">{edu.degree}</p>
                    </div>
                    <span className="text-[11px] font-sans font-bold text-slate-400 italic">
                      {edu.startDate} — {edu.endDate || 'Present'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Skills - Modern Grid */}
        {skills.length > 0 && (
          <section className="break-inside-avoid">
            <div className="flex gap-6">
              <div className="w-40 shrink-0">
                <h2 className="text-[13px] font-sans font-extrabold uppercase tracking-[0.2em] text-slate-800 pt-1">
                  Expertise
                </h2>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 font-sans font-bold text-[10px] uppercase tracking-widest rounded-sm border border-slate-200/50">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Certifications / Projects / Others */}
        <div className="grid grid-cols-2 gap-12">
          {certifications.length > 0 && (
            <div className="break-inside-avoid">
              <h2 className="text-[13px] font-sans font-extrabold uppercase tracking-[0.2em] text-slate-800 mb-4 border-b border-slate-200 pb-2">
                Certifications
              </h2>
              <div className="space-y-4">
                {certifications.map((cert, i) => (
                  <div key={i}>
                    <h3 className="text-[13px] font-bold text-slate-800 leading-tight">{cert.name}</h3>
                    <p className="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-wide mt-0.5">{cert.issuer}</p>
                    {cert.date && <p className="text-[10px] font-sans text-slate-400 italic mt-0.5">{cert.date}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div className="break-inside-avoid">
              <h2 className="text-[13px] font-sans font-extrabold uppercase tracking-[0.2em] text-slate-800 mb-4 border-b border-slate-200 pb-2">
                Languages
              </h2>
              <div className="space-y-3">
                {languages.map((lang, i) => (
                  <div key={i} className="flex justify-between items-center text-[13px] font-sans">
                    <span className="font-bold text-slate-700">{lang.name}</span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      {lang.level || 'Fluent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Projects (Full Width) */}
        {projects.length > 0 && (
          <section>
            <div className="flex gap-6">
              <div className="w-40 shrink-0">
                <h2 className="text-[13px] font-sans font-extrabold uppercase tracking-[0.2em] text-slate-800 pt-1">
                  Projects
                </h2>
              </div>
              <div className="flex-1 space-y-6">
                {projects.map((proj, i) => (
                  <div key={i} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-slate-700 transition-colors uppercase">
                        {proj.name}
                      </h3>
                      <span className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider italic">
                        {proj.startDate} — {proj.endDate || 'Present'}
                      </span>
                    </div>
                    <p className="text-[12px] font-sans leading-relaxed text-slate-600 mb-2 italic">
                      {proj.description}
                    </p>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[11px] font-sans font-bold text-slate-400 underline uppercase tracking-tighter">
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Modern Footer Divider */}
      <footer className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center opacity-50">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-slate-400">Personal Data & References available upon request</span>
        <span className="w-8 h-1 bg-slate-200" />
      </footer>
    </div>
  );
};

export default TemplateProfessional;