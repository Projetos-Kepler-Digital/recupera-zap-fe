import { extendTheme } from '@chakra-ui/react';

import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export const theme = extendTheme({
  fonts: {
    heading: inter.style.fontFamily,
    body: inter.style.fontFamily,
  },
  colors: {
    primary: '#714FD1',
    primaryColorScheme: {
      500: '#714FD1',
    },
    gray: {
      200: '#E2E8F0', // for borders
      400: '#A0AEC0', // for light text
      500: '#718096', // for light text
      700: '#2D3748', // for bold text
    },
    dark: 'linear-gradient(128.07deg, #2D3358 8.58%, #151928 99.07%);',
    darkColorScheme: {
      500: '#222741',
    },
    grayColorScheme: {
      500: '#E2E8F0',
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: '#101828',
        fontWeight: '700',
        textAlign: 'center',
      },
    },
    Text: {
      baseStyle: {
        color: '#A0AEC0',
        lineHeight: '12px',
        fontSize: 'xs',
        fontWeight: '400',
        textAlign: 'center',
      },
    },
    Button: {
      baseStyle: {
        w: '100%',
        color: 'white',
        fontWeight: '700',
        textTransform: 'uppercase',
        rounded: 'xl',
        _hover: {
          opacity: 0.75,
          textDecoration: 'none',
        },
        _active: {
          opacity: 0.5,
          textDecoration: 'none',
        },
      },
      variants: {
        primary: {
          bgColor: '#714FD1',
        },
        secondary: {
          bg: 'dark',
        },
      },
    },
  },
});
