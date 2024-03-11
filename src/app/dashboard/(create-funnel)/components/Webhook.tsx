import React from 'react';

import {
  Button,
  Heading,
  VStack,
  useClipboard,
  useToast,
  Text,
  ListItem,
  OrderedList,
  HStack,
} from '@chakra-ui/react';

import { Icon } from '@/components/Icon';

import { capitalize } from '@/utils/format';

import type { Funnel } from '@/types/Funnel';

interface WebhookProps {
  funnel: Funnel;
  onClose: () => void;
}

export const Webhook: React.FC<WebhookProps> = ({ funnel, onClose }) => {
  const endpoint = `https://www.recupera-zap.com/${funnel.uid}/${funnel.id}`;

  const { onCopy } = useClipboard(endpoint);

  const toast = useToast();

  const handleClipboard = () => {
    onCopy();

    toast({
      title: 'Endpoint copiado!',
      description: 'Cole-o na área de webhooks do seu getaway de pagamento.',
      status: 'success',
      duration: 4000,
      containerStyle: {
        bgColor: 'green',
        borderRadius: 'md',
      },
    });
  };

  return (
    <VStack mt={-6} w="100%" h="100%" spacing={4}>
      <Heading color="#222741" fontSize="3xl">
        Feito!
      </Heading>

      <Text mt={-1.5} color="#222741" fontSize="sm" fontStyle="italic">
        Funil criado com sucesso!
      </Text>

      <VStack mt={4} align="start">
        <OrderedList color="gray.500" fontSize="xs" spacing={3}>
          <ListItem>
            Chegou a hora de configurar seu <strong>Webhook.</strong>
          </ListItem>

          <ListItem>
            Acesse a área de membros do seu getaways:{' '}
            <strong>a {capitalize(funnel.getaway)}.</strong>
          </ListItem>

          <ListItem>
            Configure os mesmos eventos deste funil e adicione o endpoint
            abaixo:
          </ListItem>
        </OrderedList>
      </VStack>

      <HStack
        mt={1}
        w="100%"
        p={4}
        spacing={6}
        border="dashed 2px"
        borderColor="#718096"
        rounded="lg"
        bgColor="#F8F9FA"
        justify="space-between"
      >
        <Text color="#222741" fontSize="xs">
          https://www.recuperazap.com/webhook...
        </Text>

        <Button
          w="min"
          h="min"
          p={0}
          color="primary"
          fontSize="xs"
          fontWeight="500"
          textTransform="none"
          border="none"
          bgColor="transparent"
          iconSpacing={2}
          rightIcon={<Icon name="copy" color="primary" />}
          _hover={{ bgColor: 'transparent', opacity: 0.75 }}
          _active={{ bgColor: 'tranparent', opacity: 0.5 }}
          onClick={handleClipboard}
        >
          copiar
        </Button>
      </HStack>

      <Button mt={0.5} variant="secondary" fontSize="10px" onClick={onClose}>
        Finalizar
      </Button>
    </VStack>
  );
};
