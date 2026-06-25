import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

const headers = [
  "ID",
  "Client Name",
  "Car",
  "Start Date",
  "End Date",
  "Status",
  "Payment",
  "Actions",
];

export default function OrdersTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {headers.map((header) => (
                <TableCell
                  key={header}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index} className="animate-pulse">
                {Array.from({ length: 8 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex} className="px-4 py-4">
                    <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
