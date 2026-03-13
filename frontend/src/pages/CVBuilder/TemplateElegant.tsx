import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';
import { TemplateProps } from './types';

/**
 * Elegant CV Template
 * A minimalist, typography-focused design with a spacious and balanced layout.
 */
const TemplateElegant: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, projects = [], education, skills, certifications, languages, customFields = [] } = data;

  return (
    <div className="flex flex-col w-full min-h-[297mm] bg-[#FAFAFA] text-slate-800 p-16 font-sans">

      {/* Header Info */}
      <div className="mb-10 w-full text-center">
        <h1 className="text-5xl font-light tracking-[0.1em] text-slate-900 mb-3 uppercase">
          {personalInfo.firstName} <span className="font-bold">{personalInfo.lastName}</span>
        </h1>
        <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase mb-5">
          {personalInfo.jobTitle}
        </p>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600 tracking-wide">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5 break-all">
              <Mail size={12} className="text-slate-400 shrink-0" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={12} className="text-slate-400 shrink-0" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.address && (
            <span className="flex items-center gap-1.5 break-words max-w-[300px]">
              <MapPin size={12} className="text-slate-400 shrink-0" />
              {personalInfo.address}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Linkedin size={12} className="text-slate-400 shrink-0" />
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Github size={12} className="text-slate-400 shrink-0" />
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                github.com/{personalInfo.github.split('/').pop()}
              </a>
            </span>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-slate-200 mb-10"></div>

      <div className="flex-1 flex flex-col gap-10">

        {/* Professional Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Profile</h2>
            <p className="text-sm leading-loose text-slate-700 font-light text-justify break-words whitespace-pre-wrap">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Experience</h2>
            <div className="space-y-8 pl-1">
              {experience.map((exp, i) => (
                <div key={i} className="group break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <h3 className="text-base font-semibold text-slate-900">{exp.title}</h3>
                    <span className="text-xs font-medium text-slate-500 tracking-widest uppercase ml-4 shrink-0">
                      {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ''}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-600 mb-3 uppercase tracking-wide">{exp.company}</h4>
                  <div className="text-sm text-slate-700 font-light leading-relaxed pl-4 border-l border-slate-200">
                    {exp.description?.split('\n')
                      .map(line => line.trim())
                      .filter(Boolean)
                      .map((line, j) => {
                        const text = line.replace(/^- /, '');
                        if (!text) return null;
                        return (
                          <div key={j} className="flex gap-2.5 mb-2 break-words whitespace-pre-wrap">
                            {line.startsWith('-') && <span className="text-slate-300 font-black mt-0.5 shrink-0">·</span>}
                            <span>{text}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Projects</h2>
            <div className="space-y-8 pl-1">
              {projects.map((proj, i) => (
                <div key={i} className="group break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <h3 className="text-base font-semibold text-slate-900">
                      {proj.name}
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="ml-3 text-slate-400 hover:text-slate-600 transition-colors">
                          <span className="text-[10px] font-bold uppercase tracking-widest border border-slate-200 px-2 py-0.5 rounded">Link</span>
                        </a>
                      )}
                    </h3>
                    <span className="text-xs font-medium text-slate-500 tracking-widest uppercase ml-4 shrink-0">
                      {proj.startDate} {proj.endDate ? `— ${proj.endDate}` : ''}
                    </span>
                  </div>
                  <div className="text-sm text-slate-700 font-light leading-relaxed pl-4 border-l border-slate-100 whitespace-pre-wrap">
                    {proj.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two Column Footer Split */}
        <div className="grid grid-cols-2 gap-12 pt-4 border-t border-slate-200 mt-auto">

          <div className="space-y-10">
            {/* Education */}
            {education && education.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">Education</h2>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <div key={i} className="break-inside-avoid">
                      <h3 className="text-sm font-semibold text-slate-900 leading-tight">{edu.degree}</h3>
                      <p className="text-sm text-slate-600 mt-1">{edu.school}</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">{edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ''}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">Certifications</h2>
                <div className="space-y-4">
                  {certifications.map((cert, i) => (
                    <div key={i} className="break-inside-avoid">
                      <h3 className="text-sm font-semibold text-slate-900 leading-tight">{cert.name}</h3>
                      <p className="text-xs text-slate-600 mt-1 uppercase tracking-wider">{cert.issuer}</p>
                      {cert.date && <p className="text-xs text-slate-400 mt-1 font-medium">{cert.date}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-10">
            {/* Skills */}
            {skills && skills.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded block border border-slate-200 uppercase tracking-widest">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">Languages</h2>
                <div className="flex flex-col gap-3">
                  {languages.map((lang, i) => (
                    <div key={i} className="text-sm font-medium text-slate-700 flex items-center gap-2 uppercase tracking-widest">
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      {lang.name}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Custom Fields */}
            {customFields && customFields.length > 0 && (
              <section>
                <div className="flex flex-col gap-8 pl-1">
                  {customFields.map((field, i) => (
                    <div key={i} className="group break-inside-avoid">
                      {field.title && (
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                            {field.title}
                            {field.link && (
                              <a href={field.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <span className="text-[9px] font-bold uppercase tracking-widest border border-slate-200 px-1.5 py-0.5 rounded">URL</span>
                              </a>
                            )}
                          </h3>
                        </div>
                      )}
                      {field.subtitle && <p className="text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">{field.subtitle}</p>}
                      {(field.startDate || field.endDate) && (
                        <p className="text-[10px] text-slate-400 mb-1 font-medium tracking-wide uppercase">
                          {field.startDate} {field.endDate ? `— ${field.endDate}` : ''}
                        </p>
                      )}
                      {field.location && <p className="text-[10px] text-slate-400 mb-1 italic">{field.location}</p>}
                      {field.description && (
                         <div className="text-[13px] text-slate-700 font-light leading-relaxed whitespace-pre-wrap mt-2">
                           {field.description}
                         </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TemplateElegant;
