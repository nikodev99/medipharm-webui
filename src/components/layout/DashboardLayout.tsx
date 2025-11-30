import {Sidebar} from "@/components/layout/Sidebar.tsx";
import {Outlet} from "react-router-dom";

export const DashboardLayout = () => {
    return(
        <div className='flex h-screen overflow-hidden'>
            <Sidebar />
            <main className='flex-1 overflow-y-auto bg-background p-8'>
                <PageLayout />
            </main>
        </div>
    )
}

const PageLayout = () => {
    return <Outlet />
}