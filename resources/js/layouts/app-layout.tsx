import * as React from 'react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';

interface AppLayoutProps {
    breadcrumbs?: Array<{ label: string; href?: string }>;
    children: React.ReactNode;
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
        </div>
    );
}
