// dateFilter.js
export function filterItemsByDateRange(items, startDate, endDate) {
  console.log("here");
  if (!startDate && !endDate) {
    return items;
  } else if (!endDate && startDate) {
    const exactDay = new Date(startDate);
    exactDay.setDate(exactDay.getDate() - 1);
    const endDay = new Date(exactDay);
    endDay.setDate(exactDay.getDate() + 1);

    return items.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= exactDay && itemDate <= endDay;
    });
  } else {
    const startRange = new Date(startDate);
    const endRange = new Date(endDate);
    startRange.setDate(startRange.getDate() - 1);

    return items.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= startRange && itemDate <= endRange;
    });
  }
}
