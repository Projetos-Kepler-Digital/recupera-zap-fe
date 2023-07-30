import React, { ForwardRefRenderFunction, forwardRef } from "react";

import {
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";

import { FieldError } from "react-hook-form";

interface TextareaProps extends ChakraTextareaProps {
  name: string;
  label: string;
  placeholder: string;
  error?: FieldError;
}

const TextareaBase: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = ({ name, label, placeholder, error, ...rest }: TextareaProps, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && (
        <FormLabel pl={1} htmlFor={name} color="text.primary" fontSize="sm">
          {label}
        </FormLabel>
      )}

      <ChakraTextarea
        name={name}
        id={name}
        ref={ref}
        py={3}
        placeholder={placeholder}
        errorBorderColor="none"
        color="text.secondary"
        fontWeight="400"
        fontSize="sm"
        border="solid 1px"
        borderColor="gray.200"
        borderRadius="2xl"
        bgColor="white"
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

export const Textarea = forwardRef(TextareaBase);
