import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export interface SpecType {
    general: {
        manufacturer?: string;
        model?: string;
        releaseYear?: string;
        color?: string[];
        material?: string;
        warranty?: string;
    };
    display: {
        size?: string;
        resolution?: string;
        panelType?: string;
        refreshRate?: string;
        brightness?: string;
        colorGamut?: string;
        features?: string[];
    };
    processor: {
        brand?: string;
        series?: string;
        modelName?: string;
        cores?: string;
        threads?: string;
        cache?: string;
    };
    ram: {
        type: {
            capacity?: string;
            type?: string;
            speed?: string;
        };
    };
    storage: {
        type: {
            type?: string;
            capacity?: string;
        };
    };
    graphics: {
        type: {
            type?: string;
            brand?: string;
            model?: string;
        };
    };
    battery: {
        capacity?: string;
        life?: string;
        charging?: string;
    };
    operatingSystem: {
        name?: string;
    };
    connectivity: {
        wifi?: string;
        bluetooth?: string;
        ports?: string[];
    };
    camera: {
        front?: string;
        rear?: string;
        features?: string[];
    };
    itemWeight: {
        weight?: string;
    };
}

export interface Product {
    _id?: string;
    MaSP: string;
    productName: string;
    price: number;
    SoLuong: number;
    type: string;
    details: string;
    image?: string;
    spec?: SpecType;
}

type NewProductData = Omit<Product, '_id'>;

type UpdateProductData = Partial<Omit<Product, '_id' | 'MaSP'>>;

interface ProductState {
    products: Product[];
    currentProduct: Product | null;
    searchResults: Product[];
    loading: boolean;
    error: string | null;
    
    addProduct: (data: NewProductData) => Promise<Product | void>;
    getProduct: (params: { _id?: string; type?: string }) => Promise<void>;
    getAllProducts: () => Promise<void>;
    getSearchProducts: (searchTerm: string) => Promise<void>;
    updateProduct: (_id: string, data: UpdateProductData) => Promise<Product | void>;
    delProduct: (_id: string) => Promise<void>;
    clearError: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    currentProduct: null,
    searchResults: [],
    loading: false,
    error: null,

    clearError: () => set({ error: null, loading: false }),

    addProduct: async (data: NewProductData) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post('/products/add', data);
            const newProduct = response.data;
            set((state: ProductState) => ({
                products: [...state.products, newProduct],
                loading: false
            }));
            return newProduct as Product;
        } catch (error: any) {
            console.error("Lỗi store - addProduct:", error);
            set({ loading: false, error: error.response?.data?.message || error.message });
        }
    },

    getProduct: async (params: { _id?: string; type?: string }) => {
        set({ loading: true, error: null });
        if (!params._id && !params.type) {
            set({ loading: false, error: "Cần có ID hoặc Loại để lấy sản phẩm." });
            return;
        }
        try {
            const response = await axiosInstance.get('/products/get', { params });
            const result = response.data;
            
            if (params._id && !Array.isArray(result)) {
                set({ currentProduct: result as Product, loading: false });
            } else if (params.type && Array.isArray(result)) {
                set({ products: result as Product[], loading: false });
            } else {
                console.warn("Cấu trúc phản hồi không mong đợi từ getProduct:", result);
                set({ loading: false, error: "Dữ liệu sản phẩm không hợp lệ." });
            }
        } catch (error: any) {
            console.error("Lỗi store - getProduct:", error);
            set({ loading: false, error: error.response?.data?.message || error.message });
        }
    },

    getAllProducts: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get('/products/get');
            const allProducts = response.data;
            set({ products: allProducts as Product[], loading: false });
        } catch (error: any) {
            console.error("Lỗi store - getAllProducts:", error);
            set({ loading: false, error: error.response?.data?.message || error.message });
        }
    },

    getSearchProducts: async (searchTerm: string) => {
        set({ loading: true, error: null });
        if (!searchTerm.trim()) {
            set({ searchResults: [], loading: false });
            return;
        }
        try {
            const response = await axiosInstance.get('/products/search', {
                params: { value: searchTerm }
            });
            const searchedProducts = response.data;
            set({ searchResults: searchedProducts as Product[], loading: false });
        } catch (error: any) {
            console.error("Lỗi store - getSearchProducts:", error);
            set({ loading: false, error: error.response?.data?.message || error.message });
        }
    },

    updateProduct: async (_id: string, data: UpdateProductData) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post(`/products/update/${_id}`, data);
            const updatedProduct = response.data.product as Product;

            set((state: ProductState) => ({
                products: state.products.map(p => p._id === _id ? { ...p, ...updatedProduct } : p),
                currentProduct: state.currentProduct?._id === _id ? { ...state.currentProduct, ...updatedProduct } : state.currentProduct,
                searchResults: state.searchResults.map(p => p._id === _id ? { ...p, ...updatedProduct } : p),
                loading: false,
            }));
            return updatedProduct;
        } catch (error: any) {
            console.error("Lỗi store - updateProduct:", error);
            set({ loading: false, error: error.response?.data?.message || error.message });
        }
    },

    delProduct: async (_id: string) => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.delete(`/products/del/${_id}`);
            set((state: ProductState) => ({
                products: state.products.filter(p => p._id !== _id),
                currentProduct: state.currentProduct?._id === _id ? null : state.currentProduct,
                searchResults: state.searchResults.filter(p => p._id !== _id),
                loading: false,
            }));
        } catch (error: any) {
            console.error("Lỗi store - delProduct:", error);
            set({ loading: false, error: error.response?.data?.message || error.message });
        }
    },
}));