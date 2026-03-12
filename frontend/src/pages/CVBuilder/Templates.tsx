import React, { forwardRef } from 'react';
import useCVStore from '../../store/useCVStore';
import TemplateModern from './TemplateModern';
import TemplateProfessional from './TemplateProfessional';
import TemplateCreative from './TemplateCreative';
import TemplateElegant from './TemplateElegant';

const Templates = forwardRef<HTMLDivElement, {}>((_props, ref) => {
  const selectedTemplate = useCVStore((state) => state.selectedTemplate);
  const cvData = useCVStore((state) => state.cvData);

  let TemplateComponent: React.FC<{ data: any }>;

  switch (selectedTemplate) {
    case 'professional':
      TemplateComponent = TemplateProfessional;
      break;
    case 'creative':
      TemplateComponent = TemplateCreative;
      break;
    case 'elegant':
      TemplateComponent = TemplateElegant;
      break;
    case 'modern':
    default:
      TemplateComponent = TemplateModern;
      break;
  }

  return (
    <div ref={ref} className="w-full h-full bg-white relative overflow-hidden print:w-auto print:h-auto text-left">
      <TemplateComponent data={cvData} />
    </div>
  );
});

Templates.displayName = 'Templates';

export default Templates;
