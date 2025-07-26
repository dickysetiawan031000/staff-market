import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    console.log('AppLayout loaded');


    const menuItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Transactions', href: '/transactions' },
        { label: 'Items', href: '/items' },
        { label: 'Employees', href: '/employees' },
    ];

    return (
        <>
            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar */}
                <aside className="hidden md:block w-64 bg-white border-r">
                    <div className="h-16 flex items-center justify-center border-b font-bold text-lg">
                        Staff Market
                    </div>
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block px-4 py-2 rounded hover:bg-gray-200"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Mobile Menu */}
                <div className="md:hidden fixed top-0 left-0 p-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="p-2 rounded-md border bg-white">
                                <Menu className="w-5 h-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                            <div className="text-lg font-bold mb-4">Staff Market</div>
                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block px-4 py-2 rounded hover:bg-gray-200"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-6 mt-16 md:mt-0">
                    <div className="mt-4">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}
