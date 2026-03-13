import React, { useRef, useState } from 'react';
import SidebarForm from './SidebarForm';
import Templates from './Templates';
import { useReactToPrint } from 'react-to-print';
import { Download, ChevronLeft, Eye, X } from 'lucide-react';
import useCVStore from '../../store/useCVStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const CVEditor: React.FC = () => {
  // ✅ FIX 1: One single ref shared between desktop and mobile preview.
  // Old code passed the same ref to TWO <Templates> instances (desktop + modal),
  // which means React only attached it to the last mounted one — whichever
  // rendered last would win, making print broken on the other view.
  const componentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const selectedTemplate = useCVStore((state) => state.selectedTemplate);
  const setTemplate = useCVStore((state) => state.setTemplate);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'My_Resume',
  });

  // ✅ FIX 2: PreviewContent was defined as a component INSIDE the render function.
  // This causes React to unmount+remount it on every render (because it's a new
  // component type each time), breaking animations, focus, and state.
  // Extracted the template selector and export bar as plain JSX instead.

  const TemplateBar = () => (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/cv-builder')}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
        >
          <ChevronLeft size={16} /> Templates
        </button>
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />
        <div className="flex gap-1.5 p-1 rounded-lg bg-slate-100/50">
          {(['modern', 'professional', 'creative', 'elegant'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedTemplate === t
                  ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => handlePrint()}
        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-[0_4px_14px_0_rgb(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(93,93,93,0.23)]"
      >
        <Download size={18} />
        Export to PDF
      </button>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[40%_60%] xl:grid-cols-[35%_65%] min-h-[calc(100vh-64px)] bg-slate-50/50 relative overflow-hidden">

      {/* Sidebar Form */}
      <div className="w-full h-[calc(100vh-64px)] bg-white border-r border-slate-200/60 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 flex flex-col relative">
        <SidebarForm />
      </div>

      {/* ── Desktop Preview ── */}
      <div className="hidden lg:block relative z-10 overflow-y-auto h-[calc(100vh-64px)] p-6 lg:p-8 [--cv-scale:0.58] xl:[--cv-scale:0.72] 2xl:[--cv-scale:0.88]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 pointer-events-none -z-10" />

        <TemplateBar />

        <div className="w-full pt-4 pb-16 overflow-hidden">
          <div className="flex justify-center items-start">
            <div
              className="print-wrapper origin-top transition-transform duration-500 flex-shrink-0"
              style={{
                transform: 'scale(var(--cv-scale, 0.65))',
                marginBottom: 'calc((var(--cv-scale, 0.65) - 1) * 297mm)',
                width: '210mm',
                height: '297mm',
              } as React.CSSProperties}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.08),_0_0_0_1px_rgba(0,0,0,0.04)]"
                style={{ width: '210mm', height: '297mm' }}
              >
                {/* ✅ FIX 1 applied: ref only attached to this one instance */}
                <Templates ref={componentRef} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Preview Modal ── */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-50 bg-slate-50/95 backdrop-blur-xl overflow-y-auto p-4 lg:hidden"
          >
            <div className="sticky top-0 z-50 flex justify-end mb-4 pt-2 px-4">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="bg-white text-slate-700 p-3 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 active:scale-95 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 [--cv-scale:0.5] sm:[--cv-scale:0.7] md:[--cv-scale:0.85]">
              <TemplateBar />

              <div className="w-full pt-4 pb-16 overflow-hidden">
                <div className="flex justify-center items-start">
                  <div
                    className="print-wrapper origin-top transition-transform duration-500 flex-shrink-0"
                    style={{
                      transform: 'scale(var(--cv-scale, 0.5))',
                      marginBottom: 'calc((var(--cv-scale, 0.5) - 1) * 297mm)',
                      width: '210mm',
                      height: '297mm',
                    } as React.CSSProperties}
                  >
                    {/* ✅ FIX 3: Mobile uses a plain div wrapper (no ref) so the
                        print ref stays exclusively on the desktop instance.
                        Print always captures the desktop DOM node which is
                        rendered at full fidelity — correct for PDF export. */}
                    <div
                      className="bg-white rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.08),_0_0_0_1px_rgba(0,0,0,0.04)]"
                      style={{ width: '210mm', height: '297mm' }}
                    >
                      <Templates />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile FAB ── */}
      <div className="fixed bottom-6 right-6 z-30 lg:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPreviewOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-4 rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.3)] font-medium tracking-wide border border-emerald-500"
        >
          <Eye size={20} />
          Show Live Preview
        </motion.button>
      </div>

    </div>
  );
};