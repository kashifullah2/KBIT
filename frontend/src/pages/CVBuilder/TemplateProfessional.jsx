import React from 'react';

const TemplateProfessional = ({ data }) => {
  const { personalInfo, experience, education, skills, certifications, languages } = data;

  return (
    <div className="flex flex-col w-full h-full bg-white font-serif text-gray-900 p-12">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-6 mb-6 text-center">
        <h1 className="text-4xl tracking-tight mb-2 uppercase font-semibold text-gray-900 break-words">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-sm font-sans tracking-widest text-gray-500 uppercase font-medium mb-3 break-words">
          {personalInfo.jobTitle}
        </p>
        <div className="flex justify-center flex-wrap gap-4 text-xs font-sans text-gray-600">
          {personalInfo.phone && <span className="break-words">{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span className="text-gray-300">•</span>}
          {personalInfo.email && <span className="break-all">{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.address && <span className="text-gray-300">•</span>}
          {personalInfo.address && <span className="break-words max-w-[400px] text-center">{personalInfo.address}</span>}
          
          {(personalInfo.linkedin || personalInfo.github) && (
            <div className="w-full flex justify-center gap-4 mt-1">
              {personalInfo.linkedin && <a href={personalInfo.linkedin} className="break-all text-blue-600 hover:text-blue-800 font-medium">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a>}
              {personalInfo.linkedin && personalInfo.github && <span className="text-gray-300">•</span>}
              {personalInfo.github && <a href={personalInfo.github} className="break-all text-gray-800 hover:text-gray-600 font-medium">github.com/{personalInfo.github.split('/').pop()}</a>}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1 text-gray-800">
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 text-justify font-sans whitespace-pre-wrap break-words">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1 text-gray-800">
              Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <span className="text-sm font-sans text-gray-500 italic">
                      {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2 font-sans uppercase tracking-wide">
                    {exp.company}
                  </div>
                  <div className="text-sm leading-relaxed text-gray-700 font-sans ml-4 list-outside">
                    {exp.description?.split('\n')
                      .map(line => line.trim())
                      .filter(Boolean)
                      .map((line, j) => {
                      const text = line.replace(/^- /,'');
                      if(!text) return null;
                      return (
                        <div key={j} className={`flex gap-2 mb-1.5 break-inside-avoid break-words whitespace-pre-wrap`}>
                          {line.startsWith('-') && <span className="text-gray-400 mt-[1px] shrink-0">•</span>}
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

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1 text-gray-800">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline break-inside-avoid">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.school}</h3>
                    <p className="text-sm text-gray-700 font-sans">{edu.degree}</p>
                  </div>
                  <span className="text-sm font-sans text-gray-500 italic">
                    {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1 text-gray-800">
              Certifications
            </h2>
            <div className="space-y-4">
              {certifications.map((cert, i) => (
                <div key={i} className="flex justify-between items-baseline break-inside-avoid">
                  <div>
                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-sm text-gray-700 font-sans uppercase tracking-wide text-xs mt-0.5">{cert.issuer}</p>
                  </div>
                  {cert.date && <span className="text-sm font-sans text-gray-500 italic">
                    {cert.date}
                  </span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          {/* Skills */}
          {skills?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1 text-gray-800">
                Skills & Expertise
              </h2>
              <div className="text-sm font-sans text-gray-700 leading-relaxed">
                {skills.join(' • ')}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1 text-gray-800">
                Languages
              </h2>
              <div className="text-sm font-sans text-gray-700 leading-relaxed">
                {languages.map(l => l.name).join(' • ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateProfessional;
