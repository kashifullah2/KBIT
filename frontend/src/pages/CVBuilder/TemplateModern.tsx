import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';
import { TemplateProps } from './types';

/**
 * Modern CV Template
 * Features a dark sidebar for contact info and skills, with a clean light main area for experience.
 */
const TemplateModern: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, certifications, languages } = data;

  return (
    <div className="flex w-full h-full bg-white font-sans text-gray-800">
      {/* Left Column (Accent Sidebar) — Contact, Skills, Languages only */}
      <div className="w-1/3 bg-slate-900 text-white p-8 h-full overflow-hidden">
        <div className="mb-10 text-center border-b border-slate-700 pb-8">
          <div className="w-28 h-28 mx-auto bg-slate-700 rounded-full flex items-center justify-center text-4xl font-light mb-6 shadow-inner tracking-widest text-slate-300">
            {personalInfo.firstName?.charAt(0) || ''}{personalInfo.lastName?.charAt(0) || ''}
          </div>
          <h1 className="text-2xl font-light tracking-wide uppercase mb-2 leading-snug">
            {personalInfo.firstName || 'First'} <br />
            <span className="font-bold">{personalInfo.lastName || 'Last'}</span>
          </h1>
          <h2 className="text-xs font-medium text-blue-400 tracking-widest uppercase mt-1">
            {personalInfo.jobTitle || 'Profession'}
          </h2>
        </div>

        <div className="space-y-8">
          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-slate-700 pb-2 text-slate-400">Contact</h3>
            <ul className="space-y-3 text-sm font-light text-slate-200">
              {personalInfo.phone && (
                <li className="flex items-start gap-3">
                  <Phone size={14} className="text-blue-400 mt-0.5 opacity-80 shrink-0" />
                  <span className="break-all">{personalInfo.phone}</span>
                </li>
              )}
              {personalInfo.email && (
                <li className="flex items-start gap-3">
                  <Mail size={14} className="text-blue-400 mt-0.5 opacity-80 shrink-0" />
                  <span className="break-all">{personalInfo.email}</span>
                </li>
              )}
              {personalInfo.address && (
                <li className="flex items-start gap-3">
                  <MapPin size={14} className="text-blue-400 mt-0.5 opacity-80 shrink-0" />
                  <span className="break-words">{personalInfo.address}</span>
                </li>
              )}
              {personalInfo.linkedin && (
                <li className="flex items-start gap-3">
                  <Linkedin size={14} className="text-blue-400 mt-0.5 opacity-80 shrink-0" />
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="break-all hover:text-blue-300 text-xs">
                    {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </li>
              )}
              {personalInfo.github && (
                <li className="flex items-start gap-3">
                  <Github size={14} className="text-blue-400 mt-0.5 opacity-80 shrink-0" />
                  <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="break-all hover:text-blue-300 text-xs">
                    {personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-slate-700 pb-2 text-slate-400">Expertise</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-800 text-slate-200 text-[10px] rounded-full border border-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-slate-700 pb-2 text-slate-400">Languages</h3>
              <div className="flex flex-col gap-2">
                {languages.map((lang, i) => (
                  <div key={i} className="text-sm font-light text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0"></span>
                    {lang.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column — Profile, Education, Experience, Certifications */}
      <div className="w-2/3 p-9 h-full overflow-hidden bg-slate-50 flex flex-col gap-8">

        {/* Profile Summary */}
        {personalInfo.summary && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 border-t-2 border-blue-500"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Profile</h3>
            </div>
            <p className="text-sm font-light leading-relaxed text-slate-600 pl-10 text-justify whitespace-pre-wrap break-words">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Education — Moved from sidebar to main content */}
        {education && education.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 border-t-2 border-blue-500"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Education</h3>
            </div>
            <div className="space-y-4 pl-10">
              {education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm leading-snug">{edu.degree}</p>
                    <p className="font-light text-slate-500 italic text-xs mt-0.5">{edu.school}</p>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded ml-4 shrink-0 mt-0.5">
                    {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 border-t-2 border-blue-500"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Experience</h3>
            </div>
            <div className="space-y-6 pl-10 relative border-l border-slate-200">
              {experience.map((exp, i) => (
                <div key={i} className="relative">
                  <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -left-[5.5px] top-1.5 border-2 border-slate-50 shadow-sm"></div>
                  <div className="pl-5">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{exp.title}</h4>
                      <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded ml-2 shrink-0">
                        {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}
                      </span>
                    </div>
                    <h5 className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">{exp.company}</h5>
                    <div className="text-xs font-light leading-relaxed text-slate-600">
                      {exp.description?.split('\n')
                        .map(line => line.trim())
                        .filter(Boolean)
                        .map((line, j) => (
                          <p key={j} className={`mb-1.5 break-words whitespace-pre-wrap ${line.startsWith('-') ? 'flex gap-2' : ''}`}>
                            {line.startsWith('-') && <span className="text-blue-500 font-bold shrink-0">•</span>}
                            <span>{line.replace(/^- /, '')}</span>
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications — Moved from sidebar to main content */}
        {certifications && certifications.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 border-t-2 border-blue-500"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Certifications</h3>
            </div>
            <div className="space-y-3 pl-10">
              {certifications.map((cert, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm leading-snug">{cert.name}</p>
                    <p className="font-light text-slate-500 text-xs italic mt-0.5">{cert.issuer}</p>
                  </div>
                  {cert.date && (
                    <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded ml-4 shrink-0 mt-0.5">
                      {cert.date}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TemplateModern;
