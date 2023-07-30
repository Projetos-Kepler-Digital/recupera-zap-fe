import { Dispatch, SetStateAction } from "react";

import {
  Input,
  InputProps as ChakraInputProps,
  FormControl,
  FormLabel,
  Box,
  Text,
  VStack,
  HStack,
  Image,
  IconButton,
  useToast,
} from "@chakra-ui/react";

const getFileExtension = (file: File) => {
  const fileName = file.name;

  const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
  console.log({ fileExtension });

  return fileExtension;
};

export const findFileByExtension = (
  files: File[],
  extensions: string[]
): File | null => {
  for (const file of files) {
    const fileExtension = getFileExtension(file);
    const lowercaseFileExtension = fileExtension.toLowerCase();

    if (
      extensions.some(
        (extension) => extension.toLowerCase() === lowercaseFileExtension
      )
    ) {
      return file;
    }
  }

  return null;
};

interface FileDropProp {
  file: File;
  deleteFile: (file: File) => void;
}

const FileDrop = ({ file, deleteFile }: FileDropProp) => {
  return (
    <HStack w="100%" spacing={0}>
      <HStack
        w="100%"
        px={3}
        py={2}
        spacing={4}
        justify="space-between"
        border="solid 1px"
        borderColor="#68D391"
        borderRadius="md"
      >
        <Text color="#0F0F0F" fontWeight="500" fontSize="xs">
          {file.name}
        </Text>

        <Image alt="" src="/dashboard/main/check.svg" />
      </HStack>

      <IconButton
        aria-label="trash"
        icon={<Image alt="" src="/dashboard/main/trash.svg" />}
        bgColor="white"
        _hover={{}}
        _active={{}}
        onClick={() => deleteFile(file)}
      />
    </HStack>
  );
};

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  supportedFileTypes: string[];
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}

export const FileInput = ({
  name,
  supportedFileTypes,
  label,
  files,
  setFiles,
  ...rest
}: InputProps) => {
  const toast = useToast();

  const deleteFile = (file: File) => {
    setFiles((prev) => {
      if (!prev) return [];

      if (prev.includes(file)) {
        return prev.filter((val) => val !== file);
      }

      return prev;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setFiles((prev) => {
      const fileList = event.target.files;

      if (fileList && fileList.length > 0) {
        if (
          prev.some(
            (val) => getFileExtension(val) === getFileExtension(fileList[0])
          )
        ) {
          toast({
            title: "Tipo de arquivo já presente",
            description: "Possibilitamos somente 1 tipo de arquivo por disparo",
            status: "error",
            duration: 4000,
            containerStyle: {
              bgColor: "red",
              borderRadius: "md",
            },
          });

          return prev;
        }

        return prev ? [...prev, ...Array.from(fileList)] : Array.from(fileList);
      }

      return prev ? prev : [];
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();

    setFiles((prev) => {
      const fileList = event.dataTransfer.files;

      if (fileList && fileList.length > 0) {
        return prev ? [...prev, ...Array.from(fileList)] : Array.from(fileList);
      }

      return prev ? prev : [];
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl>
      {!!label && (
        <FormLabel pl={1} htmlFor={name} color="text.primary" fontSize="sm">
          {label}
        </FormLabel>
      )}

      <Box
        as={FormLabel}
        htmlFor={name}
        border="dashed 2px"
        borderColor="purple"
        borderRadius="xl"
        w="100%"
        minH="5rem"
        color="purple"
        _hover={{ opacity: 0.7, cursor: "pointer" }}
        {...rest}
      >
        <VStack
          w="100%"
          h="100%"
          minH="5rem"
          spacing={0}
          align="center"
          justify="center"
        >
          <Text fontSize="md">Upload dos arquivos</Text>
          <Text fontSize="xs">
            {supportedFileTypes.join(",").replaceAll(".", " ")}
          </Text>
        </VStack>
        <Input
          name={name}
          id={name}
          type="file"
          multiple
          accept={supportedFileTypes.join(",")}
          onChange={handleFileChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          pos="fixed"
          border="none"
          color="black"
          display="none"
        />
      </Box>

      <VStack w="100%" spacing={1}>
        {files?.map((file, index) => {
          return <FileDrop key={index} file={file} deleteFile={deleteFile} />;
        })}
      </VStack>
    </FormControl>
  );
};
