import React, { Dispatch, SetStateAction, useState } from "react";

import { VStack, Button, HStack, Text } from "@chakra-ui/react";

import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

import type { Funnel, Step } from "../CreateFunnelModal";
import type { Shoot } from "@/database/types/Shoot";
import { uploadFileToStorage } from "@/database/functions";

interface InfoProps {
  label: string;
  children: React.ReactNode;
}

const Info = ({ label, children }: InfoProps) => {
  return (
    <HStack spacing={2} fontSize="xs">
      <Text color="text.secondary">{label}:</Text>
      <Text color="gray.500" fontWeight="700">
        {children}
      </Text>
    </HStack>
  );
};

type URLs = {
  audio: string | null;
  image: string | null;
  video: string | null;
  doc: string | null;
};

interface ReviewProps {
  setStep: Dispatch<SetStateAction<Step>>;
  funnel: Partial<Funnel>;
  setFunnel: Dispatch<SetStateAction<Partial<Funnel>>>;
}

export const Review: React.FC<ReviewProps> = ({
  setStep,
  funnel,
  setFunnel,
}) => {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = () => {
    setStep("shoot");
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    let funnelShoots: Shoot[] = [];

    for (const shoot of funnel.shoots!) {
      const urls: URLs = {
        audio: null,
        image: null,
        video: null,
        doc: null,
      };

      for (let key in urls) {
        const file = shoot[key as keyof typeof shoot] as File | null;

        if (!!file) {
          const url = await uploadFileToStorage(user!.id, file);
          urls[key as keyof typeof urls] = url;
        }
      }

      funnelShoots.push({
        index: shoot.index,
        startAt: shoot.startAt,
        message: shoot.message,
        delayMessage: shoot.delayMessage,
        audio: urls.audio,
        delayAudio: shoot.delayAudio,
        image: !!shoot.image
          ? {
              url: urls.image!,
              caption: shoot.image.name,
            }
          : null,
        video: !!shoot.video
          ? {
              url: urls.video!,
              caption: shoot.video.name,
            }
          : null,
        doc: !!shoot.doc
          ? {
              url: urls.doc!,
              filename: shoot.doc.name,
            }
          : null,
      });
    }

    const {
      data: { funnelId },
    } = await axios.post("/api/rest/funnel/create-funnel", {
      userId: user!.id,
      name: funnel.name,
      getaway: funnel.getaway,
      events: funnel.events,
      shoots: funnelShoots,
      id: funnel.id,
    });

    setFunnel((prev) => {
      return {
        id: funnelId,
        ...prev,
      };
    });

    setIsLoading(false);
    setStep("webhook");
  };

  return (
    <VStack w="100%" spacing={6} align="start">
      <VStack
        w="100%"
        p={6}
        align="start"
        bgColor="background"
        borderRadius="xl"
      >
        <Info label="Nome">{funnel.name}</Info>
        <Info label="Getaway">{funnel.getaway}</Info>
        <Info label="Disparos">{funnel.shoots?.length} disparos</Info>
        <Info label="Eventos">{funnel.events?.length} eventos</Info>
      </VStack>

      <HStack w="100%" spacing={4}>
        <Button
          w="100%"
          py={4}
          bgColor="white"
          borderRadius="lg"
          border="solid 1px"
          borderColor="purple"
          color="purple"
          fontWeight="700"
          fontSize="xs"
          textTransform="uppercase"
          _hover={{ textDecoration: "none", opacity: 0.9 }}
          _active={{ opacity: 0.7 }}
          onClick={handleGoBack}
        >
          Voltar
        </Button>

        <Button
          w="100%"
          py={4}
          background="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
          borderRadius="lg"
          color="white"
          fontWeight="700"
          fontSize="xs"
          textTransform="uppercase"
          _hover={{ textDecoration: "none", opacity: 0.9 }}
          _active={{ opacity: 0.9 }}
          isLoading={isLoading}
          onClick={handleConfirm}
        >
          Confirmar
        </Button>
      </HStack>
    </VStack>
  );
};
