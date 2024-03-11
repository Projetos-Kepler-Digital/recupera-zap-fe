'use client';

import React from 'react';

import { Text } from '@chakra-ui/react';

import { Icon } from '@/components/Icon';

import { useAuth } from '@/app/hooks/useAuth';

import { startOfMonth, isAfter } from 'date-fns';

export const FunnelsIcon: React.FC = () => {
  const { user } = useAuth();

  const funnels = user?.funnels || [];

  const currentDate = new Date();
  const startOfMonthDate = startOfMonth(currentDate);

  const funnelCount = funnels.reduce((count, funnel) => {
    const createdAtDate = funnel.createdAt.toDate();

    if (
      isAfter(createdAtDate, startOfMonthDate) ||
      createdAtDate.getTime() === startOfMonthDate.getTime()
    ) {
      return count + 1;
    }

    return count;
  }, 0);

  return (
    <Text mt={-7}>
      <Icon name="check" /> <strong>{funnelCount} adicionados</strong> esse mês
    </Text>
  );
};
