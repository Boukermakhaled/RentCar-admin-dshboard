import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function CarsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {["Image", "Plate", "Brand", "Model", "Price", "Available", "Actions"].map(
                (header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index} className="animate-pulse">
                <TableCell className="px-5 py-4 sm:px-6">
                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800" />
                </TableCell>
                {Array.from({ length: 5 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex} className="px-4 py-4">
                    <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                  </TableCell>
                ))}
                <TableCell className="px-4 py-4">
                  <div className="flex gap-2">
                    <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
