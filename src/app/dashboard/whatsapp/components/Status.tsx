import React, { useState } from "react";

import { HStack, VStack, Heading, Button, Box, Text } from "@chakra-ui/react";

import axios from "axios";

import type { User } from "@/database/types/User";

interface StatusProps {
  user: User;
}

export const Status: React.FC<StatusProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDisconect = async () => {
    setIsLoading(true);

    await axios.post("/api/whatsapp/disconnect-instance", {
      userId: user.id,
    });

    setIsLoading(false);
  };

  return (
    <HStack
      h="100%"
      w="100%"
      maxW="25rem"
      p={[4, 8, 8, 8]}
      spacing={4}
      align="center"
      justify="space-between"
      borderRadius="2xl"
      bgColor="white"
    >
      <VStack
        h="100%"
        w="100%"
        align={["center", "center", "start", "start"]}
        spacing={6}
      >
        <Heading
          color="text.primary"
          fontSize={["sm", "sm", "lg", "lg"]}
          textAlign={["center", "center", "start", "start"]}
        >
          Conexão ao WhatsApp
        </Heading>

        <VStack
          align={["center", "center", "start", "start"]}
          spacing={2}
          fontSize={["xs", "xs", "sm", "sm"]}
          textAlign={["center", "center", "start", "start"]}
        >
          <Text color="gray.500" fontWeight="700">
            Aparelho conectado
          </Text>
          <Text color="text.secondary">Última sessão ativa dia 01/07/2023</Text>
          <Box p={1} bgColor="green" borderRadius="4px">
            <Text
              color="white"
              fontSize="8px"
              fontWeight="700"
              textTransform="uppercase"
            >
              Conectado
            </Text>
          </Box>
        </VStack>

        <Button
          px={[2, 8, 8, 8]}
          py={4}
          background="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
          borderRadius="3xl"
          color="white"
          fontWeight="700"
          fontSize={["xs", "sm", "sm", "sm"]}
          _hover={{ textDecoration: "none", opacity: 0.9 }}
          _active={{ opacity: 0.9 }}
          isLoading={isLoading}
          onClick={handleDisconect}
        >
          Desconectar
        </Button>
      </VStack>
    </HStack>
  );
};
