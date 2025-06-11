module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
        keyframes: {
            'fade-in-out': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '10%': { opacity: 1, transform: 'translateY(0)' },
            '90%': { opacity: 1 },
            '100%': { opacity: 0, transform: 'translateY(20px)' },
            },
            'progress-bar': {
            '0%': { width: '100%' },
            '100%': { width: '0%' },
            },
        },
        animation: {
            'fade-in-out': 'fade-in-out 3s ease-out forwards',
            'progress-bar': 'progress-bar 3s linear forwards',
        },
        },
    },
    plugins: [],
};