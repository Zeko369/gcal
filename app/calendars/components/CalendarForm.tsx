import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  Button,
  FormControl,
  FormLabel,
  Select,
  VStack,
  useTheme,
  Switch,
  Text,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react"
import { Input } from "app/components/Input"
import getGroups from "app/groups/queries/getGroups"
import { useQuery } from "blitz"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { CALENDAR_CARD_COLOR_VARIANT } from "app/constants/colors"

export interface CalendarFormData {
  name: string
  pricePerHour?: number | null
  groupId?: number
  currency?: string | null
  currencyBefore: boolean
  order?: number
  color?: string | null
}

interface CalendarFormProps {
  initialValues?: Partial<CalendarFormData>
  disabled?: boolean
  onSubmit: (data: CalendarFormData) => Promise<void>
  update?: boolean
}

const ignoreColors = ["transparent", "current", "whiteAlpha", "blackAlpha"]
const noNumber = ["current", "white", "black"]

export const CalendarForm: React.FC<CalendarFormProps> = (props) => {
  const { initialValues, update, onSubmit, children, disabled } = props
  const [groups] = useQuery(getGroups, undefined)
  const { register, handleSubmit, formState, watch, setValue } = useForm<CalendarFormData>({
    defaultValues: initialValues,
  })

  const theme = useTheme()
  const colors = Object.keys(theme.colors).filter((color) => !ignoreColors.includes(color))

  useEffect(() => {
    register("color")
  }, [register])

  const selectedColor = watch("color")

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} w="100%" align="flex-start">
      <Input name="name" ref={register({ required: true })} isRequired />
      <FormControl isRequired>
        <FormLabel htmlFor="color">Color</FormLabel>
        <SimpleGrid columns={9} gap="1">
          {colors.map((color) => {
            const hasPalette = !noNumber.includes(color)
            const bg = `${color}${hasPalette ? `.${CALENDAR_CARD_COLOR_VARIANT}` : ""}`
            const check = hasPalette ? `${color}.800` : "red.500"

            return (
              <Flex
                bg={bg}
                h="16"
                justifyContent="center"
                alignItems="center"
                pos="relative"
                cursor="pointer"
                onClick={() => setValue("color", color)}
              >
                {selectedColor === color && (
                  <CheckCircleIcon pos="absolute" top="1" right="1" h="5" w="5" color={check} />
                )}
                <Text>{color}</Text>
              </Flex>
            )
          })}
        </SimpleGrid>
      </FormControl>
      <Input
        name="pricePerHour"
        label="Price per hour"
        ref={register({ valueAsNumber: true })}
        type="number"
      />
      <Input name="currency" ref={register()} type="text" />
      <FormControl>
        <FormLabel mb="0">Currency before value</FormLabel>
        <Switch name="currencyBefore" ref={register()} type="text" />
      </FormControl>
      {update && (
        <Input
          name="order"
          ref={register({ required: true, valueAsNumber: true })}
          isRequired
          type="number"
        />
      )}

      {groups.length > 0 && (
        <FormControl isRequired>
          <FormLabel htmlFor="groupId">Group</FormLabel>
          <Select ref={register({ valueAsNumber: true })} name="groupId">
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </Select>
        </FormControl>
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
    </VStack>
  )
}
