import { useEffect, useState } from "react";
import { getItem } from "../storage";
export const useDarkMode = () => {
  const [theme, setTheme] = useState("light");
  const [mountedComponent, setMountedComponent] = useState(false);
  const setMode = (mode: any) => {
    // saveItem("theme", mode);
    // setTheme(mode);
  };

  const themeToggler = () => {
    theme === "light" ? setMode("dark") : setMode("light");
  };

  useEffect(() => {
    const localTheme = getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (localTheme) {
      setTheme(localTheme);
    } else if (prefersDark) {
      setMode("dark");
    } else {
      setMode("light");
    }
    setMountedComponent(true);
  }, []);

  return { theme, themeToggler, mountedComponent };
};
