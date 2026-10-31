// Dates of the content files, displayed in French and in Paris time
const PARIS = { timeZone: "Europe/Paris" };
const dayMonthYear = new Intl.DateTimeFormat("fr-FR", {
    ...PARIS,
    day: "numeric",
    month: "long",
    year: "numeric",
});
const dayMonth = new Intl.DateTimeFormat("fr-FR", { ...PARIS, day: "numeric", month: "long" });
const day = new Intl.DateTimeFormat("fr-FR", { ...PARIS, day: "numeric" });
const month = new Intl.DateTimeFormat("fr-FR", { ...PARIS, month: "numeric" });
const dayAndTime = new Intl.DateTimeFormat("fr-FR", {
    ...PARIS,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
});

// "Du 20 au 22 juin 2025", or "Du 31 mai au 2 juin 2025"
export const formatRange = (start, end) => {
    const [from, to] = [new Date(start), new Date(end)];
    const sameMonth = month.format(from) === month.format(to);

    return "Du " + (sameMonth ? day : dayMonth).format(from) + " au " + dayMonthYear.format(to);
};

// "dimanche 1er juin à 20:00" (French writes the first of the month 1er)
export const formatDayAndTime = (date) =>
    dayAndTime.format(new Date(date)).replace(/(^|\s)1 /, "$11er ");

// "2 j 3 h 4 min" before a date, null once passed
export const formatTimeLeft = (date, now = Date.now()) => {
    const minutes = Math.ceil((new Date(date) - now) / 60000);
    if (minutes <= 0) return null;

    const parts = [
        [Math.floor(minutes / 1440), "j"],
        [Math.floor((minutes % 1440) / 60), "h"],
        [minutes % 60, "min"],
    ];
    return parts
        .filter(([value], index) => value > 0 || index === 2)
        .map(([value, unit]) => value + " " + unit)
        .join(" ");
};
