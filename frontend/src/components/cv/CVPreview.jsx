import React from 'react';
import { Modern } from './templates/Modern';
import { Classic } from './templates/Classic';

export const CVPreview = React.forwardRef(({ data, template }, ref) => {
    const Template = template === 'classic' ? Classic : Modern;

    return (
        <div className="bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)]">
            <Template ref={ref} data={data} />
        </div>
    );
});

CVPreview.displayName = 'CVPreview';
