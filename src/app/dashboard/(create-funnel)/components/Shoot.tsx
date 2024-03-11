import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import {
  Button,
  HStack,
  Heading,
  Tag,
  TagLabel,
  VStack,
  WrapItem,
  useConst,
  Wrap,
  FormLabel,
  VisuallyHiddenInput,
} from '@chakra-ui/react';

import { FormFileInput, FormInput, FormTextarea } from '@/components/Form';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Funnel } from '@/types/Funnel';

import { z } from 'zod';

import { DEBUG } from '../debug';

const schema = z.object({
  index: z.number().int(),
  shootAfter: z
    .number({
      invalid_type_error: 'Campo obrigatório.',
    })
    .int('Valor inválido.')
    .positive('Valor inválido.'),
  delay: z
    .number({
      invalid_type_error: 'Campo obrigatório.',
    })
    .int('Valor inválido')
    .nonnegative('Valor inválido.'),
  message: z
    .string()
    .min(1, 'Campo obrigatório.')
    .max(500, 'Max. 500 caracteres.'),
  media: z.custom<File>().optional(),
});

type FormData = z.infer<typeof schema>;

interface ShootProps {
  funnel: Partial<Funnel>;
  setFunnel: Dispatch<SetStateAction<Partial<Funnel>>>;
  goToPrevius: () => void;
  goToNext: () => void;
}

export const Shoot: React.FC<ShootProps> = ({
  funnel,
  setFunnel,
  goToPrevius,
  goToNext,
}) => {
  const [index, setIndex] = useState<number>(0);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const currentShoot = funnel.shoots && funnel.shoots[index];

    if (currentShoot) {
      DEBUG({ index, currentShoot });

      methods.reset({
        ...currentShoot,
        media: currentShoot.media as File | undefined,
      });
    } else {
      methods.reset();
    }
  }, [funnel, methods, index]);

  const variants = useConst<string[]>(['nome', 'email', 'checkout', 'pix']);

  function addVariant(value: string): void {
    const { message } = methods.getValues();
    methods.setValue('message', `${message}[${value}]`);
  }

  function handleGoBack(): void {
    if (index === 0) {
      return goToPrevius();
    }

    setIndex((prev) => prev - 1);
  }

  function handleDelete(): void {
    setFunnel((prev) => {
      return {
        ...prev,
        shoots: prev.shoots?.filter((shoot) => shoot.index !== index),
      };
    });

    handleGoBack();
  }

  async function handleShoot(): Promise<void> {
    const isValid = await methods.trigger();

    if (!isValid) {
      const errors = methods.formState.errors;

      Object.entries(errors).forEach(([name, error]) => {
        methods.setError(name as keyof FormData, {
          message: error.message?.toString(),
        });
      });

      return;
    }

    const shoot = methods.getValues();

    // DEBUG('set index');
    setIndex((prev) => prev + 1);

    // DEBUG('set funnel');
    setFunnel((prev) => {
      const { shoots } = prev;

      const updatedShoots = [...(shoots || [])];

      updatedShoots[index] = { ...shoot, media: shoot.media || null };

      return {
        ...prev,
        shoots: updatedShoots,
      };
    });
  }

  function onSubmit(shoot: FormData): void {
    setFunnel((prev) => {
      const { shoots } = prev;

      const updatedShoots = [...(shoots || [])];

      updatedShoots[index] = { ...shoot, media: shoot.media || null };

      return {
        ...prev,
        shoots: updatedShoots,
      };
    });

    goToNext();
  }

  return (
    <FormProvider {...methods}>
      <VStack
        as="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        w="100%"
        spacing={6}
        align="start"
      >
        <Heading color="gray.400" fontSize="xs" textTransform="uppercase">
          Configuração de disparo ({index + 1}/
          {(funnel.shoots || []).length + 1})
        </Heading>

        <VisuallyHiddenInput
          {...methods.register('index', {
            valueAsNumber: true,
          })}
          value={index}
        />

        <HStack w="100%" spacing={4} align="start">
          <FormInput
            name="shootAfter"
            label="Delay do disparo"
            placeholder="segundos"
            type="number"
          />

          <FormInput
            name="delay"
            label="Delay da mensagem"
            placeholder="segundos"
            type="number"
          />
        </HStack>

        <VStack w="100%" spacing={2} align="start">
          <FormLabel
            htmlFor="message"
            ml={1}
            color="gray.700"
            fontSize="sm"
            fontWeight="500"
          >
            Mensagem
          </FormLabel>

          <Wrap w="100%" gap={2}>
            {variants.map((variant, index) => {
              return (
                <WrapItem
                  key={index}
                  onClick={() => addVariant(variant)}
                  _hover={{ opacity: 0.9, cursor: 'pointer' }}
                  _active={{ opacity: 0.8, cursor: 'pointer' }}
                >
                  <Tag
                    bgColor="white"
                    border="solid 1px"
                    borderColor="gray.200"
                    rounded="full"
                    px={3}
                  >
                    <TagLabel
                      color="gray.700"
                      fontSize="xs"
                      fontWeight="500"
                      textTransform="capitalize"
                    >
                      {variant}
                    </TagLabel>
                  </Tag>
                </WrapItem>
              );
            })}
          </Wrap>

          <FormTextarea name="message" placeholder="Digite a mensagem aqui" />
        </VStack>

        <FormFileInput
          name="media"
          label="Mídias"
          supportedFileTypes={['.jpg', '.png', '.mp3', '.mp4']}
        />

        <HStack mt={4} w="100%" justify="space-between">
          <Button
            w="min"
            px={5}
            variant="outline"
            fontSize="10px"
            color="primary"
            borderColor="primary"
            onClick={handleGoBack}
          >
            Voltar
          </Button>

          <Button
            w="min"
            px={5}
            variant="outline"
            fontSize="10px"
            color="red.500"
            borderColor="red.500"
            onClick={handleDelete}
          >
            Exlcuir
          </Button>

          <Button
            w="min"
            px={5}
            variant="primary"
            fontSize="10px"
            onClick={handleShoot}
          >
            Prox. Disparo
          </Button>

          <Button
            w="min"
            px={5}
            variant="secondary"
            fontSize="10px"
            type="submit"
          >
            Concluir
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};
