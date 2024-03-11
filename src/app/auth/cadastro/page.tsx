'use client';

import { Link } from '@chakra-ui/next-js';

import { Heading, VStack, Text, Button, useToast } from '@chakra-ui/react';

import { FormInput } from '@/components/Form';

import { AuthErrorMessages } from '@/database/client/functions/auth/AuthError';

import { useAuth } from '@/app/hooks/useAuth';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

const schema = z
  .object({
    email: z.string().email('Email inválido.'),
    password: z.string().min(6, 'A senha deve conter ao menos 6 caracteres.'),
    confirmPassword: z.string().min(1, 'Campo obrigatório.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  });

type FormData = z.infer<typeof schema>;

export default function Signup() {
  const { signUp } = useAuth();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const toast = useToast();

  async function onSubmit({ email, password }: FormData): Promise<void> {
    const result = await signUp({ email, password });

    if (!result.success) {
      const message = AuthErrorMessages[result.error];

      toast({
        title: message.title,
        description: message.description,
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

  return (
    <FormProvider {...methods}>
      <VStack
        as="form"
        noValidate
        onSubmit={methods.handleSubmit(onSubmit)}
        spacing={6}
        align={['center', 'start']}
      >
        <Heading color="primary" fontSize="3xl">
          Bem-vindo
        </Heading>

        <Text mt={-4} mb={3} fontSize="sm" fontWeight="600">
          Crie uma conta para fazer parte da plataforma.
        </Text>

        <FormInput
          w="100%"
          name="email"
          label="Email"
          placeholder="Seu email"
          type="email"
        />

        <FormInput
          w="100%"
          name="password"
          label="Senha"
          placeholder="Sua senha"
          type="password"
        />

        <FormInput
          w="100%"
          name="confirmPassword"
          label="Confirme sua senha"
          placeholder="Sua senha novamente"
          type="password"
        />

        <Button
          variant="primary"
          fontSize="10px"
          type="submit"
          isLoading={methods.formState.isSubmitting}
          _hover={{ opacity: 0.75 }}
          _active={{ opacity: 0.5 }}
        >
          Cadastrar
        </Button>

        <Text mt={-0.5} w="100%">
          Já possui uma conta?{' '}
          <Link color="primary" fontWeight="700" href="/auth/login">
            Faça Login!
          </Link>
        </Text>
      </VStack>
    </FormProvider>
  );
}
