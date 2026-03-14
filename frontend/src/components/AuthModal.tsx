import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, signup } = useAuth();

    // Login State
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    // Signup State
    const [signupData, setSignupData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        gender: 'Prefer not to say',
        address: '',
        confirm_password: ''
    });

    if (!isOpen) return null;

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => 
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    
    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        setSignupData({ ...signupData, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (mode === 'login') {
                await login(loginData.email, loginData.password);
            } else {
                if (signupData.password !== signupData.confirm_password) {
                    throw new Error("Passwords do not match");
                }
                const { confirm_password, ...dataToSend } = signupData;
                await signup(dataToSend);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden shrink-0">
                            <img src="/assets/logo.png" alt="Brain Half" className="w-full h-full object-contain p-1" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-sm font-medium text-slate-500 mt-1">
                                {mode === 'login' ? 'Login to continue your session' : 'Sign up to access all features'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="mb-6 p-4 text-sm font-bold text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'signup' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">First Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                name="first_name"
                                                required
                                                value={signupData.first_name}
                                                onChange={handleSignupChange}
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                                placeholder="John"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Last Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                name="last_name"
                                                required
                                                value={signupData.last_name}
                                                onChange={handleSignupChange}
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Phone</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={signupData.phone}
                                                onChange={handleSignupChange}
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                                placeholder="+1 234..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Gender</label>
                                        <select
                                            name="gender"
                                            value={signupData.gender}
                                            onChange={handleSignupChange}
                                            className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Address</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                                        <textarea
                                            name="address"
                                            required
                                            rows={2}
                                            value={signupData.address}
                                            onChange={handleSignupChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all resize-none placeholder:text-slate-700"
                                            placeholder="123 Main St..."
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={mode === 'login' ? loginData.email : signupData.email}
                                    onChange={mode === 'login' ? handleLoginChange : handleSignupChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700 font-medium"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={mode === 'login' ? loginData.password : signupData.password}
                                    onChange={mode === 'login' ? handleLoginChange : handleSignupChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700 font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        required
                                        value={signupData.confirm_password}
                                        onChange={handleSignupChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700 font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-xl shadow-emerald-500/10 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                mode === 'login' ? 'Authenticate' : 'Register Account'
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-950 border-t border-slate-800 text-center">
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">
                        {mode === 'login' ? (
                            <>
                                New to Brain Half?{' '}
                                <button onClick={() => setMode('signup')} className="text-emerald-400 hover:text-emerald-300 transition-colors ml-1">
                                    Create one now
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button onClick={() => setMode('login')} className="text-emerald-400 hover:text-emerald-300 transition-colors ml-1">
                                    Sign in here
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
