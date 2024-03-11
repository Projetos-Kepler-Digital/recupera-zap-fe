import React from 'react';

import { Stack, Heading, VStack } from '@chakra-ui/react';

import { Whatsapp } from './components/Whatsapp';
import { Display } from './components/Display';
import { Info } from './components/Info';

export default async function Dashboard() {
  return (
    <VStack w="100%" h="100%" minH="100vh" spacing={0} align="start">
      <VStack
        w="100%"
        h="12rem"
        p={6}
        bgColor="primary"
        rounded="2xl"
        bgImage="/assets/profile-blur.png"
        bgRepeat="no-repeat"
        bgPosition="center"
        bgSize="contain"
        align="start"
      >
        <Heading color="white" fontSize="sm">
          Meu Perfil
        </Heading>
      </VStack>

      <Display />

      <Stack
        w="100%"
        h="100%"
        mt={6}
        spacing={4}
        align="stretch"
        direction={['column', 'column', 'row']}
      >
        <Whatsapp />
        <Info />
      </Stack>
    </VStack>
  );
}
