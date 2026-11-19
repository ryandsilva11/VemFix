import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7f1',
      100: '#c1ecdc',
      200: '#96e0c4',
      300: '#6ad4ab',
      400: '#2dbe87',
      500: '#1a9e6e', // Cor principal do VemFix
      600: '#138055', // Hover
      700: '#0e613f',
      800: '#094229',
      900: '#042313',
    },
    vemfix: {
      green: '#1a9e6e',
      greenDark: '#138055',
      greenLight: '#e6f7f1',
      greenMid: '#2dbe87',
      pageBg: '#f7f8fa',
      cardBg: '#ffffff',
      border: '#eff1f5',
      grayBorder: '#dde1e9',
      graySubtitle: '#8a93a6',
      grayBody: '#4a5568',
      dark: '#1a202c',
      star: '#f59e0b',
      heart: '#ef4444',
      heartLight: '#fee2e2',
    },
  },
  fonts: {
    heading: `'Sora', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: '#f7f8fa',
        color: '#1a202c',
        fontFamily: `'Inter', sans-serif`,
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: `'Sora', sans-serif`,
        fontWeight: '600',
        borderRadius: '8px',
      },
    },
  },
});

export default theme;
