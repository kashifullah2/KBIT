import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, User, Bot, Download, FileText, Loader2,
  FileOutput, Paperclip, X, FilePlus, Layers,
  Eye, EyeOff, RotateCcw, Maximize2, Minimize2,
  Pencil, Trash2, RefreshCw, MessageSquare, History,
  Plus, History as HistoryIcon, LogIn, Save,
  ZoomIn, ZoomOut
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useCVStore, { CVStore } from '../store/useCVStore';
import Templates from './CVBuilder/Templates';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

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
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // ── State ──
  const [showPreview, setShowPreview] = useState(true);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [threadId, setThreadId] = useState(() => {
    const saved = localStorage.getItem('chat_thread_id');
    if (saved) return saved;
    const newId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chat_thread_id', newId);
    return newId;
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cvScale, setCvScale] = useState(0.6);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  // ── History State ──
  const [history, setHistory] = useState<Array<{ id: string, title: string }>>(() => {
    const saved = localStorage.getItem('chat_history_list');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeThreadId, setActiveThreadId] = useState(() => {
    return localStorage.getItem('chat_thread_id') || Math.random().toString(36).substr(2, 9);
  });
  const [showHistory, setShowHistory] = useState(true);

  // ── Sync Active Thread ──
  useEffect(() => {
    localStorage.setItem('chat_thread_id', activeThreadId);
    if (!history.find(h => h.id === activeThreadId) && messages.length > 0) {
      const newHistory = [{
        id: activeThreadId,
        title: messages[0].content.substring(0, 30) + '...'
      }, ...history];
      setHistory(newHistory);
      localStorage.setItem('chat_history_list', JSON.stringify(newHistory));
    }
    // Update existing thread title if it's the first message
    if (messages.length > 0 && history.find(h => h.id === activeThreadId && h.title === 'New Chat...')) {
      const newHistory = history.map(h =>
        h.id === activeThreadId
          ? { ...h, title: messages[0].content.substring(0, 30) + '...' }
          : h
      );
      setHistory(newHistory);
      localStorage.setItem('chat_history_list', JSON.stringify(newHistory));
    }
  }, [messages, activeThreadId, history]);

  // ── Sync with Auth State ──
  useEffect(() => {
    // When authentication state changes (login/logout), re-sync local state.
    // This is critical for privacy on shared devices.
    const savedMessages = localStorage.getItem('chat_history');
    setMessages(savedMessages ? JSON.parse(savedMessages) : []);

    const savedHistory = localStorage.getItem('chat_history_list');
    setHistory(savedHistory ? JSON.parse(savedHistory) : []);

    const savedThread = localStorage.getItem('chat_thread_id');
    if (!savedThread) {
      const newId = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chat_thread_id', newId);
      setThreadId(newId);
      setActiveThreadId(newId);
    } else {
      setThreadId(savedThread);
      setActiveThreadId(savedThread);
    }
  }, [isAuthenticated]);

  // ── Database Sync ──
  const saveCVToDB = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      await axios.post(`${API_URL}/cv/save`, {
        content: cvData,
        filename: `${cvData.personalInfo.firstName || 'My'} CV`
      });
    } catch (e) {
      console.error("Auto-save failed", e);
    }
  }, [cvData, isAuthenticated]);

  useEffect(() => {
    const timer = setTimeout(saveCVToDB, 2000);
    return () => clearTimeout(timer);
  }, [cvData, saveCVToDB]);

  // ── Check if CV has content ──
  const hasCVContent = cvData.personalInfo.firstName || cvData.personalInfo.lastName || cvData.experience.length > 0 || cvData.education.length > 0 || cvData.skills.length > 0;

  // ── Prevent accidental refresh ──
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (messages.length > 0 || hasCVContent) {
        const msg = "Are you sure you want to refresh? Your temporary session data might be cleared.";
        e.preventDefault();
        e.returnValue = msg;
        return msg;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [messages, hasCVContent]);

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
      // ✅ Better error handling for API calls
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      const response = await axios.post<ChatResponse>(
        `${API_URL}/chat`,
        {
          messages: [{ role: 'user', content: trimmed }],
          thread_id: threadId,
        },
        {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );
      
      clearTimeout(timeoutId);

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
    } catch (error: any) {
      // ✅ Better error messages for debugging
      let errorMessage = "⚠️ Connection error. Please try again.";
      
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        errorMessage = "⚠️ Request timeout. Check your connection and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "⚠️ Session expired. Please log in again.";
      } else if (error.response?.status === 500) {
        errorMessage = "⚠️ Server error. Please try again later.";
      } else if (!error.response) {
        errorMessage = "⚠️ Network error. Check your internet connection.";
      }
      
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Reset chat / New Chat ──
  const startNewChat = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setActiveThreadId(newId);
    setMessages([]);
    localStorage.setItem(`chat_history_${newId}`, JSON.stringify([]));
    const newHistory = [{ id: newId, title: 'New Chat...' }, ...history];
    setHistory(newHistory);
    localStorage.setItem('chat_history_list', JSON.stringify(newHistory));
  };

  const loadHistoryChat = (id: string) => {
    setActiveThreadId(id);
    const saved = localStorage.getItem(`chat_history_${id}`);
    setMessages(saved ? JSON.parse(saved) : []);
  };

  const deleteHistoryChat = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('chat_history_list', JSON.stringify(newHistory));
    localStorage.removeItem(`chat_history_${id}`);
    if (activeThreadId === id) {
      startNewChat();
    }
  };

  const resetChat = () => {
    setMessages([]);
    localStorage.setItem(`chat_history_${activeThreadId}`, JSON.stringify([]));
  };

  // ── Clear CV data ──
  const handleClearCV = () => {
    clearData();
  };

  // ── Update CV via chatbot ──
  const handleUpdateCVContent = () => {
    const msg = 'Please update my CV with professional content based on our conversation so far. Fill in all sections.';
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setIsLoading(true);
    setShowPreview(true);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    axios.post<ChatResponse>(
      `${API_URL}/chat`,
      {
        messages: [{ role: 'user', content: msg }],
        thread_id: threadId,
      },
      {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    ).then(res => {
      clearTimeout(timeoutId);
      const content = res.data.content?.split('DOWNLOAD_PATH:')[0]?.trim() ?? '';
      setMessages(prev => [...prev, { role: 'assistant', content }]);
      if (res.data.cv_update) applyCVUpdate(res.data.cv_update);
    }).catch((error) => {
      clearTimeout(timeoutId);
      console.error('CV update error:', error);
      const errorMsg = error.code === 'ECONNABORTED' 
        ? '⚠️ Request timeout. Please try again.' 
        : '⚠️ Connection error. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    }).finally(() => setIsLoading(false));
  };

  // ── Template options ──
  const templateOptions = [
    { name: 'Modern', value: 'modern' },
    { name: 'Professional', value: 'professional' },
    { name: 'Creative', value: 'creative' },
    { name: 'Elegant', value: 'elegant' },
    { name: 'Executive', value: 'two-column' },
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        axios.post<ChatResponse>(
          `${API_URL}/chat`,
          {
            messages: [{ role: 'user', content: msg }],
            thread_id: threadId,
          },
          {
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000,
          }
        ).then(res => {
          clearTimeout(timeoutId);
          const content = res.data.content?.split('DOWNLOAD_PATH:')[0]?.trim() ?? '';
          setMessages(prev => [...prev, { role: 'assistant', content }]);
          if (res.data.cv_update) applyCVUpdate(res.data.cv_update);
        }).catch((error) => {
          clearTimeout(timeoutId);
          console.error('Quick action error:', error);
          const errorMsg = error.code === 'ECONNABORTED' 
            ? '⚠️ Request timeout. Please try again.' 
            : '⚠️ Connection error. Please try again.';
          setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
        }).finally(() => setIsLoading(false));
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
      <div className={`flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-500 ${showPreview ? 'w-full lg:w-[520px] xl:w-[740px]' : 'w-full max-w-3xl mx-auto'
        }`}>

        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all lg:hidden"
            >
              <HistoryIcon size={20} />
            </button>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10 overflow-hidden shrink-0">
              <img src="/assets/logo.png" alt="Brain Half" className="w-full h-full object-contain p-0.5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight">Brain Half</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[11px] text-slate-400 font-medium">Online • AI Intelligence</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={startNewChat}
              className="p-2 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-slate-800 transition-all font-medium flex items-center gap-2"
              title="New Chat"
            >
              <Plus size={20} />
              <span className="hidden sm:inline text-xs">New Chat</span>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* History Sidebar */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden xl:flex flex-col bg-slate-900/40 border-r border-slate-800/80 overflow-hidden shrink-0"
              >
                <div className="p-4 flex-1 overflow-y-auto space-y-2 scrollbar-none">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Recent Chats</div>
                  {history.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all ${activeThreadId === chat.id
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      onClick={() => loadHistoryChat(chat.id)}
                    >
                      <MessageSquare size={14} className="shrink-0" />
                      <span className="text-xs font-medium truncate flex-1">{chat.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistoryChat(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-800/50">
                  <button
                    onClick={startNewChat}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
                  >
                    <Plus size={14} /> New Session
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {messages.length === 0 ? (
                /* ── Empty State ── */
                <div className="flex flex-col items-center justify-center h-full px-2 sm:px-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-6 sm:mb-10"
                  >
                    <div className="w-16 sm:w-20 h-16 sm:h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner">
                      <Bot size={32} className="sm:w-10 sm:h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
                      Welcome to Brain Half
                    </h2>
                    <p className="text-sm sm:text-base text-slate-400 max-w-sm font-medium">
                      Your personal AI expert for building premium, ATS-ready resumes in minutes.
                    </p>
                  </motion.div>

                  <div className="w-full max-w-md px-2">
                    {quickActions.map((card, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={card.action}
                        className="group w-full flex items-center gap-3 sm:gap-5 p-3 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/40 hover:bg-slate-800 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all text-left mb-3 sm:mb-4 active:scale-95"
                      >
                        <div className={`w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                          {card.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-wide">{card.title}</h3>
                          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 leading-relaxed font-medium hidden sm:block">{card.desc}</p>
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}
                    >
                      {msg.role === 'system' ? (
                        <div className="px-4 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          {msg.content}
                        </div>
                      ) : (
                        <div className={`flex items-start gap-2 sm:gap-4 max-w-[95%] sm:max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${msg.role === 'user'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-800 border border-slate-700 text-emerald-400'
                            }`}>
                            {msg.role === 'user' ? <User size={16} className="sm:w-5 sm:h-5" /> : <Bot size={16} className="sm:w-5 sm:h-5" />}
                          </div>

                          <div className={`flex flex-col min-w-0 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div
                              dir={isRTL(msg.content) ? 'rtl' : 'ltr'}
                              className={`rounded-2xl text-sm sm:text-[15px] leading-relaxed shadow-sm transition-all ${msg.role === 'user'
                                ? 'bg-emerald-600 text-white px-3 sm:px-5 py-2 sm:py-4 rounded-tr-sm'
                                : 'bg-slate-800 text-slate-100 px-3 sm:px-5 py-2 sm:py-4 rounded-tl-sm border border-slate-700/50'
                                } ${isRTL(msg.content) ? 'font-arabic text-lg' : 'word-break: break-word'}`}
                            >
                              {/* Render markdown for assistant, plain text for user */}
                              {msg.role === 'assistant' ? (
                                <div className="prose prose-invert prose-emerald max-w-none prose-p:my-2 prose-p:leading-relaxed prose-li:my-1 prose-headings:text-emerald-400 prose-strong:text-white prose-a:text-emerald-400 break-words overflow-wrap-anywhere">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.content.split('DOWNLOAD_PATH:')[0]}
                                  </ReactMarkdown>
                                </div>
                              ) : (
                                <span className="font-medium">{msg.content.split('DOWNLOAD_PATH:')[0]}</span>
                              )}

                              {/* Download button */}
                              {msg.content.includes('DOWNLOAD_PATH:') && (
                                <div className="mt-4 pt-4 border-t border-slate-700/50">
                                  <button
                                    onClick={() => {
                                      if (!isAuthenticated) {
                                        setShowAuthModal(true);
                                        return;
                                      }
                                      const path = msg.content.split('DOWNLOAD_PATH:')[1].trim();
                                      window.open(`${API_URL}${path}`, '_blank');
                                    }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all text-[13px] font-bold w-full sm:w-fit"
                                  >
                                    <Download size={16} />
                                    <span>Download File</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-4">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center shadow-md">
                          <Bot size={18} />
                        </div>
                        <div className="px-5 py-4 bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-sm flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <span className="w-2 h-2 bg-emerald-400/60 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-emerald-400/80 rounded-full animate-bounce [animation-delay:0.15s]" />
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="px-3 sm:px-6 py-4 sm:py-5 border-t border-slate-800 shrink-0 bg-slate-900/50">
          <div className="flex gap-2 sm:gap-3 items-end max-w-4xl mx-auto">
            <div className="relative flex-1 flex items-end bg-slate-800/40 rounded-2xl p-2 transition-all group backdrop-blur-sm">
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
                placeholder="Ask Brain Half anything..."
                className={`flex-1 bg-transparent border-none focus:ring-0 outline-none px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-slate-500 resize-none transition-all min-h-[44px] max-h-[150px] ${isRTL(input) ? 'font-arabic text-xl' : ''}`}
                rows={1}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                title={isLoading ? 'Sending...' : 'Send message'}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all shrink-0 ${!input.trim() || isLoading
                  ? 'bg-slate-700/50 text-slate-500'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/30 font-bold active:scale-95'
                  }`}
              >
                <Send size={16} className="sm:hidden" />
                <Send size={18} className="hidden sm:block" />
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-3 sm:mt-4">
            <span className="text-[10px] sm:text-[11px] text-white/90 font-bold uppercase tracking-[0.25em] px-3 sm:px-4 py-1.5 bg-slate-800/50 rounded-full border border-slate-700/30 shadow-sm backdrop-blur-sm whitespace-nowrap">
              Multi Language Intelligence
            </span>
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
            className={`hidden lg:flex flex-col bg-slate-50 flex-1 overflow-hidden ${previewFullscreen ? 'fixed inset-0 z-50' : ''
              }`}
          >
            {/* Preview Toolbar */}
            <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                {templateOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTemplate(opt.value)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${selectedTemplate === opt.value
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
                  onClick={async () => {
                    if (!isAuthenticated) {
                      setShowAuthModal(true);
                      return;
                    }
                    await saveCVToDB();
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                  title="Save to Profile"
                >
                  <Save size={16} />
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

                {/* Desktop Zoom Controls */}
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 ml-1">
                  <button
                    onClick={() => setCvScale(prev => Math.max(0.3, prev - 0.1))}
                    className="p-1.5 rounded-md hover:bg-white hover:text-slate-900 transition-all text-slate-500"
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <button
                    onClick={() => setCvScale(0.6)}
                    className="text-[10px] font-bold text-slate-600 px-1 hover:text-slate-900"
                    title="Reset Zoom"
                  >
                    {Math.round(cvScale * 100)}%
                  </button>
                  <button
                    onClick={() => setCvScale(prev => Math.min(1.5, prev + 0.1))}
                    className="p-1.5 rounded-md hover:bg-white hover:text-slate-900 transition-all text-slate-500"
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowAuthModal(true);
                      return;
                    }
                    handlePrint();
                  }}
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
                  transform: `scale(${cvScale})`,
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
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${selectedTemplate === opt.value
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

                {/* Mobile Zoom Controls */}
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setCvScale(prev => Math.max(0.2, prev - 0.1))}
                    className="p-1.5 rounded-md hover:bg-white text-slate-500"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <button
                    onClick={() => setCvScale(prev => Math.min(1.0, prev + 0.1))}
                    className="p-1.5 rounded-md hover:bg-white text-slate-500"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowAuthModal(true);
                      return;
                    }
                    handlePrint();
                  }}
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
                  transform: `scale(${cvScale * 0.75})`,
                  transformOrigin: 'top center',
                }}
              >
                <Templates ref={componentRef} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  AUTH MODAL: Sign In Required                               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Sign In Required</h3>
              <p className="text-slate-400 mb-8 font-medium">
                Please sign in or create an account to save, export, or download your CV.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/login', { state: { from: location.pathname } })}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup', { state: { from: location.pathname } })}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all active:scale-[0.98]"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="w-full py-3 text-slate-500 hover:text-slate-300 font-bold transition-all text-sm"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant;
