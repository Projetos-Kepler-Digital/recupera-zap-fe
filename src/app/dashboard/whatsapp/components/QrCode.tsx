import React, { useEffect, useState } from "react";

import {
  HStack,
  VStack,
  Heading,
  Button,
  Image,
  Text,
  Stack,
} from "@chakra-ui/react";

import axios from "axios";
import { updateDocument } from "@/database/functions/native-functions";

import type { User } from "@/database/types/User";

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

interface QrcodeProps {
  user: User;
}

export const QrCode: React.FC<QrcodeProps> = ({ user }) => {
  const [qrcode, setQrcode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [counter, setCounter] = useState(0);
  const handleConnect = async () => {
    setIsLoading(true);

    await axios.post("/api/whatsapp/create-new-instance", {
      userId: user.id,
    });

    const { data } = await axios.post("/api/whatsapp/get-qrcode", {
      userId: user.id,
    });

    const { qrcode } = data;

    setQrcode(qrcode);
    setCounter((prev) => prev + 1);
  };

  useEffect(() => {
    if (counter === 0) return;

    const intervalId = setInterval(() => {
      if (counter < 3) {
        axios
          .post("/api/whatsapp/get-qrcode", {
            userId: user.id,
          })
          .then(({ data }) => {
            const { qrcode } = data;
            setQrcode(qrcode);

            setCounter((prev) => prev + 1);
          });
      } else {
        setCounter(0);
        setQrcode(null);
        setIsLoading(false);
        clearInterval(intervalId);
      }
    }, 20 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [counter]);

  useEffect(() => {
    if (!isLoading) return;

    const intervalId = setInterval(() => {
      if (isLoading) {
        axios
          .post("/api/whatsapp/check-instance-connection", {
            userId: user.id,
          })
          .then(({ data }) => {
            const { connected } = data;

            if (connected) {
              axios.post("/api/whatsapp/set-instance-webhook", {
                userId: user.id,
              });

              updateDocument("users", user.id, {
                whatsapp: true,
              }).then(() => {
                setCounter(0);
                setQrcode(null);
                setIsLoading(false);
                clearInterval(intervalId);
              });
            }
          });
      } else {
        clearInterval(intervalId);
      }
    }, 5 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isLoading]);

  return (
    <VStack
      w="100%"
      h="100%"
      px={7}
      py={8}
      spacing={6}
      align={["center", "center", "start", "start"]}
      borderRadius="2xl"
      bgColor="white"
    >
      <Heading
        color="text.primary"
        fontSize="lg"
        textAlign={["center", "center", "start", "start"]}
      >
        Conexão ao Whatsapp
      </Heading>

      <Stack
        w="100%"
        align={["center", "center", "start", "start"]}
        spacing={8}
        justify="space-between"
        direction={["column-reverse", "column-reverse", "row", "row"]}
      >
        <VStack w="100%" h="100%" align="start" spacing={8}>
          <VStack w="100%" h="100%" align="start">
            <Instruction index={1}>Abra o WhatsApp no seu celular</Instruction>
            <Instruction index={2}>
              Toque em &quot;Mais Opções&quot; ou &quot;Configurações&quot; e
              selecione &quot;Aparelhos conectados&quot;.
            </Instruction>
            <Instruction index={3}>
              Aponte seu celular para esta tela para capturar o QR Code.
            </Instruction>
          </VStack>

          <Button
            minW={["100%", "100%", "0%", "0%"]}
            px={[2, 2, 12, 12]}
            py={2}
            background="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
            borderRadius="3xl"
            color="white"
            fontWeight="700"
            fontSize="xs"
            _hover={{ textDecoration: "none", opacity: 0.9 }}
            _active={{ opacity: 0.9 }}
            isLoading={isLoading}
            onClick={handleConnect}
          >
            Conectar
          </Button>
        </VStack>

        {!!qrcode && (
          <Image
            minH={["6rem", "7rem", "9rem", "9rem"]}
            minW={["6rem", "7rem", "9rem", "9rem"]}
            src={qrcode}
            alt="qrcode"
          />
        )}
      </Stack>
    </VStack>
  );
};
