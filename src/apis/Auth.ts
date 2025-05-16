import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

interface User {
    _id: string;
    MaKH?: string;
    userName: string;
    email: string;
    position?: string;  
    typeCs?: string;   
    SDT?: string;
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
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
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
            
            // Ensure the user object has the correct position and data
            const userData = {
                ...response.data,
                position: isAdmin ? 'admin' : undefined,
                MaKH: isAdmin ? undefined : response.data.MaKH
            };

            // Store user in localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('isAuthenticated', 'true');

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

            // Remove user data from localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');

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
        console.log("checkAuth() called");
        set({ loading: true, error: null });

        // Check if user is already authenticated in localStorage
        if (get().isAuthenticated && get().user) {
            set({ loading: false });
            return;
        }

        try {
            const adminResponse = await axiosInstance.get('/admin/checkAdmin');
            console.log("Admin auth success:", adminResponse.data);

            // Store user data and authentication status
            localStorage.setItem('user', JSON.stringify({ ...adminResponse.data, position: 'admin' }));
            localStorage.setItem('isAuthenticated', 'true');

            set({
                user: { ...adminResponse.data, position: 'admin' },
                isAuthenticated: true,
                loading: false,
                error: null
            });
            return; 

        } catch {
            try {
                const userResponse = await axiosInstance.get('/user/checkCustomer');
                console.log("User auth success:", userResponse.data);

                // Store user data and authentication status
                localStorage.setItem('user', JSON.stringify({ ...userResponse.data, MaKH: userResponse.data.MaKH }));
                localStorage.setItem('isAuthenticated', 'true');

                set({
                    user: { ...userResponse.data, MaKH: userResponse.data.MaKH },
                    isAuthenticated: true,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error("Auth check failed:", error);
                set({
                    user: null,
                    isAuthenticated: false,
                    loading: false,
                    error: error.message || 'Authentication failed'
                });
            }
        }
    }
}));
