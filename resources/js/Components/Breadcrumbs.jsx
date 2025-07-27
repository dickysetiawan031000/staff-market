import React from 'react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Breadcrumbs() {
    const path = window.location.pathname;

    const segments = path
        .split('/')
        .filter(Boolean)
        .map((segment, index, arr) => {
            const href = '/' + arr.slice(0, index + 1).join('/');
            return {
                name: segment.charAt(0).toUpperCase() + segment.slice(1),
                href,
                isLast: index === arr.length - 1
            };
        });

    return (
        <Breadcrumb className="mb-10">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>

                {segments.map((seg, idx) => (
                    <React.Fragment key={seg.href}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {seg.isLast ? (
                                <BreadcrumbPage>{seg.name}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={seg.href}>{seg.name}</BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
