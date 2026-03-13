import React from "react";
import { TemplateProps } from "./types";

const TemplateCreative: React.FC<TemplateProps> = ({ data }) => {

  const {
    personalInfo = {} as TemplateProps['data']['personalInfo'],
    experience = [],
    education = [],
    skills = [],
    certifications = [],
    languages = [],
    customFields = []
  } = data || {} as TemplateProps['data'];

  return (
    <div className="w-[210mm] h-[297mm] bg-white font-sans text-gray-800 flex flex-col">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-10 py-7 flex justify-between">

        <div>
          <h1 className="text-[34px] font-bold">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>

          <p className="text-[15px] uppercase tracking-widest opacity-90">
            {personalInfo.jobTitle}
          </p>
        </div>

        <div className="text-right text-[14px] space-y-1">

          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.address && <div>{personalInfo.address}</div>}

        </div>

      </div>

      {/* BODY */}
      <div className="flex flex-1">

        {/* LEFT */}
        <div className="w-[65%] px-10 py-7 flex flex-col gap-7">

          {personalInfo.summary && (
            <section>

              <h2 className="text-[19px] font-bold border-b pb-1">
                Profile
              </h2>

              <p className="text-[14px] text-gray-600 mt-2 leading-relaxed">
                {personalInfo.summary}
              </p>

            </section>
          )}

          {experience.length > 0 && (
            <section>

              <h2 className="text-[19px] font-bold border-b pb-1">
                Experience
              </h2>

              <div className="space-y-5 mt-2">

                {experience.slice(0,4).map((exp,i)=>(
                  <div key={i} className="bg-gray-50 p-6 rounded-lg border">

                    <div className="flex justify-between text-[15px] font-semibold">

                      <span>{exp.title}</span>

                      <span className="text-gray-500 text-sm">
                        {exp.startDate} - {exp.endDate}
                      </span>

                    </div>

                    <div className="text-teal-600 text-sm font-semibold">
                      {exp.company}
                    </div>

                    <p className="text-[14px] text-gray-600 mt-2">
                      {exp.description}
                    </p>

                  </div>
                ))}

              </div>

            </section>
          )}

          {education.length > 0 && (
            <section>

              <h2 className="text-[19px] font-bold border-b pb-1">
                Education
              </h2>

              <div className="space-y-3 mt-2">

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

        </div>

        {/* SIDEBAR */}
        <div className="w-[35%] bg-slate-900 text-white px-7 py-7 flex flex-col gap-7">

          {skills.length > 0 && (
            <section>

              <h2 className="text-[17px] font-bold mb-2 uppercase">
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">

                {skills.slice(0,12).map((skill,i)=>(
                  <span key={i} className="bg-slate-800 text-sm px-3 py-1.5 rounded">
                    {skill}
                  </span>
                ))}

              </div>

            </section>
          )}

          {languages.length > 0 && (
            <section>

              <h2 className="text-[17px] font-bold mb-2 uppercase">
                Languages
              </h2>

              <ul className="text-[14px] space-y-1">
                {languages.map((lang,i)=>(
                  <li key={i}>{lang.name}</li>
                ))}
              </ul>

            </section>
          )}

          {certifications.length > 0 && (
            <section>

              <h2 className="text-[17px] font-bold mb-2 uppercase">
                Certifications
              </h2>

              <div className="space-y-2 text-[14px]">

                {certifications.map((cert,i)=>(
                  <div key={i}>

                    <div className="font-semibold">{cert.name}</div>
                    <div className="text-gray-400 text-sm">{cert.issuer}</div>

                  </div>
                ))}

              </div>

            </section>
          )}

          {customFields && customFields.length > 0 && (
            <section>

              <h2 className="text-[17px] font-bold mb-2 uppercase">
                Additional
              </h2>

              <div className="space-y-2 text-[14px]">

                {customFields.map((field, i) => (
                  <div key={i}>
                    <div className="font-semibold">{field.label}</div>
                    <div className="text-gray-400 text-sm">{field.value}</div>
                  </div>
                ))}

              </div>

            </section>
          )}

        </div>

      </div>

    </div>
  );
};

export default TemplateCreative;