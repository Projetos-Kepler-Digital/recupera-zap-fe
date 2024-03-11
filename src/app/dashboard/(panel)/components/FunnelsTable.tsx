'use client';

import React from 'react';

import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import { ActionMenu } from './ActionMenu';

import { useAuth } from '@/app/hooks/useAuth';

import { format } from 'date-fns';

import { formatCurrency, formatInteger, formatPercent } from '@/utils/format';

import { serialize } from '@/utils/data';

import type { Funnel } from '@/types/Funnel';

export const FunnelsTable: React.FC = () => {
  const { user } = useAuth();

  const funnels: Funnel[] = user?.funnels || [];

  return (
    <TableContainer w="100%">
      <Table>
        <Thead>
          <Tr>
            <Th color="gray.400" fontSize="10px">
              Funil
            </Th>
            <Th color="gray.400" fontSize="10px">
              Criado em
            </Th>
            <Th color="gray.400" fontSize="10px">
              Faturamento
            </Th>
            <Th color="gray.400" fontSize="10px">
              Leads
            </Th>
            <Th color="gray.400" fontSize="10px">
              Recuperações
            </Th>
            <Th color="gray.400" fontSize="10px">
              Conversão
            </Th>
            <Th />
          </Tr>
        </Thead>

        <Tbody>
          {funnels.map((funnel) => (
            <Tr key={funnel.id}>
              <Td color="gray.700" fontSize="sm" fontWeight="700">
                {funnel.name}
              </Td>

              <Td color="gray.700" fontSize="sm" fontWeight="700">
                {format(funnel.createdAt.toDate(), 'dd/MM/yyyy')}
              </Td>

              <Td color="gray.700" fontSize="sm" fontWeight="700">
                {formatCurrency(funnel.revenue)}
              </Td>

              <Td color="gray.700" fontSize="sm" fontWeight="700">
                {formatInteger(funnel.reaches)}
              </Td>

              <Td color="gray.700" fontSize="sm" fontWeight="700">
                {formatInteger(funnel.recovers)}
              </Td>

              <Td color="gray.700" fontSize="sm" fontWeight="700">
                {formatPercent(
                  funnel.reaches === 0 ? 0 : funnel.recovers / funnel.reaches
                )}
              </Td>

              <Td>
                <ActionMenu funnel={serialize(funnel) as unknown as Funnel} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
