import React, { Dispatch, SetStateAction } from "react";

import {
  VStack,
  HStack,
  Button,
  Heading,
  Text,
  Image,
  useToast,
  useClipboard,
} from "@chakra-ui/react";

import { useAuth } from "@/hooks/useAuth";

import type { Funnel, Step } from "../CreateFunnelModal";

interface InstructionProps {
  index: number;
  children: React.ReactNode;
}

const Instruction = ({ index, children }: InstructionProps) => {
  return (
    <HStack
      w="100%"
      h="100%"
      color="gray.500"
      fontSize={["10px", "xs", "xs", "xs"]}
      display="flex"
      justify={["center", "start", "start", "start"]}
    >
      <Text fontWeight="700" display={["none", "flex", "flex", "flex"]}>
        {index}.
      </Text>

      <Text
        color="text.secondary"
        ml={2}
        display="flex"
        textAlign={["center", "start", "start", "start"]}
      >
        {children}
      </Text>
    </HStack>
  );
};

interface WebhookProps {
  setStep: Dispatch<SetStateAction<Step>>;
  funnel: Partial<Funnel>;
  onClose: () => void;
  funnelWebhook?: string;
}

export const Webhook: React.FC<WebhookProps> = ({
  setStep,
  funnel,
  onClose,
  funnelWebhook,
}) => {
  const { user } = useAuth();

  const webhook =
    funnelWebhook ||
    `https://recupera-zap.vercel.app/api/${user!.id}/${funnel.id!}/webhook`;

  const toast = useToast();
  const { onCopy } = useClipboard(webhook);

  const handleClipboard = () => {
    onCopy();

    toast({
      title: "Endpoint copiado!",
      description: "Cole-o na área de webhooks do seu getaway de pagamento.",
      status: "success",
      duration: 4000,
      containerStyle: {
        bgColor: "green",
        borderRadius: "md",
      },
    });
  };

  return (
    <VStack w="100%" spacing={6} align="center">
      <VStack spacing={1} color="#222741">
        <Heading fontSize="3xl">Feito!</Heading>
        <Text fontSize="sm">Funil criado com sucesso!</Text>
      </VStack>

      <VStack w="100%" h="100%" align="start">
        <Instruction index={1}>Agora vamos configurar seu webhook.</Instruction>
        <Instruction index={2}>
          Acesse a área de Webhooks da {funnel.getaway}.
        </Instruction>
        <Instruction index={3}>
          Selecione os eventos e adicione o endpoint abaixo:
        </Instruction>
      </VStack>

      <HStack
        w="100%"
        px={4}
        spacing={8}
        justify="space-between"
        border="dotted 2px"
        borderColor="#718096"
        borderRadius="lg"
      >
        <Text w="100%" fontSize="xs" color="#222741" noOfLines={1}>
          {webhook}
        </Text>

        <HStack
          as={Button}
          onClick={handleClipboard}
          bgColor="white"
          _hover={{ opacity: 0.7, bgColor: "white" }}
          _active={{ opacity: 0.7, bgColor: "white" }}
          spacing={1}
          mt="2px"
          mr={4}
        >
          <Text color="#714FD1" fontWeight="500" fontSize="xs">
            copiar
          </Text>
          <Image alt="" src="/dashboard/main/copy.svg" />
        </HStack>
      </HStack>

      <Button
        w="100%"
        py={4}
        background="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
        borderRadius="lg"
        color="white"
        fontWeight="700"
        fontSize="xs"
        textTransform="uppercase"
        _hover={{ textDecoration: "none", opacity: 0.9 }}
        _active={{ opacity: 0.9 }}
        onClick={() => {
          setStep("setup");
          onClose();
        }}
      >
        Finalizar
      </Button>
    </VStack>
  );
};
