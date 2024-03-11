'use client';

import React, { useEffect, useState } from 'react';

import {
  Button,
  Heading,
  VStack,
  Text,
  Tag,
  TagLabel,
  ListItem,
  OrderedList,
  Image,
  Stack,
  useCounter,
  useBoolean,
} from '@chakra-ui/react';

import { DEBUG } from '@/app/dashboard/(create-funnel)/debug';

import { useAuth } from '@/app/hooks/useAuth';

import { updateUser } from '@/database/client/functions/rest';

import { env } from '@/config/env';

const Connected = () => {
  const { user } = useAuth();

  const [isLoading, { on, off }] = useBoolean(false);

  async function handleDisconnection() {
    on();

    console.log({ key: user!.id });

    await fetch(env.NEXT_PUBLIC_SERVER_URL + '/connection', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: user!.id,
      }),
    });

    await updateUser(user!.id, {
      isConnected: false,
    });

    off();
  }

  return (
    <VStack
      w="100%"
      maxW="24rem"
      flex={1}
      p={6}
      spacing={4}
      rounded="2xl"
      align="start"
      justify="space-between"
      bgColor="white"
    >
      <Heading fontSize="lg">Conexão ao Whatsapp</Heading>

      <VStack spacing={0} align="start">
        <Heading
          mb={6}
          color="gray.400"
          fontSize="10px"
          textTransform="uppercase"
        >
          Aparelho conectado
        </Heading>

        <Heading mb={1} color="gray.500" fontSize="xs">
          Funis Ativos
        </Heading>

        <Text color="gray.500" fontSize="xs">
          Disparos recorrentes e a todo vapor.
        </Text>

        <Tag mt={2.5} size="sm" bgColor="#53BF80" rounded="4px">
          <TagLabel
            color="white"
            fontSize="8px"
            fontWeight="700"
            textTransform="uppercase"
          >
            Conectado
          </TagLabel>
        </Tag>
      </VStack>

      <Button
        variant="secondary"
        mt={2}
        w="min"
        px={8}
        fontSize="10px"
        rounded="3xl"
        onClick={handleDisconnection}
        isLoading={isLoading}
      >
        Desconectar
      </Button>
    </VStack>
  );
};

async function fetchQrcode(uid: string): Promise<string | null> {
  const response = await fetch(env.NEXT_PUBLIC_SERVER_URL + '/qrcode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key: uid,
    }),
  });

  if (!response.ok) {
    DEBUG('fetch qrcode was not ok');
    return null;
  }

  const { qrcode } = await response.json();

  return qrcode as string;
}

const Disconnected = () => {
  const { user } = useAuth();

  const [qrcode, setQrcode] = useState<string | null>(null);

  const {
    valueAsNumber: counter,
    increment: incrementCounter,
    setValue: setCounter,
  } = useCounter({ defaultValue: 0 });

  const [isLoading, { on, off }] = useBoolean(false);

  async function handleConnection() {
    on();

    const response = await fetch(env.NEXT_PUBLIC_SERVER_URL + '/connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: user?.id,
      }),
    });

    if (!response.ok) {
      DEBUG('creating connection was not ok');
    }

    const qrcode = await fetchQrcode(user!.id);

    if (!qrcode) {
      ('display error message');
    }

    setQrcode(qrcode);
    incrementCounter();
  }

  useEffect(() => {
    if (counter === 0) {
      return;
    }

    const id = setInterval(() => {
      if (counter < 3) {
        return fetchQrcode(user!.id).then((qrcode) => {
          setQrcode(qrcode);
          incrementCounter();
        });
      }

      setCounter(0);
      setQrcode(null);
      off();

      clearInterval(id);
    }, 20 * 1000);

    return () => {
      clearInterval(id);
    };
  }, [counter, incrementCounter, off, setCounter, user]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const id = setInterval(() => {
      if (!isLoading) {
        clearInterval(id);
        return;
      }

      async function main() {
        const response = await fetch(
          env.NEXT_PUBLIC_SERVER_URL + '/connection-info',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              key: user?.id,
            }),
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const isConnected = data.connected;

        if (isConnected) {
          await updateUser(user!.id, {
            isConnected,
          });

          setCounter(0);
          setQrcode(null);
          off();
          clearInterval(id);
        }
      }

      main();
    }, 5 * 1000);

    return () => {
      clearInterval(id);
    };
  }, [isLoading, user, off, setCounter]);

  return (
    <Stack
      w="100%"
      flex={1}
      p={6}
      spacing={4}
      rounded="2xl"
      align="stretch"
      justify="space-between"
      bgColor="white"
      direction={['column-reverse', 'column-reverse', 'row']}
    >
      <VStack
        align={['center', 'center', 'start']}
        justify="space-between"
        spacing={4}
      >
        <Heading fontSize="lg">Conexão ao Whatsapp</Heading>

        <OrderedList
          textAlign={['center', 'center', 'start']}
          color="gray.400"
          fontSize="xs"
          spacing={3}
        >
          <ListItem>Abra o WhatsApp no seu celular</ListItem>

          <ListItem>
            Toque em <strong>Mais Opções</strong> ou{' '}
            <strong>Configurações</strong> e selecione{' '}
            <strong>Aparelhos conectados</strong>.
          </ListItem>

          <ListItem>
            Aponte seu celular para esta tela para capturar o QR Code.
          </ListItem>
        </OrderedList>

        <Button
          variant="secondary"
          w={['100%', '100%', 'min']}
          px={8}
          fontSize="10px"
          rounded="3xl"
          onClick={handleConnection}
          isLoading={isLoading}
          _hover={{ opacity: 0.75 }}
          _active={{ opacity: 0.5 }}
        >
          Conectar
        </Button>
      </VStack>

      {!!qrcode && (
        <Image
          w="10rem"
          h="10rem"
          bgColor="primary"
          alignSelf="center"
          alt="qrcode"
          src={qrcode}
        />
      )}
    </Stack>
  );
};

export const Whatsapp: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div />;
  }

  return user.isConnected ? <Connected /> : <Disconnected />;
};
