'use client';

import React from 'react';

import {
  HStack,
  Heading,
  VStack,
  Text,
  Tag,
  TagLabel,
  Divider,
} from '@chakra-ui/react';

import { useAuth } from '@/app/hooks/useAuth';

import { isBefore, format } from 'date-fns';

interface DatumProps {
  title: string;
  children: React.ReactNode;
}

const Datum: React.FC<DatumProps> = ({ title, children }) => {
  return (
    <Text color="gray.500" fontSize="xs" fontWeight="600">
      {title}:{' '}
      <Text as="span" color="#718096" fontWeight="400">
        {children}
      </Text>
    </Text>
  );
};

export const Info: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <VStack
        w="100%"
        maxW="20rem"
        flex={1}
        p={6}
        spacing={4}
        rounded="2xl"
        align="start"
        bgColor="white"
      />
    );
  }

  const isUpToDate = isBefore(new Date(), user.licensedUntil.toDate());

  return (
    <VStack
      w="100%"
      maxW="20rem"
      flex={1}
      p={6}
      spacing={4}
      rounded="2xl"
      align="start"
      bgColor="white"
    >
      <Heading fontSize="lg">Dados da conta</Heading>

      <VStack w="100%" spacing={5} align="start">
        <HStack spacing={2} align="center" justify="center">
          <Text color="gray.500" fontSize="xs" fontWeight="600">
            Status:
          </Text>

          <Tag
            as="span"
            size="sm"
            bgColor={isUpToDate ? '#53BF80' : 'red.500'}
            rounded="4px"
          >
            <TagLabel
              color="white"
              fontSize="8px"
              fontWeight="700"
              textTransform="uppercase"
            >
              {isUpToDate ? 'Ativo' : 'Inativo'}
            </TagLabel>
          </Tag>
        </HStack>

        <Datum title="Vencimento">
          {format(user.licensedUntil.toDate(), 'dd/MM/yyyy')}
        </Datum>

        <Divider w="100%" bgColor="#E0E1E2" my={1.5} />

        <VStack spacing={5} align="start">
          <Datum title="Nome">{user.name}</Datum>
          <Datum title="Email">{user.email}</Datum>
        </VStack>
      </VStack>
    </VStack>
  );
};
