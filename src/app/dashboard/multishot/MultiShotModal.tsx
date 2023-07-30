import React, { useEffect, useState } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  VStack,
  Heading,
  Box,
  Text,
  Checkbox,
  CheckboxProps,
  SimpleGrid,
  Button,
  useToast,
} from "@chakra-ui/react";

import { Funnel } from "../create-funnel/CreateFunnelModal";

import { FileInput } from "@/components/FileInput";
import { Input } from "@/components/Input";

import { useAuth } from "@/hooks/useAuth";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import * as xlsx from "xlsx";
import axios from "axios";

import { Timestamp } from "firebase/firestore";
import { createWorker, getFunnelShots, reachLead } from "@/database/functions";
import { Lead } from "@/database/types/Lead";
import { formatPhoneNumber } from "@/lib/formatPhoneNumber";

const incrementTimestamp = (timestamp: Timestamp, increment: number) => {
  const milliseconds = timestamp.toMillis();
  const newTimestamp = new Timestamp(
    Math.floor(milliseconds / 1000 + increment * 60),
    milliseconds % 1000
  );

  return newTimestamp;
};

interface MyCheckBoxProps extends CheckboxProps {
  children: React.ReactNode;
}

const MyCheckBox = ({ children, ...rest }: MyCheckBoxProps) => {
  return (
    <Box w="100%">
      <Checkbox
        iconColor="white"
        borderColor="text.secondary"
        color="text.secondary"
        fontWeight="400"
        _checked={{
          color: "text.primary",
          fontWeight: "500",
          borderColor: "black.100",
        }}
        {...rest}
      >
        <Text fontSize="xs">{children}</Text>
      </Checkbox>
    </Box>
  );
};

type FormData = {
  delay: number;
};

const validationSchema = yup.object().shape({
  delay: yup
    .number()
    .integer()
    .typeError("Valor inválido")
    .required("Campo obrigatório"),
});

interface MultiShotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiShotModal: React.FC<MultiShotModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();

  const [files, setFiles] = useState<File[]>([]);

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const { errors } = formState;

  const [userFunnels, setUserFunnels] = useState<Funnel[] | null>(null);
  const [funnel, setFunnel] = useState<Funnel | null>(null);

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

  const toast = useToast();
  const errorToast = (title: string, description: string) =>
    toast({
      title,
      description,
      status: "error",
      duration: 4000,
      containerStyle: {
        bgColor: "red",
        borderRadius: "md",
      },
    });

  const onSubmit: SubmitHandler<FormData> = async ({ delay }) => {
    if (!funnel) {
      return errorToast(
        "Valores inválidos",
        "Escolha o funil para os disparos."
      );
    }

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(files[0]);
      reader.onload = async (e) => {
        const file = e.target?.result;

        const workbook = xlsx.read(file, { type: "buffer" });
        const name = workbook.SheetNames[0];
        const sheet = workbook.Sheets[name];
        const data = xlsx.utils.sheet_to_json(sheet) as {
          telefone: number;
          nome?: string;
        }[];

        console.log(data);

        const leads: Lead[] = data.map((datum, index) => ({
          name: datum.nome || null,
          phone: formatPhoneNumber(datum.telefone.toString()),
          email: null,
          cpf: null,
          pixCode: null,
          boletoUrl: null,
          checkout: null,
        }));

        const shoots = await getFunnelShots(user!.id, funnel.id!);
        let performAt = Timestamp.fromDate(new Date());

        const promises: Promise<any>[] = [];

        leads.forEach((lead, index) => {
          shoots.forEach((shoot, index) => {
            performAt = incrementTimestamp(performAt, delay / 60);
            const worker = createWorker(
              user!.id,
              funnel.id!,
              lead,
              shoot,
              performAt
            ).catch(console.log);

            promises.push(worker);
          });

          const reach = reachLead(user!.id, funnel.id!, lead.phone).catch(
            console.log
          );
          promises.push(reach);
        });

        return await Promise.all(promises);
      };
    } catch (err) {
      console.log(err);
      return errorToast(
        "Houve um erro com sua planilha",
        "Verifique se ela está na formação correta."
      );
    }

    // add extração de leads através do documento

    // add criação de worker para cada lead
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
          <VStack
            as="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            w="100%"
            align="start"
            px={6}
            spacing={6}
          >
            <Heading color="text.primary" fontSize="lg" fontWeight="700">
              Envio em massa
            </Heading>

            <VStack spacing={4} align="start">
              <Text color="text.primary" fontSize="sm" fontWeight="500">
                Funil de disparo
              </Text>

              <SimpleGrid w="100%" rowGap={2} columnGap={2} columns={2}>
                {userFunnels &&
                  userFunnels.map((_funnel, index) => {
                    return (
                      <MyCheckBox
                        key={index}
                        isChecked={_funnel === funnel}
                        onChange={(event) =>
                          setFunnel((prev) =>
                            event.target.checked ? userFunnels[index] : prev
                          )
                        }
                      >
                        {_funnel.name}
                      </MyCheckBox>
                    );
                  })}
              </SimpleGrid>
            </VStack>

            <FileInput
              name="file"
              label="Leads"
              supportedFileTypes={[".xlsx"]}
              files={files}
              setFiles={setFiles}
            />

            <Input
              label="Delay"
              placeholder="Segundos"
              {...register("delay")}
              error={errors.delay}
              borderRadius="xl"
              type="number"
            />

            <Button
              type="submit"
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
              isLoading={formState.isSubmitting}
            >
              Enviar
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
