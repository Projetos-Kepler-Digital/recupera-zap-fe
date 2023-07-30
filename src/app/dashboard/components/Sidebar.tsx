import React from "react";

import NextLink from "next/link";

import {
  HStack,
  VStack,
  Image,
  Heading,
  Divider,
  Link,
  Box,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { CreateFunnelModal } from "../create-funnel/CreateFunnelModal";
import { MultiShotModal } from "../multishot/MultiShotModal";

interface NavLinkProps {
  isActive?: boolean;
  href: string;
  iconSrc: string;
  activeIconSrc: string;
  children: React.ReactNode;
}

const NavLink = ({
  href,
  iconSrc,
  activeIconSrc,
  isActive,
  children,
}: NavLinkProps) => {
  return (
    <Link
      as={NextLink}
      href={href}
      w="100%"
      mb={isActive ? -3 : 0}
      _hover={{ opacity: 0.7 }}
    >
      <HStack
        w="100%"
        spacing={3}
        bgColor={isActive ? "white" : "transparent"}
        px={4}
        py={isActive ? 3 : 0}
        borderRadius="2xl"
        justify={["center", "center", "start", "start"]}
      >
        <HStack spacing={3}>
          <Box
            p={2}
            borderRadius="xl"
            bgColor="white"
            bg={
              isActive
                ? "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                : undefined
            }
          >
            <Image alt="" src={isActive ? activeIconSrc : iconSrc} />
          </Box>
        </HStack>

        <Text
          color={isActive ? "text.primary" : "text.secondary"}
          fontWeight="700"
          fontSize="xs"
          display={["none", "none", "flex", "flex"]}
        >
          {children}
        </Text>
      </HStack>
    </Link>
  );
};

interface SidebarProps {
  current: "main" | "whatsapp" | "profile";
}

export const Sidebar: React.FC<SidebarProps> = ({ current }) => {
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
      <VStack
        as="aside"
        w="100%"
        minW="5rem"
        maxW="20%"
        h="100%"
        p={2}
        spacing={6}
        align="center"
        justify="start"
      >
        <HStack spacing={2}>
          <Image alt="logo" src="/logo/logo.png" />
          <Heading
            color="purple"
            fontSize="md"
            mt={1}
            display={["none", "none", "flex", "flex"]}
          >
            Recupera
            <Text as="span" fontWeight="500">
              Zap
            </Text>
          </Heading>
        </HStack>

        <Divider bgColor="background: linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.50%, rgba(224, 225, 226, 0.15625) 99%)" />

        <VStack
          as="nav"
          w="100%"
          align={["center", "center", "start", "start"]}
          spacing={6}
        >
          <NavLink
            href="/dashboard"
            iconSrc="/dashboard/sidebar/white/home.svg"
            activeIconSrc="/dashboard/sidebar/active/home.svg"
            isActive={current === "main"}
          >
            Painel principal
          </NavLink>
          <NavLink
            href="/dashboard/whatsapp"
            iconSrc="/dashboard/sidebar/white/whatsapp.svg"
            activeIconSrc="/dashboard/sidebar/active/whatsapp.svg"
            isActive={current === "whatsapp"}
          >
            WhatsApp
          </NavLink>

          <HStack
            as={Button}
            w="100%"
            spacing={3}
            justify={["center", "center", "start", "start"]}
            bgColor="transparent"
            borderRadius="2xl"
            _hover={{ opacity: 0.7 }}
            _active={{ opacity: 0.7 }}
            onClick={createFunnelModalOnOpen}
          >
            <HStack spacing={3}>
              <Box p={2} borderRadius="xl" bgColor="white">
                <Image alt="" src="/dashboard/sidebar/white/add.svg" />
              </Box>
            </HStack>

            <Text
              color="text.secondary"
              fontWeight="700"
              fontSize="xs"
              display={["none", "none", "flex", "flex"]}
            >
              Criar funil
            </Text>
          </HStack>

          <HStack
            as={Button}
            w="100%"
            spacing={3}
            justify={["center", "center", "start", "start"]}
            bgColor="transparent"
            borderRadius="2xl"
            _hover={{ opacity: 0.7 }}
            _active={{ opacity: 0.7 }}
            onClick={multiShotModalOnOpen}
          >
            <HStack spacing={3}>
              <Box p={2} borderRadius="xl" bgColor="white">
                <Image alt="" src="/dashboard/sidebar/white/add.svg" />
              </Box>
            </HStack>

            <Text
              color="text.secondary"
              fontWeight="700"
              fontSize="xs"
              display={["none", "none", "flex", "flex"]}
            >
              Envio em Massa
            </Text>
          </HStack>

          <NavLink
            href="/dashboard/perfil"
            iconSrc="/dashboard/sidebar/white/person.svg"
            activeIconSrc="/dashboard/sidebar/active/person.svg"
            isActive={current === "profile"}
          >
            Meu perfil
          </NavLink>
        </VStack>

        <VStack
          w="90%"
          mt={2}
          p={6}
          spacing={5}
          bgColor="purple"
          bgImage="/dashboard/sidebar/background.svg"
          bgSize="cover"
          align="start"
          borderRadius="2xl"
          display={["none", "none", "none", "flex"]}
        >
          <VStack p={2} bgColor="white" borderRadius="xl">
            <Image alt="" src="/dashboard/sidebar/question-mark.svg" />
          </VStack>

          <Text color="white" fontSize="sm">
            Precisa de ajuda?
          </Text>

          <Button
            as={Link}
            href=""
            isExternal
            w="100%"
            bgColor="white"
            color="text.primary"
            fontSize="xs"
            fontWeight="700"
            textTransform="uppercase"
            borderRadius="xl"
            _hover={{ opacity: 0.7, textDecoration: "none" }}
            _active={{ opacity: 0.7, textDecoration: "none" }}
          >
            Fale conosco
          </Button>
        </VStack>
      </VStack>

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
