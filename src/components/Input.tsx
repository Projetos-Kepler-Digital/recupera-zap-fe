import { ForwardRefRenderFunction, forwardRef, useState } from "react";

import {
  FormControl,
  FormErrorMessage,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormLabel,
} from "@chakra-ui/react";

import { FieldError } from "react-hook-form";

interface InputProps extends ChakraInputProps {
  name: string;
  placeholder: string;
  label?: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, placeholder, label, error, ...rest }: InputProps,
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && (
        <FormLabel pl={1} htmlFor={name} color="text.primary" fontSize="sm">
          {label}
        </FormLabel>
      )}

      <ChakraInput
        ref={ref}
        name={name}
        id={name}
        placeholder={placeholder}
        color="text.secondary"
        fontWeight="400"
        fontSize="sm"
        errorBorderColor="none"
        bgColor="white"
        border="solid 1px"
        borderColor="gray.200"
        borderRadius="2xl"
        p={4}
        py={5}
        {...rest}
      />

      {!!error && (
        <FormErrorMessage color="#CB1F1F" fontSize="xs" mt="0.2rem">
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
