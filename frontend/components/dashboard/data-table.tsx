import React from 'react';

interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends Record<string, any>> {
  columns: TableColumn<T>[];
  data: T[];
  title?: string;
  description?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  title,
  description,
}: DataTableProps<T>) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      {title && (
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`${column.key}-${column.label}-${index}`}
                  className={`px-6 py-3 text-left font-semibold text-muted-foreground ${
                    column.className || ''
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-border hover:bg-muted/40 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${rowIndex}-${column.key}-${column.label}-${colIndex}`}
                      className={`px-6 py-4 ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
