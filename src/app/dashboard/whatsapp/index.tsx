import React from "react";

import { HStack, Heading, VStack } from "@chakra-ui/react";
import { Sidebar } from "../components/Sidebar";
import { QrCode } from "./components/QrCode";
import { Status } from "./components/Status";

import { useAuth } from "@/hooks/useAuth";

export const Whatsapp: React.FC = () => {
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
      <Sidebar current="whatsapp" />

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
          <Heading fontSize="sm">Whatsapp</Heading>
        </HStack>

        <VStack align="start" w="100%" h="100%" px={8} mt={-32}>
          {user &&
            (user.whatsapp ? <Status user={user} /> : <QrCode user={user} />)}
            </VStack>
      </VStack>
    </HStack>
  );
};
