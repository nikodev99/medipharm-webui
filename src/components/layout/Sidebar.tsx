import {type ReactNode, useMemo} from "react";
import {useLocation, Link} from "react-router-dom";
import {useAuth} from "@/hooks/useAuth.ts";
import {BarChart2, LayoutDashboard, LogOut, Package, Pill, Settings, Store, Users} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";

export interface NavItem {
    title: ReactNode
    href: string
    icon: ReactNode
}

export const Sidebar = () => {
    const location = useLocation()
    const {user, logout} = useAuth()
    
    const navItems: NavItem[] = useMemo(() => {
       if (user?.role === 'SUPER_ADMIN') {
           return [
               { title: 'Tableau de bord', href: '/superadmin', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
               { title: 'Pharmacies', href: '/pharmacies', icon: <Store className="mr-2 h-4 w-4" /> },
               { title: 'Médicaments', href: '/medications', icon: <Pill className="mr-2 h-4 w-4" /> },
               { title: 'Utilisateurs', href: '/users', icon: <Users className="mr-2 h-4 w-4" /> },
               { title: 'Analytiques', href: '/analytics', icon: <BarChart2 className="mr-2 h-4 w-4" /> },
           ] as NavItem[]
       } 
       
       if (user?.role === 'PHARMACY_ADMIN') {
           return [
               { title: 'Tableau de bord', href: '/admin', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
               { title: 'Inventaire', href: '/inventory', icon: <Package className="mr-2 h-4 w-4" /> },
               { title: 'Analytiques', href: '/analytics', icon: <BarChart2 className="mr-2 h-4 w-4" /> },
               { title: 'Paramètres', href: '/settings', icon: <Settings className="mr-2 h-4 w-4" /> },
           ] as NavItem[]
       }
       
       return [] as NavItem[]
    }, [user?.role])

    return(
        <div className='flex h-screen w-64 flex-col border-r bg-card'>
            <div className='flex items-center justify-center border-b'>
                <img src="/medipharm.png" alt="Logo" width={80} height={80} />
                <div className="flex flex-col">
                    <span className="text-lg font-bold">Medipharm</span>
                    <span className="text-xs text-muted-foreground">
                        {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Pharmacy Admin'}
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href
                    const icon = item.icon

                    return (
                        <Link key={item.href} to={item.href}>
                            <Button
                                variant={isActive ? 'secondary' : 'ghost'}
                                className={cn(
                                    'w-full justify-start',
                                    isActive && 'bg-primary/10 text-primary hover:bg-primary/20'
                                )}
                            >
                                { icon }
                                {item.title}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile */}
            <div className="border-t p-4">
                <div className="mb-3 flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-semibold text-primary">
                            {user?.fullName.charAt(0)}
                        </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium">{user?.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={logout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                </Button>
            </div>
        </div>
    )
}