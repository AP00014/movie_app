import React from 'react'

interface TableProps {
  children: React.ReactNode
  className?: string
}

interface TableHeaderProps {
  children: React.ReactNode
}

interface TableBodyProps {
  children: React.ReactNode
}

interface TableRowProps {
  children: React.ReactNode
  className?: string
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  header?: boolean
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="admin-table min-w-full divide-y divide-gray-200">
      {children}
    </table>
  </div>
)

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => (
  <thead className="bg-gray-50">
    {children}
  </thead>
)

export const TableBody: React.FC<TableBodyProps> = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">
    {children}
  </tbody>
)

export const TableRow: React.FC<TableRowProps> = ({ children, className = '' }) => (
  <tr className={className}>
    {children}
  </tr>
)

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = '',
  header = false
}) => {
  const Component = header ? 'th' : 'td'
  const baseClasses = header
    ? 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
    : 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'

  return (
    <Component className={`${baseClasses} ${className}`}>
      {children}
    </Component>
  )
}