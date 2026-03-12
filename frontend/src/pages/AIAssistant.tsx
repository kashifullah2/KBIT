import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, Download, FileText, Loader2, Library, FileOutput, Paperclip, X, FilePlus } from 'lucide-react';
import useCVStore, { CVStore } from '../store/useCVStore';
import Templates from './CVBuilder/Templates';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: "Hi! I'm CV Buddy, your professional AI assistant. I can help you build your perfect CV through simple conversation. You can also upload PDFs for me to merge or convert. How should we start?" }
    ];
  });
  const [threadId] = useState(() => {
    const saved = localStorage.getItem('chat_thread_id');
    if (saved) return saved;
    const newId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chat_thread_id', newId);
    return newId;
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showFilePanel, setShowFilePanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const cvData = useCVStore((state: CVStore) => state.cvData);
  const setCVData = useCVStore((state: CVStore) => state.setCVData);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'My_AI_CV',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== 'application/pdf') continue;
      
      newFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size
      });
    }
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setShowFilePanel(true);
    
    if (newFiles.length > 0) {
      const fileNames = newFiles.map(f => f.name).join(', ');
      setMessages(prev => [...prev, { role: 'system', content: `[System] User uploaded: ${fileNames}` }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${(import.meta as any).env.VITE_API_URL || 'http://localhost:8000'}/chat`, {
        messages: [...messages, userMessage],
        thread_id: threadId
      });

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.data.content 
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      if (response.data.tool_calls) {
        for (const call of response.data.tool_calls) {
          if (call.name === 'update_cv_data') {
            try {
              // The tool now returns structured updates directly
              // We simulate the application of these updates
              const args = call.args;
              const newCVData = { ...cvData };

              if (args.personalInfo) {
                newCVData.personalInfo = { ...newCVData.personalInfo, ...args.personalInfo };
              }
              if (args.experience) {
                // If it's a list, we might want to append or replace. 
                // For simplicity in the agent dialogue, we replace with what the agent suggests.
                newCVData.experience = args.experience;
              }
              if (args.education) {
                  newCVData.education = args.education;
              }
              if (args.skills) {
                  newCVData.skills = args.skills;
              }
              
              setCVData(newCVData);
            } catch (e) {
              console.error("Failed to apply CV update:", e);
            }
          }
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isRTL = (text: string) => {
    const rtlChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlChars.test(text);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden relative">
      <input 
        type="file" 
        multiple 
        accept=".pdf" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload}
      />

      {/* Left Chat Area */}
      <div className="flex-1 flex flex-col bg-white border-r border-slate-200 shadow-xl z-10 relative">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 tracking-tight">CV Buddy</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-500 font-medium">Multilingual Assistant</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilePanel(!showFilePanel)}
              className={`p-2 rounded-xl transition-all ${showFilePanel ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <Library size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {messages.map((msg, idx) => (
            msg.role !== 'system' && (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  flex gap-4 max-w-[85%] 
                  ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}
                `}>
                  <div className={`
                    w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1
                    ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-white border border-slate-200 text-slate-400 shadow-sm'}
                  `}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div 
                    dir={isRTL(msg.content) ? 'rtl' : 'ltr'}
                    className={`
                      p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                      ${msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-200' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}
                      ${isRTL(msg.content) ? 'font-arabic text-base' : ''}
                    `}
                  >
                    {msg.content.split('DOWNLOAD_PATH:')[0]}
                    {msg.content.includes('DOWNLOAD_PATH:') && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Generated File</p>
                         <button 
                          onClick={() => {
                            const path = msg.content.split('DOWNLOAD_PATH:')[1].trim();
                            // In a real app, this would trigger a download from the backend
                            alert(`Downloading from: ${path}\n(Note: This is a simulation, the backend logic for file generation is local.)`);
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all font-bold text-xs w-fit border border-emerald-100/50"
                         >
                          <FileOutput size={14} /> Download {msg.content.split('DOWNLOAD_PATH:')[1].split('/').pop()}
                         </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-400 shadow-sm flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File Panel */}
        <AnimatePresence>
          {showFilePanel && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border-b border-slate-200 overflow-hidden shadow-inner"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Uploaded Documents</h3>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <FilePlus size={14} /> Add PDF
                  </button>
                </div>
                {uploadedFiles.length === 0 ? (
                  <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                    <Paperclip className="text-slate-300 mb-2" size={24} />
                    <p className="text-xs text-slate-400 font-medium tracking-tight">No files uploaded yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map(file => (
                      <motion.div 
                        layout
                        key={file.id} 
                        className="bg-white border border-slate-200 px-3 py-2 rounded-xl flex items-center gap-2 shadow-sm text-xs font-medium text-slate-700 group"
                      >
                        <FileText size={14} className="text-slate-400" />
                        <span className="max-w-[120px] truncate">{file.name}</span>
                        <button 
                          onClick={() => setUploadedFiles(uploadedFiles.filter(f => f.id !== file.id))}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0">
          <div className="flex gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 border-2 border-slate-100 hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex-shrink-0"
              title="Attach PDF"
            >
              <Paperclip size={20} />
            </button>
            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                dir={isRTL(input) ? 'rtl' : 'ltr'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Talk to CV Buddy..."
                className={`w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white rounded-2xl p-4 pr-14 text-sm resize-none transition-all focus:outline-none min-h-[50px] max-h-[150px] ${isRTL(input) ? 'font-arabic text-base' : ''}`}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`
                  absolute right-2 bottom-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all
                  ${!input.trim() || isLoading 
                    ? 'bg-slate-200 text-slate-400' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'}
                `}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-3">
             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">English</span>
             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">اردو</span>
             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">پښتو</span>
          </div>
        </div>
      </div>

      {/* Right Preview Area */}
      <div className="hidden lg:flex w-[45%] xl:w-[50%] 2xl:w-[55%] flex-col bg-slate-100/50 relative overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <h2 className="text-sm font-bold text-slate-700">Live CV Generation</h2>
          </div>
          <div className="flex gap-2">
             <button 
              onClick={() => handlePrint()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
             >
              <Download size={14} /> Export to PDF
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-8 flex justify-center items-start [--cv-scale:0.6] xl:[--cv-scale:0.75] 2xl:[--cv-scale:0.85]">
          <div 
            className="bg-white shadow-2xl origin-top transition-transform duration-500 rounded-sm"
            style={{ 
              width: '210mm', 
              height: '297mm',
              transform: 'scale(var(--cv-scale))'
            }}
          >
            <Templates ref={componentRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
