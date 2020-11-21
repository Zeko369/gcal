import { Button, color, Select, Stack, useTheme } from "@chakra-ui/core"
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
  color?: string
}

const ignoreColors = ["transparent"]

export const CalendarForm: React.FC<CalendarFormProps> = (props) => {
  const { initialValues, update, onSubmit, children, disabled } = props
  const { register, handleSubmit, formState, watch } = useForm<CalendarFormData>({
    defaultValues: initialValues,
  })

  const theme = useTheme()
  const colors = Object.keys(theme.colors).filter((color) => !ignoreColors.includes(color))

  const color = watch("color")

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Input name="name" ref={register({ required: true })} isRequired />
        <Select ref={register({ required: true })} isRequired name="color" bg={`${color}.300`}>
          {colors.map((color) => (
            <option value={color}>{color}</option>
          ))}
        </Select>
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
