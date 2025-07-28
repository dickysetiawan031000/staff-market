import React from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';

export default function Index() {
    const { transactions, filters, users, auth } = usePage().props;


    const handleFilter = (name, value) => {
        router.get(route('transactions.index'), {
            ...filters,
            [name]: value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        router.get(route('transactions.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Transactions" />
            <Breadcrumbs />

            <div className="max-w-6xl space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Transactions</h1>
                    {auth.roles.includes('admin') && (
                        <Link href={route('transactions.create')}>
                            <Button>Add Transaction</Button>
                        </Link>
                    )}
                </div>

                {/* Filter Form */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm font-medium">Transaction Date</label>
                        <Input
                            type="date"
                            value={filters.date || ''}
                            onChange={(e) => handleFilter('date', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">User</label>
                        <Select
                            value={filters.user_id || ''}
                            onValueChange={(value) => handleFilter('user_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select User" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map(user => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name} ({user.employee_id || user.id})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Payment Type</label>
                        <Select
                            value={filters.status || ''}
                            onValueChange={(value) => handleFilter('status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Payment Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="installment">Installment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-end gap-2">
                        <Button variant="outline" onClick={handleReset}>Clear</Button>
                    </div>
                </div>

                {/* Table - Desktop */}
                <div className="hidden md:block overflow-auto rounded-md shadow-sm border mt-4">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">User</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Total Amount</th>
                            <th className="p-3">Payment Type</th>
                            <th className="p-3">Total Installment</th>
                            <th className="p-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.data.map((tx, index) => (
                            <tr key={tx.id} className="border-t">
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{tx.user?.name || '-'}</td>
                                <td className="p-3">{new Date(tx.created_at).toLocaleDateString()}</td>
                                <td className="p-3">Rp {tx.total_price.toLocaleString()}</td>
                                <td className="p-3 capitalize">{tx.status}</td>
                                <td className="p-3 capitalize">{tx.total_installment}</td>
                                <td className="p-3 space-x-2">
                                    <Link href={route('transactions.show', tx.id)}>
                                        <Button size="sm" variant="outline">View</Button>
                                    </Link>

                                    {auth.roles.includes('admin') && (
                                        <>
                                            <Link href={route('transactions.edit', tx.id)}>
                                                <Button size="sm" variant="secondary">Edit</Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    if (confirm('Are you sure?')) {
                                                        router.delete(route('transactions.destroy', tx.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Card - Mobile */}
                <div className="md:hidden space-y-4">
                    {transactions.data.map((tx, index) => (
                        <div key={tx.id} className="border rounded-lg shadow-sm p-4 space-y-2 text-sm">
                            <div className="text-gray-500">#{index + 1}</div>
                            <div><strong>User:</strong> {tx.user?.name || '-'}</div>
                            <div><strong>Date:</strong> {new Date(tx.created_at).toLocaleDateString()}</div>
                            <div><strong>Total Amount:</strong> Rp {tx.total_price.toLocaleString()}</div>
                            <div><strong>Payment Type:</strong> {tx.status === 'paid' ? 'Paid' : 'Installment'}</div>
                            <div><strong>Total Installment:</strong> {tx.total_installment || '-'}</div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                <Link href={route('transactions.show', tx.id)}>
                                    <Button size="sm" variant="outline">View</Button>
                                </Link>

                                {auth.roles.includes('admin') && (
                                    <>
                                        <Link href={route('transactions.edit', tx.id)}>
                                            <Button size="sm" variant="secondary">Edit</Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                                if (confirm('Are you sure?')) {
                                                    router.delete(route('transactions.destroy', tx.id));
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {transactions.links.map((link, i) => (
                        <Button
                            key={i}
                            variant={link.active ? "default" : "outline"}
                            disabled={!link.url}
                            onClick={() => router.visit(link.url)}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Button>
                    ))}
                </div>
            </div>
        </>
    );
}

Index.layout = (page) => <AppLayout title="Transactions" children={page} />;
