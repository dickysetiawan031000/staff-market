import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/Components/Breadcrumbs';

export default function Index() {
    const { users, filters } = usePage().props;

    const handleFilter = (e) => {
        router.get(route('users.index'), {
            ...filters,
            [e.target.name]: e.target.value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        router.get(route('users.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const toggleStatus = (id, currentStatus) => {
        const confirmText = currentStatus ? 'Deactivate this user?' : 'Activate this user?';
        if (confirm(confirmText)) {
            router.put(route('users.toggle-status', id));
        }
    };

    return (
        <>
            <Head title="Users" />
            <Breadcrumbs />

            <div className="max-w-6xl space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Users</h1>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            name="name"
                            value={filters.name || ''}
                            onChange={handleFilter}
                            placeholder="Search name"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Employee ID</label>
                        <Input
                            name="employee_id"
                            value={filters.employee_id || ''}
                            onChange={handleFilter}
                            placeholder="Search employee ID"
                        />
                    </div>
                    <div className="flex items-end gap-2">
                        <Button variant="outline" onClick={handleReset}>Clear</Button>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-auto rounded-md shadow-sm border mt-4">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Employee ID</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.data.map((user, index) => (
                            <tr key={user.id} className="border-t">
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.employee_id || '-'}</td>
                                <td className="p-3">
                                    {user.is_active ? 'Active' : 'Inactive'}
                                </td>
                                <td className="p-3">
                                    <Button
                                        size="sm"
                                        variant={user.is_active ? 'destructive' : 'secondary'}
                                        onClick={() => toggleStatus(user.id, user.is_active)}
                                    >
                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4 mt-4">
                    {users.data.map((user, index) => (
                        <div key={user.id} className="border rounded-lg shadow-sm p-4 space-y-2">
                            <div className="text-sm text-gray-500">#{index + 1}</div>
                            <div><strong>Name:</strong> {user.name}</div>
                            <div><strong>Email:</strong> {user.email}</div>
                            <div><strong>Employee ID:</strong> {user.employee_id || '-'}</div>
                            <div><strong>Status:</strong> {user.is_active ? 'Active' : 'Inactive'}</div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant={user.is_active ? 'destructive' : 'secondary'}
                                    onClick={() => toggleStatus(user.id, user.is_active)}
                                >
                                    {user.is_active ? 'Deactivate' : 'Activate'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {users.links.map((link, i) => (
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

Index.layout = page => <AppLayout title="Users" children={page} />;
