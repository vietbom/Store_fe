import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./Auth";

interface RegularUser {
  _id: string;
  MaKH: string;
  userName: string;
  email: string;
  position?: string;
  typeCs?: string;
}

interface CartProduct {
  product: {
    _id: string;
    MaSP: string;
    name: string;
    price: number;
    image?: string;
  };
  soLuong: number;
}

interface ShoppingCart {
  _id: string;
  customer: string;
  products: CartProduct[];
}

interface UserState {
  authUser: RegularUser | null;
  isUserLogin: boolean;
  isCheckAuth: boolean;
  cart: ShoppingCart | null;
  isLoadingCart: boolean;
  checkAuth: () => Promise<void>;
  userLogin: (data: Record<string, any>) => Promise<RegularUser | null>; 
  UserLogout: () => Promise<{ success: true } | { error: string }>;
  
  // Shopping cart functions
  addProductToCart: (MaSP: string, soLuong?: number) => Promise<ShoppingCart | null>;
  getCart: (MaKH: string) => Promise<ShoppingCart | null>;
  updateCartItem: (MaSP: string, soLuong: number) => Promise<ShoppingCart | null>;
  removeFromCart: (MaSP: string) => Promise<ShoppingCart | null>;
  clearCart: () => Promise<boolean>;
}

export const useUserStore = create<UserState>((set, get) => ({
  authUser: null,
  isUserLogin: false,
  isCheckAuth: true,
  cart: null,
  isLoadingCart: false,

  checkAuth: async () => {
    set({ isCheckAuth: true });
    try {
      const res = await axiosInstance.get<RegularUser>("/api/user/check"); 
      if (!res.data || !res.data.MaKH) {
        console.error('Invalid user data received:', res.data);
        set({ authUser: null });
        return;
      }
      
      console.log('User data received:', res.data);
      set({ authUser: res.data });
      
      // Automatically fetch cart for authenticated user
      if (res.data.MaKH) {
        try {
          const cartRes = await axiosInstance.get<ShoppingCart>(`/api/user/cart/${res.data.MaKH}`);
          set({ cart: cartRes.data });
        } catch (cartError) {
          console.error('Failed to fetch cart:', cartError);
        }
      }
    } catch (error) {
      console.error("Error in user checkAuth:", error);
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
      set({ authUser: null, cart: null }); // Clear cart on logout
      return { success: true };
    } catch (error) {
      const err = error as any;
      console.error('User Logout API Error:', err.response?.data || err.message);
      set({ authUser: null, cart: null });
      return { error: "Logout failed on server, logged out locally." };
    }
  },

  // Shopping cart functions
  addProductToCart: async (MaSP: string, soLuong: number = 1) => {
    set({ isLoadingCart: true });
    try {
      const { user, isAuthenticated } = useAuthStore.getState();
      
      if (!isAuthenticated || !user?.MaKH) {
        console.error('Add to cart failed: User not authenticated or MaKH missing');
        return null;
      }

      console.log('Adding to cart:', { MaSP, MaKH: user.MaKH, soLuong });
      const res = await axiosInstance.post<ShoppingCart>('/api/user/cart/add', {
        MaSP,
        MaKH: user.MaKH,
        soLuong
      });

      if (!res.data) {
        console.error('Add to cart failed: No data in response');
        return null;
      }

      console.log('Add to cart success:', res.data);
      set({ cart: res.data });
      return res.data;
    } catch (error) {
      console.error('Add to cart error:', error);
      return null;
    } finally {
      set({ isLoadingCart: false });
    }
  },

  getCart: async (MaKH: string) => {
    set({ isLoadingCart: true });
    try {
      if (!MaKH) {
        console.error('getCart: MaKH is required');
        return null;
      }

      console.log('Fetching cart for MaKH:', MaKH);
      const res = await axiosInstance.get<ShoppingCart>(`/user/cart/${MaKH}`);
      
      if (!res.data) {
        console.log('No cart data in response');
        return null;
      }

      console.log('Cart data received:', res.data);
      set({ cart: res.data });
      return res.data;
    } catch (error: any) {
      console.error('Get cart error:', error.response?.data || error);
      return null;
    } finally {
      set({ isLoadingCart: false });
    }
  },

  updateCartItem: async (MaSP: string, soLuong: number) => {
    set({ isLoadingCart: true });
    try {
      const { user, isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated || !user?.MaKH) {
        console.error('Update cart failed: User not authenticated or MaKH missing');
        return null;
      }

      console.log('Updating cart item:', { MaSP, MaKH: user.MaKH, soLuong });
      const res = await axiosInstance.put<ShoppingCart>('/api/user/cart/update', {
        MaSP,
        MaKH: user.MaKH,
        soLuong
      });

      if (!res.data) {
        console.error('Update cart failed: No data in response');
        return null;
      }

      console.log('Update cart success:', res.data);
      set({ cart: res.data });
      return res.data;
    } catch (error) {
      console.error('Update cart error:', error);
      return null;
    } finally {
      set({ isLoadingCart: false });
    }
  },

  removeFromCart: async (MaSP: string) => {
    set({ isLoadingCart: true });
    try {
      const { user, isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated || !user?.MaKH) {
        console.error('Remove from cart failed: User not authenticated or MaKH missing');
        return null;
      }

      console.log('Removing from cart:', { MaSP, MaKH: user.MaKH });
      const res = await axiosInstance.delete<ShoppingCart>('/api/user/cart/remove', {
        data: { MaSP, MaKH: user.MaKH }
      });

      if (!res.data) {
        console.error('Remove from cart failed: No data in response');
        return null;
      }

      console.log('Remove from cart success:', res.data);
      set({ cart: res.data });
      return res.data;
    } catch (error) {
      console.error('Remove from cart error:', error);
      return null;
    } finally {
      set({ isLoadingCart: false });
    }
  },

  clearCart: async () => {
    set({ isLoadingCart: true });
    try {
      const { user, isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated || !user?.MaKH) {
        console.error('Clear cart failed: User not authenticated or MaKH missing');
        return false;
      }

      console.log('Clearing cart for user:', user.MaKH);
      await axiosInstance.delete('/api/user/cart/clear', {
        data: { MaKH: user.MaKH }
      });

      console.log('Clear cart success');
      set({ cart: null });
      return true;
    } catch (error) {
      console.error('Clear cart error:', error);
      return false;
    } finally {
      set({ isLoadingCart: false });
    }
  }
}));