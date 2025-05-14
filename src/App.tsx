import React, { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import HeaderStore from './components/HeaderStore'
import FooterStore from './components/FooterStore'
import Loading from './components/Loading'
import Introduction from './components/User/Introduction'
import Product from './components/User/Product'
import Detail from './components/Detail'
import PDM from './components/Admin/PDM'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/User/Login'
import LoginAdmin from './components/Admin/LoginAdmin'
import SearchResult from './components/User/SearchResult'
import AdminSearchResult from './components/Admin/AdminSearchResult'
import { useAuthStore } from './apis/Auth'
import SignUp from './components/User/SignUp'
import ShoppingCartResult from './components/User/ShoppingCartResult'
import { Toaster } from 'react-hot-toast'
import InfoProfile from './components/User/InfoProfile'

function App() {
  const { checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("Auth State:", {
    isAuthenticated,
    user,
  })


  const getHomeRoute = () => {
    if (!isAuthenticated) return '/login';
    return user?.position === 'admin' ? '/admin/home' : '/user/home';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <HeaderStore />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Loading />} />
        <Route path="/about" element={<Introduction />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<Detail />} />
        <Route path="/search" element={<SearchResult />} />
        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to={getHomeRoute()} replace />
            ) : (
              <Login />
            )
          } 
        />

        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to={getHomeRoute()} replace />
            ) : (
              <SignUp />
            )
          } 
        />

        <Route 
          path="/admin/login" 
          element={
            isAuthenticated ? (
              <Navigate to={getHomeRoute()} replace />
            ) : (
              <LoginAdmin />
            )
          } 
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* User Routes */}
          <Route path="/user">
            <Route path="home" element={<Loading />} />
            <Route path="profile" element={<InfoProfile />} />
            <Route path="cart" element={<ShoppingCartResult />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin">
            <Route path="home" element={<PDM />} />
            <Route path="search" element={<AdminSearchResult />} />
            <Route path="products/edit/:id" element={<PDM />} />
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <FooterStore />
    </div>
  )
}

export default App
