'use client';

import React from 'react';

import { Avatar, VStack, Heading, Text, Stack } from '@chakra-ui/react';

import { useAuth } from '@/app/hooks/useAuth';

export const Display: React.FC = () => {
  const { user } = useAuth();

  return (
    <Stack
      direction={['column', 'column', 'row']}
      w="calc(100% - 2rem)"
      mt={-16}
      p={4}
      spacing={5}
      rounded="2xl"
      alignSelf="center"
      bgColor="rgba(255, 255, 255, 0.85)"
      backdropFilter="blur(8px)"
      align="center"
    >
      <Avatar
        name={user?.name || user?.email}
        color="white"
        boxSize="80px"
        rounded="xl"
        bgColor="primary"
      />

      <VStack spacing={0} align="start">
        <Heading fontSize="18">{user?.name || 'Recupera Zap'}</Heading>
        <Text color="gray.500">{user?.email}</Text>
      </VStack>
    </Stack>
  );
};
