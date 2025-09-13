"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, Settings, LogOut, Menu, X, FileCheck, Check, Car, Building, User, User2Icon, UserCheck2Icon, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link, useNavigate } from "react-router-dom"  
import { logout } from "@/lib/api"

export default function Sidebar({ children }) {
    const [open, setOpen] = useState(true)   
    const [mobileOpen, setMobileOpen] = useState(false)
    const [userRole, setUserRole] = useState('')
    const [isLoggingOut, setIsLoggingOut] = useState(false) // Tambahkan state ini
    const navigate = useNavigate()

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUserRole(user.role);
        }
    }, [])

    const adminMenuItems = [
        { label: "Dashboard", icon: Home, href: "/admin/dashboard" },
        { label: "Data Booking", icon: FileCheck, href: "/admin/data_booking" },
        { label: "Data Kendaraan", icon: Car, href: "/admin/data_kendaraan" },
        { label: "Data Region", icon: Building, href: "/admin/data_region" },
        { label: "Data Users", icon: User, href: "/admin/data_users" },
        { label: "Data Driver", icon: UserCheck2Icon, href: "/admin/data_driver" },
        { label: "Data Approval", icon: CheckCircle, href: "/admin/data_approval" },

    ]

    const approverMenuItems = [
        { label: "Dashboard Approval", icon: FileCheck, href: "/approval/dashboard" },
        { label: "Data Approval" , icon: Check, href: "/approval/data_approval"},
        { label: "Settings", icon: Settings, href: "#" },
    ]

    // Tentukan menu items berdasarkan role
    const menuItems = userRole === 'approver' ? approverMenuItems : adminMenuItems;

    const handleLogout = async () => {
        setIsLoggingOut(true); // Set loading state
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className={cn("hidden md:flex flex-col border-r bg-card transition-all duration-300", open ? "w-64" : "w-20")}>
                <div className="flex items-center justify-between p-4">
                    <span className="font-bold text-lg">{open ? "My App" : "MA"}</span>
                    <Button size="icon" variant="ghost" className="hidden md:flex" onClick={() => setOpen(!open)}>
                        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>

                <nav className="flex-1 space-y-1 p-2">
                    {menuItems.map((item, i) => (
                        <Link key={i} to={item.href} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
                            <item.icon className="w-5 h-5" />
                            {open && item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-2">
                    <div className="px-3 py-2 text-xs text-gray-500">
                        Role: {userRole}
                    </div>
                    <Button 
                        variant="ghost" 
                        className="w-full flex items-center gap-2" 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        <LogOut className="w-4 h-4" />
                        {open && (isLoggingOut ? "Logging out..." : "Logout")}
                    </Button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    className="m-2"
                    onClick={() => setMobileOpen(true)}
                >
                    <Menu className="w-5 h-5" />
                </Button>

                {mobileOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        <div className="w-64 bg-card border-r flex flex-col animate-in slide-in-from-left duration-200">
                            <div className="flex items-center justify-between p-4">
                                <span className="font-bold text-lg">My App</span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <nav className="flex-1 space-y-1 p-2">
                                {menuItems.map((item, i) => (
                                    <Link
                                        key={i}
                                        to={item.href}
                                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="p-2">
                                <Button 
                                    variant="ghost" 
                                    className="w-full flex items-center gap-2"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                >
                                    <LogOut className="w-4 h-4" /> 
                                    {isLoggingOut ? "Logging out..." : "Logout"}
                                </Button>
                            </div>
                        </div>

                        {/* Overlay */}
                        <div
                            className="flex-1 bg-black/50"
                            onClick={() => setMobileOpen(false)}
                        />
                    </div>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    )
}