const DAY = 24 * 60 * 60 * 1000;

const PARIS = { timeZone: "Europe/Paris" };

// "samedi 21 juin"
export const formatDay = (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
        ...PARIS,
        weekday: "long",
        day: "numeric",
        month: "long",
    });

// "dimanche 1 juin à 20:00"
export const formatDayTime = (date) =>
    formatDay(date) +
    " à " +
    new Date(date).toLocaleTimeString("fr-FR", { ...PARIS, hour: "2-digit", minute: "2-digit" });

// "20 au 22 juin 2025": the weekend lasts from the weekend date to two days later
export const formatWeekend = (weekendDate) => {
    const start = new Date(weekendDate);
    const end = new Date(start.getTime() + 2 * DAY);
    const day = (date) => date.toLocaleDateString("fr-FR", { ...PARIS, day: "numeric" });
    const month = (date) => date.toLocaleDateString("fr-FR", { ...PARIS, month: "long" });
    const year = end.toLocaleDateString("fr-FR", { ...PARIS, year: "numeric" });

    return month(start) === month(end)
        ? `${day(start)} au ${day(end)} ${month(end)} ${year}`
        : `${day(start)} ${month(start)} au ${day(end)} ${month(end)} ${year}`;
};

// 0 for the first day of the weekend, 1 for the second...
export const weekendDayIndex = (weekendDate, now = Date.now()) =>
    Math.max(0, Math.floor((now - new Date(weekendDate).getTime()) / DAY));
