(() => {
  const THEME_KEY = "auroraflow-theme";

  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", savedTheme);
      return;
    }
  } catch (_error) {}

  const prefersDark = !window.matchMedia("(prefers-color-scheme: light)").matches;
  document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
})();
