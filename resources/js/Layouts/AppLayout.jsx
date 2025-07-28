import React, { useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast, Toaster } from 'sonner';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }) {
    const { auth, flash } = usePage().props;
    const currentPath = window.location.pathname;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const menuItems = [
        { label: 'Dashboard', href: '/' },
        { label: 'Transactions', href: '/transactions' },
        ...(auth.roles.includes('admin') ? [
            { label: 'Items', href: '/items' },
            { label: 'Users', href: '/users' },
        ] : []),
    ];

    const renderNavLink = (item) => {
        const isActive =
            item.href === '/'
                ? currentPath === '/'
                : currentPath.startsWith(item.href);

        return (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "block px-4 py-2 rounded transition-all",
                    isActive
                        ? "bg-gray-100 text-primary font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                )}
            >
                {item.label}
            </Link>
        );
    };

    return (
        <>
            <div className="flex min-h-screen bg-white">
                {/* Sidebar Desktop */}
                <aside className="hidden md:block w-64 bg-white border-r">
                    <div className="h-16 flex items-center justify-center border-b font-bold text-lg">
                        Staff Market
                    </div>
                    <nav className="p-4 space-y-2">
                        {menuItems.map(renderNavLink)}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-red-600"
                        >
                            Logout
                        </Link>
                    </nav>
                </aside>

                {/* Sidebar Mobile */}
                <div className="md:hidden fixed top-0 left-0 p-2 z-50">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="p-2 rounded-md border bg-white shadow">
                                <Menu className="w-5 h-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                            <div className="text-lg font-bold mb-4">Staff Market</div>
                            <nav className="space-y-2">
                                {menuItems.map(renderNavLink)}
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-red-600"
                                >
                                    Logout
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-6 mt-16 md:mt-0">
                    <div className="mt-4">{children}</div>
                </main>
            </div>

            {/* Toast */}
            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'bg-white text-gray-800 shadow-md',
                    style: {
                        background: '#fff',
                        color: '#333',
                    },
                }}
                duration={2500}
            />
        </>
    );
}
