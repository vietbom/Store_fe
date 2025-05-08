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
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && user?.position !== 'admin') {
        // Redirect to home if not admin
        return <Navigate to="/" replace />;
    }

    // If user is admin and trying to access admin routes, allow access
    if (user?.position === 'admin' && location.pathname.startsWith('/admin')) {
        return children ? <>{children}</> : <Outlet />;
    }

    // For regular users, allow access to non-admin routes
    if (!requireAdmin && user?.position !== 'admin') {
        return children ? <>{children}</> : <Outlet />;
    }

    // Default fallback
    return <Navigate to="/" replace />;
};

export default ProtectedRoute; 