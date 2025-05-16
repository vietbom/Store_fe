import React, { useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useReceiptStore } from '../../apis/Receipt'
import { useAuthStore } from '../../apis/Auth'

interface Regularuser {
  _id: string
  userName?: string
  email?: string
  SDT?: string
}
interface Productdetails{
  _id: string
  MaSP?: string
  productName?: string
  price?: number
}

interface FetchedReceiptProductItem{
  product: Productdetails
  soLuong: number
  _id?: string
}
interface AllReceipt {
  MaDH: string
  MaKH: string
  customer: Regularuser
  products: FetchedReceiptProductItem[]
  dateOrder: string
  voucher?: string
  paymentStatus: string
  address: string
  note?: string
  priceTotal?: number 
}

const Receipt = () => {
  const { getReceiptsByCustomer, receipts } = useReceiptStore()
  const {user} = useAuthStore()

  useEffect(() => {
    if (user?._id) {
      console.log('Lấy đơn hàng của: ',user._id)
      getReceiptsByCustomer(user._id)
    }
  }, [user, getReceiptsByCustomer])

  if(!user){
    return <p className='text-center py-10 text-red-400'>Vui lòng đăng nhập để xem lịch sử đơn hàng.</p>
  }

  if(!receipts || receipts.length === 0){
    return <p className='text-center py-10'>Đang tải đơn hàng hoặc bạn chưa có đơn hàng nào...</p>;
  }

  return (
    <div className='container mx-auto py-6 px-4 md:px-6'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8 text-center'>
          <ShoppingCart className='h-12 w-12 text-green-700 mx-auto mb-4'/>
          <h1 className='text-xl md:text-2xl font-bold mb-2'>Lịch sử đơn hàng</h1>
        </div>

        {receipts.map((receipt: AllReceipt, index: number) => (
          <div key={receipt._id || index} className='mb-10 border rounded-lg p-6 shadow-lg bg-white'>
            <div className='mb-6'>
              <div className='flex justify-between items-center'>
                <p className='text-xl font-semibold'>
                  Đơn hàng #{receipt.MaDH || receipt._id}
                </p>

                <div className='inline-block mt-2 px-3 py-1 text-sm rounded font-medium bg-green-100 text-green-700'>
                  Trạng thái: Đã xác nhận
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <div>
                  <p className='text-sm text-gray-600'>Ngày đặt hàng</p>
                  <p className='font-medium'>{new Date(receipt.dateOrder).toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Phương thức thanh toán</p>
                  <p className='font-medium'>
                    {
                      receipt.paymentStatus === 'COD' ? 'Thanh toán khi nhận hàng (COD)' :
                      receipt.paymentStatus === 'BANK' ? 'Chuyển khoản ngân hàng' :
                      receipt.paymentStatus === 'CREDITCARD' ? 'Thẻ tín dụng/Thẻ ghi nợ' :
                      receipt.paymentStatus
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-gray-100 px-2 py-4'>
              <div>
                <p className='text-lg font-semibold'>Thông tin khách hàng</p>
                <p className='font-medium'>Họ tên: {receipt.customer?.userName || user.userName}</p>
                <p className='text-gray-700'>SDT: {receipt.customer?.SDT}</p>
                <p className=' text-gray-700'>Email: {receipt.customer?.email}</p>
              </div>
              <div>
                <p className='text-lg font-semibold'>Địa chỉ giao hàng</p>
                <p className='text-gray-700'>{receipt.address}</p>
              </div>
            </div>

            <div>
              <p className='text-lg font-semibold mb-2'>Chi tiết sản phẩm</p>
              <div className='space-y-4'>
                {receipt.products?.map((item, productIndex) => (
                  <div key={item._id || productIndex} className='border rounded p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                    <div>
                      <p className='font-semibold text-gray-800'>{item.product?.productName  || 'Tên sản phẩm'}</p>
                      <p className='text-sm text-gray-500'>Mã SP: {item.product?.MaSP || item.product?._id}</p>
                    </div>

                    <div className='text-left sm:text-right'>
                      <p className='text-sm text-gray-600'>Số lượng: {item.soLuong}</p> 
                      <p className='text-sm text-gray-600'>Đơn giá: {(item.product?.price || 0).toLocaleString('vi-VN')}đ</p>
                      <p className='font-medium text-gray-800'>
                        Thành tiền: {((item.product?.price || 0) * item.soLuong).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className='mt-6 pt-4 border-t text-right'>
                <p className='text-lg font-semibold'>
                    Tổng cộng: {
                        receipt.priceTotal?.toLocaleString('vi-VN')
                    }đ
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Receipt
