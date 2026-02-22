import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--color-background))',
        foreground: 'hsl(var(--color-foreground))',
        card: 'hsl(var(--color-card))',
        'card-foreground': 'hsl(var(--color-card-foreground))',
        popover: 'hsl(var(--color-popover))',
        'popover-foreground': 'hsl(var(--color-popover-foreground))',
        primary: 'hsl(var(--color-primary))',
        'primary-foreground': 'hsl(var(--color-primary-foreground))',
        secondary: 'hsl(var(--color-secondary))',
        'secondary-foreground': 'hsl(var(--color-secondary-foreground))',
        muted: 'hsl(var(--color-muted))',
        'muted-foreground': 'hsl(var(--color-muted-foreground))',
        accent: 'hsl(var(--color-accent))',
        'accent-foreground': 'hsl(var(--color-accent-foreground))',
        destructive: 'hsl(var(--color-destructive))',
        'destructive-foreground': 'hsl(var(--color-destructive-foreground))',
        border: 'hsl(var(--color-border))',
        input: 'hsl(var(--color-input))',
        ring: 'hsl(var(--color-ring))',
        success: 'hsl(var(--color-success))',
        'success-foreground': 'hsl(var(--color-success-foreground))',
        warning: 'hsl(var(--color-warning))',
        'warning-foreground': 'hsl(var(--color-warning-foreground))',
        streak: 'hsl(var(--color-streak))',
        glass: 'hsla(var(--color-glass))',
        'sidebar-background': 'hsl(var(--color-sidebar-background))',
        'sidebar-foreground': 'hsl(var(--color-sidebar-foreground))',
        'sidebar-primary': 'hsl(var(--color-sidebar-primary))',
        'sidebar-primary-foreground': 'hsl(var(--color-sidebar-primary-foreground))',
        'sidebar-accent': 'hsl(var(--color-sidebar-accent))',
        'sidebar-accent-foreground': 'hsl(var(--color-sidebar-accent-foreground))',
        'sidebar-border': 'hsl(var(--color-sidebar-border))',
        'sidebar-ring': 'hsl(var(--color-sidebar-ring))',
      },
      borderRadius: {
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        'glow-primary': 'var(--shadow-glow-primary)',
        'glow-success': 'var(--shadow-glow-success)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        mono: 'var(--font-mono)',
      },
    },
  },
  plugins: [],
};

export default config;
