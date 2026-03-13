import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCVStore from '../../store/useCVStore';
import { User, Briefcase, GraduationCap, Wrench, FileText, ChevronDown, Plus, Trash2, Wand2, Loader2, Heart } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { CVData, CustomField } from './types';

interface MD3InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const MD3Input: React.FC<MD3InputProps> = ({ label, name, value, onChange, type = "text", ...props }) => (
  <div className="relative w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="block px-4 pb-2.5 pt-5 w-full text-base text-slate-900 bg-transparent rounded-xl border-2 border-slate-200 appearance-none focus:outline-none focus:border-blue-600 peer transition-colors hover:border-slate-300 hover:bg-slate-50/50 focus:bg-white"
      placeholder=" "
      {...props}
    />
    <label className="absolute text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] px-2 left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none peer-focus:bg-white bg-white peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:-translate-y-3 peer-[&:not(:placeholder-shown)]:scale-75">
      {label}
    </label>
  </div>
);

interface MD3TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const MD3TextArea: React.FC<MD3TextAreaProps> = ({ label, name, value, onChange, rows = 5, ...props }) => (
  <div className="relative w-full h-full">
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="block px-4 pb-2.5 pt-5 w-full text-base text-slate-900 bg-transparent rounded-xl border-2 border-slate-200 appearance-none focus:outline-none focus:border-blue-600 peer transition-colors resize-y hover:border-slate-300 hover:bg-slate-50/50 focus:bg-white min-h-[120px]"
      placeholder=" "
      {...props}
    />
    <label className="absolute text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] px-2 left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none peer-focus:bg-white bg-white peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:-translate-y-3 peer-[&:not(:placeholder-shown)]:scale-75">
      {label}
    </label>
  </div>
);

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, isOpen, onToggle, children }) => (
  <div className={`bg-white border-b border-slate-200 last:border-b-0 transition-all duration-300 overflow-hidden`}>
    <button 
      onClick={onToggle}
      className={`w-full flex items-center justify-between py-6 px-4 transition-colors hover:bg-slate-50`}
    >
      <h3 className={`text-[1.1rem] font-bold tracking-tight transition-colors ${isOpen ? 'text-slate-800' : 'text-slate-600'}`}>
        {title}
      </h3>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border ${isOpen ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200 bg-white'}`}>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-slate-800' : 'text-slate-500'}`} />
      </div>
    </button>
    
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          <div className="pb-6 pt-2 px-2">
             {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const SidebarForm: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('personal');
  const cvData = useCVStore((state) => state.cvData);
  const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);
  const addExperience = useCVStore((state) => state.addExperience);
  const updateExperience = useCVStore((state) => state.updateExperience);
  const removeExperience = useCVStore((state) => state.removeExperience);
  const addEducation = useCVStore((state) => state.addEducation);
  const updateEducation = useCVStore((state) => state.updateEducation);
  const removeEducation = useCVStore((state) => state.removeEducation);
  const setSkills = useCVStore((state) => state.setSkills);
  const addCertification = useCVStore((state) => state.addCertification);
  const updateCertification = useCVStore((state) => state.updateCertification);
  const removeCertification = useCVStore((state) => state.removeCertification);
  const addLanguage = useCVStore((state) => state.addLanguage);
  const updateLanguage = useCVStore((state) => state.updateLanguage);
  const removeLanguage = useCVStore((state) => state.removeLanguage);
  const addCustomField = useCVStore((state) => state.addCustomField);
  const updateCustomField = useCVStore((state) => state.updateCustomField);
  const removeCustomField = useCVStore((state) => state.removeCustomField);
  const addProject = useCVStore((state) => state.addProject);
  const updateProject = useCVStore((state) => state.updateProject);
  const removeProject = useCVStore((state) => state.removeProject);
  const setHobbies = useCVStore((state) => state.setHobbies);
  const loadDummyData = useCVStore((state) => state.loadDummyData);
  const clearData = useCVStore((state) => state.clearData);

  const [isGenerating, setIsGenerating] = useState<Record<number, boolean>>({});
  const [itemKeys, setItemKeys] = useState<Record<string, string[]>>({
    experience: [],
    education: [],
    certifications: [],
    languages: [],
    skills: [],
    projects: [],
    hobbies: [],
    customFields: [],
  });

  const ensureKeys = (section: keyof typeof itemKeys, length: number) => {
    setItemKeys((prev) => {
      const current = prev[section] || [];
      if (current.length === length) return prev;

      const next = [...current];
      if (length > current.length) {
        for (let i = current.length; i < length; i += 1) {
          next.push(`${section}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${i}`);
        }
      } else {
        next.splice(length);
      }

      return { ...prev, [section]: next };
    });
  };

  useEffect(() => {
    ensureKeys('experience', cvData.experience.length);
    ensureKeys('education', cvData.education.length);
    ensureKeys('certifications', cvData.certifications.length);
    ensureKeys('languages', cvData.languages.length);
    ensureKeys('skills', cvData.skills.length);
    ensureKeys('projects', (cvData.projects || []).length);
    ensureKeys('hobbies', (cvData.hobbies || []).length);
    ensureKeys('customFields', (cvData.customFields || []).length);
  }, [
    cvData.experience.length,
    cvData.education.length,
    cvData.certifications.length,
    cvData.languages.length,
    cvData.skills.length,
    (cvData.projects || []).length,
    (cvData.hobbies || []).length,
    (cvData.customFields || []).length,
  ]);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updatePersonalInfo({ [e.target.name]: e.target.value });
  };

  const handleMagicWrite = async (index: number, jobTitle: string) => {
    if (!jobTitle) {
      alert("Please enter a job title first.");
      return;
    }

    setIsGenerating((prev) => ({ ...prev, [index]: true }));
    try {
      const response = await axios.post(`${API_BASE_URL}/cv/improve`, {
        text: `Generate 3 professional, active, action-driven resume bullet points for a ${jobTitle}. Do not include a preamble or conclusion, just the 3 bullet points starting with a dash.`,
        section: "experience"
      });

      const newDescription = response.data.improved_text;
      updateExperience(index, { description: newDescription });

    } catch (error) {
      console.error("Magic write failed:", error);
      alert("Failed to generate text. Please try again.");
    } finally {
      setIsGenerating((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/30 overflow-hidden">
      
      {/* Form Content Area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
        <div className="w-full max-w-4xl mx-auto">
          
          <div className="mb-6 px-2 flex gap-4 border-b border-slate-200 pb-6 mt-4">
            <button 
              onClick={clearData}
              className="flex-1 py-3 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Clear Form
            </button>
            <button 
              onClick={loadDummyData}
              className="flex-1 py-3 bg-white border border-teal-200 text-teal-700 rounded-xl text-sm font-bold hover:bg-teal-50 hover:border-teal-300 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Wand2 size={16} />
              Load Example
            </button>
          </div>

          <div className="space-y-0 px-2">
            {/* PERSONAL INFO ACCORDION */}
            <AccordionSection 
              id="personal" 
              title="Personal Details" 
              icon={User} 
              isOpen={openSection === 'personal'} 
              onToggle={() => toggleSection('personal')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <MD3Input label="First Name" name="firstName" value={cvData.personalInfo.firstName} onChange={handlePersonalChange} />
                <MD3Input label="Last Name" name="lastName" value={cvData.personalInfo.lastName} onChange={handlePersonalChange} />
                <div className="md:col-span-2">
                  <MD3Input label="Desired Job Title" name="jobTitle" value={cvData.personalInfo.jobTitle} onChange={handlePersonalChange} />
                </div>
                <MD3Input label="Email Address" type="email" name="email" value={cvData.personalInfo.email} onChange={handlePersonalChange} />
                <MD3Input label="Phone Number" name="phone" value={cvData.personalInfo.phone} onChange={handlePersonalChange} />
                <MD3Input label="Location (City, State)" name="address" value={cvData.personalInfo.address} onChange={handlePersonalChange} />
                <MD3Input label="LinkedIn Profile" name="linkedin" value={cvData.personalInfo.linkedin || ''} onChange={handlePersonalChange} />
                <MD3Input label="GitHub Profile" name="github" value={cvData.personalInfo.github || ''} onChange={handlePersonalChange} />
              </div>
            </AccordionSection>

            {/* EXPERIENCE ACCORDION */}
            <AccordionSection 
              id="experience" 
              title="Employment History" 
              icon={Briefcase} 
              isOpen={openSection === 'experience'} 
              onToggle={() => toggleSection('experience')}
            >
              <div className="space-y-8 pt-4">
                <AnimatePresence>
                  {cvData.experience.map((exp, index) => (
                    <motion.div
                      key={itemKeys.experience[index] || `experience-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 border border-slate-200/60 rounded-2xl relative group bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => removeExperience(index)}
                        className="absolute -top-3 -right-3 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-full shadow-sm border border-slate-100 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Experience"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MD3Input label="Job Title" value={exp.title || ''} onChange={(e) => updateExperience(index, { title: e.target.value })} />
                        <MD3Input label="Employer / Company" value={exp.company || ''} onChange={(e) => updateExperience(index, { company: e.target.value })} />

                        <MD3Input label="Start Date" value={exp.startDate || ''} onChange={(e) => updateExperience(index, { startDate: e.target.value })} />
                        <MD3Input label="End Date" value={exp.endDate || ''} onChange={(e) => updateExperience(index, { endDate: e.target.value })} />

                        <div className="md:col-span-2 mt-2">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-slate-700 ml-1">Responsibilities & Achievements</span>
                            <button
                              type="button"
                              onClick={() => handleMagicWrite(index, exp.title)}
                              disabled={isGenerating[index]}
                              className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors font-semibold shadow-sm border border-indigo-100/50 uppercase tracking-wider disabled:opacity-50"
                            >
                              {isGenerating[index] ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                              {isGenerating[index] ? 'Writing...' : 'Magic Write'}
                            </button>
                          </div>
                          <MD3TextArea
                            label="Job Description"
                            value={exp.description || ''}
                            onChange={(e) => updateExperience(index, { description: e.target.value })}
                            rows={6}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={() => addExperience({ title: '', company: '', startDate: '', endDate: '', description: '' })}
                  className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 text-slate-600 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm mt-2"
                >
                  <Plus size={18} /> Add another employment
                </button>
              </div>
            </AccordionSection>

            {/* EDUCATION ACCORDION */}
            <AccordionSection 
              id="education" 
              title="Education" 
              icon={GraduationCap} 
              isOpen={openSection === 'education'} 
              onToggle={() => toggleSection('education')}
            >
              <div className="space-y-8 pt-4">
                <AnimatePresence>
                  {cvData.education.map((edu, index) => (
                    <motion.div
                      key={itemKeys.education[index] || `education-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 border border-slate-200/60 rounded-2xl relative group bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => removeEducation(index)}
                        className="absolute -top-3 -right-3 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-full shadow-sm border border-slate-100 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Education"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MD3Input label="Degree / Program" value={edu.degree || ''} onChange={(e) => updateEducation(index, { degree: e.target.value })} />
                        <MD3Input label="Institution / School" value={edu.school || ''} onChange={(e) => updateEducation(index, { school: e.target.value })} />
                        <MD3Input label="Start Date" value={edu.startDate || ''} onChange={(e) => updateEducation(index, { startDate: e.target.value })} />
                        <MD3Input label="End Date" value={edu.endDate || ''} onChange={(e) => updateEducation(index, { endDate: e.target.value })} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={() => addEducation({ degree: '', school: '', startDate: '', endDate: '' })}
                  className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 text-slate-600 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm mt-2"
                >
                  <Plus size={18} /> Add another education
                </button>
              </div>
            </AccordionSection>

            {/* PROJECTS ACCORDION */}
            <AccordionSection 
              id="projects" 
              title="Personal Projects" 
              icon={FileText} 
              isOpen={openSection === 'projects'} 
              onToggle={() => toggleSection('projects')}
            >
              <div className="space-y-8 pt-4">
                <AnimatePresence>
                  {(cvData.projects || []).map((proj, index) => (
                    <motion.div
                      key={itemKeys.projects[index] || `projects-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 border border-slate-200/60 rounded-2xl relative group bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => removeProject(index)}
                        className="absolute -top-3 -right-3 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-full shadow-sm border border-slate-100 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MD3Input label="Project Name" value={proj.name || ''} onChange={(e) => updateProject(index, { name: e.target.value })} />
                        <MD3Input label="Project Link (URL)" value={proj.link || ''} onChange={(e) => updateProject(index, { link: e.target.value })} />
                        <MD3Input label="Start Date" value={proj.startDate || ''} onChange={(e) => updateProject(index, { startDate: e.target.value })} />
                        <MD3Input label="End Date" value={proj.endDate || ''} onChange={(e) => updateProject(index, { endDate: e.target.value })} />
                        <div className="md:col-span-2">
                          <MD3TextArea
                            label="Project Description"
                            value={proj.description || ''}
                            onChange={(e) => updateProject(index, { description: e.target.value })}
                            rows={4}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={() => addProject({ name: '', description: '', startDate: '', endDate: '', link: '' })}
                  className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 text-slate-600 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm mt-2"
                >
                  <Plus size={18} /> Add another project
                </button>
              </div>
            </AccordionSection>

            {/* CERTIFICATIONS ACCORDION */}
            <AccordionSection 
              id="certifications" 
              title="Certifications" 
              icon={FileText} 
              isOpen={openSection === 'certifications'} 
              onToggle={() => toggleSection('certifications')}
            >
              <div className="space-y-8 pt-4">
                <AnimatePresence>
                  {cvData.certifications.map((cert, index) => (
                    <motion.div
                      key={itemKeys.certifications[index] || `certifications-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 border border-slate-200/60 rounded-2xl relative group bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => removeCertification(index)}
                        className="absolute -top-3 -right-3 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-full shadow-sm border border-slate-100 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Certification"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MD3Input label="Certification Name" value={cert.name || ''} onChange={(e) => updateCertification(index, { name: e.target.value })} />
                        <MD3Input label="Issuing Organization" value={cert.issuer || ''} onChange={(e) => updateCertification(index, { issuer: e.target.value })} />
                        <MD3Input label="Date Earned" value={cert.date || ''} onChange={(e) => updateCertification(index, { date: e.target.value })} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={() => addCertification({ name: '', issuer: '', date: '' })}
                  className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 text-slate-600 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm mt-2"
                >
                  <Plus size={18} /> Add another certification
                </button>
              </div>
            </AccordionSection>

            {/* LANGUAGES ACCORDION */}
            <AccordionSection 
              id="languages" 
              title="Languages" 
              icon={FileText} 
              isOpen={openSection === 'languages'} 
              onToggle={() => toggleSection('languages')}
            >
              <div className="space-y-4 pt-4">
                <AnimatePresence>
                  {cvData.languages.map((lang, index) => (
                     <motion.div
                      key={itemKeys.languages[index] || `languages-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-4 relative group"
                    >
                      <MD3Input label={`Language ${index + 1}`} value={lang.name || ''} onChange={(e) => updateLanguage(index, { name: e.target.value })} />
                      <button
                        onClick={() => removeLanguage(index)}
                        className="bg-white text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl shadow-sm border border-slate-200 transition-all"
                        title="Delete Language"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={() => addLanguage({ name: '', level: '' })}
                  className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 text-slate-600 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm mt-2"
                >
                  <Plus size={18} /> Add a language
                </button>
              </div>
            </AccordionSection>

            {/* SKILLS ACCORDION */}
            <AccordionSection 
              id="skills" 
              title="Skills & Expertise" 
              icon={Wrench} 
              isOpen={openSection === 'skills'} 
              onToggle={() => toggleSection('skills')}
            >
              <div className="space-y-4 pt-4">
                <AnimatePresence>
                  {cvData.skills.map((skill, index) => (
                    <motion.div
                      key={itemKeys.skills[index] || `skills-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-4 relative group"
                    >
                      <MD3Input label={`Skill ${index + 1}`} value={skill || ''} onChange={(e) => {
                          const newSkills = [...cvData.skills];
                          newSkills[index] = e.target.value;
                          setSkills(newSkills);
                      }} />
                      <button
                        onClick={() => {
                          const newSkills = cvData.skills.filter((_, i) => i !== index);
                          setSkills(newSkills);
                        }}
                        className="bg-white text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl shadow-sm border border-slate-200 transition-all"
                        title="Delete Skill"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={() => setSkills([...cvData.skills, ''])}
                  className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 text-slate-600 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm mt-2"
                >
                  <Plus size={18} /> Add a skill
                </button>
              </div>
            </AccordionSection>

            {/* SUMMARY ACCORDION */}
            <AccordionSection 
              id="summary" 
              title="Professional Summary" 
              icon={FileText} 
              isOpen={openSection === 'summary'} 
              onToggle={() => toggleSection('summary')}
            >
              <div className="space-y-6 pt-4">
                <p className="text-slate-500 text-sm">Write a brief, punchy overview of your career and goals.</p>
                <MD3TextArea
                  label="Summary Text"
                  name="summary"
                  value={cvData.personalInfo.summary}
                  onChange={handlePersonalChange}
                  rows={8}
                />
              </div>
            </AccordionSection>

            {/* HOBBIES ACCORDION */}
            <AccordionSection
              id="hobbies"
              title="Hobbies & Interests"
              icon={Heart}
              isOpen={openSection === 'hobbies'}
              onToggle={() => toggleSection('hobbies')}
            >
              <div className="space-y-4 pt-4 px-1">
                <MD3TextArea
                  label="Hobbies & Interests"
                  value={cvData.hobbies.join(', ')}
                  onChange={(e) => setHobbies(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  placeholder="Photography, Chess, Traveling, etc."
                  rows={4}
                />
                <p className="text-slate-400 text-[11px] italic">Separate your hobbies with commas.</p>
              </div>
            </AccordionSection>

            {/* CUSTOM FIELDS ACCORDION */}
            <AccordionSection
              id="custom"
              title="Custom Fields"
              icon={FileText}
              isOpen={openSection === 'custom'}
              onToggle={() => toggleSection('custom')}
            >
              <div className="space-y-4 pt-4">
                <p className="text-slate-500 text-sm px-1">Add any additional info you'd like on your CV — awards, websites, portfolios, etc.</p>
                <AnimatePresence>
                  {(cvData.customFields || []).map((field, index) => (
                    <motion.div
                      key={itemKeys.customFields[index] || `customFields-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 border border-slate-200/60 rounded-2xl relative group bg-white shadow-sm hover:shadow-md transition-shadow mb-4"
                    >
                      <button
                        onClick={() => removeCustomField(index)}
                        className="absolute -top-3 -right-3 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-full shadow-sm border border-slate-100 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Entry"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <MD3Input
                            label="Title"
                            value={field.title || ''}
                            onChange={(e) => updateCustomField(index, { title: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <MD3Input
                            label="Subtitle"
                            value={field.subtitle || ''}
                            onChange={(e) => updateCustomField(index, { subtitle: e.target.value })}
                          />
                        </div>
                        <MD3Input
                          label="Start Date"
                          value={field.startDate || ''}
                          onChange={(e) => updateCustomField(index, { startDate: e.target.value })}
                        />
                        <MD3Input
                          label="End Date"
                          value={field.endDate || ''}
                          onChange={(e) => updateCustomField(index, { endDate: e.target.value })}
                        />
                        <MD3Input
                          label="Location"
                          value={field.location || ''}
                          onChange={(e) => updateCustomField(index, { location: e.target.value })}
                        />
                        <MD3Input
                          label="Link"
                          value={field.link || ''}
                          onChange={(e) => updateCustomField(index, { link: e.target.value })}
                        />
                        <div className="md:col-span-2">
                          <MD3TextArea
                            label="Description"
                            value={field.description || ''}
                            onChange={(e) => updateCustomField(index, { description: e.target.value })}
                            rows={4}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <button
                  onClick={() => addCustomField({})}
                  className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 text-slate-600 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm mt-2"
                >
                  <Plus size={18} /> Add custom entry
                </button>
              </div>
            </AccordionSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarForm;
