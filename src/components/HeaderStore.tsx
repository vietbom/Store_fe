import React, { useState, useEffect } from 'react'
import { Search, Menu, X, ShoppingCart, UserCircle } from 'lucide-react' 
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Login from './User/Login'  
import Sidebar from './User/Sidebar'
import { useAuthStore } from '../apis/Auth'
import { useProductStore } from '../apis/Product'

const HeaderStore: React.FC = () => {
  const navLinkStyle =
    'text-white uppercase py-3 px-4 text-xs font-semibold tracking-wider hover:bg-red-700 transition-colors duration-150 flex items-center'
  const separatorStyle = 'border-l border-red-500 h-4 self-center'
  const sidebarWidthClass = 'w-60'

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const navigate = useNavigate()
  const location = useLocation()

  const { user, isAuthenticated, loading, logout, checkAuth } = useAuthStore()
  const { getSearchProducts } = useProductStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.position === 'admin'
      const isAdminRoute = location.pathname.startsWith('/admin/')
      const isUserRoute = location.pathname.startsWith('/user/')

      if (isAdmin && !isAdminRoute && !isUserRoute) {
        navigate('/admin/home', { replace: true })
      } else if (!isAdmin && isAdminRoute) {
        navigate('/user/home', { replace: true })
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate])

  const isLoggedIn = isAuthenticated && user
  const isAdmin = user?.position === 'admin'
  const displayName = user ? (user.userName || (user.position === 'admin' ? 'Admin' : 'User')) : ''

  const toggleDrawer = () => setIsSidebarOpen(!isSidebarOpen)
  const closeDrawer = () => setIsSidebarOpen(false)
  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      setIsLoginModalOpen(false)
    } catch (error) {
      console.error("Logout error in HeaderStore:", error)
    }
  }

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      try {
        await getSearchProducts(searchTerm.trim())
        if (isAdmin) {
          navigate(`/admin/search?q=${encodeURIComponent(searchTerm.trim())}`)
        } else {
          navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
        }
      } catch (error) {
        console.error("Search error:", error)
      }
    }
  }

  const headerTopHeightRem = 4
  const headerBottomHeightRem = 2.75
  const totalHeaderHeightRem = headerTopHeightRem + headerBottomHeightRem
  const headerTopOffsetPx = totalHeaderHeightRem * 16

  if (loading) {
    return (
      <header className="sticky top-0 z-40 bg-white shadow-sm h-[calc(4rem+2.75rem)] flex items-center justify-center">
        <div>Đang tải...</div>
      </header>
    )
  }

  if (isAdmin) {
    return (
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="w-full bg-green-300">
          <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
            <Link to="/admin/home" className="flex items-center gap-2 text-xl font-bold">
              <span className="text-green-900">Duc Viet Store</span>
            </Link>
            <div className="flex items-center gap-4">
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="pl-8 pr-2 py-1.5 w-[200px] lg:w-[300px] border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </form>
              <div className="flex items-center gap-3">
                <span className="text-sm text-green-900 font-medium">
                  Chào, {displayName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="w-full bg-green-300">
          <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <span className="text-green-900">Duc Viet Store</span>
            </Link>
            <div className="flex items-center gap-4">
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="pl-8 pr-2 py-1.5 w-[200px] lg:w-[300px] border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </form>
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/user/profile"
                    className="text-green-900 hover:text-green-700 transition-colors"
                  >
                    <UserCircle size={20} />
                  </Link>
                  <span className="text-sm text-green-900 font-medium">
                    Chào, {displayName}
                  </span>
                  <Link 
                    to="/user/cart"
                    className="text-green-900 hover:text-green-700 transition-colors relative"
                  >
                    <ShoppingCart size={24} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs font-medium"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full bg-red-600">
          <div className="flex items-stretch h-11">
            <button
              onClick={toggleDrawer}
              className={`bg-orange-500 text-white flex items-center justify-center px-4 font-semibold text-sm uppercase hover:bg-orange-600 transition-colors duration-150 flex-shrink-0 ${sidebarWidthClass}`}
              aria-label="Toggle Product Categories Sidebar"
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? <X size={20} className="mr-2 flex-shrink-0" /> : <Menu size={20} className="mr-2 flex-shrink-0" />}
              <span className="whitespace-nowrap hidden sm:inline">Danh mục sản phẩm </span>
            </button>
            <div className="container mx-auto flex items-stretch flex-grow overflow-x-auto">
              <nav className="flex items-stretch flex-grow">
                <Link to="/" className={navLinkStyle}> Trang chủ </Link>
                <div className={separatorStyle}></div>
                <Link to="/about" className={navLinkStyle}> Giới thiệu </Link>
                <div className={separatorStyle}></div>
                <Link to="/news" className={navLinkStyle}> Tin tức </Link>
                <div className={separatorStyle}></div>
                <Link to="/products" className={navLinkStyle}> Sản phẩm </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} topOffset={headerTopOffsetPx} widthClass={sidebarWidthClass} onClose={closeDrawer} />

      {isSidebarOpen && (
        <div onClick={closeDrawer} className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity" aria-hidden="true" />
      )}

      {!isLoggedIn && isLoginModalOpen && <Login isOpen={isLoginModalOpen} onClose={closeLoginModal} />}
    </>
  )
}

export default HeaderStore