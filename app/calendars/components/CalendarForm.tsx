import { Button, Stack } from "@chakra-ui/core"
import { Input } from "app/components/Input"
import React from "react"
import { useForm } from "react-hook-form"

export interface CalendarFormData {
  name: string
}

interface CalendarFormProps {
  initialValues?: Partial<CalendarFormData>
  disabled?: boolean
  onSubmit: (data: CalendarFormData) => Promise<void>
  update?: boolean
}

export const CalendarForm: React.FC<CalendarFormProps> = (props) => {
  const { initialValues, update, onSubmit, children, disabled } = props
  const { register, handleSubmit, formState } = useForm<CalendarFormData>({
    defaultValues: initialValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Input name="name" ref={register({ required: true })} isRequired />
        {children}
        <Button
          colorScheme="green"
          type="submit"
          isDisabled={disabled}
          isLoading={formState.isSubmitting}
        >
          {update ? "Update" : "Create"}
        </Button>
      </Stack>
    </form>
  )
}
