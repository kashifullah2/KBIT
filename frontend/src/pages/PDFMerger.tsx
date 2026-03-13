import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Trash2, ArrowUp, ArrowDown, Download, Loader2, Plus, AlertCircle } from 'lucide-react';

interface PDFFile {
  file: File;
  id: string;
}

const PDFMerger: React.FC = () => {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
      }));
    
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }
  });

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;
    
    const newFiles = [...files];
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError('Please add at least two PDF files to merge.');
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const pdfFile of files) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged_document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Merge failed:', err);
      setError('Failed to merge PDFs. One of the files might be corrupted or password-protected.');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Merge PDF Files
          </h1>
          <p className="text-lg text-slate-600">
            Combine multiple PDFs into a single professional document. Your files are processed safely in your browser.
          </p>
        </div>

        {/* Dropzone */}
        <div 
          {...getRootProps()} 
          className={`
            relative overflow-hidden p-10 border-2 border-dashed rounded-3xl transition-all cursor-pointer
            flex flex-col items-center justify-center gap-4
            ${isDragActive ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50'}
          `}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Upload size={32} />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">
              {isDragActive ? 'Drop files here' : 'Click or drag PDFs here'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Supports multiple PDF files
            </p>
          </div>
        </div>

        {/* File List */}
        <div className="mt-10 space-y-3">
          <AnimatePresence initial={false}>
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-colors"
                style={{ zIndex: files.length - index }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate pr-4">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => moveFile(index, 'up')}
                    disabled={index === 0}
                    className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  >
                    <ArrowUp size={18} />
                  </button>
                  <button 
                    onClick={() => moveFile(index, 'down')}
                    disabled={index === files.length - 1}
                    className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  >
                    <ArrowDown size={18} />
                  </button>
                  <div className="w-px h-6 bg-slate-100 mx-1" />
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {files.length > 0 && (
            <div className="flex justify-center pt-6">
              <button
                onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-6 py-3 rounded-full transition-colors"
              >
                <Plus size={18} />
                Add more files
              </button>
            </div>
          )}
        </div>

        {/* Action Button */}
        {files.length > 0 && (
          <div className="mt-12">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm animate-shake">
                <AlertCircle size={18} className="flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}
            <button
              onClick={mergePDFs}
              disabled={isMerging || files.length < 2}
              className={`
                w-full py-5 rounded-3xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl transition-all
                ${isMerging || files.length < 2
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-slate-900/10'
                }
              `}
            >
              {isMerging ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Merging Files...
                </>
              ) : (
                <>
                  <Download size={24} />
                  Merge & Download
                </>
              )}
            </button>
            <p className="text-center text-slate-400 text-xs mt-6">
              Processing occurs entirely on your device for maximum privacy.
            </p>
          </div>
        )}

        {/* Empty State Illustration or Background Glow */}
        <div className="fixed inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden opacity-30">
          <div className="w-[500px] h-[500px] bg-blue-200/50 rounded-full blur-[120px]" />
          <div className="w-[400px] h-[400px] bg-purple-200/50 rounded-full blur-[100px] translate-x-32 -translate-y-20" />
        </div>
      </div>
    </div>
  );
};

export default PDFMerger;
