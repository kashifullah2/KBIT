import React, { useState } from 'react';
import { X, Mail, Lock, User, LayoutTemplate, Loader2, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthModal({ isOpen, onClose, onSuccess }) {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
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

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
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
                // Exclude confirm_password before sending to backend
                const { confirm_password, ...dataToSend } = signupData;
                await signup(dataToSend);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {mode === 'login' ? 'Login to save your progress' : 'Sign up to potential employers'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                name="first_name"
                                                required
                                                value={signupData.first_name}
                                                onChange={handleSignupChange}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                                placeholder="John"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Last Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                name="last_name"
                                                required
                                                value={signupData.last_name}
                                                onChange={handleSignupChange}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={signupData.phone}
                                                onChange={handleSignupChange}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                                placeholder="+1 234..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Gender</label>
                                        <select
                                            name="gender"
                                            value={signupData.gender}
                                            onChange={handleSignupChange}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                            <option>Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <textarea
                                            name="address"
                                            required
                                            rows="2"
                                            value={signupData.address}
                                            onChange={handleSignupChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                                            placeholder="123 Main St..."
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={mode === 'login' ? loginData.email : signupData.email}
                                    onChange={mode === 'login' ? handleLoginChange : handleSignupChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={mode === 'login' ? loginData.password : signupData.password}
                                    onChange={mode === 'login' ? handleLoginChange : handleSignupChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        required
                                        value={signupData.confirm_password}
                                        onChange={handleSignupChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-sm text-slate-500">
                    {mode === 'login' ? (
                        <>
                            Don't have an account?{' '}
                            <button onClick={() => setMode('signup')} className="text-indigo-600 font-medium hover:text-indigo-700">
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button onClick={() => setMode('login')} className="text-indigo-600 font-medium hover:text-indigo-700">
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
