// Example minimal tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // make sure this matches your source files location
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const utilities = {
        '.bg-background': { backgroundColor: 'var(--color-background)' },
        '.text-foreground': { color: 'var(--color-foreground)' },
        '.bg-card': { backgroundColor: 'var(--color-card)' },
        '.text-card-foreground': { color: 'var(--color-card-foreground)' },
        '.bg-popover': { backgroundColor: 'var(--color-popover)' },
        '.text-popover-foreground': { color: 'var(--color-popover-foreground)' },
        '.bg-primary': { backgroundColor: 'var(--color-primary)' },
        '.text-primary-foreground': { color: 'var(--color-primary-foreground)' },
        '.bg-secondary': { backgroundColor: 'var(--color-secondary)' },
        '.text-secondary-foreground': { color: 'var(--color-secondary-foreground)' },
        '.bg-muted': { backgroundColor: 'var(--color-muted)' },
        '.text-muted-foreground': { color: 'var(--color-muted-foreground)' },
        '.bg-accent': { backgroundColor: 'var(--color-accent)' },
        '.text-accent-foreground': { color: 'var(--color-accent-foreground)' },
        '.bg-destructive': { backgroundColor: 'var(--color-destructive)' },
        '.text-destructive-foreground': { color: 'var(--color-destructive-foreground)' },
      }
      addUtilities(utilities, ['responsive', 'hover'])
    }
  ],
}
