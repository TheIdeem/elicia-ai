import { FC, ReactNode, useEffect } from 'react';

export interface Column<T> {
  header: string | ReactNode;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  sortable?: boolean;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  sortField?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: keyof T) => void;
  emptyState?: ReactNode;
  rowClassName?: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  sortField,
  sortDirection = 'asc',
  onSort,
  emptyState,
  rowClassName,
  onRowClick,
  isLoading = false,
}: TableProps<T>) => {
  
  // Debugging: Check if keyExtractor is producing unique keys
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const keys = data.map(keyExtractor);
      const uniqueKeys = new Set(keys);
      
      if (keys.length !== uniqueKeys.size) {
        console.warn('Table component received non-unique keys:', keys);
      }
    }
  }, [data, keyExtractor]);
  
  const handleSort = (column: Column<T>) => {
    if (column.sortable && onSort && typeof column.accessor === 'string') {
      onSort(column.accessor);
    }
  };
  
  const renderValue = (item: T, column: Column<T>): ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor as string];
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Empty state
  if (data.length === 0 && emptyState) {
    return <div>{emptyState}</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                } ${column.width || ''} ${column.className || ''}`}
                onClick={() => handleSort(column)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={`${
                onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
              } ${rowClassName ? rowClassName(item) : ''}`}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 whitespace-nowrap border-b border-gray-100 ${column.className || ''}`}
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 