export interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  linkedin?: string;
  github?: string;
  profileImage?: string;
}

export interface Experience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Language {
  name: string;
  level?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date?: string;
}

export interface CustomField {
  label: string;
  value: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
  customFields?: CustomField[];
}

export interface TemplateProps {
  data: CVData;
}
