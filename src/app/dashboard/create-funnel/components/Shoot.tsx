import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import {
  Button,
  ButtonProps,
  HStack,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { FileInput, findFileByExtension } from "@/components/FileInput";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import type { Funnel, Step } from "../CreateFunnelModal";

interface MyButtomProps extends ButtonProps {
  children: React.ReactNode;
}

const MyButton = ({ children, ...rest }: MyButtomProps) => {
  return (
    <Button
      px={4}
      py={4}
      borderRadius="xl"
      color="white"
      fontWeight="700"
      fontSize="xs"
      textTransform="uppercase"
      _hover={{ textDecoration: "none", opacity: 0.9 }}
      _active={{ opacity: 0.9 }}
      {...rest}
    >
      {children}
    </Button>
  );
};

type FormData = {
  startAt: number;
  message: string | undefined;
  delayMessage: number | undefined;
  delayAudio: number | undefined;
};

const validationSchema = yup.object().shape({
  startAt: yup
    .number()
    .required("Este campo é obrigatório.")
    .typeError("Valor inválido."),
  message: yup.string(),
  delayMessage: yup.number().integer().typeError("Valor inválido."),
  delayAudio: yup.number().integer().typeError("Valor inválido."),
});

interface ShootProps {
  setStep: Dispatch<SetStateAction<Step>>;
  setShootIndex: Dispatch<SetStateAction<number>>;
  funnel: Partial<Funnel>;
  setFunnel: Dispatch<SetStateAction<Partial<Funnel>>>;
  index: number;
}

export const Shoot: React.FC<ShootProps> = ({
  setStep,
  setShootIndex,
  funnel,
  setFunnel,
  index,
}) => {
  const toast = useToast();

  const [files, setFiles] = useState<File[]>([]);

  const { register, handleSubmit, formState, reset, trigger, watch, setValue } =
    useForm<FormData>({
      resolver: yupResolver(validationSchema),
    });

  const { errors } = formState;

  useEffect(() => {
    if (!funnel.shoots || !funnel.shoots[index]) {
      reset();
      setFiles([]);

      return;
    }

    const shoot = funnel.shoots[index];

    setValue("startAt", shoot.startAt);
    setValue("message", shoot.message || undefined);
    setValue("delayMessage", shoot.delayMessage || undefined);
    setValue("delayAudio", shoot.delayAudio || undefined);
    setFiles(
      [shoot.audio, shoot.doc, shoot.image, shoot.video].filter(
        (file) => file !== null
      ) as File[]
    );
  }, [index]);

  const handleGoBack = () => {
    if (index === 0) {
      setStep("setup");
      return;
    }

    setShootIndex((prev) => prev - 1);
  };

  const handleExclude = async () => {
    if (!funnel.shoots || funnel.shoots.length === 0) {
      return setStep("setup");
    }

    setShootIndex((prev) => (index === 0 ? prev : prev - 1));

    setFunnel((prev) => {
      return {
        ...prev,
        shoots: [...prev.shoots!.filter((_, i) => i !== index)],
      };
    });
  };

  const handleNewShoot = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    if (!watch("message") && files.length === 0) {
      toast({
        title: "Valores inválidos",
        description: "Configure ao menos 1 tipo de mensagem no seu disparo.",
        status: "error",
        duration: 4000,
        containerStyle: {
          bgColor: "red",
          borderRadius: "md",
        },
      });

      return;
    }

    const newShoot = {
      index,
      startAt: Number(watch("startAt")),
      message: watch("message") ?? null,
      delayMessage: watch("delayMessage") ?? 0,
      audio: findFileByExtension(files, ["mp3"]),
      delayAudio: watch("delayAudio") ?? 0,
      image: findFileByExtension(files, ["png", "jpg"]),
      video: findFileByExtension(files, ["mp4"]),
      doc: findFileByExtension(files, ["pdf"]),
    };

    setFunnel((prev) => {
      if (!prev.shoots) {
        return {
          ...prev,
          shoots: [newShoot],
        };
      }

      if (index + 1 > prev.shoots.length) {
        return {
          ...prev,
          shoots: [...prev.shoots, newShoot],
        };
      }

      return {
        ...prev,
        shoots: [
          ...prev.shoots.map((shoot, i) => {
            if (i === index) return newShoot;
            return shoot;
          }),
        ],
      };
    });

    setShootIndex((prev) => prev + 1);
  };

  const onSubmit: SubmitHandler<FormData> = async ({ startAt, message }) => {
    if (!watch("message") && files.length === 0) {
      toast({
        title: "Valores inválidos",
        description: "Configure ao menos 1 tipo de mensagem no seu disparo.",
        status: "error",
        duration: 4000,
        containerStyle: {
          bgColor: "red",
          borderRadius: "md",
        },
      });

      return;
    }

    setFunnel((prev) => {
      return {
        ...prev,
        shoots: [
          ...(prev.shoots?.slice(0, index) ?? []),
          {
            index,
            startAt: Number(watch("startAt")),
            message: watch("message") ?? null,
            delayMessage: watch("delayMessage") ?? 0,
            audio: findFileByExtension(files, ["mp3"]),
            delayAudio: watch("delayAudio") ?? 0,
            image: findFileByExtension(files, ["png", "jpg"]),
            video: findFileByExtension(files, ["mp4"]),
            doc: findFileByExtension(files, ["pdf"]),
          },
          ...(prev.shoots?.slice(index + 1) ?? []),
        ],
      };
    });

    setStep("review");
  };

  return (
    <VStack
      as="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      w="100%"
      spacing={4}
    >
      <HStack w="100%" justify="end" my={-6}>
        <Text color="text.primary" fontSize="sm" fontWeight="700">{`${
          index + 1
        }/${(funnel.shoots?.length || 0) + 1}`}</Text>
      </HStack>

      <Input
        label="Tempo de disparo após último evento"
        placeholder="Segundos"
        {...register("startAt")}
        error={errors.startAt}
        borderRadius="xl"
        type="number"
      />

      <Textarea
        label="Mensagem"
        placeholder="Digite a mensagem aqui"
        {...register("message")}
        error={errors.message}
        borderRadius="xl"
      />

      <HStack w="100%">
        <Input
          label={`Tempo de "digitando..."`}
          placeholder="Segundos"
          {...register("delayMessage")}
          error={errors.delayMessage}
          borderRadius="xl"
          type="number"
        />

        <Input
          label={`Tempo de "gravando áudio..."`}
          placeholder="Segundos"
          {...register("delayAudio")}
          error={errors.delayAudio}
          borderRadius="xl"
          type="number"
        />
      </HStack>

      <FileInput
        name="file"
        label="Mídia"
        supportedFileTypes={[".mp3", ".pdf", ".png", ".jpg", ".mp4"]}
        files={files}
        setFiles={setFiles}
      />

      <HStack w="100%" spacing={2} justify="space-between">
        <MyButton
          bgColor="transparent"
          border="solid 1px"
          borderColor="purple"
          color="purple"
          onClick={handleGoBack}
        >
          Voltar
        </MyButton>
        <MyButton
          bgColor="transparent"
          border="solid 1px"
          borderColor="red"
          color="red"
          onClick={handleExclude}
        >
          Excluir
        </MyButton>
        <MyButton bgColor="purple" onClick={handleNewShoot}>
          Disparo {`>`}
        </MyButton>
        <MyButton
          type="submit"
          bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
        >
          Concluir
        </MyButton>
      </HStack>
    </VStack>
  );
};
