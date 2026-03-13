import React from "react";
import { TemplateProps } from "./types";

const TemplateModern: React.FC<TemplateProps> = ({ data }) => {

  const {
    personalInfo = {} as TemplateProps['data']['personalInfo'],
    experience = [],
    education = [],
    projects = [],
    skills = [],
    certifications = [],
    languages = [],
    hobbies = [],
    customFields = []
  } = data || {} as TemplateProps['data'];

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white font-sans text-gray-800 flex">

      {/* LEFT SIDEBAR */}
      <div className="w-[34%] bg-slate-900 text-white px-7 py-7 flex flex-col gap-7">

        <div>
          <h1 className="text-[32px] font-bold leading-tight">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>

          <p className="text-[15px] text-teal-400 uppercase tracking-widest mt-1">
            {personalInfo.jobTitle}
          </p>
        </div>

        <div className="space-y-2 text-[14px]">

          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.address && <div>{personalInfo.address}</div>}

        </div>

        {skills.length > 0 && (
          <div>
            <h2 className="text-[17px] font-bold mb-2">Skills</h2>

            <div className="flex flex-wrap gap-2">
              {skills.slice(0,12).map((skill,i)=>(
                <span key={i} className="bg-slate-800 text-sm px-3 py-1.5 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <h2 className="text-[17px] font-bold mb-2">Languages</h2>

            <ul className="text-[14px] space-y-1">
              {languages.map((lang,i)=>(
                <li key={i}>{lang.name}</li>
              ))}
            </ul>
          </div>
        )}

        {hobbies && hobbies.length > 0 && (
          <div>
            <h2 className="text-[17px] font-bold mb-2">Hobbies</h2>

            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby, i) => (
                <span key={i} className="text-[14px] opacity-80 flex items-center gap-2">
                   <span className="w-1 h-1 bg-teal-400 rounded-full"></span>
                   {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MAIN CONTENT */}
      <div className="w-[66%] px-10 py-7 flex flex-col gap-7">

        {personalInfo.summary && (
          <section>

            <h2 className="text-[19px] font-bold mb-2 border-b pb-1">
              Profile
            </h2>

            <p className="text-[14px] text-gray-600 leading-relaxed">
              {personalInfo.summary}
            </p>

          </section>
        )}

        {experience.length > 0 && (
          <section>

            <h2 className="text-[19px] font-bold mb-3 border-b pb-1">
              Experience
            </h2>

            <div className="space-y-4">

              {experience.slice(0,4).map((exp,i)=>(
                <div key={i}>

                  <div className="flex justify-between text-[15px] font-semibold">
                    <span>{exp.title}</span>
                    <span className="text-gray-500 text-sm">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>

                  <div className="text-teal-600 text-sm font-semibold">
                    {exp.company}
                  </div>

                  <p className="text-[14px] text-gray-600 mt-1">
                    {exp.description}
                  </p>

                </div>
              ))}

            </div>

          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-[19px] font-bold mb-3 border-b pb-1">
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[15px] font-semibold">
                    <span>{proj.name}</span>
                    <span className="text-gray-500 text-sm">
                      {proj.startDate} - {proj.endDate}
                    </span>
                  </div>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-xs font-semibold block">
                      {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  )}
                  <p className="text-[14px] text-gray-600 mt-1 whitespace-pre-wrap">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>

            <h2 className="text-[19px] font-bold mb-3 border-b pb-1">
              Education
            </h2>

            <div className="space-y-3">

              {education.map((edu,i)=>(
                <div key={i}>

                  <div className="flex justify-between text-[15px] font-semibold">
                    <span>{edu.degree}</span>
                    <span className="text-gray-500 text-sm">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>

                  <div className="text-teal-600 text-sm font-semibold">
                    {edu.school}
                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

        {certifications.length > 0 && (
          <section>

            <h2 className="text-[19px] font-bold mb-3 border-b pb-1">
              Certifications
            </h2>

            <div className="space-y-2">

              {certifications.map((cert,i)=>(
                <div key={i} className="text-[14px]">

                  <div className="font-semibold">{cert.name}</div>
                  <div className="text-gray-500 text-sm">{cert.issuer}</div>

                </div>
              ))}

            </div>

          </section>
        )}

        {customFields && customFields.length > 0 && (
          <section>
            <div className="space-y-4">

              {customFields.map((field, i) => (
                <div key={i} className="text-[14px]">
                  {field.title && (
                    <div className="flex justify-between font-semibold text-[15px]">
                      <span>{field.title}</span>
                      {(field.startDate || field.endDate) && (
                        <span className="text-gray-500 text-sm font-normal">
                          {field.startDate} {field.endDate ? ` - ${field.endDate}` : ''}
                        </span>
                      )}
                    </div>
                  )}
                  {field.subtitle && (
                    <div className="text-teal-600 font-semibold text-sm">
                      {field.subtitle}
                    </div>
                  )}
                  {field.link && (
                    <a href={field.link} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-xs hover:underline block mt-0.5">
                      {field.link.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  )}
                  {field.location && (
                    <div className="text-gray-500 text-xs italic mt-0.5">
                      {field.location}
                    </div>
                  )}
                  {field.description && (
                    <p className="text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">
                      {field.description}
                    </p>
                  )}
                </div>
              ))}

            </div>

          </section>
        )}

      </div>

    </div>
  );
};

export default TemplateModern;