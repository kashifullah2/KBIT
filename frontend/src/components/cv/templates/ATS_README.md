# ATS-Friendly CV Template System

## Overview
This system provides a comprehensive set of ATS (Applicant Tracking System) compatible CV components and templates optimized for PDF export and online job applications.

## What is ATS Compatibility?

ATS (Applicant Tracking Systems) are software applications used by employers to scan, parse, and rank resumes. To ensure your CV passes through ATS systems successfully, it must follow specific formatting rules:

### ✅ ATS-Friendly Features
- **Single-column layout** - No multi-column designs
- **Simple text formatting** - No graphics, icons, or images
- **Standard fonts** - Inter, Roboto, Arial, Helvetica
- **Clear section headers** - Easily identifiable sections
- **Plain text** - No text boxes, tables, or complex layouts
- **Standard bullet points** - Simple • or − characters
- **Black/dark gray text** - High contrast, readable
- **Proper spacing** - Consistent margins and line heights

### ❌ ATS-Unfriendly Features (Avoided)
- Icons and graphics
- Multiple columns
- Tables for layout
- Text boxes
- Headers and footers
- Fancy fonts
- Colored backgrounds
- Skill bars or progress indicators
- Charts or graphs

## File Structure

```
/components/cv/templates/
├── Minimal.jsx          # Main minimal ATS template
├── ATSComponents.jsx    # Modular ATS-friendly components
├── Modern.jsx           # Modern template (existing)
├── Classic.jsx          # Classic template (existing)
├── Creative.jsx         # Creative template (existing)
└── Executive.jsx        # Executive template (existing)
```

## Minimal Template

### Features
- ✅ Single-column layout
- ✅ A4 page size (210mm × 297mm)
- ✅ Optimal margins (20-22mm sides, 22mm top/bottom)
- ✅ Clean typography hierarchy
- ✅ Auto page-break handling
- ✅ No icons or graphics
- ✅ Professional fonts only
- ✅ Black/dark gray text for maximum readability

### Usage

```javascript
import { Minimal } from './templates/Minimal';

// In your component
<Minimal 
  ref={printRef}
  data={cvData} 
  customization={{ fontFamily: "'Inter', sans-serif" }} 
/>
```

### Section Order
1. **Header** - Full name and job title
2. **Contact Information** - Phone, email, location, LinkedIn, GitHub, website
3. **Professional Summary** - Brief overview of experience
4. **Work Experience** - Job history with achievements
5. **Projects** - Notable projects and contributions
6. **Education** - Academic qualifications
7. **Skills** - Technical and soft skills
8. **Custom Sections** - Certifications, achievements, etc.

## Modular ATS Components

The `ATSComponents.jsx` file contains reusable, modular components that can be used to build custom ATS-friendly templates.

### Available Components

#### 1. ATSHeader
Displays name and job title.

```javascript
<ATSHeader 
  personal={personal}
  textPrimary="#000000"
  textSecondary="#374151"
/>
```

