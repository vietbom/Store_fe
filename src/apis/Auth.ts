import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

interface User {
    _id: string;
    userName: string;
    email: string;
    position?: string;  // For admin
    typeCs?: string;    // For customer
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    login: async (email: string, password: string, isAdmin = false) => {
        set({ loading: true, error: null });
        try {
            const endpoint = isAdmin ? '/admin/login' : '/user/login';
            const response = await axiosInstance.post(endpoint, { 
                [isAdmin ? 'userName' : 'email']: email, 
                password 
            });
            
            // Ensure the user object has the correct position
            const userData = {
                ...response.data,
                position: isAdmin ? 'admin' : undefined
            };

            set({
                user: userData,
                isAuthenticated: true,
                loading: false,
                error: null
            });
        } catch (error: any) {
            set({
                loading: false,
                error: error.response?.data?.message || 'Đăng nhập thất bại',
                isAuthenticated: false,
                user: null
            });
            throw error;
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            const currentUser = get().user;
            const endpoint = currentUser?.position === 'admin' ? '/admin/logout' : '/user/logout';
            await axiosInstance.post(endpoint);
            set({
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null
            });
        } catch (error: any) {
            set({
                loading: false,
                error: error.response?.data?.message || 'Đăng xuất thất bại',
                isAuthenticated: false,
                user: null
            });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ loading: true, error: null });
        try {
            // Try admin check first
            try {
                const adminResponse = await axiosInstance.get('/admin/check');
                set({
                    user: { ...adminResponse.data, position: 'admin' },
                    isAuthenticated: true,
                    loading: false,
                    error: null
                });
                return;
            } catch {
                // If admin check fails, try user check
                const userResponse = await axiosInstance.get('/user/check');
                set({
                    user: userResponse.data,
                    isAuthenticated: true,
                    loading: false,
                    error: null
                });
            }
        } catch (error: any) {
            set({
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null
            });
        }
    }
})); 