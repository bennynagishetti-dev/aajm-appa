import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppThemeConfig, ThemePreset } from '../types';

export interface ThemeColors {
  primaryColor: string;
  primaryDark: string;
  primaryLight: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  iconColor: string;
  borderColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
}

const THEME_PALETTES: Record<ThemePreset, { light: ThemeColors; dark: ThemeColors }> = {
  blue: {
    light: {
      primaryColor: '#1d4ed8', // blue-700
      primaryDark: '#1e40af', // blue-800
      primaryLight: '#dbeafe', // blue-100
      secondaryColor: '#0ea5e9', // sky-500
      backgroundColor: '#f8fafc',
      surfaceColor: '#ffffff',
      textColor: '#0f172a',
      mutedTextColor: '#64748b',
      iconColor: '#2563eb',
      borderColor: '#e2e8f0',
      successColor: '#16a34a',
      warningColor: '#ea580c',
      errorColor: '#dc2626',
    },
    dark: {
      primaryColor: '#3b82f6',
      primaryDark: '#1d4ed8',
      primaryLight: '#1e293b',
      secondaryColor: '#38bdf8',
      backgroundColor: '#090d16',
      surfaceColor: '#131b2e',
      textColor: '#f8fafc',
      mutedTextColor: '#94a3b8',
      iconColor: '#60a5fa',
      borderColor: '#1e293b',
      successColor: '#22c55e',
      warningColor: '#f97316',
      errorColor: '#ef4444',
    },
  },
  red: {
    light: {
      primaryColor: '#b91c1c', // red-700
      primaryDark: '#991b1b', // red-800
      primaryLight: '#fee2e2', // red-100
      secondaryColor: '#f43f5e',
      backgroundColor: '#faf8f8',
      surfaceColor: '#ffffff',
      textColor: '#1c1917',
      mutedTextColor: '#78716c',
      iconColor: '#dc2626',
      borderColor: '#f0e2e2',
      successColor: '#16a34a',
      warningColor: '#ea580c',
      errorColor: '#dc2626',
    },
    dark: {
      primaryColor: '#ef4444',
      primaryDark: '#b91c1c',
      primaryLight: '#2c1517',
      secondaryColor: '#fb7185',
      backgroundColor: '#110a0b',
      surfaceColor: '#201214',
      textColor: '#fafafa',
      mutedTextColor: '#a8a29e',
      iconColor: '#f87171',
      borderColor: '#371c20',
      successColor: '#22c55e',
      warningColor: '#f97316',
      errorColor: '#ef4444',
    },
  },
  green: {
    light: {
      primaryColor: '#15803d', // green-700
      primaryDark: '#166534', // green-800
      primaryLight: '#dcfce7', // green-100
      secondaryColor: '#10b981',
      backgroundColor: '#f8faf8',
      surfaceColor: '#ffffff',
      textColor: '#0f172a',
      mutedTextColor: '#64748b',
      iconColor: '#16a34a',
      borderColor: '#e2f0e4',
      successColor: '#16a34a',
      warningColor: '#ea580c',
      errorColor: '#dc2626',
    },
    dark: {
      primaryColor: '#22c55e',
      primaryDark: '#15803d',
      primaryLight: '#14271a',
      secondaryColor: '#34d399',
      backgroundColor: '#0a120c',
      surfaceColor: '#122016',
      textColor: '#f8fafc',
      mutedTextColor: '#94a3b8',
      iconColor: '#4ade80',
      borderColor: '#1d3324',
      successColor: '#22c55e',
      warningColor: '#f97316',
      errorColor: '#ef4444',
    },
  },
  purple: {
    light: {
      primaryColor: '#7e22ce', // purple-700
      primaryDark: '#6b21a8', // purple-800
      primaryLight: '#f3e8ff', // purple-100
      secondaryColor: '#a855f7',
      backgroundColor: '#faf8fd',
      surfaceColor: '#ffffff',
      textColor: '#0f172a',
      mutedTextColor: '#64748b',
      iconColor: '#9333ea',
      borderColor: '#ede4f5',
      successColor: '#16a34a',
      warningColor: '#ea580c',
      errorColor: '#dc2626',
    },
    dark: {
      primaryColor: '#a855f7',
      primaryDark: '#7e22ce',
      primaryLight: '#261438',
      secondaryColor: '#c084fc',
      backgroundColor: '#0f0917',
      surfaceColor: '#1e112d',
      textColor: '#f8fafc',
      mutedTextColor: '#94a3b8',
      iconColor: '#c084fc',
      borderColor: '#2e1946',
      successColor: '#22c55e',
      warningColor: '#f97316',
      errorColor: '#ef4444',
    },
  },
  orange: {
    light: {
      primaryColor: '#c2410c', // orange-700
      primaryDark: '#9a3412', // orange-800
      primaryLight: '#ffedd5', // orange-100
      secondaryColor: '#f97316',
      backgroundColor: '#fefaf6',
      surfaceColor: '#ffffff',
      textColor: '#1c1917',
      mutedTextColor: '#78716c',
      iconColor: '#ea580c',
      borderColor: '#f5e7da',
      successColor: '#16a34a',
      warningColor: '#ea580c',
      errorColor: '#dc2626',
    },
    dark: {
      primaryColor: '#f97316',
      primaryDark: '#c2410c',
      primaryLight: '#30180d',
      secondaryColor: '#fb923c',
      backgroundColor: '#140c06',
      surfaceColor: '#26170e',
      textColor: '#fafafa',
      mutedTextColor: '#a8a29e',
      iconColor: '#fb923c',
      borderColor: '#3c2317',
      successColor: '#22c55e',
      warningColor: '#f97316',
      errorColor: '#ef4444',
    },
  },
  teal: {
    light: {
      primaryColor: '#0f766e', // teal-700
      primaryDark: '#115e59', // teal-800
      primaryLight: '#ccfbf1', // teal-100
      secondaryColor: '#14b8a6',
      backgroundColor: '#f6faf9',
      surfaceColor: '#ffffff',
      textColor: '#0f172a',
      mutedTextColor: '#64748b',
      iconColor: '#0d9488',
      borderColor: '#dff1ee',
      successColor: '#16a34a',
      warningColor: '#ea580c',
      errorColor: '#dc2626',
    },
    dark: {
      primaryColor: '#14b8a6',
      primaryDark: '#0f766e',
      primaryLight: '#112926',
      secondaryColor: '#2dd4bf',
      backgroundColor: '#071312',
      surfaceColor: '#0e2422',
      textColor: '#f8fafc',
      mutedTextColor: '#94a3b8',
      iconColor: '#2dd4bf',
      borderColor: '#193a37',
      successColor: '#22c55e',
      warningColor: '#f97316',
      errorColor: '#ef4444',
    },
  },
  custom: {
    light: {
      primaryColor: '#1d4ed8',
      primaryDark: '#1e40af',
      primaryLight: '#dbeafe',
      secondaryColor: '#0ea5e9',
      backgroundColor: '#f8fafc',
      surfaceColor: '#ffffff',
      textColor: '#0f172a',
      mutedTextColor: '#64748b',
      iconColor: '#2563eb',
      borderColor: '#e2e8f0',
      successColor: '#16a34a',
      warningColor: '#ea580c',
      errorColor: '#dc2626',
    },
    dark: {
      primaryColor: '#3b82f6',
      primaryDark: '#1d4ed8',
      primaryLight: '#1e293b',
      secondaryColor: '#38bdf8',
      backgroundColor: '#090d16',
      surfaceColor: '#131b2e',
      textColor: '#f8fafc',
      mutedTextColor: '#94a3b8',
      iconColor: '#60a5fa',
      borderColor: '#1e293b',
      successColor: '#22c55e',
      warningColor: '#f97316',
      errorColor: '#ef4444',
    },
  },
};

