import { Facebook, Instagram, Linkedin } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const FooterStore = () => {
  const currentYear = new Date().getFullYear()
  const linkStyle = "text-sm text-gray-600 hover:text-green-700 hover:underline"
  return (
    <footer className='bg-green-300 border-t mt-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-4'>
          <div>
            <h4 className='text-base font-semibold text-gray-900 mb-4'>
              Duc Viet Store
            </h4>
            <p className='text-sm text-gray-800'>
              Cung cấp các sản phẩm chất lượng cao với giá cả cạnh tranh.
            </p>
          </div>

          <div>
            <h4 className='text-base font-semibold text-gray-900 mb-4'>
              Sản phẩm
            </h4>
            <ul>
              <li><Link to='/laptop' className={linkStyle}>Laptop</Link></li>
              <li><Link to='/apple' className={linkStyle}>Apple </Link></li>
              <li><Link to='/tablet' className={linkStyle}>Tablet </Link></li>
              <li><Link to='/phone' className={linkStyle}>Điện thoại </Link></li>
              <li><Link to='/screen' className={linkStyle}>Màn hình </Link></li>
              <li><Link to='/accessories' className={linkStyle}>Phụ kiện </Link></li>
            </ul>
          </div>

          <div>
            <h4 className='text-base font-semibold text-gray-900 mb-4'>
              Thông tin 
            </h4>
            <ul>
              <li><Link to='/about' className={linkStyle}>Giới thiệu </Link></li>
              <li><Link to='/contact' className={linkStyle}>Liên hệ  </Link></li>
            </ul>
          </div>

          <div>
            <h4 className='text-base font-semibold text-gray-900 mb-4'>
              Cửa hàng  
            </h4>
            <address className='not-italic text-sm text-gray-600 space-y-2'>
              <p>04, Ngõ 29, Đường Đông lộ, Phường Thạch Linh, TP Hà Tĩnh</p>
              <p>
                <a href='mailto:vietnho2004@gmail.com' className={linkStyle}>vietnho2004@gmail.com</a>
              </p>
              <p>
                <a href='tel:+84945698597' className={linkStyle}>+84 945 698 597</a>
              </p>
            </address>
          </div>

        </div>
        <hr className='border-t border-gray-200 my-6'/>
        <div className='flex flex-col md:flex-row justify-between items-center text-sm to-gray-500'>
          <p>© {currentYear} Duc Viet Store. Tất cả các quyền được bảo lưu. </p>
          <div className='flex space-x-5'>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-700">
              <Facebook size={20} /> {/* Use the imported icon component */}
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-700">
              <Instagram size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-700">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
      
    </footer>
  )
}

export default FooterStore
