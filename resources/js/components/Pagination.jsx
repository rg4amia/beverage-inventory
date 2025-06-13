import { router } from '@inertiajs/react';

const Pagination = ({ links }) => {
    const handlePageChange = (url) => {
        if (url) {
            router.get(url, {}, { preserveState: true });
        }
    };

    return (
        <nav className="mt-6 flex items-center justify-center" aria-label="Pagination">
            <div className="flex items-center space-x-2">
                {links.map((link, index) => {
                    const isPrevious = link.label.includes('Previous');
                    const isNext = link.label.includes('Next');

                    return (
                        <button
                            key={index}
                            onClick={() => handlePageChange(link.url)}
                            disabled={!link.url}
                            className={`rounded-md px-4 py-2 text-sm font-medium ${
                                link.active ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                            } ${!link.url ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${
                                isPrevious || isNext ? 'border border-gray-300' : ''
                            } transition-colors duration-200`}
                            aria-current={link.active ? 'page' : undefined}
                            aria-disabled={!link.url}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default Pagination;
