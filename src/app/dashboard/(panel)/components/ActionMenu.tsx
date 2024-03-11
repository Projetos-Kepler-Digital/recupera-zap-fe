'use client';

import React, { useState } from 'react';

import { Button, HStack, useDisclosure } from '@chakra-ui/react';

import { CreateFunnelModal } from '../../(create-funnel)/CreateFunnelModal';

import {
  createFunnel,
  deleteFunnel,
  updateFunnel,
} from '@/database/client/functions/rest';

import type { Funnel } from '@/types/Funnel';
import { Timestamp } from 'firebase/firestore';

interface ActionButtonProps {
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleClick() {
    setIsLoading(true);
    await onClick();
    setIsLoading(false);
  }

  return (
    <Button
      w="fit-content"
      onClick={handleClick}
      isLoading={isLoading}
      p={0}
      bgColor="transparent"
      color="gray.500"
      fontSize="xs"
      fontWeight="700"
      textTransform="none"
      _hover={{ bgColor: 'transparent', opacity: 0.75 }}
      _active={{ bgColor: 'transparent', opacity: 0.5 }}
    >
      {children}
    </Button>
  );
};

interface ActionMenuProps {
  funnel: Funnel;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ funnel }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { id, createdAt, ...data } = funnel;

  const isActive = funnel.status === 'active';

  return (
    <>
      <HStack spacing={4}>
        <ActionButton onClick={onOpen}>Exibir</ActionButton>

        <ActionButton
          onClick={async () => {
            await deleteFunnel(funnel.id);
          }}
        >
          Excluir
        </ActionButton>

        <ActionButton
          onClick={async () => {
            await createFunnel({ createdAt: Timestamp.now(), ...data });
          }}
        >
          Duplicar
        </ActionButton>

        <ActionButton
          onClick={async () => {
            await updateFunnel(funnel.id, {
              status: isActive ? 'suspended' : 'active',
            });
          }}
        >
          {isActive ? 'Suspender' : 'Ativar'}
        </ActionButton>
      </HStack>

      <CreateFunnelModal
        isOpen={isOpen}
        onClose={onClose}
        initialFunnel={funnel}
        index={3}
      />
    </>
  );
};
