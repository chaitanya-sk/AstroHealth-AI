/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Refined Light Theme Palette (Image 3)
        astro: {
          bg: '#F2F3F1',           // Main outer background
          surface: '#FAFAF7',      // Main dashboard surface
          card: '#FFFFFF',         // Card background
          secondary: '#F5F2E9',    // Secondary surface / pale cream
          text: '#20272D',         // Primary text
          muted: '#78818A',        // Secondary text
          subtle: '#A0A7AF',       // Tertiary muted text
          border: '#E7E9E5',       // Border color
          'border-light': '#F0F2EE',
          accent: '#E9C95A',       // Primary accent yellow
          'accent-light': '#FAF4DF',
          cyan: '#45BFD2',         // Cyan
          'cyan-light': '#EBF8FA',
          teal: '#32A889',         // Teal
          'teal-light': '#EBF6F3',
          warning: '#E7A83C',      // Warning amber
          'warning-light': '#FDF6EB',
          critical: '#D95C5C',     // Critical coral red
          'critical-light': '#FBEEEE',
          charcoal: '#20272D',     // Dark pill active state
        },
        // Cinematic Anatomy Visualization Palette (Image 2)
        anatomy: {
          navy: '#061B35',         // Deep navy container background
          surface: '#0A2548',      // Elevated navy panel
          border: '#153C68',       // Subtle border in anatomy box
          blue: '#087DC0',         // Biomedical blue
          cyan: '#40D7F0',         // Electric cyan glow
          red: '#E75B65',          // Anatomical arterial red
          orange: '#E99B55',       // Anatomical visceral orange
        },
        // Compatibility space colors mapped to light palette
        space: {
          bg: '#F2F3F1',
          sidebar: '#FAFAF7',
          card: '#FFFFFF',
          'card-hover': '#F7F7F4',
          'card-subtle': '#F5F2E9',
          border: '#E7E9E5',
          'border-light': '#F0F2EE',
          'border-accent': '#E9C95A',
          cyan: '#45BFD2',
          'cyan-muted': 'rgba(69, 191, 210, 0.12)',
          teal: '#32A889',
          'teal-muted': 'rgba(50, 168, 137, 0.12)',
          warning: '#E7A83C',
          'warning-muted': 'rgba(231, 168, 60, 0.12)',
          critical: '#D95C5C',
          'critical-muted': 'rgba(217, 92, 92, 0.12)',
          text: '#20272D',
          muted: '#78818A',
          dim: '#A0A7AF',
        }
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'dashboard': '28px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 2px 10px -2px rgba(32, 39, 45, 0.05), 0 1px 3px -1px rgba(32, 39, 45, 0.04)',
        'dashboard': '0 20px 40px -15px rgba(32, 39, 45, 0.06), 0 0 1px 1px rgba(231, 233, 229, 0.6)',
        'float': '0 12px 32px -4px rgba(32, 39, 45, 0.08), 0 4px 12px -2px rgba(32, 39, 45, 0.04)',
        'pill': '0 2px 6px rgba(32, 39, 45, 0.15)',
        'cyan-glow': '0 0 25px rgba(64, 215, 240, 0.35)',
      }
    },
  },
  plugins: [],
}
