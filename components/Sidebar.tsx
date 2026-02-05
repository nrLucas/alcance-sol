"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Menu, X, Home, History, Phone, LogOut, Sun } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/history", label: "Histórico", icon: History },
    { href: "/contact", label: "Contato", icon: Phone },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={onClose} />}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-zinc-900 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1f7e7b] to-[#156362]">
                                <Sun className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-lg font-bold text-[#012d2e] dark:text-emerald-100">Sol Conectividade</span>
                        </div>
                        <Button isIconOnly aria-label="Fechar menu" variant="light" onPress={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <Divider />

                    {/* Menu Items */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                                                isActive
                                                    ? "bg-[#156362]/10 text-[#012d2e] dark:bg-[#156362]/30 dark:text-emerald-100"
                                                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                            }`}
                                            href={item.href}
                                            onClick={onClose}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <Divider />

                    {/* Logout */}
                    <div className="p-4">
                        <Button className="w-full" color="danger" startContent={<LogOut className="h-5 w-5" />} variant="flat" onPress={handleLogout}>
                            Sair
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}

// Header with hamburger menu
interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-md dark:bg-zinc-900/80">
            <Button isIconOnly aria-label="Abrir menu" variant="light" onPress={onMenuClick}>
                <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1f7e7b] to-[#156362]">
                    <Sun className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-[#012d2e] dark:text-emerald-100">Sol Conectividade</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
        </header>
    );
}
