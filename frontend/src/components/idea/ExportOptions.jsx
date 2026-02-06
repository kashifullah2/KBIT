import React from 'react';
import { Download, Copy, FileJson, FileText, Check } from 'lucide-react';
import { useState } from 'react';

export function ExportOptions({ analysis, ideaTitle }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const text = JSON.stringify(analysis, null, 2);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExportJSON = () => {
        const dataStr = JSON.stringify({
            title: ideaTitle,
            analysis: analysis,
            exported_at: new Date().toISOString()
        }, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${ideaTitle?.replace(/\s+/g, '_') || 'idea'}_analysis.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportMarkdown = () => {
        const md = generateMarkdown(ideaTitle, analysis);
        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${ideaTitle?.replace(/\s+/g, '_') || 'idea'}_analysis.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-wrap gap-3">
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        Copied!
                    </>
                ) : (
                    <>
                        <Copy className="w-4 h-4" />
                        Copy Result
                    </>
                )}
            </button>

            <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
                <FileJson className="w-4 h-4" />
                Export JSON
            </button>

            <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
                <FileText className="w-4 h-4" />
                Export Markdown
            </button>
        </div>
    );
}

function generateMarkdown(title, analysis) {
    let md = `# Business Idea Analysis: ${title}\n\n`;
    md += `## Overview\n`;
    md += `**Viability Score:** ${analysis.viability_score || 'N/A'}/10\n\n`;
    md += `${analysis.idea_summary || ''}\n\n`;

    md += `## Market Demand\n`;
    md += `**Score:** ${analysis.market_demand?.score || 'N/A'}/10\n\n`;
    md += `${analysis.market_demand?.analysis || ''}\n\n`;

    md += `## Target Customers\n`;
    md += `**Primary:** ${analysis.target_customers?.primary || 'N/A'}\n\n`;
    md += `**Secondary:** ${analysis.target_customers?.secondary || 'N/A'}\n\n`;

    md += `## Competition\n`;
    md += `**Level:** ${analysis.competition?.level || 'N/A'}\n\n`;
    md += `${analysis.competition?.differentiation || ''}\n\n`;

    md += `## Risks\n`;
    if (analysis.risks) {
        analysis.risks.forEach(risk => {
            md += `- **${risk.type}** (${risk.severity}): ${risk.description}\n`;
            md += `  - Mitigation: ${risk.mitigation}\n`;
        });
    }
    md += `\n`;

    md += `## Improvements\n`;
    if (analysis.improvements) {
        analysis.improvements.forEach(imp => {
            md += `- ${imp}\n`;
        });
    }
    md += `\n`;

    md += `## MVP Recommendation\n`;
    if (analysis.mvp_recommendation) {
        md += `**Timeline:** ${analysis.mvp_recommendation.timeline || 'N/A'}\n`;
        md += `**Budget:** ${analysis.mvp_recommendation.budget_range || 'N/A'}\n\n`;
        md += `### Core Features\n`;
        analysis.mvp_recommendation.core_features?.forEach(feat => {
            md += `- ${feat}\n`;
        });
    }
    md += `\n`;

    md += `## Execution Plan\n`;
    if (analysis.execution_plan) {
        analysis.execution_plan.forEach(phase => {
            md += `### ${phase.phase}\n`;
            phase.steps.forEach((step, i) => {
                md += `${i + 1}. ${step}\n`;
            });
            md += `\n`;
        });
    }
    md += `\n`;

    md += `## Growth Strategy\n`;
    if (analysis.growth_strategy) {
        md += `**Short Term:** ${analysis.growth_strategy.short_term || 'N/A'}\n`;
        md += `**Medium Term:** ${analysis.growth_strategy.medium_term || 'N/A'}\n`;
        md += `**Long Term:** ${analysis.growth_strategy.long_term || 'N/A'}\n`;
        if (analysis.growth_strategy.key_metrics) {
            md += `**Key Metrics:** ${analysis.growth_strategy.key_metrics.join(', ')}\n`;
        }
    }
    md += `\n`;

    md += `## Verdict\n`;
    md += `${analysis.verdict || ''}\n\n`;

    md += `---\n`;
    md += `*Generated by KBIT AI Business Idea Validator*\n`;

    return md;
}
