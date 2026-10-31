// Applies the theme the user chose (src/utils/theme.js) before the first paint
try {
    var theme = window.localStorage.getItem("theme");
    if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch (error) {}
