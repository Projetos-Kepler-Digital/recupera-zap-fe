'use client';

import React from 'react';

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  VStack,
} from '@chakra-ui/react';

import { Icon as IconComponent } from '@/components/Icon';

import { useFormContext } from 'react-hook-form';

interface FormInputProps extends InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  icon?: React.ReactElement<typeof IconComponent>;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  placeholder,
  icon,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <FormControl
      as={VStack}
      w="100%"
      align="start"
      spacing={0}
      isInvalid={!!error}
    >
      {label && (
        <FormLabel
          htmlFor={name}
          ml={1}
          color="gray.500"
          fontSize="sm"
          fontWeight="500"
        >
          {label}
        </FormLabel>
      )}

      <InputGroup>
        {!!icon && (
          <InputLeftElement as={FormLabel} htmlFor={name} h="100%">
            {icon}
          </InputLeftElement>
        )}

        <Input
          id={name}
          h={12}
          w="100%"
          placeholder={placeholder || label}
          _placeholder={{ fontSize: 'sm' }}
          color="gray.400"
          fontWeight="400"
          fontSize="sm"
          bgColor="white"
          rounded="xl"
          border="solid 1px"
          borderColor="gray.200"
          errorBorderColor="red.500"
          focusBorderColor="primary"
          _hover={{ opacity: 0.8 }}
          _active={{ opacity: 0.8 }}
          {...register(name, {
            valueAsNumber: props.type === 'number',
          })}
          {...props}
        />
      </InputGroup>

      {error && (
        <FormErrorMessage color="red.500" fontWeight="500" fontSize="xs">
          {error.message?.toString()}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};
