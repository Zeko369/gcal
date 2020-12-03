import { Button, FormControl, FormLabel, Select, Stack, useTheme } from "@chakra-ui/react"
import { Input } from "app/components/Input"
import React from "react"
import { useForm } from "react-hook-form"

export interface CalendarFormData {
  name: string
  order?: number
  color?: string
}

interface CalendarFormProps {
  initialValues?: Partial<CalendarFormData>
  disabled?: boolean
  onSubmit: (data: CalendarFormData) => Promise<void>
  update?: boolean
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
        <FormControl isRequired>
          <FormLabel htmlFor="color">Color</FormLabel>
          <Select ref={register({ required: true })} isRequired name="color" bg={`${color}.300`}>
            {colors.map((color) => (
              <option value={color}>{color}</option>
            ))}
          </Select>
        </FormControl>
        {update && (
          <Input
            name="order"
            ref={register({ required: true, valueAsNumber: true })}
            isRequired
            type="number"
          />
        )}
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
