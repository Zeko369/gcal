import React, { forwardRef } from "react"
import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormControlProps,
} from "@chakra-ui/react"
import { ForwardRefRenderFunction } from "react"
import { capitalize } from "app/helpers"

interface InputProps extends ChakraInputProps {
  label?: string
  error?: string
  name?: string
  outerProps?: FormControlProps
}

const resoleType = (name: string): string | undefined => {
  switch (name.toLowerCase()) {
    case "email":
      return "email"
    case "password":
    case "confirm_password":
    case "current_password":
      return "password"
    default:
      return undefined
  }
}

const InputComponent: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (props, ref) => {
  const {
    name: baseName = "Input Field",
    isInvalid,
    isRequired,
    error,
    label,
    placeholder,
    outerProps,
    ...rest
  } = props

  const name = baseName.split("_").join(" ")

  return (
    <FormControl isInvalid={isInvalid || !!error} isRequired={isRequired} {...outerProps}>
      <FormLabel htmlFor={baseName}>{label || capitalize(name)}</FormLabel>
      <ChakraInput
        type={resoleType(baseName)}
        id={baseName}
        name={baseName}
        ref={ref}
        placeholder={placeholder || label || capitalize(name)}
        {...rest}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}

export const Input = forwardRef(InputComponent)
