import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, User, Bot, Download, FileText, Loader2,
  FileOutput, Paperclip, X, FilePlus, Layers,
  Eye, EyeOff, RotateCcw, Maximize2, Minimize2,
  Pencil, Trash2, RefreshCw
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useCVStore, { CVStore } from '../store/useCVStore';
import Templates from './CVBuilder/Templates';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  role: string;
  content: string;
  cv_update: Record<string, any> | null;
  download: string | null;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const AIAssistant: React.FC = () => {
  const navigate = useNavigate();

  // ── State ──
  const [showPreview, setShowPreview] = useState(false);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_history');
    return saved ? JSON.parse(saved) : [];
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

  // ── Refs ──
  const fileInputRef = useRef<HTMLInputElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Store ──
  const cvData = useCVStore((s: CVStore) => s.cvData);
  const setCVData = useCVStore((s: CVStore) => s.setCVData);
  const clearData = useCVStore((s: CVStore) => s.clearData);
  const selectedTemplate = useCVStore((s) => s.selectedTemplate);
  const setTemplate = useCVStore((s) => s.setTemplate);

  // ── Check if CV has content ──
  const hasCVContent = cvData.personalInfo.firstName || cvData.personalInfo.lastName || cvData.experience.length > 0 || cvData.education.length > 0 || cvData.skills.length > 0;

  // ── Persist chat ──
  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  // ── Print ──
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'My_AI_CV',
  });

  // ── Auto-scroll ──
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ── Auto-resize textarea ──
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  // ── RTL detection ──
  const isRTL = (text: string) => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);

  // ── CV Update — simplified, store already deep-merges ──
  const applyCVUpdate = useCallback((cvUpdate: Record<string, any>) => {
    if (!cvUpdate || Object.keys(cvUpdate).length === 0) return;
    setCVData(cvUpdate);
    setShowPreview(true);
  }, [setCVData]);

  // ── File upload ──
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const names: string[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'application/pdf') names.push(files[i].name);
    }
    if (names.length > 0) {
      setMessages(prev => [...prev, { role: 'system', content: `📎 Uploaded: ${names.join(', ')}` }]);
    }
  };

  // ── Send message ──
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post<ChatResponse>(`${API_URL}/chat`, {
        messages: [{ role: 'user', content: trimmed }],
        thread_id: threadId,
      });

      const data = response.data;

      // Build display content — strip DOWNLOAD_PATH suffix
      const displayContent = data.content?.split('DOWNLOAD_PATH:')[0]?.trim() ?? '';
      const downloadPath = data.download ?? (
        data.content?.includes('DOWNLOAD_PATH:')
          ? data.content.split('DOWNLOAD_PATH:')[1]?.trim()
          : null
      );

      const fullContent = downloadPath
        ? `${displayContent}\nDOWNLOAD_PATH:${downloadPath}`
        : displayContent;

      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }]);

      // Apply CV update immediately — no confirmation needed
      if (data.cv_update) {
        applyCVUpdate(data.cv_update);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Reset chat ──
  const resetChat = () => {
    if (confirm('Clear chat history?')) {
      setMessages([]);
      localStorage.removeItem('chat_history');
      localStorage.removeItem('chat_thread_id');
      window.location.reload();
    }
  };

  // ── Clear CV data ──
  const handleClearCV = () => {
    if (confirm('Clear all CV content? This will reset the CV preview.')) {
      clearData();
    }
  };

  // ── Update CV via chatbot ──
  const handleUpdateCVContent = () => {
    const msg = 'Please update my CV with professional content based on our conversation so far. Fill in all sections.';
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setIsLoading(true);
    setShowPreview(true);
    axios.post<ChatResponse>(`${API_URL}/chat`, {
      messages: [{ role: 'user', content: msg }],
      thread_id: threadId,
    }).then(res => {
      const content = res.data.content?.split('DOWNLOAD_PATH:')[0]?.trim() ?? '';
      setMessages(prev => [...prev, { role: 'assistant', content }]);
      if (res.data.cv_update) applyCVUpdate(res.data.cv_update);
    }).catch(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Connection error. Please try again.' }]);
    }).finally(() => setIsLoading(false));
  };

  // ── Template options ──
  const templateOptions = [
    { name: 'Modern', value: 'modern' },
    { name: 'Professional', value: 'professional' },
    { name: 'Creative', value: 'creative' },
    { name: 'Elegant', value: 'elegant' },
  ];

  // ── Quick actions for empty state ──
  const quickActions = [
    {
      title: 'Create a CV',
      desc: 'Build a professional CV from scratch with AI guidance.',
      icon: <FilePlus size={24} />,
      gradient: 'from-emerald-500 to-teal-600',
      action: () => {
        setShowPreview(true);
        const msg = 'I want to create a professional CV';
        setMessages(prev => [...prev, { role: 'user', content: msg }]);
        setIsLoading(true);
        axios.post<ChatResponse>(`${API_URL}/chat`, {
          messages: [{ role: 'user', content: msg }],
          thread_id: threadId,
        }).then(res => {
          const content = res.data.content?.split('DOWNLOAD_PATH:')[0]?.trim() ?? '';
          setMessages(prev => [...prev, { role: 'assistant', content }]);
          if (res.data.cv_update) applyCVUpdate(res.data.cv_update);
        }).catch(() => {
          setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Connection error. Please try again.' }]);
        }).finally(() => setIsLoading(false));
      }
    },
    {
      title: 'Merge PDFs',
      desc: 'Combine multiple documents into one PDF.',
      icon: <Layers size={24} />,
      gradient: 'from-blue-500 to-indigo-600',
      action: () => {
        const msg = 'I want to merge PDF files';
        setMessages(prev => [...prev, { role: 'user', content: msg }]);
      }
    },
    {
      title: 'Convert to DOCX',
      desc: 'Transform PDFs into editable Word documents.',
      icon: <FileOutput size={24} />,
      gradient: 'from-amber-500 to-orange-600',
      action: () => {
        const msg = 'I want to convert PDF to DOCX';
        setMessages(prev => [...prev, { role: 'user', content: msg }]);
      }
    }
  ];

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div className="flex h-[calc(100vh-56px)] bg-slate-950 overflow-hidden relative">
      <input
        type="file"
        multiple
        accept=".pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  LEFT: Chat Panel                                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className={`flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-500 ${
        showPreview ? 'w-full lg:w-[420px] xl:w-[480px]' : 'w-full max-w-3xl mx-auto'
      }`}>

        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Bot size={20} />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm tracking-tight">CV Buddy</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-400 font-medium">Online • Multilingual</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-lg transition-all text-sm ${
                showPreview
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button
              onClick={resetChat}
              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-all"
              title="Reset Chat"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {messages.length === 0 ? (
            /* ── Empty State ── */
            <div className="flex flex-col items-center justify-center h-full px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Bot size={32} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  What can I help you with?
                </h2>
                <p className="text-slate-400 text-sm max-w-sm">
                  Choose an action below or type your request to get started.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
                {quickActions.map((card, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    onClick={card.action}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800 transition-all text-left"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-lg flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform`}>
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{card.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{card.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Message List ── */
            <>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}
                >
                  {msg.role === 'system' ? (
                    <div className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {msg.content}
                    </div>
                  ) : (
                    <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === 'user'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800 border border-slate-700 text-emerald-400'
                      }`}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div
                        dir={isRTL(msg.content) ? 'rtl' : 'ltr'}
                        className={`rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-emerald-600 text-white px-4 py-3 rounded-tr-sm'
                            : 'bg-slate-800 text-slate-200 px-4 py-3 rounded-tl-sm border border-slate-700/50'
                        } ${isRTL(msg.content) ? 'font-arabic text-base' : ''}`}
                      >
                        {/* Render markdown for assistant, plain text for user */}
                        {msg.role === 'assistant' ? (
                          <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:text-emerald-400 prose-strong:text-white prose-a:text-emerald-400">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content.split('DOWNLOAD_PATH:')[0]}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <span>{msg.content.split('DOWNLOAD_PATH:')[0]}</span>
                        )}

                        {/* Download button */}
                        {msg.content.includes('DOWNLOAD_PATH:') && (
                          <div className="mt-3 pt-3 border-t border-slate-600/50">
                            <button
                              onClick={() => {
                                const path = msg.content.split('DOWNLOAD_PATH:')[1].trim();
                                window.open(`${API_URL}${path}`, '_blank');
                              }}
                              className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-xs font-semibold w-fit"
                            >
                              <Download size={14} />
                              Download {msg.content.split('DOWNLOAD_PATH:')[1].split('/').pop()?.trim()}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center">
                      <Bot size={14} />
                    </div>
                    <div className="px-4 py-3 bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-sm flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-emerald-400/80 rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="px-4 py-4 border-t border-slate-800 shrink-0">
          <div className="flex gap-2 items-end">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 border border-slate-700 bg-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 transition-all shrink-0"
              title="Attach PDF"
            >
              <Paperclip size={18} />
            </button>
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                dir={isRTL(input) ? 'rtl' : 'ltr'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message CV Buddy..."
                className={`w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/50 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 resize-none transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500/20 min-h-[44px] max-h-[150px] ${isRTL(input) ? 'font-arabic text-base' : ''}`}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`absolute right-2 bottom-2 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  !input.trim() || isLoading
                    ? 'bg-slate-700 text-slate-500'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                }`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {['English', 'اردو', 'پښتو'].map(lang => (
              <span key={lang} className="text-[9px] text-slate-600 font-semibold uppercase tracking-widest">{lang}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  RIGHT: CV Preview Panel                                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={`hidden lg:flex flex-col bg-slate-50 flex-1 overflow-hidden ${
              previewFullscreen ? 'fixed inset-0 z-50' : ''
            }`}
          >
            {/* Preview Toolbar */}
            <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                {templateOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTemplate(opt.value)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      selectedTemplate === opt.value
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearCV}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Clear CV Content"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={handleUpdateCVContent}
                  disabled={isLoading}
                  className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                  title="Update CV Content via AI"
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={() => navigate('/cv-builder/edit')}
                  className="flex items-center gap-1.5 px-3 py-2 text-emerald-600 bg-emerald-50 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-all border border-emerald-200"
                  title="Edit CV Manually"
                >
                  <Pencil size={14} /> Edit CV
                </button>
                <button
                  onClick={() => setPreviewFullscreen(!previewFullscreen)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                  title={previewFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {previewFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={() => handlePrint()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-all shadow-sm"
                >
                  <Download size={14} /> Export PDF
                </button>
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="flex-1 overflow-auto p-6 flex justify-center items-start bg-[repeating-conic-gradient(#f1f5f9_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]">
              <div
                className="bg-white shadow-2xl shadow-slate-900/10 origin-top transition-transform duration-500 rounded border border-slate-200"
                style={{
                  width: '210mm',
                  height: '297mm',
                  transform: 'scale(var(--cv-scale, 0.6))',
                }}
              >
                <Templates ref={componentRef} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  MOBILE: Preview Toggle FAB                                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {showPreview && (
        <div className="lg:hidden fixed bottom-24 right-4 z-40">
          <button
            onClick={() => setPreviewFullscreen(true)}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-full shadow-xl shadow-emerald-500/30 font-semibold text-sm"
          >
            <Eye size={18} /> Preview CV
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  MOBILE: Fullscreen Preview Modal                           */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {previewFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-slate-50 flex flex-col"
          >
            {/* Mobile Preview Toolbar */}
            <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 overflow-x-auto">
                {templateOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTemplate(opt.value)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                      selectedTemplate === opt.value
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearCV}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Clear CV"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={handleUpdateCVContent}
                  disabled={isLoading}
                  className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                  title="Update CV Content"
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={() => navigate('/cv-builder/edit')}
                  className="flex items-center gap-1.5 px-3 py-2 text-emerald-600 bg-emerald-50 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-all border border-emerald-200"
                  title="Edit CV"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handlePrint()}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  <Download size={14} /> PDF
                </button>
                <button
                  onClick={() => setPreviewFullscreen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Mobile Preview Canvas */}
            <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
              <div
                className="bg-white shadow-xl origin-top border border-slate-200 rounded"
                style={{
                  width: '210mm',
                  height: '297mm',
                  transform: 'scale(0.45)',
                  transformOrigin: 'top center',
                }}
              >
                <Templates ref={componentRef} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant;
