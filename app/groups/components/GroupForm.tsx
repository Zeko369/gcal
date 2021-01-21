import React from "react"
import { useForm } from "react-hook-form"
import { Button, VStack } from "@chakra-ui/react"
import { Input } from "app/components/Input"

export interface GroupFormData {
  name: string
}

interface GroupFormProps {
  initialValues?: Partial<GroupFormData>
  disabled?: boolean
  onSubmit: (data: GroupFormData) => Promise<void>
}

export const GroupForm: React.FC<GroupFormProps> = (props) => {
  const { initialValues, onSubmit, disabled } = props
  const { register, handleSubmit, formState } = useForm<GroupFormData>({
    defaultValues: initialValues,
  })

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} w="100%" align="flex-start">
      <Input name="name" ref={register({ required: true })} isRequired />

      <Button
        colorScheme="green"
        type="submit"
        isDisabled={disabled}
        isLoading={formState.isSubmitting}
      >
        {!!initialValues ? "Update" : "Create"}
      </Button>
    </VStack>
  )
}
