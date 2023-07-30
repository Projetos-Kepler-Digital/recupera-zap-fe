import React, { Dispatch, SetStateAction, useState } from "react";

import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th as ChakraTh,
  TableColumnHeaderProps as ChakraThProps,
  Thead,
  Tr as ChakraTr,
  TableRowProps as ChakraTrProps,
  HStack,
  Button,
  useDisclosure,
  ButtonProps,
} from "@chakra-ui/react";

import {
  CreateFunnelModal,
  type Funnel as ShotsFunnel,
} from "../create-funnel/CreateFunnelModal";

import { format } from "date-fns";

import axios from "axios";
import { getFunnelShots, updateFunnel } from "@/database/functions";

import { useAuth } from "@/hooks/useAuth";

import type { Funnel } from "@/database/types/Funnel";
import type { User } from "@/database/types/User";

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

interface ThProps extends ChakraThProps {
  children: React.ReactNode;
}

const Th = ({ children, ...rest }: ThProps) => {
  return (
    <ChakraTh color="text.secondary" fontSize="10px" fontWeight="700" {...rest}>
      {children}
    </ChakraTh>
  );
};

interface TrProps extends ChakraTrProps {
  children: React.ReactNode;
}

const Tr = ({ children, ...rest }: TrProps) => {
  return (
    <ChakraTr color="text.primary" fontSize="sm" fontWeight="700" {...rest}>
      {children}
    </ChakraTr>
  );
};

interface ActionButtonProps extends ButtonProps {
  isLoading?: boolean;
  onClick: () => Promise<void>;
  children: React.ReactNode;
}

const ActionButton = ({
  isLoading,
  onClick,
  children,
  ...rest
}: ActionButtonProps) => {
  return (
    <Button
      bgColor="white"
      color="text.secondary"
      fontSize="xs"
      onClick={onClick}
      _hover={{ opacity: 0.7 }}
      _active={{ opacity: 0.7 }}
      isLoading={isLoading}
      {...rest}
    >
      {children}
    </Button>
  );
};

interface FunnelsTableProps {
  funnels: Funnel[];
}

