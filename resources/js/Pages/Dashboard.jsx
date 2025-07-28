import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, CheckCircle } from 'lucide-react';

export default function Dashboard() {
    const { total_transactions, paid_transactions, total_items, total_employees,auth } = usePage().props;

    return (
        <AppLayout>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex justify-between items-center pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{total_transactions}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex justify-between items-center pb-2">
                        <CardTitle className="text-sm font-medium">Paid Transactions</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{paid_transactions}</div>
                        <p className="text-xs text-muted-foreground">Marked as paid</p>
                    </CardContent>
                </Card>

                {auth.roles.includes('admin') && (
                    <>
                        <Card>
                            <CardHeader className="flex justify-between items-center pb-2">
                                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{total_items}</div>
                                <p className="text-xs text-muted-foreground">Available now</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex justify-between items-center pb-2">
                                <CardTitle className="text-sm font-medium">Employees</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{total_employees}</div>
                                <p className="text-xs text-muted-foreground">Registered</p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
