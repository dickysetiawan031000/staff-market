import React from 'react';
import { useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ItemForm({ initialValues = {}, onSubmit, processing, errors }) {
    const { data, setData, submit, reset } = useForm({
        item_code: initialValues.item_code || '',
        name: initialValues.name || '',
        price: initialValues.price || '',
        stock: initialValues.stock || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Item Code */}
            <div>
                <Label htmlFor="item_code">Item Code</Label>
                <Input
                    id="item_code"
                    type="text"
                    value={data.item_code}
                    onChange={(e) => setData('item_code', e.target.value)}
                    placeholder="e.g. M001"
                />
                {errors.item_code && <p className="text-sm text-red-500">{errors.item_code}</p>}
            </div>

            {/* Name */}
            <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g. Minyak Goreng"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Price */}
            <div>
                <Label htmlFor="price">Price</Label>
                <Input
                    id="price"
                    type="number"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    placeholder="e.g. 10000"
                    min={0}
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                    id="stock"
                    type="number"
                    value={data.stock}
                    onChange={(e) => setData('stock', e.target.value)}
                    placeholder="e.g. 100"
                    min={0}
                />
                {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
            </div>

            {/* Submit */}
            <div className="pt-2">
                <Button type="submit" disabled={processing}>
                    Save
                </Button>
            </div>
        </form>
    );
}
