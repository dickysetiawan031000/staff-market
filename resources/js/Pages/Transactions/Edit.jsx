import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';
import { toast } from 'sonner';
import Breadcrumbs from '@/Components/Breadcrumbs';
import HeaderForm from '@/Components/HeaderForm';

export default function Edit({ page_settings, transaction, transaction_items, items }) {
    const getItemInfo = (item_id) => items.find((i) => i.id === item_id);

    const [itemsState, setItemsState] = useState(
        transaction_items.map(({ id, item_id, quantity, price }) => ({
            id,
            item_id,
            quantity,
            price_at_transaction: price,
        }))
    );

    const [status, setStatus] = useState(transaction.status);
    const [totalInstallment, setTotalInstallment] = useState(
        transaction.status === 'installment' ? parseInt(transaction.total_installment || 0) : null
    );

    const totalPriceNow = itemsState.reduce((sum, item) => {
        const info = getItemInfo(item.item_id);
        return sum + (info ? info.price * item.quantity : 0);
    }, 0);

    const { data, setData, put, processing, errors } = useForm({
        items: itemsState.map(({ id, quantity, item_id }) => ({ id, item_id, quantity })),
        status: transaction.status,
        total_installment: totalInstallment,
        total_price: totalPriceNow,
    });

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            items: itemsState.map(({ id, quantity, item_id }) => ({
                id,
                quantity: parseInt(quantity) || 1,
                item_id,
            })),
            status,
            total_installment: status === 'installment'
                ? parseInt(totalInstallment) || 0
                : null,
            total_price: totalPriceNow,
        }));
    }, [itemsState, status, totalInstallment, totalPriceNow]);

    const handleQuantityChange = (index, value) => {
        const updated = [...itemsState];
        updated[index].quantity = value;
        setItemsState(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        put(page_settings.action, {
            items: itemsState.map(({ id, item_id, quantity }) => ({
                id,
                item_id,
                quantity: parseInt(quantity) || 1,
            })),
            status,
            total_installment: status === 'installment' ? parseInt(totalInstallment) || 0 : null,
            total_price: totalPriceNow,
        }, {
            onSuccess: () => toast.success('Transaction updated successfully'),
        });
    };

    return (
        <AppLayout>
            <Head title={page_settings.title} />
            <Breadcrumbs />
            <div className="max-w-6xl">
                <HeaderForm title={page_settings.title} subtitle={page_settings.subtitle} />

                <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow p-6 rounded-md mt-10">
                    {itemsState.map((item, index) => {
                        const info = getItemInfo(item.item_id);
                        return (
                            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                <div>
                                    <Label>Item</Label>
                                    <div className="bg-gray-100 p-2 rounded">
                                        {info?.name || '-'}<br />
                                        <span className="text-sm text-gray-600">
                                            Price at Transaction: Rp {item.price_at_transaction.toLocaleString()}<br />
                                            Current Price: Rp {info?.price?.toLocaleString() || '0'}<br />
                                            Stock: {info?.stock ?? '-'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    />
                                    {errors[`items.${index}.quantity`] && (
                                        <div className="text-sm text-red-500 mt-1">
                                            {errors[`items.${index}.quantity`]}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Payment Status */}
                    <div className="mt-6">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="installment">Installment</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <div className="text-sm text-red-500 mt-1">{errors.status}</div>
                        )}
                    </div>

                    {/* Installment Field */}
                    {status === 'installment' && (
                        <div>
                            <Label>Total Installment</Label>
                            <Input
                                type="number"
                                min={1}
                                value={totalInstallment}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setTotalInstallment(val);
                                    setData('total_installment', val === '' ? '' : parseInt(val));
                                }}
                                required
                            />
                            {errors.total_installment && (
                                <div className="text-sm text-red-500 mt-1">{errors.total_installment}</div>
                            )}
                        </div>
                    )}

                    {/* Total Price Summary */}
                    <div className="text-left font-semibold text-lg space-y-2">
                        <div>Total Price at Transaction: Rp {transaction.total_price.toLocaleString()}</div>
                        <div className="border-2 border-gray-800 rounded-md px-4 py-2 font-bold">
                            Total Price Now: Rp {totalPriceNow.toLocaleString()}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" disabled={processing}>
                            Update Transaction
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
