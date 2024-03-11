'use client';

import React from 'react';

import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from '@chakra-ui/react';

import { useFormContext } from 'react-hook-form';
import { Icon } from '../Icon';

interface FormMenuProps extends ButtonProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: Record<string, string | number>;
}

export const FormMenu: React.FC<FormMenuProps> = ({
  name,
  label,
  placeholder,
  options,
  ...props
}) => {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  const currentValue = watch(name);

  const current = Object.entries(options).find(
    ([_, value]) => value === currentValue
  );

  const error = errors[name];

  const optionsLeft = Object.entries(options).filter(
    ([_, val]) => val !== currentValue
  );

  const handleChange = (value: string | number) => {
    setValue(name, value);
    trigger(name);
  };

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
          color="gray.700"
          fontSize="sm"
          fontWeight="500"
        >
          {label}
        </FormLabel>
      )}

      <Menu
        {...register(name, {
          setValueAs: (val) => val || '',
        })}
      >
        <MenuButton
          as={Button}
          w="100%"
          h={12}
          bgColor="white"
          color="gray.400"
          fontSize="sm"
          fontWeight="500"
          textAlign="left"
          border="solid 1px"
          borderWidth={!!error ? '2px' : '1px'}
          borderColor={!!error ? 'red.500' : 'gray.200'}
          rounded="xl"
          textTransform="none"
          rightIcon={<Icon name="down" color="gray.400" />}
          disabled={optionsLeft.length === 0}
          _hover={{ opacity: 0.8 }}
          _focus={{
            borderWidth: '2px',
            borderColor: 'primary',
          }}
          _active={{
            opacity: 0.8,
            borderWidth: '2px',
            borderColor: 'primary',
          }}
          {...props}
        >
          {current ? current[0] : placeholder}
        </MenuButton>

        <MenuList bgColor="white">
          {optionsLeft.map(([key, val]) => (
            <MenuItem
              key={key}
              bgColor="white"
              color="gray.400"
              _hover={{ opacity: 0.8 }}
              _active={{ opacity: 0.8 }}
              onClick={() => handleChange(val)}
            >
              {key}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      {error && (
        <FormErrorMessage color="red.500" fontWeight="500" fontSize="xs">
          {error.message?.toString()}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};
