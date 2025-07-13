import type { ReactNode } from "react";

type TableCellProps = {
  children: ReactNode;
  className?: string;
};

const TableCell = ({ children, className = "" }: TableCellProps) => (
  <td className={`px-4 py-2 text-sm whitespace-nowrap ${className}`}>
    {children}
  </td>
);

export default TableCell;
