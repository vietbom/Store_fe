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

    // If children are provided, render them, otherwise render Outlet
    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute; 