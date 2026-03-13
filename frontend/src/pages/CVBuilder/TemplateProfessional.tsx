import React from 'react';
import { TemplateProps } from './types';

const TemplateProfessional: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, certifications, languages, customFields = [] } = data;

  return (
    <div className="w-[210mm] h-[297mm] bg-white font-serif text-gray-900 px-[22mm] pt-[18mm] pb-[22mm] flex flex-col">

      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-6 mb-6 text-center">

        <h1 className="text-[42px] tracking-tight uppercase font-semibold mb-2 break-words">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>

        <p className="text-[14px] font-sans tracking-[3px] text-gray-500 uppercase mb-3 break-words">
          {personalInfo.jobTitle}
        </p>

        <div className="flex justify-center flex-wrap gap-3 text-[13px] font-sans text-gray-600">

          {personalInfo.phone && <span>{personalInfo.phone}</span>}

          {personalInfo.phone && personalInfo.email && <span className="text-gray-300">•</span>}

          {personalInfo.email && <span className="break-all">{personalInfo.email}</span>}

          {personalInfo.email && personalInfo.address && <span className="text-gray-300">•</span>}

          {personalInfo.address && (
            <span className="max-w-[420px] text-center break-words">
              {personalInfo.address}
            </span>
          )}

        </div>

        {(personalInfo.linkedin || personalInfo.github) && (
          <div className="flex justify-center gap-4 text-[13px] mt-2 font-sans">

            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-all"
              >
                {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            )}

            {personalInfo.linkedin && personalInfo.github && <span className="text-gray-300">•</span>}

            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-600 break-all"
              >
                github.com/{personalInfo.github.split('/').pop()}
              </a>
            )}

          </div>
        )}

      </div>

      <div className="flex-1">

        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-6 break-inside-avoid">

            <h2 className="text-[18px] font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">
              Professional Summary
            </h2>

            <p className="text-[14px] leading-relaxed text-gray-700 text-justify font-sans whitespace-pre-wrap break-words">
              {personalInfo.summary}
            </p>

          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-6 break-inside-avoid">

            <h2 className="text-[18px] font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">
              Experience
            </h2>

            <div className="space-y-5">

              {experience.map((exp, i) => (
                <div key={i}>

                  <div className="flex justify-between items-baseline mb-1">

                    <h3 className="font-bold text-[15px] text-gray-900">
                      {exp.title}
                    </h3>

                    <span className="text-[13px] font-sans text-gray-500 italic">
                      {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}
                    </span>

                  </div>

                  <div className="text-[13px] font-semibold text-gray-700 mb-2 font-sans uppercase tracking-wide">
                    {exp.company}
                  </div>

                  <div className="text-[14px] leading-relaxed text-gray-700 font-sans ml-4">

                    {exp.description?.split('\n')
                      .map(line => line.trim())
                      .filter(Boolean)
                      .map((line, j) => {
                        const text = line.replace(/^- /, '');

                        return (
                          <div key={j} className="flex gap-2 mb-1.5 break-words">

                            {line.startsWith('-') && (
                              <span className="text-gray-400 shrink-0">•</span>
                            )}

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

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-6 break-inside-avoid">

            <h2 className="text-[18px] font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">
              Education
            </h2>

            <div className="space-y-4">

              {education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">

                  <div>

                    <h3 className="font-bold text-[15px] text-gray-900">
                      {edu.school}
                    </h3>

                    <p className="text-[14px] text-gray-700 font-sans">
                      {edu.degree}
                    </p>

                  </div>

                  <span className="text-[13px] font-sans text-gray-500 italic">
                    {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}
                  </span>

                </div>
              ))}

            </div>

          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section className="mb-6 break-inside-avoid">

            <h2 className="text-[18px] font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">
              Certifications
            </h2>

            <div className="space-y-3">

              {certifications.map((cert, i) => (
                <div key={i} className="flex justify-between items-baseline">

                  <div>

                    <h3 className="font-bold text-[15px] text-gray-900">
                      {cert.name}
                    </h3>

                    <p className="text-[12px] text-gray-700 font-sans uppercase tracking-wide">
                      {cert.issuer}
                    </p>

                  </div>

                  {cert.date && (
                    <span className="text-[13px] font-sans text-gray-500 italic">
                      {cert.date}
                    </span>
                  )}

                </div>
              ))}

            </div>

          </section>
        )}

        <div className="grid grid-cols-2 gap-10">

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="break-inside-avoid">

              <h2 className="text-[18px] font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">
                Skills & Expertise
              </h2>

              <div className="text-[14px] font-sans text-gray-700 leading-relaxed uppercase tracking-wider">
                {skills.join(' • ')}
              </div>

            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="break-inside-avoid">

              <h2 className="text-[18px] font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">
                Languages
              </h2>

              <div className="text-[14px] font-sans text-gray-700 leading-relaxed uppercase tracking-wider">
                {languages.map(l => l.name).join(' • ')}
              </div>

            </div>
          )}

        </div>

        {/* Custom Fields */}
        {customFields && customFields.length > 0 && (
          <section className="mb-6 break-inside-avoid mt-4">

            <h2 className="text-[18px] font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">
              Additional Information
            </h2>

            <div className="grid grid-cols-2 gap-3">

              {customFields.map((field, i) => (
                <div key={i} className="text-[14px] font-sans">
                  <span className="font-bold text-gray-900">{field.label}: </span>
                  <span className="text-gray-700">{field.value}</span>
                </div>
              ))}

            </div>

          </section>
        )}

      </div>

    </div>
  );
};

export default TemplateProfessional;