// The homepage follows the life of the current edition:
//   teaser    before the shotgun
//   shotgun   from 1h before the shotgun opens to a few hours after
//   countdown after the shotgun, before the weekend
//   live      during the weekend
//   recap     once it is over

export const PHASES = ["teaser", "shotgun", "countdown", "live", "recap"];

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const SHOTGUN_WINDOW_BEFORE = HOUR;
export const SHOTGUN_WINDOW_AFTER = 4 * HOUR;
export const WEEKEND_DURATION = 3 * DAY;

export const computePhase = (edition, now) => {
    if (!edition || !edition.shotgunDate || !edition.weekendDate) return "teaser";

    const shotgun = new Date(edition.shotgunDate).getTime();
    const weekend = new Date(edition.weekendDate).getTime();

    if (now < shotgun - SHOTGUN_WINDOW_BEFORE) return "teaser";
    if (now < shotgun + SHOTGUN_WINDOW_AFTER) return "shotgun";
    if (now < weekend) return "countdown";
    if (now < weekend + WEEKEND_DURATION) return "live";
    return "recap";
};

// The phase can be forced with ?phase=..., to preview it without a backend
export const getPreviewPhase = (search) => {
    const phase = new URLSearchParams(search || "").get("phase");
    return PHASES.includes(phase) ? phase : null;
};

const atHour = (time, hour) => {
    const date = new Date(time);
    date.setHours(hour, 0, 0, 0);
    return date;
};

// Plausible dates around now for a previewed phase, when the real edition doesn't match it
export const getPreviewEdition = (phase, year, now) => {
    const dates = {
        teaser: { shotgun: now + 12 * DAY + 5 * HOUR, weekend: now + 32 * DAY },
        shotgun: { shotgun: now + 37 * 60 * 1000 + 12 * 1000, weekend: now + 20 * DAY },
        countdown: { shotgun: now - 6 * DAY, weekend: now + 18 * DAY + 7 * HOUR },
        live: { shotgun: now - 20 * DAY, weekend: now - DAY },
        recap: { shotgun: now - 40 * DAY, weekend: now - 20 * DAY },
    }[phase];

    return {
        year: year,
        shotgunDate: new Date(dates.shotgun).toISOString(),
        weekendDate: atHour(dates.weekend, 0).toISOString(),
        preview: true,
    };
};

const PARIS = { timeZone: "Europe/Paris" };

export const formatDay = (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
        ...PARIS,
        weekday: "long",
        day: "numeric",
        month: "long",
    });

export const formatShortDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", { ...PARIS, day: "2-digit", month: "2-digit" });

export const formatHour = (date) =>
    new Date(date)
        .toLocaleTimeString("fr-FR", { ...PARIS, hour: "2-digit", minute: "2-digit" })
        .replace(":", "h");

export const getWeekendEnd = (edition) =>
    new Date(new Date(edition.weekendDate).getTime() + 2 * DAY);

export const daysBetween = (from, to) => Math.ceil((to - from) / DAY);
