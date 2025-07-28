import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Button } from '@/components/ui/button';

export default function View() {
    const { transaction, transaction_items } = usePage().props;

    return (
        <AppLayout>
            <Head title="Transaction Detail" />
            <Breadcrumbs />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Transaction Detail</h1>
                    <Link href={route('transactions.index')}>
                        <Button variant="outline">Back</Button>
                    </Link>
                </div>

                {/* Info Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-4 bg-white shadow-sm text-sm">
                    <div><strong>User:</strong> {transaction.user?.name || '-'}</div>
                    <div><strong>Date:</strong> {new Date(transaction.created_at).toLocaleDateString()}</div>
                    <div><strong>Status:</strong> {transaction.status === 'paid' ? 'Paid' : 'Installment'}</div>
                    <div><strong>Total Installment:</strong> Rp {transaction.total_installment.toLocaleString() || '-'}</div>
                    <div><strong>Total Price:</strong> Rp {transaction.total_price.toLocaleString()}</div>
                </div>

                {/* Item List - Desktop */}
                <div className="hidden md:block overflow-auto rounded-md shadow-sm border">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Item</th>
                            <th className="p-3">Price at Transaction</th>
                            <th className="p-3">Current Price</th>
                            <th className="p-3">Quantity</th>
                            <th className="p-3">Subtotal</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transaction_items.map((item, index) => (
                            <tr key={item.id} className="border-t">
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{item.item?.name}</td>
                                <td className="p-3">Rp {item.price.toLocaleString()}</td>
                                <td className="p-3">Rp {item.item?.price.toLocaleString()}</td>
                                <td className="p-3">{item.quantity}</td>
                                <td className="p-3">
                                    Rp {(item.price * item.quantity).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Item List - Mobile */}
                <div className="md:hidden space-y-4">
                    {transaction_items.map((item, index) => (
                        <div key={item.id} className="border rounded-lg shadow-sm p-4 space-y-1 text-sm">
                            <div className="text-gray-500">#{index + 1}</div>
                            <div><strong>Item:</strong> {item.item?.name}</div>
                            <div><strong>Price at Transaction:</strong> Rp {item.price.toLocaleString()}</div>
                            <div><strong>Current Price:</strong> Rp {item.item?.price.toLocaleString()}</div>
                            <div><strong>Quantity:</strong> {item.quantity}</div>
                            <div><strong>Subtotal:</strong> Rp {(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
