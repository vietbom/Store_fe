import { create } from 'zustand'
import { useReceiptStore } from './Receipt'
import { data } from 'react-router-dom'
import { axiosInstance } from '../lib/axios'
interface Receiptproduct {
    MaSP: string
    soLuong: number
}

interface ReceiptPayload {
    MaDH: string
    MaKH: string
    products: Receiptproduct[]
    dateOrder: string
    voucher?: string
    paymentStatus: string
    address: string
    note?: string
    priceTotal?: number 
}

interface ReceiptState{
    receipts: AllReceipt[]
    createReceipt: (data: ReceiptPayload) => Promise<void>
    getReceiptsByCustomer: (customerId: string) => Promise<void>
}

export const useReceiptStore = create<ReceiptState>((set) => ({
    receipts: [],
    createReceipt: async (data) => {
        try {
          const response = await axiosInstance.post('/receipt/create', data)
          console.log("Đặt hàng thành công:", response.data)
        } catch (error: any) {
          console.error("Lỗi đặt hàng:", error.response?.data?.message || error.message)
          throw error
        }
      },
      getReceiptsByCustomer: async(customerId: string) => {
          try {
            const response = await axiosInstance.get<{message: string, data: AllReceipt[]}>(`/receipt/getByCustomer/${customerId}`)
            console.log('Lấy đơn hàng thành công. Dữ liệu:', response.data.data)
            set({ receipts: response.data.data })
          } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error.response?.data?.message || error.message)
            set({receipts: []})
            throw error
          }
      },
    
}))