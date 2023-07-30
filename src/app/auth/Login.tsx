import React, { useState } from "react";

import NextLink from "next/link";

import { useAuth } from "@/hooks/useAuth";

import {
  HStack,
  Heading,
  VStack,
  Text,
  Button,
  useToast,
  Switch,
  Link,
  Image,
} from "@chakra-ui/react";
import { Input } from "@/components/Input";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
        color="text.primary"
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
      pos="fixed"
      top="0"
      left="50%"
      transform="translateX(-50%)"
      w="70%"
      mt={6}
      px={6}
      py={4}
      align="center"
      justify={["center", "center", "space-between", "space-between"]}
      background="linear-gradient(137deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.80) 100%)"
      borderRadius="2xl"
      boxShadow="0px 7px 23px 0px #0000000D"
    >
      <HStack spacing={2}>
        <Image alt="logo" src="/logo/logo.png" />
        <Heading color="purple" fontSize="md" mt={1}>
          Recupera
          <Text as="span" fontWeight="500">
            Zap
          </Text>
        </Heading>
      </HStack>

      <HStack as="nav" spacing={8} display={["none", "none", "none", "flex"]}>
        <NavLink href="/auth/signup" iconSrc="/auth/login/dashboard.svg">
          Dashboard
        </NavLink>
        <NavLink href="/dashboard/profile" iconSrc="/auth/login/profile.svg">
          Profile
        </NavLink>
        <NavLink href="/auth/signup" iconSrc="/auth/login/signup.svg">
          Cadastro
        </NavLink>
        <NavLink href="/auth/login" iconSrc="/auth/login/login.svg">
          Entrar
        </NavLink>
      </HStack>

      <Button
        as={Link}
        href=""
        isExternal
        px={8}
        py={4}
        background="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
        borderRadius="3xl"
        color="white"
        fontWeight="700"
        _hover={{ textDecoration: "none", opacity: 0.9 }}
        _active={{ opacity: 0.9 }}
        display={["none", "none", "flex", "flex"]}
      >
        Assine Agora
      </Button>
    </HStack>
  );
};

type FormData = {
  email: string;
  password: string;
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email inválido.")
    .required("O campo email é obrigatório."),
  password: yup.string().required("O campo senha é obrigatório."),
});

export const Login: React.FC = () => {
  const { signIn } = useAuth();

  const toast = useToast();

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const [switchValue, setSwitchValue] = useState(true);

  const onSubmit: SubmitHandler<FormData> = async ({ email, password }) => {
    try {
      await signIn({ email, password }, switchValue);
    } catch (err) {
      console.log(err);
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
    <HStack
      w="100%"
      minW="100vw"
      h="100%"
      minH="100vh"
      p={0}
      spacing={0}
      align="center"
      justify="space-between"
    >
      <Header />

      <VStack
        w="100%"
        mt={[0, 0, 20, 20]}
        px={[4, 4, 0, 0]}
        align="center"
        justify="center"
      >
        <VStack
          as="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          alignSelf="center"
          spacing={9}
        >
          <VStack w="100%" align="start" spacing={2}>
            <Heading color="purple" fontSize="3xl">
              Bem-vindo de volta
            </Heading>
            <Text
              color="text.secondary"
              fontSize="sm"
              fontWeight="700"
              textAlign="center"
            >
              Insira seu email e senha para fazer login
            </Text>
          </VStack>

          <VStack w="100%" spacing={6} align="start">
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
              Login
            </Button>

            <Text color="text.secondary" fontSize="sm">
              Ainda não tem uma conta?{" "}
              <Link
                as={NextLink}
                href="/auth/signup"
                color="purple"
                fontWeight="700"
              >
                Cadastre-se
              </Link>
            </Text>
          </VStack>
        </VStack>
      </VStack>

      <VStack
        display={["none", "none", "flex", "flex"]}
        w="100%"
        h="100%"
        minH="100vh"
        bgImage="/auth/login/blur.png"
        bgSize="cover"
      />
    </HStack>
  );
};
