import { useState, useEffect } from "react";

export const useIsDarkModeActive = () => {
  const [isDarkModeActive, setIsDarkModeActive] = useState<boolean>(false);

  useEffect(() => {
    const isDarkModeActive = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkModeActive(isDarkModeActive);
  }, []);

  return isDarkModeActive;
}