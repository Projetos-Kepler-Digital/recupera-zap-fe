import React, { useEffect, useState } from "react";

import {
  HStack,
  Heading,
  VStack,
  Text,
  Image,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { Sidebar } from "./components/Sidebar";
import { StatusCard } from "./components/StatusCard";
import { FunnelsTable } from "./components/FunnelsTable";

import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

import type { Funnel } from "@/database/types/Funnel";
import { getFunnelShots } from "@/database/functions";

const formatCurrency = (val: number) => {
  return val.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
    currency: "BRL",
  });
};

const formatRatio = (val: number) => {
  return val.toLocaleString("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  const [userFunnels, setUserFunnels] = useState<Funnel[] | null>(null);

  useEffect(() => {
    if (!!user) {
      axios
        .post("/api/rest/funnel/get-user-funnels-by-user-email", {
          email: user.email,
        })
        .then((response) => {
          const { funnels } = response.data;

          setUserFunnels(funnels);
        });
    }
  }, [user]);

  return (
    <HStack
      w="100%"
      h="100%"
      minH="100vh"
      p={6}
      spacing={0}
      align="start"
      justify="center"
      bgColor="background"
    >
      <Sidebar current="main" />

      <VStack as="main" w="80%" h="100%" pl={8} spacing={8} align="start">
        <HStack w="100%" justify="space-between">
          <Heading color="text.primary" fontSize="sm">
            Dashboard
          </Heading>

          <Button
            bgColor="transparent"
            _hover={{ opacity: 0.7 }}
            _active={{ opacity: 0.7 }}
            onClick={signOut}
          >
            <HStack spacing={1}>
              <Image alt="" src="/dashboard/main/person.svg" />
              <Text color="gray.500" fontSize="sm" fontWeight="700">
                Sair
              </Text>
            </HStack>
          </Button>
        </HStack>
        <SimpleGrid w="100%" gap={4} columns={[1, 2, 2, 4]}>
          <StatusCard
            label="Leads atingidos"
            iconSrc="/dashboard/main/globe.svg"
          >
            {user &&
              user.leadsReached &&
              user.leadsReached.toLocaleString("pt-BR")}
          </StatusCard>
          <StatusCard
            label="Leads recuperados"
            iconSrc="/dashboard/main/cart.svg"
          >
            {user &&
              user.leadsRecovered &&
              user.leadsRecovered.toLocaleString("pt-BR")}
          </StatusCard>
          <StatusCard label="Faturamento" iconSrc="/dashboard/main/wallet.svg">
            {user &&
              user.revenue &&
              `${user.revenue === 0 ? "R$ " : ""}${formatCurrency(
                user.revenue
              )}${user.revenue === 0 ? ",00" : ""}`}
          </StatusCard>
          <StatusCard
            label="Taxa de conversão"
            iconSrc="/dashboard/main/file.svg"
          >
            {user &&
              user.leadsRecovered &&
              user.leadsReached &&
              `${formatRatio(user.leadsRecovered / user.leadsReached)}${
                user.leadsRecovered === 0 ? ",00%" : ""
              }`}
          </StatusCard>
        </SimpleGrid>

        <VStack
          w="100%"
          p={7}
          spacing={7}
          align="start"
          bgColor="white"
          borderRadius="2xl"
        >
          <VStack spacing={1} align="start">
            <Heading color="text.primary" fontSize="lg">
              Funis
            </Heading>
            <HStack spacing={1}>
              <Image alt="" src="/dashboard/main/check.svg" />
              {user && !!user.activeFunnels && (
                <Text color="text.secondary" fontSize="sm">
                  <Text as="span" fontWeight="700">
                    {user.activeFunnels}
                  </Text>{" "}
                  {user.activeFunnels === 1 ? "funil ativo" : "funis ativos"}{" "}
                  atualmente
                </Text>
              )}
            </HStack>
          </VStack>

          {userFunnels && <FunnelsTable funnels={userFunnels} />}
        </VStack>
      </VStack>
    </HStack>
  );
};
