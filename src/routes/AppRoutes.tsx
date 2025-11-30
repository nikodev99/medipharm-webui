

// component used as the single index handler
import {useAuth} from "@/hooks/useAuth.ts";
import {Navigate, createBrowserRouter} from "react-router-dom";
import RedirectProvider from "@/providers/RedirectProvider.tsx";
import {LoginPage} from "@/pages/auth/LoginPage.tsx";
import {DashboardLayout} from "@/components/layout/DashboardLayout.tsx";
import ProtectedRoute from "@/routes/ProtectedRoute.tsx";
import SuperAdminPage from "@/pages/SuperAdminPage.tsx";
import {PharmaciesPage} from "@/pages/super-admin/PharmaciesPage.tsx";
import MedicationsPage from "@/pages/super-admin/MedicationsPage.tsx";
import PharmacyAdminPage from "@/pages/PharmacyAdminPage.tsx";

const IndexRedirect = () => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (user?.role === "SUPER_ADMIN") return <Navigate to="/superadmin" replace />;
    if (user?.role === "PHARMACY_ADMIN") return <Navigate to="/admin" replace />;

    return <Navigate to="/not-authorized" replace />;
};

const AppRoutes = createBrowserRouter([
    {
        path: "/login",
        element: (
            <RedirectProvider>
                <LoginPage />
            </RedirectProvider>
        ),
    },
    {
        path: "/",
        element: (
            <RedirectProvider>
                <DashboardLayout />
            </RedirectProvider>
        ),
        children: [
            { index: true, element: <IndexRedirect /> },

            // SUPER_ADMIN protected subtree
            {
                element: <ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />,
                children: [
                    { path: "superadmin", index: true, element: <SuperAdminPage /> },
                    { path: "pharmacies", element: <PharmaciesPage /> },
                    { path: "medications", element: <MedicationsPage /> },
                ],
            },

            // PHARMACY_ADMIN protected subtree
            {
                element: <ProtectedRoute allowedRoles={["PHARMACY_ADMIN"]} />,
                children: [
                    { path: "admin", index: false, element: <PharmacyAdminPage /> },
                    { path: "pharmacy", element: <div>Pharmacy view</div> },
                    { path: "medication", element: <div>Medication page</div> },
                ],
            },

            // fallback for unmatched nested routes
            { path: "*", element: <div>404 - Not Found</div> },
        ],
    },
]);

export default AppRoutes;
