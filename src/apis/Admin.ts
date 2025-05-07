import { create } from "zustand";
import { axiosInstance } from "../lib/axios"; 

interface AdminUser {
  id: number;
  username: string;
  email?: string;
}


interface AdminState {
  authUserAdmin: AdminUser | null;
  isAdminLogin: boolean;
  isCheckAuth: boolean;
  checkAuth: () => Promise<void>;
  adminLogin: (data: Record<string, any>) => Promise<AdminUser | null>;
  AdminLogout: () => Promise<{ success: true } | { error: string }>;
}

export const useAdminStore = create<AdminState>((set) => ({ 
  authUserAdmin: null,
  isAdminLogin: false,
  isCheckAuth: true,

  checkAuth: async () => {
    set({ isCheckAuth: true });
    try {
      const res = await axiosInstance.get<AdminUser>("/admin/check");
      set({ authUserAdmin: res.data });
    } catch (error) {
      console.log("Error in admin checkAuth:", error);
      set({ authUserAdmin: null });
    } finally {
      set({ isCheckAuth: false });
    }
  },

  adminLogin: async (data: Record<string, any>) => {
    set({ isAdminLogin: true });
    try {
      const res = await axiosInstance.post<AdminUser>('/admin/login', data); // Expect AdminUser
      set({ authUserAdmin: res.data });
      return res.data;
    } catch (error) {
      const err = error as any; 
      console.error("Admin login error:", err.response?.data || err.message);
      return null;
    } finally {
      set({ isAdminLogin: false });
    }
  },

  AdminLogout: async () => {
    try {
      await axiosInstance.post('/admin/logout');
      set({ authUserAdmin: null });
      return { success: true };
    } catch (error) {
      const err = error as any;
      console.error('Admin Logout API Error:', err.response?.data || err.message);
      set({ authUserAdmin: null });
      return { error: "Logout failed on server, logged out locally." };
    }
  },

  
}));