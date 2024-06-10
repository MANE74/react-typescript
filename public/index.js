// For changing favicon type based on browser color mode
const faviconTag = document.getElementById("faviconTag");
const isDark = window.matchMedia("(prefers-color-scheme: dark)");
const changeFavicon = () => {
  if (isDark.matches) faviconTag.href = "/favicon_light.ico";
  else faviconTag.href = "/favicon_dark.ico";
}
isDark.addEventListener("change", changeFavicon);
setTimeout(changeFavicon, 100);
