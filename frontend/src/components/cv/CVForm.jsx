import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Wand2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const Section = ({ title, isOpen, onToggle, children }) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-4 bg-white shadow-sm">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
            <span className="font-semibold text-slate-700">{title}</span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                >
                    <div className="p-4 space-y-4 border-t border-slate-100">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const InputGroup = ({ label, value, onChange, placeholder, type = "text", className, aiEnabled, onImprove }) => {
    const [isImproving, setIsImproving] = useState(false);

    const handleImproveClick = async () => {
        if (!value || isImproving) return;
        setIsImproving(true);
        await onImprove(value, (newText) => {
            onChange(newText);
            setIsImproving(false);
        });
    };

    return (
        <div className={cn("space-y-1.5", className)}>
            <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-700">{label}</label>
                {aiEnabled && (
                    <button
                        onClick={handleImproveClick}
                        disabled={isImproving || !value}
                        className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
                    >
                        <Wand2 className={cn("w-3 h-3", isImproving && "animate-spin")} />
                        {isImproving ? "Improving..." : "Improve"}
                    </button>
                )}
            </div>
            {type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
            )}
        </div>
    );
};

export function CVForm({ data, onUpdate }) {
    const [openSection, setOpenSection] = useState('personal');

    const toggleSection = (section) => setOpenSection(openSection === section ? null : section);

    const handleImprove = async (text, callback) => {
        try {
            const res = await fetch(`${API_URL}/cv/improve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, section: 'general' })
            });
            if (!res.ok) throw new Error("Failed");
            const resData = await res.json();
            callback(resData.improved_text);
        } catch (e) {
            console.error(e);
            alert("Failed to improve text. Ensure backend is running.");
            callback(text); // Revert or do nothing
        }
    };

    const updatePersonal = (field, value) => {
        onUpdate('personal', { ...data.personal, [field]: value });
    };

    // Generic list handlers (Experience, Education usually)
    const addItem = (section, initialItem) => {
        onUpdate(section, [...data[section], initialItem]);
    };

    const updateItem = (section, index, field, value) => {
        const newItems = [...data[section]];
        newItems[index] = { ...newItems[index], [field]: value };
        onUpdate(section, newItems);
    };

    const removeItem = (section, index) => {
        const newItems = data[section].filter((_, i) => i !== index);
        onUpdate(section, newItems);
    };

    return (
        <div className="pb-10">
            {/* Personal Info */}
            <Section title="Personal Information" isOpen={openSection === 'personal'} onToggle={() => toggleSection('personal')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Full Name" value={data.personal.fullName} onChange={v => updatePersonal('fullName', v)} placeholder="John Doe" />
                    <InputGroup label="Job Title" value={data.personal.jobTitle || ''} onChange={v => updatePersonal('jobTitle', v)} placeholder="Software Engineer" />
                    <InputGroup label="Email" value={data.personal.email} onChange={v => updatePersonal('email', v)} placeholder="john@example.com" />
                    <InputGroup label="Phone" value={data.personal.phone} onChange={v => updatePersonal('phone', v)} placeholder="+1 234 567 890" />
                    <InputGroup label="Location" value={data.personal.address} onChange={v => updatePersonal('address', v)} placeholder="City, Country" />
                    <InputGroup label="LinkedIn" value={data.personal.linkedin} onChange={v => updatePersonal('linkedin', v)} placeholder="linkedin.com/in/..." />
                </div>
                <InputGroup
                    label="Professional Summary"
                    value={data.personal.summary}
                    onChange={v => updatePersonal('summary', v)}
                    type="textarea"
                    aiEnabled
                    onImprove={handleImprove}
                    placeholder="Briefly describe your experience..."
                />
            </Section>

            {/* Experience */}
            <Section title="Experience" isOpen={openSection === 'experience'} onToggle={() => toggleSection('experience')}>
                {data.experience.map((exp, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4 relative group">
                        <button
                            onClick={() => removeItem('experience', index)}
                            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Job Title" value={exp.title} onChange={v => updateItem('experience', index, 'title', v)} placeholder="Senior Developer" />
                            <InputGroup label="Company" value={exp.company} onChange={v => updateItem('experience', index, 'company', v)} placeholder="Company Inc." />
                            <InputGroup label="Start Date" value={exp.startDate} onChange={v => updateItem('experience', index, 'startDate', v)} placeholder="Jan 2022" />
                            <InputGroup label="End Date" value={exp.endDate} onChange={v => updateItem('experience', index, 'endDate', v)} placeholder="Present" />
                        </div>
                        <InputGroup
                            label="Description"
                            value={exp.description}
                            onChange={v => updateItem('experience', index, 'description', v)}
                            type="textarea"
                            aiEnabled
                            onImprove={handleImprove}
                            placeholder="Describe your key responsibilities and achievements..."
                        />
                    </div>
                ))}
                <button
                    onClick={() => addItem('experience', { title: '', company: '', startDate: '', endDate: '', description: '' })}
                    className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 font-medium hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Experience
                </button>
            </Section>

            {/* Education */}
            <Section title="Education" isOpen={openSection === 'education'} onToggle={() => toggleSection('education')}>
                {data.education.map((edu, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4 relative group">
                        <button
                            onClick={() => removeItem('education', index)}
                            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Degree" value={edu.degree} onChange={v => updateItem('education', index, 'degree', v)} placeholder="BSc Computer Science" />
                            <InputGroup label="School" value={edu.school} onChange={v => updateItem('education', index, 'school', v)} placeholder="University Name" />
                            <InputGroup label="Year" value={edu.year} onChange={v => updateItem('education', index, 'year', v)} placeholder="2020 - 2024" />
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => addItem('education', { degree: '', school: '', year: '' })}
                    className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 font-medium hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Education
                </button>
            </Section>

            {/* Skills */}
            <Section title="Skills" isOpen={openSection === 'skills'} onToggle={() => toggleSection('skills')}>
                {data.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            value={skill}
                            onChange={(e) => {
                                const newSkills = [...data.skills];
                                newSkills[index] = e.target.value;
                                onUpdate('skills', newSkills);
                            }}
                            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            placeholder="e.g. React.js"
                        />
                        <button
                            onClick={() => removeItem('skills', index)}
                            className="p-2 text-slate-400 hover:text-red-500"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => onUpdate('skills', [...data.skills, ''])}
                    className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 font-medium hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Skill
                </button>
            </Section>
        </div>
    );
}
