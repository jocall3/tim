import React, { useMemo, useState } from 'react';
import { RefreshCw, Search, ChevronUp, ChevronDown, X } from 'lucide-react';

// --- Card Component ---
export interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => (
  <div className={`bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">{title}</h3>
      {children}
  </div>
);

// --- Section Header ---
interface SectionHeaderProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onRefresh?: () => void;
  showRefresh?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, icon: Icon, onRefresh, showRefresh = true }) => (
  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-lg mb-6">
      <div className="flex items-center">
          <Icon className="h-8 w-8 text-purple-400 mr-3" />
          <div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="text-gray-400 text-sm">{description}</p>
          </div>
      </div>
      {showRefresh && onRefresh && (
          <button
              onClick={onRefresh}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
              <RefreshCw className="h-5 w-5 mr-2" /> Refresh
          </button>
      )}
  </div>
);

// --- Detail Panel ---
interface DetailPanelProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ title, children, onClose }) => {
  return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex justify-end">
          <div className="relative w-full md:w-1/2 lg:w-1/3 bg-gray-800 shadow-xl flex flex-col h-full border-l border-gray-700">
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                  <h3 className="text-2xl font-bold text-white">{title}</h3>
                  <button onClick={onClose} className="text-gray-400 hover:text-white transition duration-200">
                      <X className="h-6 w-6" />
                  </button>
              </div>
              <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                  {children}
              </div>
          </div>
      </div>
  );
};

// --- Loading Spinner ---
export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      <span className="ml-3 text-gray-400">Loading data...</span>
  </div>
);

// --- Filterable Table ---
interface FilterableTableProps<T> {
  data: T[];
  columns: { header: string; accessor: keyof T; render?: (item: T) => React.ReactNode }[];
  title: string;
  initialSortBy?: keyof T;
  initialSortDirection?: 'asc' | 'desc';
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  actionButtons?: (item: T) => React.ReactNode;
}

export const FilterableTable = <T extends { id?: string | number }>({
  data,
  columns,
  title,
  initialSortBy,
  initialSortDirection = 'asc',
  searchPlaceholder = "Search...",
  onRowClick,
  actionButtons
}: FilterableTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof T | undefined>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = useMemo(() => {
      return data.filter(item =>
          Object.values(item).some(value =>
              String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
      if (!sortBy) return filteredData;

      return [...filteredData].sort((a, b) => {
          const aValue = a[sortBy];
          const bValue = b[sortBy];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
              return sortDirection === 'asc'
                  ? aValue.localeCompare(bValue)
                  : bValue.localeCompare(aValue);
          }
          if (typeof aValue === 'number' && typeof bValue === 'number') {
              return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
          }
          // Fallback for other types
          return 0;
      });
  }, [filteredData, sortBy, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (columnAccessor: keyof T) => {
      if (sortBy === columnAccessor) {
          setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
          setSortBy(columnAccessor);
          setSortDirection('asc');
      }
  };

  const getSortIndicator = (columnAccessor: keyof T) => {
      if (sortBy === columnAccessor) {
          return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
      }
      return null;
  };

  return (
      <Card title={title}>
          <div className="mb-4 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
              <div className="flex items-center w-full md:w-1/2 relative">
                  <Search className="absolute left-3 text-gray-400 h-5 w-5" />
                  <input
                      type="text"
                      placeholder={searchPlaceholder}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Items per page:</span>
                  <select
                      className="bg-gray-700 border border-gray-600 rounded-md text-white py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={itemsPerPage}
                      onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  >
                      {[5, 10, 25, 50, 100].map(num => (
                          <option key={num} value={num}>{num}</option>
                      ))}
                  </select>
              </div>
          </div>
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                      <tr>
                          {columns.map(col => (
                              <th
                                  key={String(col.accessor)}
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                  onClick={() => handleSort(col.accessor)}
                              >
                                  <div className="flex items-center">
                                      {col.header}
                                      {getSortIndicator(col.accessor)}
                                  </div>
                              </th>
                          ))}
                          {actionButtons && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>}
                      </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                      {paginatedData.length === 0 ? (
                          <tr>
                              <td colSpan={columns.length + (actionButtons ? 1 : 0)} className="px-6 py-4 text-center text-gray-400">
                                  No data found.
                              </td>
                          </tr>
                      ) : (
                          paginatedData.map((item, rowIndex) => (
                              <tr
                                  key={item.id || rowIndex}
                                  className={`hover:bg-gray-800 transition duration-150 ease-in-out ${onRowClick ? 'cursor-pointer' : ''}`}
                                  onClick={() => onRowClick?.(item)}
                              >
                                  {columns.map(col => (
                                      <td key={String(col.accessor)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                          {col.render ? col.render(item) : String(item[col.accessor])}
                                      </td>
                                  ))}
                                  {actionButtons && (
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                          {actionButtons(item)}
                                      </td>
                                  )}
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
          <div className="mt-4 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
              <span className="text-sm text-gray-400">
                  Showing {Math.min(sortedData.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(sortedData.length, currentPage * itemsPerPage)} of {sortedData.length} entries
              </span>
              <div className="flex items-center space-x-1">
                  <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNum = index + 1;
                      if (totalPages <= 5 || (pageNum >= currentPage - 2 && pageNum <= currentPage + 2) || pageNum === 1 || pageNum === totalPages) {
                          if ((pageNum === currentPage - 3 && pageNum > 1) || (pageNum === currentPage + 3 && pageNum < totalPages)) {
                              return <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">...</span>;
                          }
                          return (
                              <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                              >
                                  {pageNum}
                              </button>
                          );
                      }
                      return null;
                  })}
                  <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      Next
                  </button>
              </div>
          </div>
      </Card>
  );
};