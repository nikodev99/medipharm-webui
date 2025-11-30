import {useAuth} from "@/hooks/useAuth.ts";
import {Navigate, Outlet} from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }: {allowedRoles: string[]}) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role as string)) {
        // Could redirect to a "not authorized" page or home
        return <Navigate to="/not-authorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
