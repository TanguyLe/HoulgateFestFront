// Light or dark theme. Follows the system unless the user chose one, kept in localStorage and set
// as data-theme on <html> (web/static/theme.js applies it before the page is painted).
const STORAGE_KEY = "theme";
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

export const isDark = () => {
    const chosen = document.documentElement.dataset.theme;
    return chosen ? chosen === "dark" : darkQuery.matches;
};

// The browser UI (address bar on phones) takes the colour of the top app bar
export const updateThemeColor = () => {
    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--md-sys-color-surface")
        .trim();
    if (meta && color) meta.setAttribute("content", color);
};

export const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    try {
        window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // private browsing: the choice lasts until the page is closed
    }
    updateThemeColor();
};

export const onSystemThemeChange = (fct) => {
    darkQuery.addEventListener("change", fct);
    return () => darkQuery.removeEventListener("change", fct);
};
