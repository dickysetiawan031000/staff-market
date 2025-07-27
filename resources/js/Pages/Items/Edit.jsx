import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage, router } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs.jsx';
import HeaderForm from '@/Components/HeaderForm.jsx';
import ItemForm from "@/Pages/Items/ItemForm.jsx";

export default function Edit({ item, page_settings }) {
    const { errors } = usePage().props;

    const handleSubmit = (formData) => {
        router.patch(route('items.update', item.id), formData);
    };

    return (
        <AppLayout>
            <Head title={page_settings.title} />
            <Breadcrumbs />

            <div className="max-w-6xl">
                <HeaderForm
                    title={page_settings.title}
                    subtitle={page_settings.subtitle}
                />

                <div className="bg-white shadow-md rounded-lg p-6">
                    <ItemForm
                        initialValues={item}
                        onSubmit={handleSubmit}
                        processing={false}
                        errors={errors}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
