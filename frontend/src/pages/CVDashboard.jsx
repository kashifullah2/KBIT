import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Copy, Trash2, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';

export function CVDashboard() {
    const navigate = useNavigate();
    const { token, isAuthenticated } = useAuth();
    const [cvList, setCvList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            loadCVs();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const loadCVs = async () => {
        try {
            const response = await axios.get(`${API_URL}/cv/list`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCvList(response.data);
        } catch (error) {
            console.error('Failed to load CVs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        navigate('/cv-builder/new');
    };

    const handleViewCV = (cvId) => {
        navigate(`/cv-builder/${cvId}`);
    };

    const handleDuplicateCV = async (cv) => {
        try {
            const duplicateData = {
                ...cv,
                title: `${cv.title} (Copy)`
            };
            const response = await axios.post(`${API_URL}/cv/save`, duplicateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadCVs(); // Refresh the list
        } catch (error) {
            console.error('Failed to duplicate CV:', error);
        }
    };

    const handleDeleteCV = async (cvId) => {
        if (!window.confirm('Are you sure you want to delete this resume?')) return;

        try {
            await axios.delete(`${API_URL}/cv/${cvId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadCVs(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete CV:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f3f0]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-pink-600" />
                            <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
                        </div>
                        {isAuthenticated && cvList.length > 0 && (
                            <p className="text-sm text-slate-600">
                                Your first resume is free forever. Need more than one resume?{' '}
                                <a href="#" className="text-pink-600 font-medium hover:underline">Upgrade your plan</a>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
                    </div>
                ) : !isAuthenticated ? (
                    <div className="text-center py-20">
                        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Resumes Yet</h2>
                        <p className="text-slate-600 mb-6">Sign in to save and manage your resumes</p>
                        <button
                            onClick={handleCreateNew}
                            className="px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
                        >
                            Create Your First Resume
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* New Resume Card */}
                        <button
                            onClick={handleCreateNew}
                            className="aspect-[210/297] border-2 border-dashed border-slate-300 rounded-lg hover:border-pink-400 hover:bg-white/50 transition-all flex flex-col items-center justify-center gap-3 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-pink-50 flex items-center justify-center transition-colors">
                                <Plus className="w-6 h-6 text-slate-400 group-hover:text-pink-600 transition-colors" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 group-hover:text-pink-600 transition-colors">
                                New resume
                            </span>
                        </button>

                        {/* Existing CV Cards */}
                        {cvList.map((cv) => (
                            <div
                                key={cv.id}
                                className="aspect-[210/297] bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden group hover:shadow-lg transition-all"
                            >
                                {/* Preview Thumbnail */}
                                <div className="relative h-[calc(100%-80px)] bg-slate-50 p-4 overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                        <FileText className="w-16 h-16 text-slate-300" />
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => handleViewCV(cv.id)}
                                            className="px-4 py-2 bg-white text-slate-900 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            VIEW RESUME
                                        </button>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="h-[80px] p-4 border-t border-slate-200">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm text-slate-900 truncate">
                                                {cv.title || 'Untitled Resume'}
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                {cv.updated_at ? new Date(cv.updated_at).toLocaleDateString() : 'Just now'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleDuplicateCV(cv)}
                                                className="p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-600 hover:text-slate-900"
                                                title="Duplicate"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCV(cv.id)}
                                                className="p-1.5 hover:bg-red-50 rounded transition-colors text-slate-600 hover:text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State for Authenticated Users */}
                {isAuthenticated && cvList.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Your First Resume</h2>
                        <p className="text-slate-600 mb-6">Build a professional resume in minutes</p>
                        <button
                            onClick={handleCreateNew}
                            className="px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Resume
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
