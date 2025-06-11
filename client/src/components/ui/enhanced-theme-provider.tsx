import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'auto' | 'supreme' | 'quantum';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function EnhancedThemeProvider({
  children,
  defaultTheme = 'supreme',
  storageKey = 'maquina-milionaria-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'supreme', 'quantum');
    
    let resolvedTheme: 'dark' | 'light' = 'dark';
    
    if (theme === 'auto') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else if (theme === 'supreme' || theme === 'quantum') {
      resolvedTheme = 'dark'; // Supreme and quantum themes are dark-based
      root.classList.add(theme);
    } else {
      resolvedTheme = theme;
    }
    
    root.classList.add(resolvedTheme);
    setEffectiveTheme(resolvedTheme);
    
    // Apply dynamic theme variables
    if (theme === 'supreme') {
      root.style.setProperty('--primary', '25 100% 65%'); // Orange
      root.style.setProperty('--primary-foreground', '0 0% 0%');
      root.style.setProperty('--background', '240 10% 3.9%');
      root.style.setProperty('--foreground', '0 0% 98%');
      root.style.setProperty('--accent', '25 100% 65%');
      root.style.setProperty('--accent-foreground', '0 0% 0%');
    } else if (theme === 'quantum') {
      root.style.setProperty('--primary', '270 95% 75%'); // Purple
      root.style.setProperty('--primary-foreground', '0 0% 0%');
      root.style.setProperty('--background', '240 10% 3.9%');
      root.style.setProperty('--foreground', '0 0% 98%');
      root.style.setProperty('--accent', '270 95% 75%');
      root.style.setProperty('--accent-foreground', '0 0% 0%');
    }
    
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme,
    effectiveTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};