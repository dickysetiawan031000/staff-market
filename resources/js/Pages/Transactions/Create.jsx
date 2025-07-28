import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import Breadcrumbs from "@/Components/Breadcrumbs.jsx";
import HeaderForm from "@/Components/HeaderForm.jsx";

export default function Create({ page_settings, users, items }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        status: 'paid',
        items: [{ item_id: '', quantity: 1 }],
        total_installment: '',
    });

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...data.items];
        updatedItems[index][field] = value;
        setData('items', updatedItems);
    };


    const addRow = () => {
        setData('items', [...data.items, { item_id: '', quantity: 1 }]);
    };

    const removeRow = (index) => {
        const updatedItems = data.items.filter((_, i) => i !== index);
        setData('items', updatedItems);
    };

    const calculateTotal = () => {
        return data.items.reduce((sum, item) => {
            const found = items.find((i) => i.id === parseInt(item.item_id));
            if (!found) return sum;
            return sum + (found.price * parseInt(item.quantity || 0));
        }, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('transactions.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Transaction created successfully');
                reset();
            }
        });
    };

    return (
        <AppLayout>
            <Head title={page_settings.title} />
            <Breadcrumbs />

            <div className="max-w-6xl">
                <HeaderForm title={page_settings.title} subtitle={page_settings.subtitle} />

                <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow p-6 rounded-md">
                    {/* User */}
                    <div>
                        <Label htmlFor="user">Select User</Label>
                        <Select value={data.user_id} onValueChange={(value) => setData('user_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a user" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.user_id && <p className="text-sm text-red-500">{errors.user_id}</p>}
                    </div>

                    {/* Items */}
                    {data.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                            <div>
                                <Label>Item</Label>
                                <Select
                                    value={item.item_id}
                                    onValueChange={(value) => handleItemChange(index, 'item_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {items.map((option) => (
                                            <SelectItem
                                                key={option.id}
                                                value={option.id.toString()}
                                                disabled={option.stock === 0}
                                            >
                                                {option.name} - Rp {option.price.toLocaleString()} - Stock: {option.stock}
                                                {option.stock === 0 && ' (Out of stock)'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2">
                                {index > 0 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeRow(index)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    <Button type="button" onClick={addRow}>
                        + Add Item
                    </Button>

                    {/* Status */}
                    <div>
                        <Label>Status</Label>
                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="installment">Installment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {data.status === 'installment' && (
                        <div>
                            <Label htmlFor="total_installment">Total Installment</Label>
                            <Input
                                id="total_installment"
                                type="number"
                                min={1}
                                value={data.total_installment}
                                onChange={e => setData('total_installment', e.target.value)}
                            />
                            {errors.total_installment && (
                                <p className="text-sm text-red-500">{errors.total_installment}</p>
                            )}
                        </div>
                    )}

                    {/* Total */}
                    <div className="text-xl font-semibold">
                        Total: Rp {calculateTotal().toLocaleString()}
                    </div>

                    {/* Submit */}
                    <div>
                        <Button type="submit" disabled={processing}>
                            Save Transaction
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
