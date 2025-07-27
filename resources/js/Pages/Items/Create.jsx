import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, usePage } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs.jsx';
import HeaderForm from '@/Components/HeaderForm.jsx';
import ItemForm from "@/Pages/Items/ItemForm.jsx";

export default function Create({ page_settings }) {
    const { errors } = usePage().props;

    const handleSubmit = (formData) => {
        router.post(page_settings.action, formData);
    };

    return (
        <AppLayout>
            <Head title={page_settings.title} />
            <Breadcrumbs />
            <div className="max-w-6xl">
                <HeaderForm title={page_settings.title} subtitle={page_settings.subtitle} />

                <div className="bg-white shadow-md rounded-lg p-6">
                    <ItemForm
                        onSubmit={handleSubmit}
                        processing={false}
                        errors={errors}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
