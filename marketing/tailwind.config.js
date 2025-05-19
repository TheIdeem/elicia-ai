module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg1': '#04030A',
        'bg2': '#0F0D1B',
        'bg3': '#1A1729',
        'bg4': '#252134',
        'w1': '#ECEAF4',
        'w2': '#B4B0C5',
        'w3': '#7C7696',
        'w4': '#443D66',
        'p1': '#653EE8',
        'p2': '#7756E8',
        'p3': '#8A6EE8',
        'batch-bg': 'rgba(236,234,244,0.1)',
        'banner-p': '#0F0D1B',
        'banner-p-border': 'rgba(236,234,244,0.1)',
        'banner-post': 'rgba(236,234,244,0.03)',
        'card-border': '#ECEAF4',
        'link-hover': '#B4A4EF',
        'border': '#ECEAF4'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 1))',
        'main-button-glow': 'radial-gradient(50% 50% at 50% 50%, rgba(101, 62, 232, 0.2) 0%, rgba(101, 62, 232, 0) 100%)',
      },
      boxShadow: {
        'banner-p-shadow': '0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'abc-mono': ['ABC Mono Trial', 'monospace'],
      },
      fontSize: {
        'display': ['72px', '86px'],
        'large-title': ['48px', '58px'],
        'title-1': ['36px', '44px'],
        'title-2': ['24px', '32px'],
        'subtitle': ['18px', '28px'],
        'body': ['16px', '24px'],
        'caption': ['14px', '20px'],
        'caption-cta': ['14px', '14px'],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'accordion-down-custom': 'accordion-down-custom 0.2s ease-out',
        'accordion-up-custom': 'accordion-up-custom 0.2s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'accordion-down-custom': {
          from: { height: 'var(--acc-custom-height)' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up-custom': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 'var(--acc-custom-height)' },
        },
      },
    },
  },
  plugins: [],
}; 