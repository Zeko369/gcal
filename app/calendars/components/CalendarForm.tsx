import { Button, Stack } from "@chakra-ui/core"
import { Field } from "app/components/Field"
import React from "react"
import { useForm } from "react-hook-form"

export interface CalendarFormData {
  name: string
}

interface CalendarFormProps {
  initialValues?: Partial<CalendarFormData>
  onSubmit: (data: CalendarFormData) => Promise<void>
  update?: boolean
}

export const CalendarForm = ({ initialValues, update, onSubmit }: CalendarFormProps) => {
  const { register, handleSubmit } = useForm<CalendarFormData>({ defaultValues: initialValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Field name="name" ref={register({ required: true })} isRequired />
        <Button type="submit">{update ? "Update" : "Create"}</Button>
      </Stack>
    </form>
  )
}
