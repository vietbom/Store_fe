import { Search } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../../apis/Product'

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

const CATEGORIES: Category[] = [
  { id: 'may-tinh', name: 'Máy tính' },
  { id: 'apple', name: 'Apple' },
  { id: 'dien-thoai', name: 'Điện thoại' },
  { id: 'tablet', name: 'Tablet' },
  { id: 'man-hinh', name: 'Màn hình' },
  { id: 'phu-kien', name: 'Phụ kiện' }
];

const BRANDS: Brand[] = [
  { id: 'apple', name: 'Apple' },
  { id: 'dell', name: 'Dell' },
  { id: 'acer', name: 'Acer' },
  { id: 'lenovo', name: 'Lenovo' },
  { id: 'samsung', name: 'Samsung' },
  { id: 'xiaomi', name: 'Xiaomi' }
];

const PRODUCTS_PER_PAGE = 12;
const MAX_PRICE = 50000000;

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const FilterCheckbox: React.FC<{
  id: string;
  label: string;
  type: 'category' | 'brand';
}> = ({ id, label, type }) => (
  <div className="flex items-center">
    <input 
      type='checkbox' 
      id={`${type}-${id}`}
      className='mr-2 h-4 w-4 accent-green-500 text-green-600 border-gray-300 rounded focus:ring-green-500'
    />
    <label 
      htmlFor={`${type}-${id}`}
      className='text-sm text-gray-700 cursor-pointer'
    >
      {label}
    </label>
  </div>
);

const ProductCard: React.FC<{
  product: any;
}> = ({ product }) => (
  <Link to={`/products/${product._id}`} className='block group'>
    <div className='bg-gray-100 border-gray-400 rounded-lg overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow duration-200'>
      <div className='relative w-full aspect-[4/3] bg-gray-200'>
        <img
          src={product.image || 'https://via.placeholder.com/150'}
          alt={product.productName}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-4 flex flex-col flex-grow'>
        <h3 className='text-md font-semibold text-gray-800 mb-1 group-hover:text-red-600 truncate'>
          {product.productName}
        </h3>
        <p className='text-lg font-bold text-gray-900 mt-auto pt-1'>
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  </Link>
);

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => (
  <div className='flex justify-center mt-8 space-x-2'>
    {Array.from({length: totalPages}, (_, i) => (
      <button
        key={i}
        onClick={() => onPageChange(i + 1)}
        className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
          currentPage === i + 1
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>
);

const Product: React.FC = () => {
  const { products, loading, error, getAllProducts } = useProductStore()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)

  useEffect(() => {
    getAllProducts()
  }, [getAllProducts])

  const currentProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPrice(Number(e.target.value))
  }

  if (loading) {
    return <div className="p-8 text-center">Đang tải...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  return (
    <div className='flex flex-col lg:flex-row bg-white'>

      <div className='w-full lg:w-1/5 p-4 lg:p-6 border-gray-200 bg-white lg:min-h-screen'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold'>Bộ lọc</h2>
          <button className='text-sm text-gray-600 hover:text-gray-800'>Xóa tất cả</button>
        </div>

        <div className='mb-6'>
          <h3 className='text-md font-semibold mb-3'>Danh mục</h3>
          <div className='space-y-2'>
            {CATEGORIES.map(category => (
              <FilterCheckbox
                key={category.id}
                id={category.id}
                label={category.name}
                type="category"
              />
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='text-md font-semibold mb-3'>Giá</h3>
          <span className='text-sm'>0đ - {formatPrice(currentPrice)}</span>
          <div className='relative'>
            <input 
              type='range'
              min='0'
              max={MAX_PRICE}
              value={currentPrice}
              onChange={handlePriceChange}
              className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black'
            />
            <div className='flex justify-between text-xs text-gray-500 mt-1'>
              <span>0đ</span>
              <span>{formatPrice(MAX_PRICE)}</span>
            </div>
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='text-md font-semibold mb-3'>Thương hiệu</h3>
          <div className='space-y-2'>
            {BRANDS.map(brand => (
              <FilterCheckbox
                key={brand.id}
                id={brand.id}
                label={brand.name}
                type="brand"
              />
            ))}
          </div>
        </div>

        <button className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'>
          Áp dụng bộ lọc
        </button>
      </div>

      <div className='w-px h-auto bg-gray-300 mx-4 self-stretch'></div>
      <div className='w-full lg:w-4/5 lg:p-6'>

        <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-black'>Tất cả sản phẩm</h1>
            <p className='text-sm text-gray-500 mt-1'>Hiển thị {currentProducts.length} sản phẩm</p>
          </div>

          <div className='flex items-center gap-3 mt-4 md:mt-0'>
            <select className='border border-gray-300 rounded-md py-2 px-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500'>
              <option>Mới nhất</option>
              <option>Giá: Thấp đến cao</option>
              <option>Giá: Cao đến thấp</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {currentProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}

export default Product
