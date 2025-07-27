import React from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppLayout from "@/Layouts/AppLayout.jsx";
import Breadcrumbs from "@/Components/Breadcrumbs.jsx";

export default function Index() {
    const { items, filters } = usePage().props;

    const handleSearch = (e) => {
        router.get(route('items.index'), { search: e.target.value }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Items" />
            <Breadcrumbs />

            <div className=" max-w-6xl space-y-6">
                {/* Header & Search */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Items</h1>
                    <Link href={route('items.create')}>
                        <Button>Add Item</Button>
                    </Link>
                </div>

                <div className="w-full">
                    <Input
                        placeholder="Search item name or code..."
                        defaultValue={filters.search}
                        onChange={handleSearch}
                        className="w-full sm:max-w-xs"
                    />
                </div>

                {/* Table */}
                <div className="overflow-auto rounded-md shadow-sm border">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Item Code</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.data.map((item, index) => (
                            <tr key={item.id} className="border-t">
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{item.item_code}</td>
                                <td className="p-3">{item.name}</td>
                                <td className="p-3">Rp {item.price.toLocaleString()}</td>
                                <td className="p-3">{item.stock}</td>
                                <td className="p-3 space-x-2">
                                    <Link href={route('items.edit', item.id)}>
                                        <Button size="sm" variant="outline">Edit</Button>
                                    </Link>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this item?')) {
                                                router.delete(route('items.destroy', item.id), {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                });
                                            }
                                        }}

                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {items.links.map((link, i) => (
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

Index.layout = (page) => <AppLayout title="Items" children={page} />;
