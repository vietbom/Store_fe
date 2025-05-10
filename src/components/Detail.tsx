import { RefreshCw, ShieldCheck, ShoppingCart, Truck } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProductStore } from '../apis/Product'
import { useUserStore } from '../apis/User'
import { useAuthStore } from '../apis/Auth'
import { toast } from 'react-hot-toast'

type Tab = 'description' | 'specs' | 'review'

const colorMapping: Record<string, string> = {
  'Đỏ': '#991b1b',
  'Xanh dương': '#1e40af',
  'Đen': '#111827',
  'Trắng': '#ffffff',
  'Xám': '#4b5563',
  'Vàng': '#fef3c7',
  'Hồng': '#be185d',
  'Tím': '#6b21a8',
  'Xanh lá': '#166534',
  'Cam': '#c2410c',
  'Nâu': '#78350f',
  'Bạc': '#9ca3af'
};

const Detail: React.FC = () => {
  const { id } = useParams<{id: string}>()
  const navigate = useNavigate()
  const { currentProduct, loading, error, getProduct } = useProductStore()
  const { addProductToCart } = useUserStore()
  const { user, isAuthenticated } = useAuthStore()
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<Tab>('description')
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    if (id) {
      getProduct({ _id: id })
    }
  }, [id, getProduct])

  const handleAddToCart = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }

    if (!currentProduct) {
      toast.error('Không tìm thấy thông tin sản phẩm');
      return;
    }

    try {
      setIsAddingToCart(true);
      const result = await addProductToCart(currentProduct.MaSP, quantity);
      if (result) {
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
      } else {
        toast.error('Không thể thêm sản phẩm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

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
              className={`w-full h-auto max-h-[500px] object-contain rounded-lg border-4 transition-all duration-300 ${
                selectedColor 
                  ? 'border-opacity-100 shadow-lg' 
                  : 'border-opacity-0'
              }`}
              style={{ 
                borderColor: selectedColor ? colorMapping[selectedColor] || selectedColor.toLowerCase() : 'transparent',
                boxShadow: selectedColor ? `0 0 15px ${colorMapping[selectedColor] || selectedColor.toLowerCase()}40` : 'none'
              }}
            />
          </div>

          <div className='w-full lg:w-3/5'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>{currentProduct.productName}</h1>
            <p className='text-3xl font-semibold text-green-600 mb-6'>{formatPrice(currentProduct.price)}</p>
            
            <div className='mb-6'>
              <h4 className='text-sm font-semibold text-gray-600 mb-2'>Màu sắc:</h4>
              <div className='flex items-center gap-2'>
                {currentProduct?.spec?.general?.color && currentProduct?.spec?.general?.color.length > 0 ? (
                  <div className='flex items-center gap-2'>
                    {currentProduct.spec.general.color.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-1 p-2 rounded-lg border transition-all ${
                          selectedColor === color 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div 
                          className='w-6 h-6 rounded-full border border-gray-300'
                          style={{ backgroundColor: colorMapping[color] || color.toLowerCase() }}
                        />
                        <div className='flex flex-col items-start'>
                          <span className='font-normal text-gray-700'>{color}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className='font-normal text-gray-500'>Chưa có thông tin màu sắc</span>
                )}
              </div>
            </div>

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

            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`w-full flex items-center justify-center ${
                isAddingToCart 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-700'
              } text-white font-semibold py-3 px-6 rounded-lg text-lg mb-6 transition duration-150`}
            >
              <ShoppingCart size={20} className='mr-2'/>
              {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
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
              <div className='space-y-6'>
                {currentProduct.spec ? (
                  <>
                    {/* Thông tin chung */}
                    <div className='border-b border-gray-200 pb-4'>
                      <h3 className='text-lg font-semibold mb-3'>Thông tin chung</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {currentProduct.spec.general?.manufacturer && (
                          <div>
                            <span className='font-medium'>Nhà sản xuất:</span> {currentProduct.spec.general.manufacturer}
                          </div>
                        )}
                        {currentProduct.spec.general?.model && (
                          <div>
                            <span className='font-medium'>Model:</span> {currentProduct.spec.general.model}
                          </div>
                        )}
                        {currentProduct.spec.general?.releaseYear && (
                          <div>
                            <span className='font-medium'>Năm sản xuất:</span> {currentProduct.spec.general.releaseYear}
                          </div>
                        )}
                        {currentProduct.spec.general?.warranty && (
                          <div>
                            <span className='font-medium'>Bảo hành:</span> {currentProduct.spec.general.warranty}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Màn hình */}
                    <div className='border-b border-gray-200 pb-4'>
                      <h3 className='text-lg font-semibold mb-3'>Màn hình</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {currentProduct.spec.display?.size && (
                          <div>
                            <span className='font-medium'>Kích thước:</span> {currentProduct.spec.display.size}
                          </div>
                        )}
                        {currentProduct.spec.display?.resolution && (
                          <div>
                            <span className='font-medium'>Độ phân giải:</span> {currentProduct.spec.display.resolution}
                          </div>
                        )}
                        {currentProduct.spec.display?.panelType && (
                          <div>
                            <span className='font-medium'>Loại màn hình:</span> {currentProduct.spec.display.panelType}
                          </div>
                        )}
                        {currentProduct.spec.display?.refreshRate && (
                          <div>
                            <span className='font-medium'>Tần số quét:</span> {currentProduct.spec.display.refreshRate}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CPU */}
                    <div className='border-b border-gray-200 pb-4'>
                      <h3 className='text-lg font-semibold mb-3'>Bộ xử lý</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {currentProduct.spec.processor?.brand && (
                          <div>
                            <span className='font-medium'>Hãng:</span> {currentProduct.spec.processor.brand}
                          </div>
                        )}
                        {currentProduct.spec.processor?.modelName && (
                          <div>
                            <span className='font-medium'>Model:</span> {currentProduct.spec.processor.modelName}
                          </div>
                        )}
                        {currentProduct.spec.processor?.cores && (
                          <div>
                            <span className='font-medium'>Số nhân:</span> {currentProduct.spec.processor.cores}
                          </div>
                        )}
                        {currentProduct.spec.processor?.threads && (
                          <div>
                            <span className='font-medium'>Số luồng:</span> {currentProduct.spec.processor.threads}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RAM */}
                    <div className='border-b border-gray-200 pb-4'>
                      <h3 className='text-lg font-semibold mb-3'>RAM</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {currentProduct.spec.ram?.type?.capacity && (
                          <div>
                            <span className='font-medium'>Dung lượng:</span> {currentProduct.spec.ram.type.capacity}
                          </div>
                        )}
                        {currentProduct.spec.ram?.type?.type && (
                          <div>
                            <span className='font-medium'>Loại RAM:</span> {currentProduct.spec.ram.type.type}
                          </div>
                        )}
                        {currentProduct.spec.ram?.type?.speed && (
                          <div>
                            <span className='font-medium'>Tốc độ:</span> {currentProduct.spec.ram.type.speed}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ổ cứng */}
                    <div className='border-b border-gray-200 pb-4'>
                      <h3 className='text-lg font-semibold mb-3'>Lưu trữ</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {currentProduct.spec.storage?.type?.type && (
                          <div>
                            <span className='font-medium'>Loại ổ cứng:</span> {currentProduct.spec.storage.type.type}
                          </div>
                        )}
                        {currentProduct.spec.storage?.type?.capacity && (
                          <div>
                            <span className='font-medium'>Dung lượng:</span> {currentProduct.spec.storage.type.capacity}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card đồ họa */}
                    <div className='border-b border-gray-200 pb-4'>
                      <h3 className='text-lg font-semibold mb-3'>Card đồ họa</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {currentProduct.spec.graphics?.type?.type && (
                          <div>
                            <span className='font-medium'>Loại:</span> {currentProduct.spec.graphics.type.type}
                          </div>
                        )}
                        {currentProduct.spec.graphics?.type?.brand && (
                          <div>
                            <span className='font-medium'>Hãng:</span> {currentProduct.spec.graphics.type.brand}
                          </div>
                        )}
                        {currentProduct.spec.graphics?.type?.model && (
                          <div>
                            <span className='font-medium'>Model:</span> {currentProduct.spec.graphics.type.model}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pin */}
                    <div className='border-b border-gray-200 pb-4'>
                      <h3 className='text-lg font-semibold mb-3'>Pin</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {currentProduct.spec.battery?.capacity && (
                          <div>
                            <span className='font-medium'>Dung lượng:</span> {currentProduct.spec.battery.capacity}
                          </div>
                        )}
                        {currentProduct.spec.battery?.life && (
                          <div>
                            <span className='font-medium'>Thời lượng:</span> {currentProduct.spec.battery.life}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hệ điều hành */}
                    {currentProduct.spec.operatingSystem?.name && (
                      <div className='border-b border-gray-200 pb-4'>
                        <h3 className='text-lg font-semibold mb-3'>Hệ điều hành</h3>
                        <div>
                          <span className='font-medium'>OS:</span> {currentProduct.spec.operatingSystem.name}
                        </div>
                      </div>
                    )}

                    {/* Kết nối */}
                    <div className='border-b border-gray-200 pb-4'>
                      <h3 className='text-lg font-semibold mb-3'>Kết nối</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {currentProduct.spec.connectivity?.wifi && (
                          <div>
                            <span className='font-medium'>Wi-Fi:</span> {currentProduct.spec.connectivity.wifi}
                          </div>
                        )}
                        {currentProduct.spec.connectivity?.bluetooth && (
                          <div>
                            <span className='font-medium'>Bluetooth:</span> {currentProduct.spec.connectivity.bluetooth}
                          </div>
                        )}
                        {currentProduct.spec.connectivity?.ports && currentProduct.spec.connectivity.ports.length > 0 && (
                          <div className='col-span-2'>
                            <span className='font-medium'>Cổng kết nối:</span>
                            <ul className='list-disc list-inside mt-1'>
                              {currentProduct.spec.connectivity.ports.map((port, index) => (
                                <li key={index}>{port}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Camera */}
                    <div className='border-b border-gray-200 pb-4'>
                      <h3 className='text-lg font-semibold mb-3'>Camera</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {currentProduct.spec.camera?.front && (
                          <div>
                            <span className='font-medium'>Camera trước:</span> {currentProduct.spec.camera.front}
                          </div>
                        )}
                        {currentProduct.spec.camera?.rear && (
                          <div>
                            <span className='font-medium'>Camera sau:</span> {currentProduct.spec.camera.rear}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Kích thước & Trọng lượng */}
                    <div>
                      <h3 className='text-lg font-semibold mb-3'>Kích thước & Trọng lượng</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {currentProduct.spec.itemWeight?.weight && (
                          <div>
                            <span className='font-medium'>Trọng lượng:</span> {currentProduct.spec.itemWeight.weight}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Chưa có thông số kỹ thuật cho sản phẩm này.</p>
                  </div>
                )}
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