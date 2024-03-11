import { Heading, VStack } from '@chakra-ui/react';

import { FunnelsTable } from './components/FunnelsTable';
import { FunnelsIcon } from './components/FunnelsIcon';
import { Metrics } from './components/Metrics';

// import { mockFunnnel } from '@/utils/mock';

export default async function Dashboard() {
  // const funnels = Array.from({ length: 5 }, mockFunnnel);

  return (
    <VStack w="100%" h="100%" py={1} spacing={8} align="start" flex={1}>
      <Heading fontSize="md">Dashboard</Heading>

      <Metrics />

      <VStack
        w="100%"
        h="100%"
        py={7}
        px={5}
        spacing={7}
        align="start"
        bgColor="white"
        rounded="2xl"
      >
        <Heading fontSize="lg" mb={1.5}>
          Funis
        </Heading>

        <FunnelsIcon />

        <FunnelsTable />
      </VStack>
    </VStack>
  );
}
