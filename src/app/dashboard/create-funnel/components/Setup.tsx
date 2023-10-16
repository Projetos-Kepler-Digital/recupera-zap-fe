import React, { Dispatch, SetStateAction, useState } from 'react';

import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  VStack,
  Text,
  MenuItem,
  SimpleGrid,
  Checkbox,
  CheckboxProps,
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Input } from '@/components/Input';

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import type { Step } from '../CreateFunnelModal';
import { Events, type Funnel, type Getaway } from '@/database/types/Funnel';

type FormData = {
  name: string;
};

const validationSchema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório.'),
});

const Getaways: Getaway[] = [
  'Hotmart',
  // "Monetize",
  'Kiwify',
  'Perfectpay',
  'Edduz',
  // "Pepper",
];

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
          color: 'text.primary',
          fontWeight: '500',
          borderColor: 'black.100',
        }}
        {...rest}
      >
        <Text fontSize="xs">{children}</Text>
      </Checkbox>
    </Box>
  );
};

interface SetupProps {
  setStep: Dispatch<SetStateAction<Step>>;
  funnel: Partial<Funnel>;
  setFunnel: Dispatch<SetStateAction<Partial<Funnel>>>;
}

export const Setup: React.FC<SetupProps> = ({ setStep, funnel, setFunnel }) => {
  const toast = useToast();

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: funnel.name ?? '',
    },
  });
  const { errors } = formState;

  const [getaway, setGetaway] = useState<Getaway>(funnel.getaway ?? 'Hotmart');

  const [checkedEvents, setCheckedEvents] = useState<{
    [key: string]: boolean;
  }>(
    Events[getaway].reduce((acc, event) => {
      acc[event] = !!funnel.events ? funnel.events.includes(event) : false;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  const onSubmit: SubmitHandler<FormData> = async ({ name }) => {
    if (!Object.values(checkedEvents).some((value) => value === true)) {
      toast({
        title: 'Valores inválidos',
        description: 'Selecione ao menos um evento de ativação.',
        status: 'error',
        duration: 4000,
        containerStyle: {
          bgColor: 'red',
          borderRadius: 'md',
        },
      });

      return;
    }

    const funnelEvents = Object.keys(checkedEvents).filter(
      (key) => checkedEvents[key] === true
    );

    setFunnel((prev) => {
      return {
        ...prev,
        name,
        getaway,
        events: funnelEvents,
      };
    });

    setStep('shoot');
  };

  const DropdownItem = (option: Getaway, key: number) => {
    return (
      <MenuItem
        onClick={() => {
          setGetaway(option);
        }}
        key={key}
        color="text.secondary"
        _hover={{ backgroundColor: 'white', opacity: 0.7 }}
        _active={{ backgroundColor: 'white', opacity: 0.7 }}
        _focus={{ backgroundColor: 'white' }}
      >
        {option}
      </MenuItem>
    );
  };

  return (
    <VStack
      as="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      w="100%"
      spacing={6}
    >
      <Input
        label="Nome do funil"
        placeholder="Nome do funil"
        {...register('name')}
        error={errors.name}
        borderRadius="xl"
      />

      <VStack w="100%" align="start">
        <Text color="text.primary" fontSize="sm" fontWeight="500">
          Getaway de pagamento
        </Text>
        <Menu>
          <MenuButton
            as={Button}
            background="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            _hover={{ opacity: 0.7 }}
            _active={{ opacity: 0.7 }}
            fontWeight="regular"
            w="100%"
            py={2}
          >
            <HStack color="black" justify="space-between">
              <Box mt={1}>
                <Text color="text.secondary" fontWeight="500" fontSize="sm">
                  {getaway}
                </Text>
              </Box>
              <ChevronDownIcon />
            </HStack>
          </MenuButton>
          <MenuList background="white" borderColor="gray.200" w="100%">
            {Getaways.filter((value) => value !== getaway).map((option, key) =>
              DropdownItem(option, key)
            )}
          </MenuList>
        </Menu>
      </VStack>

      <VStack w="100%" align="start">
        <Text color="text.primary" fontSize="sm" fontWeight="500">
          Eventos de ativação
        </Text>

        <SimpleGrid w="100%" rowGap={2} columnGap={2} columns={2}>
          {Events[getaway].map((event, index) => {
            return (
              <MyCheckBox
                key={index}
                isChecked={checkedEvents[event]}
                onChange={(e) =>
                  setCheckedEvents((prev) => {
                    return {
                      ...prev,
                      [event]: e.target.checked,
                    };
                  })
                }
              >
                {event}
              </MyCheckBox>
            );
          })}
        </SimpleGrid>
      </VStack>

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
        _hover={{ textDecoration: 'none', opacity: 0.9 }}
        _active={{ opacity: 0.9 }}
      >
        Continuar
      </Button>
    </VStack>
  );
};
