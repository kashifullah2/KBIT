import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

interface User {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    // Add other fields as needed
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (userData: any) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState<boolean>(true);

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            fetchUserProfile();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${API_URL}/users/me`);
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        const formData = new FormData();
        formData.append('username', email); // OAuth2 expects 'username'
        formData.append('password', password);

        try {
            const response = await axios.post(`${API_URL}/token`, formData);
            setToken(response.data.access_token);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const signup = async (userData: any): Promise<boolean> => {
        try {
            const response = await axios.post(`${API_URL}/signup`, userData);
            setToken(response.data.access_token);
            return true;
        } catch (error) {
            console.error("Signup failed", error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        
        // Clear chat history for privacy on logout
        localStorage.removeItem('chat_history');
        localStorage.removeItem('chat_history_list');
        localStorage.removeItem('chat_thread_id');
        
        // Clear all individual thread histories
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('chat_history_')) {
                localStorage.removeItem(key);
            }
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
