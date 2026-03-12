import { create } from 'zustand';
import { CVData, CustomField } from '../pages/CVBuilder/types';

export interface CVStore {
  cvData: CVData;
  selectedTemplate: string;
  updatePersonalInfo: (data: Partial<CVData['personalInfo']>) => void;
  addExperience: (exp: CVData['experience'][0]) => void;
  updateExperience: (index: number, data: Partial<CVData['experience'][0]>) => void;
  removeExperience: (index: number) => void;
  addEducation: (edu: CVData['education'][0]) => void;
  updateEducation: (index: number, data: Partial<CVData['education'][0]>) => void;
  removeEducation: (index: number) => void;
  setSkills: (skills: string[]) => void;
  addCertification: (cert: CVData['certifications'][0]) => void;
  updateCertification: (index: number, data: Partial<CVData['certifications'][0]>) => void;
  removeCertification: (index: number) => void;
  addLanguage: (lang: CVData['languages'][0]) => void;
  updateLanguage: (index: number, data: Partial<CVData['languages'][0]>) => void;
  removeLanguage: (index: number) => void;
  setTemplate: (templateId: string) => void;
  setCVData: (data: CVData) => void;
  loadDummyData: () => void;
  clearData: () => void;
  addCustomField: (field: CustomField) => void;
  updateCustomField: (index: number, data: Partial<CustomField>) => void;
  removeCustomField: (index: number) => void;
}

const defaultCVData: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
  customFields: [],
};

const dummyCVData: CVData = {
  personalInfo: {
    firstName: 'Alex',
    lastName: 'Chen',
    jobTitle: 'Senior Full Stack Developer',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/alexchen',
    github: 'https://github.com/alexchen-dev',
    summary: 'Innovative and results-driven Senior Full Stack Developer with 8+ years of experience designing and building scalable web applications. Passionate about creating elegant architectural solutions, optimizing performance, and mentoring engineering teams. Proven track record of delivering high-impact projects from conception to deployment.',
  },
  experience: [
    {
      title: 'Lead Software Engineer',
      company: 'TechFlow Solutions',
      startDate: 'Jan 2021',
      endDate: 'Present',
      description: '- Architected and launched a cloud-native SaaS platform reaching 100k+ active users within the first year.\n- Spearheaded the migration from a monolithic architecture to Node.js/Go microservices, reducing server response times by 40%.\n- Managed a team of 6 engineers, conducting code reviews, mentoring juniors, and establishing CI/CD pipelines.',
    },
    {
      title: 'Full Stack Developer',
      company: 'Innovate Digital',
      startDate: 'Mar 2017',
      endDate: 'Dec 2020',
      description: '- Developed responsive, accessible single-page applications using React and Redux.\n- Designed Restful APIs in Python (Django) handling over 10M requests daily.\n- Optimized complex SQL queries, decreasing database payload times by an average of 30%.',
    }
  ],
  education: [
    {
      degree: 'Master of Science in Computer Science',
      school: 'Stanford University',
      startDate: 'Sep 2015',
      endDate: 'Jun 2017',
    },
    {
      degree: 'Bachelor of Science in Software Engineering',
      school: 'University of California, Berkeley',
      startDate: 'Sep 2011',
      endDate: 'Jun 2015',
    }
  ],
  skills: ['JavaScript (ES6+)', 'TypeScript', 'React & Next.js', 'Node.js', 'Python', 'Go', 'PostgreSQL', 'AWS Architecture', 'Docker & Kubernetes', 'GraphQL'],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      date: '2023',
    },
    {
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2022',
    }
  ],
  languages: [
    { name: 'English (Native)' },
    { name: 'Mandarin (Bilingual)' },
    { name: 'Spanish (Conversational)' }
  ],
  customFields: [],
};

const useCVStore = create<CVStore>((set) => ({
  cvData: defaultCVData,
  selectedTemplate: 'modern', // 'modern', 'professional', 'creative'

  updatePersonalInfo: (data) =>
    set((state) => ({
      cvData: { ...state.cvData, personalInfo: { ...state.cvData.personalInfo, ...data } },
    })),

  addExperience: (exp) =>
    set((state) => ({
      cvData: { ...state.cvData, experience: [...state.cvData.experience, exp] },
    })),

  updateExperience: (index, data) =>
    set((state) => {
      const newExperience = [...state.cvData.experience];
      newExperience[index] = { ...newExperience[index], ...data };
      return { cvData: { ...state.cvData, experience: newExperience } };
    }),

  removeExperience: (index) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        experience: state.cvData.experience.filter((_, i) => i !== index),
      },
    })),

  addEducation: (edu) =>
    set((state) => ({
      cvData: { ...state.cvData, education: [...state.cvData.education, edu] },
    })),

  updateEducation: (index, data) =>
    set((state) => {
      const newEducation = [...state.cvData.education];
      newEducation[index] = { ...newEducation[index], ...data };
      return { cvData: { ...state.cvData, education: newEducation } };
    }),

  removeEducation: (index) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        education: state.cvData.education.filter((_, i) => i !== index),
      },
    })),

  setSkills: (skills) =>
    set((state) => ({
      cvData: { ...state.cvData, skills },
    })),

  addCertification: (cert) =>
    set((state) => ({
      cvData: { ...state.cvData, certifications: [...state.cvData.certifications, cert] },
    })),

  updateCertification: (index, data) =>
    set((state) => {
      const newCerts = [...state.cvData.certifications];
      newCerts[index] = { ...newCerts[index], ...data };
      return { cvData: { ...state.cvData, certifications: newCerts } };
    }),

  removeCertification: (index) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        certifications: state.cvData.certifications.filter((_, i) => i !== index),
      },
    })),

  addLanguage: (lang) =>
    set((state) => ({
      cvData: { ...state.cvData, languages: [...state.cvData.languages, lang] },
    })),

  updateLanguage: (index, data) =>
    set((state) => {
      const newLangs = [...state.cvData.languages];
      newLangs[index] = { ...newLangs[index], ...data };
      return { cvData: { ...state.cvData, languages: newLangs } };
    }),

  removeLanguage: (index) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        languages: state.cvData.languages.filter((_, i) => i !== index),
      },
    })),
    
  setTemplate: (templateId) => set({ selectedTemplate: templateId }),
  
  // Replace entirely (e.g., when loading from backend)
  setCVData: (data) => set({ cvData: data }),

  loadDummyData: () => set({ cvData: dummyCVData }),
  
  clearData: () => set({ cvData: defaultCVData }),

  addCustomField: (field) =>
    set((state) => ({
      cvData: { ...state.cvData, customFields: [...(state.cvData.customFields || []), field] },
    })),

  updateCustomField: (index, data) =>
    set((state) => {
      const newFields = [...(state.cvData.customFields || [])];
      newFields[index] = { ...newFields[index], ...data };
      return { cvData: { ...state.cvData, customFields: newFields } };
    }),

  removeCustomField: (index) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        customFields: (state.cvData.customFields || []).filter((_, i) => i !== index),
      },
    })),
}));

export default useCVStore;