interface ThemeContextType {
  config: AppThemeConfig;
  colors: ThemeColors;
  setPreset: (preset: ThemePreset) => void;
  setCustomColor: (color: string) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('aajm_app_theme');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      preset: 'blue',
      mode: 'light',
    };
  });

  const [systemIsDark, setSystemIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isDark = config.mode === 'dark' || (config.mode === 'system' && systemIsDark);

  // Compute active colors
  const palette = THEME_PALETTES[config.preset] || THEME_PALETTES.blue;
  const baseColors = isDark ? palette.dark : palette.light;
  
  const colors: ThemeColors = {
    ...baseColors,
    ...(config.preset === 'custom' && config.customColor
      ? {
          primaryColor: config.customColor,
          primaryDark: config.customColor,
          iconColor: config.customColor,
        }
      : {}),
  };

  // Inject CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primaryColor);
    root.style.setProperty('--color-primary-dark', colors.primaryDark);
    root.style.setProperty('--color-primary-light', colors.primaryLight);
    root.style.setProperty('--color-secondary', colors.secondaryColor);
    root.style.setProperty('--color-bg', colors.backgroundColor);
    root.style.setProperty('--color-surface', colors.surfaceColor);
    root.style.setProperty('--color-text', colors.textColor);
    root.style.setProperty('--color-muted', colors.mutedTextColor);
    root.style.setProperty('--color-icon', colors.iconColor);
    root.style.setProperty('--color-border', colors.borderColor);
    root.style.setProperty('--color-success', colors.successColor);
    root.style.setProperty('--color-warning', colors.warningColor);
    root.style.setProperty('--color-error', colors.errorColor);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('aajm_app_theme', JSON.stringify(config));
    } catch {}
  }, [config, colors, isDark]);

  const setPreset = (preset: ThemePreset) => {
    setConfig((prev) => ({ ...prev, preset }));
  };

  const setCustomColor = (customColor: string) => {
    setConfig((prev) => ({ ...prev, preset: 'custom', customColor }));
  };

  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    setConfig((prev) => ({ ...prev, mode }));
  };

  return (
    <ThemeContext.Provider
      value={{
        config,
        colors,
        setPreset,
        setCustomColor,
        setThemeMode,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return context;
};
