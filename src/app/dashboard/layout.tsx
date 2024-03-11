import React from 'react';

import { Stack } from '@chakra-ui/react';

import { Sidebar } from './components/Sidebar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Stack
      w="100%"
      h="100%"
      minH="100vh"
      pl={[6, 6, 64]}
      pr={6}
      pt={12}
      pb={[24, 24, 12]}
      spacing={0}
      align="stretch"
      justify="center"
      bgColor="#F8F9FA"
    >
      <Sidebar />

      {children}
    </Stack>
  );
}
