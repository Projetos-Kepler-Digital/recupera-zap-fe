import React, { Dispatch, SetStateAction } from 'react';

import { Button, VStack, useConst } from '@chakra-ui/react';

import { FormInput, FormMenu, FormCheckboxGroup } from '@/components/Form';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { type Getaway, getaways, events, Event } from '@/types/Getaway';

import type { Funnel } from '@/types/Funnel';

import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Campo obrigatório.'),
  getaway: z.enum(getaways, {
    required_error: 'Selecione um getaway de pagamento.',
  }),
  events: z.array(z.enum(events)).min(1, 'Selecione ao menos 1 evento.'),
});

type FormData = z.infer<typeof schema>;

interface SetupProps {
  funnel: Partial<Funnel>;
  setFunnel: Dispatch<SetStateAction<Partial<Funnel>>>;
  goToNext: () => void;
}

export const Setup: React.FC<SetupProps> = ({
  funnel,
  setFunnel,
  goToNext,
}) => {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: funnel,
  });

  const options = useConst<Record<string, Getaway>>({
    Hotmart: 'hotmart',
    Kiwify: 'kiwify',
    Perfectpay: 'perfectpay',
    Eduzz: 'eduzz',
    Kirvano: 'kirvano',
    Monetizze: 'monetizze',
  });

  const events = useConst<Record<Event, string>>({
    'carrinho abandonado': 'Carrinho Abandonado',
    'compra aprovada': 'Compra Aprovada',
    reembolsado: 'Reembolsado',
    chargeback: 'Chargeback',
  });

  function onSubmit({ name, getaway, events }: FormData): void {
    setFunnel((prev) => ({ ...prev, name, getaway, events }));
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
        <FormInput
          name="name"
          label="Nome do Funil"
          placeholder="Nome do funil"
        />

        <FormMenu
          name="getaway"
          label="Geteway"
          placeholder="Geteway"
          options={options}
        />

        <FormCheckboxGroup name="events" label="Eventos" options={events} />

        <Button variant="secondary" type="submit" mt={2} h={10} fontSize="10px">
          Continuar
        </Button>
      </VStack>
    </FormProvider>
  );
};
