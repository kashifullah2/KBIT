import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Loader2, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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
            navigate('/cv-builder');
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950 relative overflow-hidden">
            <Helmet>
                <title>Sign Up - KBIT</title>
                <meta name="description" content="Create your KBIT account to access AI-powered CV builder and professional tools." />
            </Helmet>

            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-lg relative z-10">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2.5 mb-6">
                        <div className="bg-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/25">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">KBIT</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create an account</h2>
                    <p className="text-sm text-slate-400">Start building your professional CV today</p>
                </div>

                {/* Card */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl shadow-black/20">
                    {error && (
                        <div className="mb-6 p-3.5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        name="first_name"
                                        required
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all text-sm"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        name="last_name"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all text-sm"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all text-sm"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all text-sm"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all text-sm"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                    <option>Prefer not to say</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                                <textarea
                                    name="address"
                                    required
                                    rows={2}
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all resize-none text-sm"
                                    placeholder="123 Main St, City, Country"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        required
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer link */}
                <div className="text-center text-sm text-slate-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
