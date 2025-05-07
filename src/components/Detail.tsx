import { RefreshCw, ShieldCheck, ShoppingCart, Truck } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useProductStore } from '../apis/Product'

type Tab = 'description' | 'specs' | 'review'

const Detail: React.FC = () => {
  const { id } = useParams<{id: string}>()
  const { currentProduct, loading, error, getProduct } = useProductStore()
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<Tab>('description')

  useEffect(() => {
    if (id) {
      getProduct({ _id: id })
    }
  }, [id, getProduct])

  // Hàm định dạng giá tiền theo định dạng Việt Nam
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  if (loading) {
    return <div className="p-8 text-center">Đang tải...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  if (!currentProduct) {
    return <div className="p-8 text-center text-xl">Không tìm thấy sản phẩm.</div>
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount))
  }

  const infoItems = [
    { icon: <ShieldCheck size={20} className="text-green-600" />, text: 'Bảo hành chính hãng 12 tháng' },
    { icon: <Truck size={20} className="text-blue-600" />, text: 'Giao hàng miễn phí toàn quốc' },
    { icon: <RefreshCw size={20} className="text-orange-600" />, text: 'Đổi trả dễ dàng trong 7 ngày' },
  ]

  return(
    <div className='bg-gray-100 min-h-screen py-8'>
      <div className='container mx-auto max-w-6xl p-4 bg-white shadow-lg rounded-lg'>
        <div className='flex flex-col lg:flex-row gap-8'>
          
          <div className='w-full lg:w-2/5'>
            <img
              src={currentProduct.image || 'https://via.placeholder.com/500'}
              alt={currentProduct.productName}
              className='w-full h-auto max-h-[500px] object-contain rounded-lg border border-black-200'
            />
          </div>

          <div className='w-full lg:w-3/5'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>{currentProduct.productName}</h1>
            <p className='text-3xl font-semibold text-green-600 mb-6'>{formatPrice(currentProduct.price)}</p>

            <div className='mb-6'>
              <h4 className='text-sm font-semibold text-gray-600 mb-2'>Mã sản phẩm: <span className='font-normal'>{currentProduct.MaSP}</span></h4>
            </div>

            <div className='mb-6'>
                <h4 className='text-sm font-semibold text-gray-600 mb-2'>Số lượng: </h4>
                <div className='flex items-center border border-gray-300 rounded w-max'>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className='px-3 py-1.5 text-lg text-gray-700 hover:bg-gray-100'
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type='text'
                    readOnly
                    value={quantity}
                    className='w-12 text-center py-1.5 border-1 border-r border-gray-300 focus:outline-none'
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className='px-3 py-1.5 text-lg text-gray-700 hover:bg-gray-100'
                  >
                    +
                  </button>
                </div>
            </div>

            <button className='w-full flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-lg mb-6 transition duration-150'>
              <ShoppingCart size={20} className='mr-2'/> Thêm vào giỏ hàng 
            </button>

            <div className='space-y-3 mb-8 p-4 border border-gray-200 rounded-lg text-gray-700'>
              {infoItems.map((item) => (
                <div key={item.text} className=' flex items-center text-sm text-gray-700'>
                  {item.icon}
                  <span className='ml-2.5'>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='mt-10 pt-6 border-t border-gray-200'>
          <div className='flex border-b border-gray-200 mb-6'>
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3 px-5 font-medium text-base transition-colors
                ${activeTab === 'description'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Mô tả sản phẩm 
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-3 px-5 font-medium text-base transition-colors
                ${activeTab === 'specs'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Thông số kỹ thuật 
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`py-3 px-5 font-medium text-base transition-colors
                ${activeTab === 'review'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Đánh giá 
            </button>
          </div>

          <div className='text-gray-700 leading-relaxed min-h-[100px]'>
            {activeTab === 'description' && (
              <div className='prose max-w-none'>
                <p>{currentProduct.details}</p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div>
                <p className='text-gray-500 italic'>Nội dung thông số kỹ thuật sẽ được cập nhật sớm.</p>
              </div>
            )}
            {activeTab === 'review' && (
              <div>
                <p className='text-gray-500 italic'>Chưa hoàn thiện tính năng này. </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail