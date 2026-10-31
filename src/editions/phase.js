/*
 * The homepage changes with the moment of the year, computed from the current edition's dates:
 *
 *   teaser ── shotgunDate - 1h ── shotgun ── shotgunDate + 4h ── countdown ── weekendDate
 *          ── live (3 days) ── recap
 *
 * `?phase=<name>` previews a phase with fake dates, so it can be shown without any backend.
 */

export const PHASES = ["teaser", "shotgun", "countdown", "live", "recap"];

export const PHASE_LABELS = {
    teaser: "Avant le shotgun",
    shotgun: "Shotgun",
    countdown: "Avant le weekend",
    live: "Pendant le weekend",
    recap: "Après le weekend",
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const SHOTGUN_OPENS_BEFORE = HOUR;
export const SHOTGUN_CLOSES_AFTER = 4 * HOUR;
export const WEEKEND_DURATION = 3 * DAY;

const toTime = (date) => (date ? new Date(date).getTime() : NaN);

export const getPhase = (edition, now) => {
    const shotgun = toTime(edition && edition.shotgunDate);
    const weekend = toTime(edition && edition.weekendDate);

    if (!isNaN(weekend) && now >= weekend + WEEKEND_DURATION) return "recap";
    if (!isNaN(weekend) && now >= weekend) return "live";
    if (isNaN(shotgun) || now < shotgun - SHOTGUN_OPENS_BEFORE) return "teaser";
    if (now < shotgun + SHOTGUN_CLOSES_AFTER) return "shotgun";
    return "countdown";
};

// Fake dates around now, for the previews
const PREVIEW_DATES = {
    teaser: { shotgun: 12 * DAY + 5 * HOUR + 30 * MINUTE, weekend: 32 * DAY },
    shotgun: { shotgun: 25 * MINUTE, weekend: 20 * DAY },
    countdown: { shotgun: -3 * DAY, weekend: 17 * DAY + 3 * HOUR },
    live: { shotgun: -20 * DAY, weekend: -1 * DAY - 2 * HOUR },
    recap: { shotgun: -40 * DAY, weekend: -10 * DAY },
};

export const getPreviewEdition = (phase, year, now) => ({
    year: year,
    shotgunDate: new Date(now + PREVIEW_DATES[phase].shotgun).toISOString(),
    weekendDate: new Date(now + PREVIEW_DATES[phase].weekend).toISOString(),
    preview: true,
});

export const getPreviewPhase = (search) => {
    const phase = new URLSearchParams(search).get("phase");
    return PHASES.includes(phase) ? phase : null;
};

/* ------------------------------------------------------------------ Time helpers */

export const getTimeLeft = (target, now) => {
    let diff = Math.max(0, Math.floor((target - now) / 1000));
    const days = Math.floor(diff / 86400);
    diff -= days * 86400;
    const hours = Math.floor(diff / 3600);
    diff -= hours * 3600;
    const min = Math.floor(diff / 60);
    return { days, hours, min, sec: diff - min * 60 };
};

export const daysBetween = (from, to) => Math.ceil((to - from) / DAY);

const PARIS = "Europe/Paris";

const format = (date, options) =>
    new Intl.DateTimeFormat("fr-FR", Object.assign({ timeZone: PARIS }, options)).format(
        new Date(date),
    );

// "dimanche 1 juin à 20:00"
export const formatDateTime = (date) =>
    format(date, { weekday: "long", day: "numeric", month: "long" }) +
    " à " +
    format(date, { hour: "2-digit", minute: "2-digit" }).replace(":", "h");

// "du vendredi 20 au dimanche 22 juin 2025"
export const formatWeekend = (weekendDate) => {
    const start = new Date(weekendDate);
    const end = new Date(start.getTime() + 2 * DAY);
    const sameMonth = format(start, { month: "long" }) === format(end, { month: "long" });

    return (
        "du " +
        format(
            start,
            sameMonth
                ? { weekday: "long", day: "numeric" }
                : { weekday: "long", day: "numeric", month: "long" },
        ) +
        " au " +
        format(end, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    );
};

export const formatDay = (date) => format(date, { weekday: "long", day: "numeric", month: "long" });
