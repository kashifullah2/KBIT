import React from 'react';
import { Mail, Phone, MapPin, GraduationCap, Brain, Globe, Briefcase, User, Award, BookOpen, FolderOpen, Puzzle } from 'lucide-react';
import { TemplateProps } from './types';

const TemplateTwoColumn: React.FC<TemplateProps> = ({ data }) => {
  const {
    personalInfo = {} as TemplateProps['data']['personalInfo'],
    experience = [],
    education = [],
    projects = [],
    skills = [],
    certifications = [],
    languages = [],
    customFields = []
  } = data || {} as TemplateProps['data'];

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white font-['Zilla_Slab'] text-[10pt] leading-[17px] flex shadow-lg mx-auto overflow-hidden">
      {/* LEFT SIDEBAR (44%) */}
      <div className="w-[44%] bg-[#193141] text-white flex flex-col p-[15mm]">
        {/* Profile Image */}
        {personalInfo.profileImage && (
          <div className="mb-6">
            <img 
              src={personalInfo.profileImage} 
              alt="Profile" 
              className="w-[130px] h-[130px] object-cover rounded shadow-md border-2 border-white/10"
            />
          </div>
        )}

        {/* Name & Title */}
        <div className="mb-8 font-['Outfit']">
          <h1 className="text-[24.5pt] font-bold leading-tight mb-2 break-words">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-[16.5pt] font-normal opacity-90 break-words">
            {personalInfo.jobTitle}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-10 text-[10pt]">
          {personalInfo.email && (
            <div className="flex items-center gap-3">
              <Mail size={16} className="shrink-0" />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-3">
              <Phone size={16} className="shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-start gap-3 text-justify">
              <MapPin size={16} className="shrink-0 mt-0.5" />
              <span className="break-words">{personalInfo.address}</span>
            </div>
          )}
        </div>

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-center bg-white/10 py-1.5 rounded mb-4 uppercase font-bold tracking-wider text-[12pt] gap-2 font-['Outfit']">
              <GraduationCap size={18} />
              <span>Education</span>
            </div>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i}>
                  <p className="font-bold">{edu.degree}</p>
                  <p className="text-[9pt] opacity-80 italic">{edu.school}</p>
                  <p className="text-[8pt] opacity-70">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-center bg-white/10 py-1.5 rounded mb-4 uppercase font-bold tracking-wider text-[12pt] gap-2 font-['Outfit']">
              <Brain size={18} />
              <span>Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="bg-white/10 px-2 py-1 rounded text-[9pt]">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-center bg-white/10 py-1.5 rounded mb-4 uppercase font-bold tracking-wider text-[12pt] gap-2 font-['Outfit']">
              <Globe size={18} />
              <span>Languages</span>
            </div>
            <div className="space-y-1 text-[10pt]">
              {languages.map((lang, i) => (
                <div key={i} className="flex justify-between uppercase">
                  <span>{lang.name}</span>
                  {lang.level && <span className="opacity-70">{lang.level}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects in Sidebar (matching the requested structure) */}
        {projects.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-center bg-white/10 py-1.5 rounded mb-4 uppercase font-bold tracking-wider text-[12pt] gap-2 font-['Outfit']">
              <FolderOpen size={18} />
              <span>Projects</span>
            </div>
            <div className="space-y-4">
              {projects.map((proj, i) => (
                <div key={i}>
                  <p className="font-bold">{proj.name}</p>
                  <p className="text-[9pt] opacity-80 leading-snug">{proj.description}</p>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[8pt] text-teal-300 underline block mt-1">
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT CONTENT (56%) */}
      <div className="w-[56%] bg-white text-[#222222] flex flex-col p-[15mm] flex-grow">
        
        {/* Profile / Summary - MOVED TO TOP */}
        {personalInfo.summary && (
          <section className="mb-10">
            <div className="flex items-center justify-center bg-black/5 py-1.5 rounded mb-5 uppercase font-bold tracking-wider text-[12pt] gap-2 font-['Outfit']">
              <User size={18} />
              <span>Profile</span>
            </div>
            <p className="text-[10pt] leading-relaxed text-gray-600 text-justify whitespace-pre-wrap">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-center bg-black/5 py-1.5 rounded mb-5 uppercase font-bold tracking-wider text-[12pt] gap-2 font-['Outfit']">
              <Briefcase size={18} />
              <span>Professional Experience</span>
            </div>
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-[11pt] font-['Outfit']">{exp.title}</h3>
                    <span className="text-[9pt] text-gray-500 italic shrink-0 ml-2">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <p className="text-[10pt] font-semibold text-gray-700 uppercase mb-2 font-['Outfit']">{exp.company}</p>
                  <p className="text-[10pt] leading-relaxed text-gray-600 whitespace-pre-wrap text-justify">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-center bg-black/5 py-1.5 rounded mb-5 uppercase font-bold tracking-wider text-[12pt] gap-2 font-['Outfit']">
              <Award size={18} />
              <span>Certificates</span>
            </div>
            <div className="space-y-4">
              {certifications.map((cert, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[10pt] font-['Outfit']">{cert.name}</p>
                    <p className="text-[9pt] text-gray-500 uppercase tracking-wide font-['Outfit']">{cert.issuer}</p>
                  </div>
                  {cert.date && <span className="text-[9pt] text-gray-400 italic">{cert.date}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Fields */}
        {customFields && customFields.length > 0 && (
          <section className="mb-10">
            <div className="space-y-6">
              {customFields.map((field, i) => (
                <div key={i}>
                  {field.title && (
                    <div className="flex justify-between items-baseline mb-1 font-['Outfit']">
                      <h4 className="font-bold text-[11pt]">{field.title}</h4>
                      {(field.startDate || field.endDate) && (
                        <span className="text-[9pt] text-gray-400 italic">
                          {field.startDate} {field.endDate ? `— ${field.endDate}` : ''}
                        </span>
                      )}
                    </div>
                  )}
                  {field.subtitle && <p className="text-[10pt] font-semibold text-gray-500 uppercase mb-1 font-['Outfit']">{field.subtitle}</p>}
                  {field.location && <p className="text-[9pt] text-gray-400 italic mb-2">{field.location}</p>}
                  {field.description && <p className="text-[10pt] text-gray-600 text-justify whitespace-pre-wrap">{field.description}</p>}
                  {field.link && (
                    <a href={field.link} target="_blank" rel="noopener noreferrer" className="text-[9pt] text-blue-500 underline mt-2 block">
                      {field.link.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Page Info Overlay (Fixed at bottom) */}
      <div className="absolute bottom-[10mm] left-0 right-0 flex px-[15mm] text-[9pt] font-medium opacity-60 pointer-events-none font-['Outfit']">
        <div className="w-[44%] text-white">
        </div>
        <div className="w-[56%] text-right text-[#222222]">
          1 / 1
        </div>
      </div>
    </div>
  );
};

export default TemplateTwoColumn;