export const FunnelsTable: React.FC<FunnelsTableProps> = ({ funnels }) => {
  const { user } = useAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDuplicate = async (
    userId: string,
    funnel: Funnel,
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ) => {
    setIsLoading(true);

    const shoots = await getFunnelShots(userId, funnel.id);

    await axios.post("/api/rest/funnel/create-funnel", {
      userId,
      name: funnel.name,
      getaway: funnel.getaway,
      events: funnel.events,
      shoots,
    });

    setIsLoading(false);
  };

  const [curFunnel, setCurFunell] = useState<ShotsFunnel | null>(null);
  const [initialStep, setInitialStep] = useState<"setup" | "webhook">("setup");

  const handleShow = async (
    funnel: Funnel,
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ) => {
    setIsLoading(true);

    const shoots = await getFunnelShots(user!.id, funnel.id);

    const fileShoots: any[] = [];
    await Promise.all(
      shoots.map(async (shoot) => {
        const midias = await Promise.all(
          [shoot.audio, shoot.doc, shoot.image, shoot.video].map(
            async (midia) => {
              if (!midia) return null;

              const url = typeof midia === "string" ? midia : midia.url;
              const {
                data: { fileData },
              } = await axios.post("/api/rest/download-from-storage", { url });

              const file = new File([fileData], "arquivo");
              return file;
            }
          )
        );

        fileShoots.push({
          ...shoot,
          audio: midias[0],
          doc: midias[1],
          image: midias[2],
          video: midias[3],
        });
      })
    );

    const funnelShoots = fileShoots.sort((a, b) => a.index - b.index);

    setCurFunell({ ...funnel, shoots: funnelShoots });
    setIsLoading(false);

    setInitialStep("webhook");
    onOpen();
  };

  const handleEdit = async (
    funnel: Funnel,
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ) => {
    setIsLoading(true);

    const shoots = await getFunnelShots(user!.id, funnel.id);

    const fileShoots: any[] = [];
    await Promise.all(
      shoots.map(async (shoot) => {
        const midias = await Promise.all(
          [shoot.audio, shoot.doc, shoot.image, shoot.video].map(
            async (midia) => {
              if (!midia) return null;

              const url = typeof midia === "string" ? midia : midia.url;
              const {
                data: { fileData },
              } = await axios.post("/api/rest/download-from-storage", { url });

              const file = new File([fileData], "arquivo");
              return file;
            }
          )
        );

        fileShoots.push({
          ...shoot,
          audio: midias[0],
          doc: midias[1],
          image: midias[2],
          video: midias[3],
        });
      })
    );

    const funnelShoots = fileShoots.sort((a, b) => a.index - b.index);

    setCurFunell({ ...funnel, shoots: funnelShoots });
    setIsLoading(false);

    setInitialStep("setup");
    onOpen();
  };

  const handleSuspend = async (
    funnel: Funnel,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    isActive: boolean
  ) => {
    setIsLoading(true);

    await updateFunnel(user!.id, funnel.id, {
      isActive,
    });

    window.location.href = "/dashboard";
  };

  const handleRemove = async (
    userId: string,
    funnelId: string,
    revenue: number,
    leadsReached: number,
    leadsRecovered: number,
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ) => {
    setIsLoading(true);

    await axios.post("/api/rest/funnel/delete-funnel", {
      userId,
      funnelId,
      revenue,
      leadsReached,
      leadsRecovered,
    });

    setIsLoading(false);
  };

  interface FunnelTrProps {
    funnel: Funnel;
    user: User;
  }

  const FunnelTr = ({ funnel, user }: FunnelTrProps) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
      <Tr>
        <Td>{funnel.name}</Td>
        <Td>
          {format(new Date(funnel.createdAt.seconds * 1000), "dd/MM/yyyy")}
        </Td>
        <Td isNumeric>{formatCurrency(funnel.revenue)}</Td>
        <Td isNumeric>{funnel.leadsReached.toLocaleString("pt-BR")}</Td>
        <Td isNumeric>{funnel.leadsRecovered.toLocaleString("pt-BR")}</Td>
        <Td isNumeric>
          {formatRatio(
            funnel.leadsReached !== 0
              ? funnel.leadsRecovered / funnel.leadsReached
              : 0
          )}
        </Td>
        {user && (
          <Td>
            <HStack ml={4} spacing={2}>
              <ActionButton
                onClick={async () => await handleShow(funnel, setIsLoading)}
                isLoading={isLoading}
              >
                Exibir
              </ActionButton>
              <ActionButton
                onClick={() => handleDuplicate(user.id, funnel, setIsLoading)}
                isLoading={isLoading}
              >
                Duplicar
              </ActionButton>
              <ActionButton
                onClick={async () => await handleEdit(funnel, setIsLoading)}
                isLoading={isLoading}
              >
                Editar
              </ActionButton>
              <ActionButton
                onClick={async () =>
                  await handleSuspend(funnel, setIsLoading, !funnel.isActive)
                }
                isLoading={isLoading}
              >
                {funnel.isActive ? "Suspender" : "Ativar"}
              </ActionButton>
              <ActionButton
                onClick={() =>
                  handleRemove(
                    user.id,
                    funnel.id,
                    funnel.revenue,
                    funnel.leadsReached,
                    funnel.leadsRecovered,
                    setIsLoading
                  )
                }
                isLoading={isLoading}
              >
                Remover
              </ActionButton>
            </HStack>
          </Td>
        )}
      </Tr>
    );
  };

  return (
    <>
      <TableContainer w="100%">
        <Table>
          <Thead>
            <Tr>
              <Th>Funil</Th>
              <Th>Criado em</Th>
              <Th isNumeric>Faturamento recuperado</Th>
              <Th isNumeric>Leads atingidos</Th>
              <Th isNumeric>Leads recuperados</Th>
              <Th isNumeric>Taxa de conversão</Th>
              <Th color="white">.</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!!user &&
              funnels.map((funnel, index) => (
                <FunnelTr key={index} funnel={funnel} user={user} />
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      {curFunnel && (
        <CreateFunnelModal
          isOpen={isOpen}
          onClose={onClose}
          currentFunnel={curFunnel}
          initialStep={initialStep}
        />
      )}
    </>
  );
};
