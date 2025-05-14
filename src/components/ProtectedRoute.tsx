import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../apis/Auth';

interface ProtectedRouteProps {
    children?: React.ReactNode;
    requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, user, loading } = useAuthStore();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && user?.position !== 'admin') {
        return <Navigate to="/" replace />;
    }

    if (user?.position === 'admin' && location.pathname.startsWith('/admin')) {
        return children ? <>{children}</> : <Outlet />;
    }

    if (!requireAdmin && user?.position !== 'admin') {
        return children ? <>{children}</> : <Outlet />;
    }

    return <Navigate to="/" replace />;
};

export default ProtectedRoute; 