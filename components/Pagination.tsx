import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Logic to show a limited number of page buttons (e.g., first, last, current, and neighbors)
  const getPageNumbers = () => {
    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);

    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        pages.add(i);
    }
    
    const sortedPages = Array.from(pages).sort((a,b) => a - b);
    const result: (number | string)[] = [];
    
    let lastPage: number | null = null;
    for (const page of sortedPages) {
        if (lastPage !== null && page - lastPage > 1) {
            result.push('...');
        }
        result.push(page);
        lastPage = page;
    }

    return result;
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        السابق
      </button>

      {getPageNumbers().map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-brand-blue text-white border-brand-blue'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ) : (
            <span key={index} className="px-4 py-2 text-gray-500">
                {page}
            </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        التالي
      </button>
    </nav>
  );
};

export default Pagination;
