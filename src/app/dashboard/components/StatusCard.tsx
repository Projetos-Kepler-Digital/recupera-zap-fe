import React from "react";

import { HStack, VStack, Text, Heading, Box, Image } from "@chakra-ui/react";

interface StatusCardProps {
  label: string;
  iconSrc: string;
  children: React.ReactNode;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  label,
  iconSrc,
  children,
}) => {
  return (
    <HStack
      w="100%"
      px={5}
      py={4}
      spacing={2}
      align="center"
      justify="space-between"
      bgColor="white"
      borderRadius="2xl"
    >
      <VStack
        w="100%"
        spacing={1}
        align={["center", "start", "start", "start"]}
        justify="center"
        textAlign={["center", "start", "start", "start"]}
      >
        <Text color="text.secondary" fontSize="xs" fontWeight="700">
          {label}
        </Text>
        <Heading color="text.primary" fontSize="lg">
          {children}
        </Heading>
      </VStack>

      <Box
        p={3}
        bgColor="purple"
        borderRadius="xl"
        display={["none", "flex", "flex", "flex"]}
      >
        <Image alt="" src={iconSrc} />
      </Box>
    </HStack>
  );
};
