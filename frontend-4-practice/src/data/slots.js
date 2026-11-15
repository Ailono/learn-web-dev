const GROUPS = [
  { title: "Утро", from: 0, to: 12 * 60 },
  { title: "День", from: 12 * 60 + 1, to: 17 * 60 - 1 },
  { title: "Вечер", from: 17 * 60, to: 24 * 60 - 1 },
];

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Группирует плоский список слотов с сервера по времени суток.
export function groupSlots(slots) {
  return GROUPS.map((group) => ({
    title: group.title,
    slots: slots
      .filter((slot) => {
        const minutes = timeToMinutes(slot.time);
        return minutes >= group.from && minutes <= group.to;
      })
      .sort((first, second) => first.time.localeCompare(second.time)),
  })).filter((group) => group.slots.length > 0);
}

export function hasAvailableSlots(slots) {
  return slots.some((slot) => slot.available);
}
