export default function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse"
        >
          <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-800" />
          <div className="mt-5 space-y-3">
            <div className="h-4 w-24 bg-gray-200 rounded dark:bg-gray-800" />
            <div className="h-7 w-20 bg-gray-200 rounded dark:bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
