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

export interface Project {
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  link?: string;
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
  title?: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  link?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects?: Project[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
  hobbies: string[];
  customFields?: CustomField[];
}

export interface TemplateProps {
  data: CVData;
}
