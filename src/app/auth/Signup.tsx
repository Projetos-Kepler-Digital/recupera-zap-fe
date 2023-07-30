import React, { useState } from "react";

import NextLink from "next/link";

import {
  Button,
  HStack,
  Heading,
  Link,
  VStack,
  Image,
  Text,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { Input } from "@/components/Input";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";

import { useAuth } from "@/hooks/useAuth";

import axios from "axios";

interface NavLinkProps {
  href: string;
  iconSrc: string;
  isDisabled?: boolean;
  children: React.ReactNode;
}

const NavLink = ({ href, iconSrc, children }: NavLinkProps) => {
  return (
    <HStack spacing={1} align="center">
      <Image src={iconSrc} />

      <Link
        as={NextLink}
        href={href}
        color="white"
        fontWeight="700"
        fontSize="xs"
        textTransform="uppercase"
        _hover={{ textDecoration: "none", opacity: 0.7 }}
      >
        {children}
      </Link>
    </HStack>
  );
};

const Header = () => {
  return (
    <HStack
      as="header"
      w="70%"
      align="center"
      justify={["center", "center", "space-between", "space-between"]}
      background="transparent"
    >
      <HStack spacing={2}>
        <Image alt="logo" src="/logo/logo-white.png" />
        <Heading color="white" fontSize="md" mt={1}>
          Recupera
          <Text as="span" fontWeight="500">
            Zap
          </Text>
        </Heading>
      </HStack>

      <HStack as="nav" spacing={8} display={["none", "none", "none", "flex"]}>
        <NavLink href="/dashboard" iconSrc="/auth/signup/dashboard.svg">
          Dashboard
        </NavLink>
        <NavLink href="/dashboard/profile" iconSrc="/auth/signup/profile.svg">
          Profile
        </NavLink>
        <NavLink href="/auth/signup" iconSrc="/auth/signup/signup.svg">
          Cadastro
        </NavLink>
        <NavLink href="/auth/login" iconSrc="/auth/signup/login.svg">
          Entrar
        </NavLink>
      </HStack>

      <Button
        as={Link}
        href=""
        isExternal
        px={8}
        py={4}
        background="white"
        borderRadius="3xl"
        color="text.primary"
        fontWeight="700"
        _hover={{ textDecoration: "none", opacity: 0.7 }}
        _active={{ opacity: 0.7 }}
        display={["none", "none", "flex", "flex"]}
      >
        Assine Agora
      </Button>
    </HStack>
  );
};

type FormData = {
  name: string;
  email: string;
  password: string;
};

const validationSchema = yup.object().shape({
  name: yup.string().required("O campo nome é obrigatório."),
  email: yup
    .string()
    .email("Email inválido.")
    .required("O campo email é obrigatório."),
  password: yup.string().required("O campo senha é obrigatório."),
});

export const Signup: React.FC = () => {
  const { signUp } = useAuth();

  const toast = useToast();

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const [switchValue, setSwitchValue] = useState(true);

  const onSubmit: SubmitHandler<FormData> = async ({
    name,
    email,
    password,
  }) => {
    const {
      data: { userExists, userId, user },
    } = await axios.post("/api/rest/user/user-exists", { email });

    if (!userExists) {
      toast({
        title: "Usuário não encontrado",
        description: "Considere comprar nosso produto ou chame o suporte.",
        status: "error",
        duration: 4000,
      });

      return;
    }

    try {
      await signUp(
        userId,
        user!.dueDate,
        { name, email, password },
        switchValue
      );
    } catch (err) {
      toast({
        title: "Credenciais inválidas",
        description: "Verifique suas credenciais e tente novamente.",
        status: "error",
        duration: 4000,
        containerStyle: {
          bgColor: "red",
          borderRadius: "md",
        },
      });
    }
  };

  return (
    <VStack w="100%" h="100%" minH="100vh" py={16} spacing={16} align="center">
      <Header />

      <VStack
        pos="absolute"
        zIndex="-1"
        top={6}
        w="calc(100vw - 4rem)"
        h="60vh"
        bgColor="purple"
        bgImage="/auth/signup/blur.png"
        bgSize="cover"
        borderRadius="xl"
      />

      <VStack w="100%" spacing={16}>
        <VStack spacing={2}>
          <Heading fontSize="3xl">Seja bem-vindo!</Heading>
          <Text textAlign="center" fontSize="sm">
            Obrigado pela compra! Preencha os dados abaixo
            <br /> para iniciar suas vendas.
          </Text>
        </VStack>

        <VStack
          as="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          spacing={9}
          bgColor="white"
          borderRadius="xl"
          w={["60%", "60%", "30%", "30%"]}
          px={12}
          py={10}
          boxShadow="0px 7px 23px 0px #0000000D"
        >
          <VStack w="100%" spacing={6} align="start">
            <Input
              label="Nome"
              placeholder="Seu primeiro nome"
              {...register("name")}
              error={errors.name}
            />

            <Input
              label="Email"
              placeholder="Seu email"
              {...register("email")}
              error={errors.email}
            />

            <Input
              label="Senha"
              placeholder="Sua senha"
              {...register("password")}
              error={errors.password}
              type="password"
            />

            <HStack spacing={3}>
              <Switch
                colorScheme="purpleColorScheme"
                size="md"
                isChecked={switchValue}
                onChange={() => setSwitchValue((prev) => !prev)}
              />

              <Text color="text.primary" fontSize="xs">
                Lembre-se de mim
              </Text>
            </HStack>
          </VStack>

          <VStack w="100%">
            <Button
              w="100%"
              type="submit"
              bgColor="purple"
              color="white"
              fontSize="xs"
              fontWeight="600"
              textTransform="uppercase"
              borderRadius="xl"
              _hover={{ opacity: 0.7 }}
              _active={{ opacity: 0.7 }}
              isLoading={formState.isSubmitting}
            >
              Cadastrar
            </Button>

            <Text color="text.secondary" fontSize="sm">
              Já tem uma conta?{" "}
              <Link
                as={NextLink}
                href="/auth/login"
                color="purple"
                fontWeight="700"
              >
                Login
              </Link>
            </Text>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
};
