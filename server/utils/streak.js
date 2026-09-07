export function calculateStreak(logDates) {
  if (!logDates || logDates.length === 0) return 0;

  const dates = logDates
    .map((d) => new Date(d).toISOString().split("T")[0])
    .sort()
    .reverse();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let cursor = new Date(today);

  if (dates[0] !== cursor.toISOString().split("T")[0]) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  for (const dateStr of dates) {
    const cursorStr = cursor.toISOString().split("T")[0];
    if (dateStr === cursorStr) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (dateStr < cursorStr) {
      break;
    }
  }

  return streak;
}