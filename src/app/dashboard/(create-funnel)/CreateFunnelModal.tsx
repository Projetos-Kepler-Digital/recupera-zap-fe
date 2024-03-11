'use client';

import React, { useState } from 'react';

import {
  Box,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Progress,
  Step,
  StepIndicator,
  Stepper,
  VStack,
  useConst,
  useSteps,
} from '@chakra-ui/react';

import { Setup } from './components/Setup';
import { Shoot } from './components/Shoot';
import { Review } from './components/Review';
import { Webhook } from './components/Webhook';

import type { Funnel } from '@/types/Funnel';

const steps = ['setup', 'shoot', 'review', 'webhook'] as const;

type Step = (typeof steps)[number];

interface CreateFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  index?: number;
  initialFunnel?: Funnel;
}

export const CreateFunnelModal: React.FC<CreateFunnelModalProps> = ({
  isOpen,
  onClose,
  index,
  initialFunnel,
}) => {
  const [funnel, setFunnel] = useState<Partial<Funnel>>(initialFunnel || {});

  const stepLabels = useConst<string[]>([
    'Criar Funil',
    'Criar Disparos',
    'Revisão',
    'Webhook',
  ]);

  const { activeStep, setActiveStep, goToPrevious, goToNext } = useSteps({
    index: index ?? 0,
    count: steps.length,
  });

  function reset() {
    onClose();

    if (!index) {
      setFunnel({});
      setActiveStep(0);
    }
  }

  const CurrentPage = [
    <Setup key={0} funnel={funnel} setFunnel={setFunnel} goToNext={goToNext} />,

    <Shoot
      key={1}
      funnel={funnel}
      setFunnel={setFunnel}
      goToPrevius={goToPrevious}
      goToNext={goToNext}
    />,

    <Review
      key={2}
      funnel={funnel as Funnel}
      setFunnel={setFunnel}
      goToNext={goToNext}
      goToPrevius={goToPrevious}
    />,

    <Webhook key={3} funnel={funnel as Funnel} onClose={reset} />,
  ][activeStep];

  const max = steps.length - 1;
  const progressPercent = (activeStep / max) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent bgColor="white" p={4} pb={8} rounded="2xl">
        <ModalBody as={VStack} w="100%" spacing={12}>
          <Box w="12rem" position="relative">
            <Stepper
              size="xs"
              index={activeStep}
              colorScheme="darkColorScheme"
              gap="0"
            >
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator
                    bgColor={index === activeStep ? '#222741' : '#E2E8F0'}
                  />
                </Step>
              ))}
            </Stepper>

            <Heading mt={3} color="#222741" fontSize="xs" fontWeight="600">
              {stepLabels[activeStep]}
            </Heading>

            <Progress
              value={progressPercent}
              position="absolute"
              height="2px"
              width="full"
              top="7px"
              bgColor="#E2E8F0"
              colorScheme="darkColorScheme"
              zIndex={-1}
            />
          </Box>

          {CurrentPage}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
