import React from "react";

import {
  HStack,
  Heading,
  VStack,
  Text,
  Button,
  Box,
  Divider,
  Link,
  Stack,
  Avatar,
} from "@chakra-ui/react";
import { Sidebar } from "../components/Sidebar";

import { format } from "date-fns";

import { useAuth } from "@/hooks/useAuth";

interface DatumProps {
  label: string;
  children: React.ReactNode;
}

const Datum = ({ label, children }: DatumProps) => {
  return (
    <HStack spacing={2}>
      <Text>{label}:</Text>
      <Text color="text.secondary" fontWeight="400">
        {children}
      </Text>
    </HStack>
  );
};

export const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <HStack
      w="100%"
      h="100%"
      minH="100vh"
      p={6}
      spacing={0}
      align="start"
      justify="center"
      bgColor="background"
    >
      <Sidebar current="profile" />

      <VStack
        as="main"
        w="80%"
        h="100%"
        pl={8}
        py={2}
        spacing={8}
        align="start"
      >
        <HStack
          w="100%"
          h="15rem"
          p={6}
          align="start"
          bgColor="purple"
          bgImage="/dashboard/whatsapp/blur.png"
          bgSize="cover"
          borderRadius="xl"
        >
          <Heading fontSize="sm">Meu perfil</Heading>
        </HStack>

        <HStack w="100%" h="100%" px={8} mt={-24}>
          <HStack
            w="100%"
            h="100%"
            p={4}
            spacing={4}
            align="center"
            justify={["center", "center", "space-between", "space-between"]}
            borderRadius="2xl"
            bgColor="white"
          >
            <Stack
              spacing={6}
              align="center"
              direction={["column", "column", "row", "row"]}
            >
              <Avatar
                name={user?.name}
                h="5rem"
                w="5rem"
                borderRadius="lg"
                bgColor="purple"
              />

              <VStack
                spacing={0}
                align={["center", "center", "start", "start"]}
              >
                <Heading color="text.primary" fontSize="lg">
                  {user?.name}
                </Heading>
                <Text color="gray.500" fontSize="sm">
                  {user?.email}
                </Text>
              </VStack>
            </Stack>

            <Button
              as={Link}
              href=""
              isExternal
              px={8}
              py={4}
              background="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
              borderRadius="3xl"
              color="white"
              fontWeight="700"
              fontSize="sm"
              _hover={{ textDecoration: "none", opacity: 0.9 }}
              _active={{ opacity: 0.9 }}
              display={["none", "none", "flex", "flex"]}
            >
              Suporte
            </Button>
          </HStack>
        </HStack>

        <VStack
          w="100%"
          maxW="25rem"
          px={5}
          py={6}
          spacing={5}
          align="start"
          bgColor="white"
          borderRadius="xl"
        >
          <Heading color="text.primary" fontSize="lg">
            Dados da conta
          </Heading>

          <VStack
            spacing={3}
            align="start"
            color="gray.500"
            fontSize="xs"
            fontWeight="700"
          >
            <HStack spacing={2}>
              <Text>Status:</Text>
              <Box p={1} bgColor="green" borderRadius="4px">
                <Text color="white" fontSize="8px" textTransform="uppercase">
                  Ativo
                </Text>
              </Box>
            </HStack>
            <Datum label="Vencimento">
              {user &&
                format(new Date(user.dueDate.seconds * 1000), "dd/MM/yyyy")}
            </Datum>
          </VStack>

          <Divider
            w="100%"
            bgColor="background: linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 100%)"
          />

          <VStack
            spacing={3}
            align="start"
            color="gray.500"
            fontSize="xs"
            fontWeight="700"
          >
            <Datum label="Nome">{user?.name}</Datum>
            <Datum label="Email">{user?.email}</Datum>
          </VStack>
        </VStack>
      </VStack>
    </HStack>
  );
};
