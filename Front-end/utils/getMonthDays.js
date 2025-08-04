export function getMonthDays(month, year) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  return Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: totalDays }, (_, i) => i + 1));
}
