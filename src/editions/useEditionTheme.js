import { useLocation } from "react-router-dom";

import { getTheme, LATEST_THEMED_YEAR } from "./themes";
import { PHASES, computePhase, previewEdition, useCurrentEdition, useNow } from "./phase";

// Previews count down from the page load, not from each re-render
const PREVIEW_BASE = Date.now();

/*
 * The current edition, its theme and its phase, with preview overrides from the URL:
 *   ?phase=teaser|shotgun|countdown|live|recap  forces the phase (with fake dates around now)
 *   ?theme=2024                                  shows another edition's poster
 * Without an edition (logged out, none this year, API down) it falls back on a teaser of the
 * latest themed edition: the page is never blank.
 */
export const useEditionTheme = () => {
    const { search } = useLocation();
    const { status, edition: fetched } = useCurrentEdition();
    const now = useNow();

    const params = new URLSearchParams(search);
    const forcedPhase = PHASES.includes(params.get("phase")) ? params.get("phase") : null;
    const forcedYear = /^\d{4}$/.test(params.get("theme") || "")
        ? Number(params.get("theme"))
        : null;

    const year = forcedYear || (fetched && fetched.year) || LATEST_THEMED_YEAR;
    const theme = getTheme(year);

    let edition = fetched;
    if (forcedPhase) edition = previewEdition(forcedPhase, year, PREVIEW_BASE);
    else if (forcedYear && fetched && fetched.year !== forcedYear) edition = null;

    const phase = forcedPhase || computePhase(edition, now);

    return {
        status: forcedPhase ? "ready" : status,
        edition,
        theme,
        phase,
        now,
        isPreview: !!(forcedPhase || forcedYear),
    };
};

export default useEditionTheme;
