import type { AppProps } from "next/app";

import { AuthProvider } from "@/auth/AuthProvider";

import { ChakraBaseProvider } from "@chakra-ui/react";
import { theme } from "@/styles/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraBaseProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraBaseProvider>
    </AuthProvider>
  );
}
