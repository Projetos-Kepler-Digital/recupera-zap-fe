'use client';

import React from 'react';

import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  VStack,
  useToast,
} from '@chakra-ui/react';

import { FormFileInput, FormInput, FormRadioGroup } from '@/components/Form';

import { useAuth } from '@/app/hooks/useAuth';

import xlsx from 'xlsx';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Lead } from '@/types/Funnel';

import { z } from 'zod';
import { formatPhoneNumber } from '@/utils/format';
import { sendMultiShot } from './multi-shot';

const schema = z.object({
  funnel: z.string({
    required_error: 'Campo obrigatório.',
    invalid_type_error: 'Campo obrigatório.',
  }),
  file: z.custom<File>(),
  delay: z
    .number({ invalid_type_error: 'Campo obrigatório.' })
    .int('Valor inválido.')
    .nonnegative('Valor inválido.'),
});

type FormData = z.infer<typeof schema>;

interface MultiShotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiShotModal: React.FC<MultiShotModalProps> = ({
  isOpen,
  onClose,
}) => {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const toast = useToast();

  async function onSubmit({ funnel, file, delay }: FormData) {
    try {
      const reader = new FileReader();

      reader.readAsArrayBuffer(file);
      reader.onload = async (event) => {
        const file = event.target?.result;

        const workbook = xlsx.read(file, { type: 'buffer' });
        const name = workbook.SheetNames[0];
        const sheet = workbook.Sheets[name];

        const data: {
          telefone: number;
          nome?: string;
        }[] = xlsx.utils.sheet_to_json(sheet);

        const leads: Lead[] = data.map(
          (datum) =>
            ({
              name: datum.nome || null,
              phone: formatPhoneNumber(datum.telefone.toString()),
            } as Lead)
        );

        return await sendMultiShot(funnel, leads, delay);
      };
    } catch (err) {
      return toast({
        title: 'Planilha com formatação incorreta',
        description: 'Não foi possível processar sua planilha.',
        status: 'error',
        duration: 4000,
        containerStyle: {
          color: 'white',
          bgColor: 'red',
          borderRadius: 'md',
        },
      });
    }
  }

  const { user } = useAuth();

  const options = Object.fromEntries(
    user?.funnels?.map((funnel) => [funnel.id, funnel.name]) || []
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent bgColor="white" p={4} pb={8} rounded="2xl">
        <ModalBody as={VStack} w="100%" spacing={6} align="start">
          <Heading fontSize="lg">Envio em massa</Heading>

          <FormProvider {...methods}>
            <VStack
              as="form"
              onSubmit={methods.handleSubmit(onSubmit)}
              noValidate
              w="100%"
              spacing={6}
              align="start"
            >
              <FormRadioGroup name="funnel" label="Funil" options={options} />

              <FormFileInput
                name="file"
                label="Planilha de Leads"
                supportedFileTypes={['.xlsx']}
              />

              <FormInput
                name="delay"
                label="Delay"
                placeholder="segundos"
                type="number"
              />

              <Button
                variant="secondary"
                type="submit"
                mt={2}
                h={10}
                fontSize="10px"
              >
                Enviar
              </Button>
            </VStack>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
