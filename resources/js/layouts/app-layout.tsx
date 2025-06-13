import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import Alert from '@/components/Alert';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';

interface AppLayoutProps {
    breadcrumbs?: Array<{ label: string; href?: string }>;
    children: React.ReactNode;
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Alert />
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppSidebar />
            <main className="lg:pl-64">
                <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                    {children}
                </AppLayoutTemplate>
            </main>
        </div>
    );
}
