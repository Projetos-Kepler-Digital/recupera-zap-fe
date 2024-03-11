'use client';

import React from 'react';

import { usePathname } from 'next/navigation';

import { Link } from '@chakra-ui/next-js';

import {
  VStack,
  Divider,
  HStack,
  Image,
  Heading,
  Circle,
  Text,
  Button,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';

import { Icon, IconName } from '@/components/Icon';

import { useAuth } from '@/app/hooks/useAuth';

import { CreateFunnelModal } from '../(create-funnel)/CreateFunnelModal';
import { MultiShotModal } from '../(multi-shot)/MultiShotModal';

interface NavButtonProps {
  href: string;
  icon: IconName;
  isButton?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({
  href,
  icon,
  isButton = false,
  onClick,
  children,
}) => {
  const pathname = usePathname();

  const isActive = !isButton && pathname === href;

  return (
    <HStack
      as={!isButton ? Link : undefined}
      href={!isButton ? href : undefined}
      cursor="pointer"
      w={['min', 'min', '100%']}
      h="min"
      px={isActive ? 2 : [0, 0, 2]}
      py={isActive ? 3 : 0}
      spacing={3}
      bgColor={isActive ? 'white' : 'transparent'}
      // border="solid 1px black"
      rounded="2xl"
      onClick={onClick}
      _hover={{ opacity: 0.75, textDecoration: 'none' }}
      _active={{ opacity: 0.5, textDecoration: 'none' }}
      transition="0.2s"
      {...(isActive && { my: [0, 0, -3], _first: { mt: 0 }, _last: { mb: 0 } })}
    >
      <Circle p={2} bg={isActive ? 'dark' : 'white'} rounded="xl">
        <Icon name={icon} color={isActive ? 'white' : 'primary'} />
      </Circle>

      <Heading
        color="gray.700"
        fontSize="xs"
        display={['none', 'none', 'flex']}
      >
        {children}
      </Heading>
    </HStack>
  );
};

export const Sidebar: React.FC = () => {
  const { signOut } = useAuth();

  const {
    isOpen: createFunnelModalIsOpen,
    onOpen: createFunnelModalOnOpen,
    onClose: createFunnelModalOnClose,
  } = useDisclosure();

  const {
    isOpen: multiShotModalIsOpen,
    onOpen: multiShotModalOnOpen,
    onClose: multiShotModalOnClose,
  } = useDisclosure();

  return (
    <>
      <Stack
        as="aside"
        pos="fixed"
        zIndex={1}
        left="0"
        bottom="0"
        w={['100%', '100%', 'min']}
        minW={60}
        h={['min', 'min', '100%']}
        py={[2, 2, 12]}
        px={6}
        spacing={6}
        align="center"
        bgColor="#F8F9FA"
        justify="space-around"
        direction={['row', 'row', 'column']}
      >
        <Image
          alt="Recupera Zap"
          src="/images/logo.png"
          display={['none', 'none', 'flex']}
        />

        <Divider
          w="100%"
          bgColor="#E0E1E2"
          display={['none', 'none', 'flex']}
        />

        <NavButton href="/dashboard" icon="home">
          Painel Principal
        </NavButton>

        <NavButton
          href="/dashboard"
          icon="add"
          isButton
          onClick={createFunnelModalOnOpen}
        >
          Criar funil
        </NavButton>

        <NavButton
          href="/dasbhoard"
          icon="whatsapp"
          isButton
          onClick={multiShotModalOnOpen}
        >
          Disparo Múltiplo
        </NavButton>

        <NavButton href="/dashboard/perfil" icon="person">
          Meu Perfil
        </NavButton>

        <NavButton href="/dashboard" icon="add" isButton onClick={signOut}>
          Sair
        </NavButton>

        <VStack
          w="100%"
          mt={5}
          p={4}
          pb={6}
          spacing={5}
          align="start"
          bgColor="primary"
          rounded="2xl"
          bgImage="/assets/question-button-blur.png"
          bgRepeat="no-repeat"
          bgPosition="center"
          bgSize="cover"
          display={['none', 'none', 'flex']}
        >
          <Circle p={2} bgColor="white" rounded="xl">
            <Icon name="question" />
          </Circle>

          <Text mt={0.5} mb={-0.5} color="white" fontSize="sm">
            Precisa de ajuda?
          </Text>

          <Button
            as={Link}
            href="https://www.youtube.com"
            h="2.25rem"
            color="gray.700"
            fontSize="10px"
          >
            Fale Conosco
          </Button>
        </VStack>
      </Stack>

      <CreateFunnelModal
        isOpen={createFunnelModalIsOpen}
        onClose={createFunnelModalOnClose}
      />

      <MultiShotModal
        isOpen={multiShotModalIsOpen}
        onClose={multiShotModalOnClose}
      />
    </>
  );
};
