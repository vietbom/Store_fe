import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface RegularUser {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  authUser: RegularUser | null;
  isUserLogin: boolean;
  isCheckAuth: boolean;
  checkAuth: () => Promise<void>;
  userLogin: (data: Record<string, any>) => Promise<RegularUser | null>; 
  UserLogout: () => Promise<{ success: true } | { error: string }>;
}

export const useUserStore = create<UserState>((set) => ({
  authUser: null,
  isUserLogin: false,
  isCheckAuth: true,

  checkAuth: async () => {
    set({ isCheckAuth: true });
    try {
      const res = await axiosInstance.get<RegularUser>("/user/check"); 
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in user checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckAuth: false });
    }
  },

  userLogin: async (data: Record<string, any>) => {
    set({ isUserLogin: true });
    try {
      const res = await axiosInstance.post<RegularUser>('/user/login', data); 
      set({ authUser: res.data });
      return res.data;
    } catch (error) {
      const err = error as any;
      console.error("User login error:", err.response?.data || err.message);
      return null;
    } finally {
      set({ isUserLogin: false });
    }
  },

  UserLogout: async () => {
    try {
      await axiosInstance.post('/user/logout');
      set({ authUser: null });
      return { success: true };
    } catch (error) {
      const err = error as any;
      console.error('User Logout API Error:', err.response?.data || err.message);
      set({ authUser: null });
      return { error: "Logout failed on server, logged out locally." };
    }
  }
}));