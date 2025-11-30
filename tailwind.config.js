/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                // New Palette from user image
                primary: {
                    DEFAULT: '#24305E', // Navy
                    light: '#374785',
                    dark: '#1a2240',
                },
                secondary: {
                    DEFAULT: '#5B9AA0', // Teal
                    light: '#7dbcc2',
                    dark: '#407075',
                },
                accent: {
                    DEFAULT: '#D67B77', // Salmon/Red
                    light: '#e89b98',
                    dark: '#b55b57',
                },
                background: {
                    DEFAULT: '#C6D8C8', // Sage
                    light: '#e3ebe4',
                    dark: '#a8bfa9',
                },
                surface: {
                    DEFAULT: '#EBC0B7', // Peach
                    light: '#f5dcd7',
                    dark: '#dca095',
                },
                // Keep dark mode colors for compatibility but adjusted to match navy
                dark: {
                    DEFAULT: '#24305E', // Navy as main dark bg
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in',
                'slide-up': 'slideUp 0.4s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(251, 191, 36, 0.5)',
                'glow-lg': '0 0 40px rgba(251, 191, 36, 0.6)',
            },
        },
    },
    plugins: [],
}
