import { TableRow, TableCell } from "../ui/table";

const TableRowSkeleton = () => (
  <TableRow>
    {Array.from({ length: 8 }).map((_, index) => (
      <TableCell key={index} className="px-4 py-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </TableCell>
    ))}
  </TableRow>
);

export default TableRowSkeleton;
