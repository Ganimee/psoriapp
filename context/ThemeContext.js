import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProviderCustom({ children }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeCustom() {
  return useContext(ThemeContext);
}