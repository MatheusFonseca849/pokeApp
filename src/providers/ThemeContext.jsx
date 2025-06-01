import React, { createContext, useState, useMemo } from "react";
import { lightTheme, darkTheme } from "../themes/themes"; // your current theme.js

const darkColors = darkTheme;

const lightColors = lightTheme;

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const currentTheme = useMemo(
    () => (isDarkMode ? darkColors : lightColors),
    [isDarkMode]
  );

  return (
    <ThemeContext.Provider
      value={{ theme: currentTheme, isDarkMode, toggleTheme }}
    >
      {children(currentTheme)}
    </ThemeContext.Provider>
  );
};
