export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function buildMonthlyOrdersData(
  year: number,
  ordersOverTime: { month: string; total_orders: string | number }[]
): number[] {
  const data = new Array<number>(12).fill(0);

  ordersOverTime.forEach(({ month, total_orders }) => {
    const [yearPart, monthPart] = month.split("-");
    if (Number(yearPart) === year && monthPart) {
      const index = Number(monthPart) - 1;
      if (index >= 0 && index < 12) {
        data[index] = Number(total_orders);
      }
    }
  });

  return data;
}

export function formatRevenue(value: number | string): string {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "0.00 DZD";

  return (
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " DZD"
  );
}

export function getYearOptions(count = 6): { value: string; label: string }[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, index) => {
    const year = currentYear - index;
    return { value: String(year), label: String(year) };
  });
}