**Props:**
- `personal` - Object containing `fullName` and `jobTitle`
- `textPrimary` - Color for name (default: #000000)
- `textSecondary` - Color for job title (default: #374151)

---

#### 2. ATSContactInfo
Displays contact information in ATS-friendly format.

```javascript
<ATSContactInfo 
  personal={personal}
  textColor="#374151"
/>
```

**Props:**
- `personal` - Object containing contact fields (phone, email, address, linkedin, github, website)
- `textColor` - Text color (default: #374151)

**Displays:** Phone, Email, Location, LinkedIn, GitHub, Website (only if values exist)

---

#### 3. ATSSummary
Displays professional summary.

```javascript
<ATSSummary 
  summary={personal.summary}
  textPrimary="#000000"
  textSecondary="#374151"
/>
```

**Props:**
- `summary` - Summary text
- `textPrimary` - Header color
- `textSecondary` - Body text color

---

#### 4. ATSExperience
Displays work experience section.

```javascript
<ATSExperience 
  experience={experience}
  textPrimary="#000000"
  textSecondary="#374151"
  textMuted="#6b7280"
/>
```

**Props:**
- `experience` - Array of experience objects
- `textPrimary` - Color for job titles
- `textSecondary` - Color for company names and descriptions
- `textMuted` - Color for dates

**Experience Object Structure:**
```javascript
{
  title: "Job Title",
  company: "Company Name",
  location: "City, State", // optional
  startDate: "Jan 2020",
  endDate: "Present",
  description: "• Achievement 1\n• Achievement 2"
}
```

---

#### 5. ATSProjects
Displays projects section.

```javascript
<ATSProjects 
  projects={projects}
  textPrimary="#000000"
  textSecondary="#374151"
  textMuted="#6b7280"
/>
```

**Props:**
- `projects` - Array of project objects
- Color props same as ATSExperience

**Project Object Structure:**
```javascript
{
  name: "Project Name",
  technologies: "React, Node.js, MongoDB",
  description: "Project description",
  link: "https://github.com/..." // optional
}
```

---

#### 6. ATSEducation
Displays education section.

```javascript
<ATSEducation 
  education={education}
  textPrimary="#000000"
  textSecondary="#374151"
  textMuted="#6b7280"
/>
```

**Props:**
- `education` - Array of education objects
- Color props same as ATSExperience

**Education Object Structure:**
```javascript
{
  degree: "Bachelor of Science in Computer Science",
  school: "University Name",
  year: "2020",
  location: "City, State" // optional
}
```

---

#### 7. ATSSkills
Displays skills section with two format options.

```javascript
// Simple array format
<ATSSkills 
  skills={["JavaScript", "React", "Node.js"]}
  textPrimary="#000000"
  textSecondary="#374151"
/>

// Grouped format
<ATSSkills 
  groupedSkills={{
    "Languages": "Python, JavaScript, Java",
    "Frameworks": "React, Django, FastAPI",
    "Tools": "Git, Docker, AWS"
  }}
  textPrimary="#000000"
  textSecondary="#374151"
/>
```

**Props:**
- `skills` - Array of skill strings (for simple format)
- `groupedSkills` - Object with categories as keys (for grouped format)
- `textPrimary` - Color for category labels
- `textSecondary` - Color for skill text

---

#### 8. ATSCustomSection
Displays custom sections (certifications, achievements, etc.).

```javascript
<ATSCustomSection 
  section={{
    title: "Certifications",
    items: [
      {
        title: "AWS Solutions Architect",
        description: "Amazon Web Services • Issued Dec 2023"
      }
    ]
  }}
  textPrimary="#000000"
  textSecondary="#374151"
/>
```

**Props:**
- `section` - Object with `title` and `items` array
- `textPrimary` - Color for item titles
- `textSecondary` - Color for descriptions

---

#### 9. ATSSectionHeader
Reusable section header component.

```javascript
<ATSSectionHeader 
  title="WORK EXPERIENCE"
  textColor="#000000"
/>
```

**Props:**
- `title` - Section title (will be uppercased)
- `textColor` - Text color

## Creating Custom ATS Templates

You can create your own ATS-friendly templates using the modular components:

```javascript
import React from 'react';
import {
  ATSHeader,
  ATSContactInfo,
  ATSSummary,
  ATSExperience,
  ATSEducation,
  ATSSkills,
  ATSCustomSection
} from './ATSComponents';

export const MyCustomATS = React.forwardRef(({ data, customization }, ref) => {
  const { personal, experience, education, skills, customSections } = data;
  const fontFamily = customization.fontFamily || "'Inter', sans-serif";

  return (
    <div
      ref={ref}
      style={{ fontFamily }}
      className="w-[210mm] min-h-[297mm] bg-white"
    >
      <div className="px-[20mm] py-[22mm]">
        <ATSHeader personal={personal} />
        <ATSContactInfo personal={personal} />
        <ATSSummary summary={personal?.summary} />
        <ATSExperience experience={experience} />
        <ATSEducation education={education} />
        <ATSSkills skills={skills} />
        {customSections?.map((section, index) => (
          <ATSCustomSection key={index} section={section} />
        ))}
      </div>
    </div>
  );
});

MyCustomATS.displayName = 'MyCustomATSTemplate';
```

## Typography Guidelines

### Font Sizes (ATS-Optimized)
- **Name:** 22-26px, bold, uppercase
- **Section Headers:** 13-15px, bold, uppercase
- **Job Titles:** 12px, bold
- **Body Text:** 10.5-12px
- **Dates/Metadata:** 10-11px

### Font Families (ATS-Safe)
- Inter (recommended)
- Roboto
- Arial
- Helvetica

### Line Spacing
- Header: 1.2-1.3
- Body: 1.4-1.5

### Colors
- Primary Text: `#000000` (black)
- Secondary Text: `#374151` (dark gray)
- Muted Text: `#6b7280` (medium gray)

## Page Layout

### Dimensions
- **Page Size:** A4 (210mm × 297mm)
- **Margins:** 
  - Left/Right: 18-22mm
  - Top/Bottom: 20-25mm

### Spacing
- Section margin bottom: 24px (6 in Tailwind)
- Entry spacing: 12-20px
- Line spacing: 1.3-1.5

## PDF Export Optimization

### Print Styles
The template includes break-inside-avoid classes on entries to prevent awkward page breaks:

```javascript
className="break-inside-avoid"
```

### Page Style Configuration
```javascript
pageStyle: `
  @page {
    size: A4;
    margin: 20mm;
  }
  @media print {
    body {
      -webkit-print-color-adjust: exact;
    }
  }
`
```

## Best Practices

### Content Formatting

#### Work Experience
```
Job Title — Company Name
Location | Jan 2020 – Present
• Quantifiable achievement with metrics
• Action-driven bullet point
• Result-oriented description
```

#### Skills Format
**Good (ATS-friendly):**
```
Languages: Python, JavaScript, Java
Frameworks: React, Django, FastAPI
Tools: Git, Docker, AWS
```

**Bad (Not ATS-friendly):**
- Skill bars or progress indicators
- Icons or graphics
- Tables or complex layouts

#### Section Headers
- Use ALL CAPS for consistency
- Keep headers simple and standard
- Use semantic HTML (h1, h2, h3)

### Common Pitfalls to Avoid

1. ❌ Using tables for layout
2. ❌ Adding icons or graphics
3. ❌ Using multiple columns
4. ❌ Fancy fonts or decorative elements
5. ❌ Colored backgrounds
6. ❌ Headers and footers
7. ❌ Text boxes
8. ❌ Images (including profile photos for ATS)

## Future Enhancements

### Planned Features
- [ ] Drag-and-drop section reordering
- [ ] Multiple theme variants (while maintaining ATS compatibility)
- [ ] Section visibility toggles
- [ ] Custom section builder
- [ ] Smart keyword optimization
- [ ] ATS compatibility checker
- [ ] Real-time ATS score

### Theme Support
The template is designed to support future theme variations while maintaining ATS compatibility:
- Different color schemes (keeping black/dark gray text)
- Font variations (from ATS-safe list)
- Spacing adjustments
- Section order customization

## Integration with CV Builder

### How to Use in the CV Builder

1. Select the "Minimal" template from the template selector
2. Edit your content in the CV Form
3. The preview updates in real-time
4. Export to PDF when ready

### Template Selection
```javascript
// In CVBuilder.jsx
const templates = ['modern', 'classic', 'creative', 'executive', 'minimal'];
```

### Custom Styling
```javascript
// Pass custom font family
const customization = {
  fontFamily: "'Roboto', sans-serif"
};
```

## Accessibility

### Semantic HTML
All components use proper semantic HTML:
- `<header>` for the name/title section
- `<section>` for each content section
- `<h1>` for name
- `<h2>` for section headers
- `<h3>` for entry titles

### Screen Reader Support
- Proper heading hierarchy
- Meaningful text content
- No reliance on visual formatting alone

## Testing

### ATS Compatibility Testing
To test ATS compatibility:
1. Export the CV as PDF
2. Upload to ATS testing tools (e.g., Jobscan, Resume Worded)
3. Verify all text is properly parsed
4. Check section recognition
5. Validate keyword extraction

### Print Testing
1. Use Print Preview in browser
2. Verify page breaks are appropriate
3. Check margins and spacing
4. Ensure all content is visible
5. Validate text is selectable in PDF

## Support

For issues or questions:
- Check the component props documentation above
- Review the example templates
- Ensure your data structure matches the expected format
- Test with simple content first

## Version History

- **v1.0.0** - Initial release with Minimal template and ATS components
  - Single-column ATS-friendly layout
  - Modular component system
  - A4 PDF export optimization
  - Full section support (experience, education, skills, projects, custom sections)
