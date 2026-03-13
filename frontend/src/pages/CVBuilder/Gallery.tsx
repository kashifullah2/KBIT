import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCVStore from '../../store/useCVStore';
import { CheckCircle2 } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  image: string;
  tag: string;
}

const CVGallery: React.FC = () => {
  const navigate = useNavigate();
  const setTemplate = useCVStore((state) => state.setTemplate);
  const selectedTemplate = useCVStore((state) => state.selectedTemplate);
  
  const templates: Template[] = [
    { id: 'modern', name: 'Modern', image: '/thumbnails/modern.png', tag: 'Most Popular' },
    { id: 'professional', name: 'Professional', image: '/thumbnails/professional.png', tag: 'ATS Optimized' },
    { id: 'creative', name: 'Creative', image: '/thumbnails/creative.png', tag: 'Stand Out' },
    { id: 'elegant', name: 'Elegant', image: '/thumbnails/elegant.png', tag: 'Minimalist' }
  ];

  const handleSelect = (templateId: string) => {
    setTemplate(templateId);
    navigate('/cv-builder/edit');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Select your professional template
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our premium, ATS-friendly designs. You can always change your template later in the editor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {templates.map(({ id, name, image, tag }) => (
            <div 
              key={id} 
              className={`group relative flex flex-col bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden
                ${selectedTemplate === id ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-gray-200 hover:border-emerald-300'}
              `}
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md
                  ${id === 'modern' ? 'bg-emerald-500 text-white' : 
                    id === 'professional' ? 'bg-slate-800 text-white' : 
                    'bg-teal-500 text-white'}`}
                >
                  {tag}
                </span>
              </div>

              {/* Selection Indicator */}
              {selectedTemplate === id && (
                <div className="absolute top-4 left-4 z-20 bg-emerald-500 text-white rounded-full p-1 shadow-md">
                   <CheckCircle2 size={16} />
                </div>
              )}

              {/* Preview Container - Scaled Image overlay */}
              <div className="relative h-[400px] w-full bg-gray-100 overflow-hidden isolate cursor-pointer" onClick={() => handleSelect(id)}>
                 <img src={image} alt={`${name} Template Preview`} className="w-full h-full object-cover object-top" />
                 
                 {/* Overlay on hover */}
                 <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/10 transition-colors z-10 flex items-center justify-center pointer-events-none">
                 </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 flex flex-col items-center justify-between bg-white z-20">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{name}</h3>
                <button
                  onClick={() => handleSelect(id)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all shadow-sm
                    ${selectedTemplate === id 
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-2 border-emerald-200' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'
                    }`}
                >
                  {selectedTemplate === id ? 'Resume Editing' : 'Start with this template'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CVGallery;
