import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: "white",
        bg: "white",
      },
    },
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
  colors: {
    purpleColorScheme: {
      500: "#714FD1",
    },
    purple: "#714FD1",
    green: "#53BF80",
    black: "#000000",
    white: "#FFFFFF",
    background: "#F8F9FA",
    text: {
      primary: "#2D3748",
      secondary: "#A0AEC0",
    },
    gray: {
      200: "#E2E8F0",
      500: "#718096",
    },
  },
});
