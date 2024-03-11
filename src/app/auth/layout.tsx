import { HStack, VStack, Image } from '@chakra-ui/react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  // validate authentication and redirection

  return (
    <HStack
      w="100%"
      h="100%"
      minH="100vh"
      p={0}
      spacing={0}
      align="start"
      justify="center"
    >
      <VStack w="100%" h="100%" minH="100vh" align="center" justify="center">
        {children}
      </VStack>

      <VStack
        w="100%"
        minW="50vw"
        h="90vh"
        bgColor="primary"
        align="center"
        justify="center"
        borderBottomLeftRadius="3xl"
        bgImage="/assets/blur.png"
        bgRepeat="no-repeat"
        bgPosition="center"
        bgSize="cover"
        display={['none', 'none', 'flex']}
      >
        <Image alt="Recupera Zap" src="/images/logo-white.png" />
      </VStack>
    </HStack>
  );
}
