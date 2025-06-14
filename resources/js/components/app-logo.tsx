export default function AppLogo() {
    return (
        <>
            <div className="flex justify-center items-center bg-white rounded-md aspect-square size-8 text-sidebar-primary-foreground">
                <img src="/logo.png" alt="Logo" className="size-5" />
            </div>
            <div className="grid flex-1 ml-1 text-sm text-left">
                <span className="mb-0.5 truncate leading-tight font-semibold">Gest-Cave</span>
            </div>
        </>
    );
}
