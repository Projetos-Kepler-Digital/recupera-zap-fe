'use client';

import React from 'react';

import {
  HStack,
  Heading,
  VStack,
  Text,
  Circle,
  SimpleGrid,
} from '@chakra-ui/react';

import { Icon, IconName } from '@/components/Icon';

import { useAuth } from '@/app/hooks/useAuth';

import { formatCurrency, formatPercent, formatReduce } from '@/utils/format';

import type { Funnel } from '@/types/Funnel';

interface MetricProps {
  title: string;
  icon: IconName;
  children: React.ReactNode;
}

const Metric: React.FC<MetricProps> = ({ title, icon, children }) => {
  return (
    <HStack px={5} py={4} justify="space-between" bgColor="white" rounded="2xl">
      <VStack spacing={1.5} align="start">
        <Text color="gray.400" fontSize="xs" fontWeight="600" textAlign="start">
          {title}
        </Text>

        <Heading color="gray.700" fontSize="lg">
          {children}
        </Heading>
      </VStack>

      <Circle p={2.5} bgColor="primary" rounded="xl">
        <Icon name={icon} color="white" />
      </Circle>
    </HStack>
  );
};

export const Metrics: React.FC = () => {
  const { user } = useAuth();

  const funnels: Funnel[] = user?.funnels || [];

  const revenue = funnels.reduce((sum, funnel) => sum + funnel.revenue, 0);
  const reaches = funnels.reduce((sum, funnel) => sum + funnel.reaches, 0);
  const recovers = funnels.reduce((sum, funnel) => sum + funnel.recovers, 0);

  const activeFunnels = funnels.filter((funnel) => funnel.status === 'active');

  return (
    <SimpleGrid w="100%" minChildWidth="12rem" gap={6}>
      <Metric title="Faturamento" icon="wallet">
        {formatCurrency(revenue)}
      </Metric>

      <Metric title="Lead atingidos" icon="globe">
        {formatReduce(reaches)}
      </Metric>

      <Metric title="Taxa de conversão" icon="file">
        {formatPercent(reaches === 0 ? 0 : recovers / reaches)}
      </Metric>

      <Metric title="Funis ativos" icon="cart">
        {activeFunnels.length}
      </Metric>
    </SimpleGrid>
  );
};
