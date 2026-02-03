import React from 'react';
import { Modern } from './templates/Modern';

export const CVPreview = React.forwardRef(({ data, template }, ref) => {
    // We can switch templates here based on the 'template' prop
    // For now, we only have 'modern'

    return (
        <div className="bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)]">
            <Modern ref={ref} data={data} />
        </div>
    );
});

CVPreview.displayName = 'CVPreview';
