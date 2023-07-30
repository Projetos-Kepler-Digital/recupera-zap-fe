import React, { useEffect, useState } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { Setup } from "./components/Setup";
import { Shoot } from "./components/Shoot";
import { Review } from "./components/Review";
import { Webhook } from "./components/Webhook";

import type { Getaway } from "@/database/types/Funnel";
import { useAuth } from "@/hooks/useAuth";

export type Step = "setup" | "shoot" | "review" | "webhook";

export type Funnel = {
  id?: string;

  name: string;
  getaway: Getaway;
  events: string[];

  shoots: {
    index: number;
    startAt: number;

    message: string | null;
    delayMessage: number;

    audio: File | null;
    delayAudio: number;

    image: File | null;
    video: File | null;
    doc: File | null;
  }[];
};

interface StepHeaderProps {
  isActive?: boolean;
  children: React.ReactNode;
}

const StepHeader = ({ isActive = false, children }: StepHeaderProps) => {
  return (
    <Text
      color={isActive ? "purple" : "text.secondary"}
      fontWeight={isActive ? "700" : "500"}
      fontSize="xs"
    >
      {children}
    </Text>
  );
};

type CreateFunnelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentFunnel?: Funnel;
  initialStep?: Step;
};

export const CreateFunnelModal: React.FC<CreateFunnelModalProps> = ({
  isOpen,
  onClose,
  currentFunnel,
  initialStep,
}) => {
  const { user } = useAuth();

  const [step, setStep] = useState<Step>(initialStep || "setup");
  const [shootIndex, setShootIndex] = useState(0);

  useEffect(() => {
    if (!!initialStep) {
      setStep(initialStep);
    }
  }, [initialStep]);

  const isUpdate = !!currentFunnel;
  const [funnel, setFunnel] = useState<Partial<Funnel>>(
    isUpdate ? currentFunnel : {}
  );

  const funnelWebhook = isUpdate
    ? `https://recupera-zap.vercel.app/api/${user!.id}/${funnel.id!}/webhook`
    : undefined;

  const StepComponents = {
    setup: <Setup setStep={setStep} funnel={funnel} setFunnel={setFunnel} />,
    shoot: (
      <Shoot
        setStep={setStep}
        setShootIndex={setShootIndex}
        funnel={funnel}
        setFunnel={setFunnel}
        index={shootIndex}
      />
    ),
    review: <Review setStep={setStep} funnel={funnel} setFunnel={setFunnel} />,
    webhook: (
      <Webhook
        setStep={setStep}
        funnel={funnel}
        onClose={onClose}
        funnelWebhook={funnelWebhook}
      />
    ),
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent bgColor="white" py={4}>
        <ModalCloseButton color="black" />

        <ModalBody>
          <VStack w="100%" px={8} spacing={12}>
            <HStack spacing={4}>
              <StepHeader isActive={step === "setup"}>Funil</StepHeader>
              <StepHeader isActive={step === "shoot"}>Disparos</StepHeader>
              <StepHeader isActive={step === "review"}>Revisão</StepHeader>
              <StepHeader isActive={step === "webhook"}>Webhook</StepHeader>
            </HStack>
            {StepComponents[step]}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
