import React from 'react';
import { Modern } from './templates/Modern';
import { Classic } from './templates/Classic';
import { Creative } from './templates/Creative';
import { Executive } from './templates/Executive';

export const CVPreview = React.forwardRef(({ data, template, customization = {} }, ref) => {
    const Template = {
        classic: Classic,
        modern: Modern,
        creative: Creative,
        executive: Executive
    }[template] || Modern;

    return (
        <div className="bg-white">
            <Template ref={ref} data={data} customization={customization} />
        </div>
    );
});

CVPreview.displayName = 'CVPreview';
