export function applyThemePreference() {
  const theme = localStorage.theme;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const shouldUseDark = theme === "dark" || (!theme && prefersDark);

  document.documentElement.classList.toggle("dark", shouldUseDark);
}
