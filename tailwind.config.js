module.exports = {
  content: ['./*.html', 'src/**/*.{ts,tsx}'],
  prefix: 'ts-',
  theme: {
    extend: {
      keyframes: {
        spinner: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        spinner: 'spinner linear 1s infinite',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        code: ['Monaco', 'monospace', 'sans-serif'],
      },
      fontSize: {
        xxs: ['10px', '13px'],
        xs: ['12px', '16px'],
        sm: ['14px', '18px'],
        base: ['16px', '20px'],
        md: ['18px', '22px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
      },
      spacing: {
        0: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        14: '56px',
        16: '64px',
        18: '72px',
        20: '80px',
        28: '112px',
        30: '120px',
        40: '160px',
        50: '200px',
        60: '240px',
        70: '280px',
        80: '320px',
        90: '360px',
        100: '400px',
      },
      borderRadius: {
        none: '0',
        DEFAULT: '4px',
        full: '9999px',
        large: '12px',
      },
      textColor: {
        primary: '#005aa0',
        secondary: '#808080',
        error: '#d63339',
        default: '#000a12',
        light: '#ffffff',
        durkLabel: '#1a1a1a',
        code: '#000611',
      },
      colors: {
        yellow: {
          500: '#ffdc0f',
        },
        green: {
          300: '#edf8ef',
          500: '#4db85f',
          600: '#249132',
        },
        blue: {
          durk: '#2a5db0',
          100: '#e6f8fb',
          400: '#16a1cf',
          500: '#1c8dc6',
          600: '#2277bc',
          700: '#005aa0',
          800: '#004c87',
        },
        red: {
          300: '#fbebeb',
          400: '#ee393f',
          500: '#d63339',
          600: '#bc1417',
          700: '#b82c31',
          800: '#9e262a',
          900: '#d6353b',
        },
        backgroundCard: '#f5f9fa',
        backgroundError: '#ffe3e4',
        gray: {
          100: '#cccccc',
          200: '#808080',
          300: '#f4f2f0',
          light: {
            100: '#f6f5f6',
            200: '#e8e8e8',
            300: '#f0f0f0',
            400: '#e5e5e5',
            500: '#f5f5f5',
          },
          divider: '#d3d3d5',
          500: '#b2b2b2',
          600: '#d4d4d4',
          700: '#666666',
        },
      },
      left: {
        tooltipRight: '120%',
      },
      borderWidth: {
        3: '3px',
      },
      width: {
        backgroundCard: '1185px',
        formLogin: '264px',
        chanelSelected: '245px',
        statusSelected: '287px',
        placementSelect: '185px',
        tooltip: '281px',
        infobox: '510px',
        switch: '38px',
        th1: '37%',
        th2: '13%',
        th3: '17%',
        th4: '26%',
        th5: '7%',
      },
      inset: {
        positionToolTip: '270px', // width.formLogin+6px
      },
      height: {
        switch: '14px',
        infobox: '104px',
      },
      translate: {
        switch: '18px',
      },
      maxWidth: {
        backgroundCard: '1185px',
        tooltip: '281px',
      },
      minWidth: {
        40: '160px',
      },
      boxShadow: {
        input: 'inset 0px 1px 3px 0px rgba(0, 0, 0, 0.3)',
        button: 'inset 0px 1px 1px 0px rgb(255, 255, 255)',
        switch: '0px 1px 1px 0px rgba(0, 0, 0, 0.15)',
        md: '0px 2px 6px rgba(0, 0, 0, 0.14), 0px 1px 2px rgba(0, 0, 0, 0.08), 0px 0px 1px rgba(0, 0, 0, 0.06), 0px 0px 0px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
