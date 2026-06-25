export default function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="h-5 w-40 bg-gray-200 rounded dark:bg-gray-800" />
        <div className="mt-2 h-4 w-56 bg-gray-200 rounded dark:bg-gray-800" />
      </div>
      <div className="p-6">
        <div className="h-[310px] bg-gray-100 rounded-xl dark:bg-gray-800" />
      </div>
    </div>
  );
}
