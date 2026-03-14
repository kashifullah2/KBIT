import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Loader2, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirm_password: '',
        first_name: '',
        last_name: '',
        phone: '',
        gender: 'Prefer not to say',
        address: ''
    });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from || '/cv-builder';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (formData.password !== formData.confirm_password) {
                throw new Error("Passwords do not match");
            }
            const { confirm_password, ...dataToSend } = formData;
            await signup(dataToSend);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#020617] relative overflow-hidden font-sans">
            <Helmet>
                <title>Sign Up - Brain Half AI Assistant</title>
                <meta name="description" content="Create your Brain Half account to access AI-powered CV builder and professional tools." />
            </Helmet>

            {/* Premium Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" 
                />
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" 
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-xl relative z-10"
            >
                {/* Brand Logo */}
                <div className="text-center mb-10">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 mb-4 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl shadow-xl shadow-emerald-500/20">
                            <Bot className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-3xl font-extrabold text-white tracking-tighter uppercase">Brain Half</span>
                    </motion.div>
                    <h2 className="text-4xl font-bold tracking-tight text-white mb-2 leading-tight">Start Your Journey</h2>
                    <p className="text-slate-400 text-lg font-medium">Join thousands of professionals using AI</p>
                </div>

                {/* Main Card */}
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 font-medium"
                        >
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">First Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        name="first_name"
                                        required
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base outline-none group-hover:bg-slate-800/70"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Last Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        name="last_name"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base outline-none group-hover:bg-slate-800/70"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base outline-none group-hover:bg-slate-800/70"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Phone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base outline-none group-hover:bg-slate-800/70"
                                        placeholder="+1..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base outline-none cursor-pointer hover:bg-slate-800/70"
                                >
                                    <option className="bg-slate-900">Male</option>
                                    <option className="bg-slate-900">Female</option>
                                    <option className="bg-slate-900">Other</option>
                                    <option className="bg-slate-900">Prefer not to say</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Address</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                <textarea
                                    name="address"
                                    required
                                    rows={2}
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base outline-none resize-none group-hover:bg-slate-800/70"
                                    placeholder="Your city, country"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base outline-none group-hover:bg-slate-800/70"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Confirm</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        required
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base outline-none group-hover:bg-slate-800/70"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl shadow-emerald-500/30 active:scale-[0.98] text-xl"
                        >
                            {isLoading ? (
                                <Loader2 className="w-7 h-7 animate-spin" />
                            ) : (
                                <>
                                    Join the Community
                                    <ArrowRight className="w-6 h-6" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Bottom Link */}
                <div className="text-center text-slate-400 mt-10 font-medium pb-10">
                    Already have an account?{' '}
                    <Link to="/login" className="text-white font-bold hover:text-emerald-400 transition-colors underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-500">
                        Sign in instead
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
