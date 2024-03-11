import React, { Dispatch, SetStateAction, useState } from 'react';

import { HStack, VStack, Text, Button, Heading } from '@chakra-ui/react';

import { useAuth } from '@/app/hooks/useAuth';

import { Timestamp } from 'firebase/firestore';
import { createFunnel } from '@/database/client/functions/rest';

import { formatDecimal } from '@/utils/format';

import { DEBUG } from '../debug';

import type { Funnel } from '@/types/Funnel';

const Info = (props: { label: string; value: string | number }) => {
  return (
    <HStack w="100%">
      <Text color="#A0AEC0">{props.label}:</Text>

      <Heading color="gray.500" fontSize="xs" textTransform="capitalize">
        {props.value}
      </Heading>
    </HStack>
  );
};

interface ReviewProps {
  funnel: Funnel;
  setFunnel: Dispatch<SetStateAction<Partial<Funnel>>>;
  goToPrevius: () => void;
  goToNext: () => void;
}

export const Review: React.FC<ReviewProps> = ({
  funnel,
  setFunnel,
  goToPrevius,
  goToNext,
}) => {
  const { user } = useAuth();

  console.log({ user });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const duration =
    funnel.shoots.reduce((sum, shoot) => sum + shoot.shootAfter, 0) / 60;

  async function handleCreateFunnel() {
    setIsLoading(true);

    // deploy shoots to storage
    const shoots = funnel.shoots.map((shoot) => ({
      ...shoot,
      media: (shoot.media as string) || null,
    }));

    const data: Funnel = {
      ...funnel,
      uid: user!.id,
      createdAt: Timestamp.now(),
      status: 'active',
      leads: [],
      revenue: 0,
      recovers: 0,
      reaches: 0,
    };

    const id = await createFunnel({
      ...data,
      shoots,
    });

    setFunnel((prev) => ({ ...data, id }));

    setIsLoading(false);

    goToNext();
  }

  return (
    <VStack w="100%" h="100%" p={0} spacing={9}>
      <VStack w="100%" p={6} spacing={4} bgColor="#F8F9FA" rounded="xl">
        <Info label="Nome" value={funnel.name} />
        <Info label="Getaway" value={funnel.getaway} />
        <Info label="Eventos" value={`${funnel.events.length} eventos`} />
        <Info label="Disparos" value={`${funnel.shoots.length} disparos`} />
        <Info
          label="Duração do Funil"
          value={`${formatDecimal(duration)} minutos`}
        />
      </VStack>

      <HStack w="100%" spacing={4}>
        <Button
          w="100%"
          variant="outline"
          fontSize="10px"
          color="primary"
          borderColor="primary"
          onClick={goToPrevius}
        >
          Voltar
        </Button>

        <Button
          variant="secondary"
          fontSize="10px"
          onClick={handleCreateFunnel}
          isLoading={isLoading}
        >
          Criar Funil
        </Button>
      </HStack>
    </VStack>
  );
};
