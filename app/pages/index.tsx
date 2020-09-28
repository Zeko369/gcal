import React, { Suspense, useCallback, useMemo } from "react"
import { BlitzPage, useQuery } from "blitz"
import {
  Spinner,
  Heading,
  Text,
  VStack,
  Flex,
  IconButton,
  HStack,
  SimpleGrid,
  Box,
  Select,
  Button,
  Grid,
} from "@chakra-ui/core"
import { Calendar } from "@prisma/client"
import { Link, LinkIconButton } from "chakra-next-link"
import { ArrowLeftIcon, DeleteIcon, EditIcon, ArrowRightIcon } from "@chakra-ui/icons"

import { useCurrentUser } from "app/hooks/useCurrentUser"
import Layout from "app/layouts/Layout"
import getCalendarsDB from "app/calendars/queries/getCalendars"
import getEvents from "app/queries/getEvents"
import { useStore, Scale, intervals } from "app/lib/reducer"
import { timeMax, timeMin } from "app/lib/time"

const format = (n: number) => Math.round(n * 100) / 100

const CalendarEvents: React.FC<{ calendar: Calendar }> = ({ calendar }) => {
  const { state } = useStore()
  const [{ data }] = useQuery(getEvents, {
    calendarId: calendar.uuid,
    timeMin: timeMin(state.date),
    timeMax: timeMax(state.date),
  })

  if (!data) {
    return (
      <Heading size="lg" color="red">
        Error reading gcal
      </Heading>
    )
  }

  return (
    <VStack align="flex-start" spacing="1">
      <Text size="md">
        Hours:{" "}
        <strong>
          {format(data.soFar / 60)}h [{format(data.all / 60)}]
        </strong>
      </Text>
      <Text>Count: {data.formatted.length}</Text>
    </VStack>
  )
}

const dFormat = (date: Date, scale: Scale) => {
  switch (scale) {
    case "day":
      return `Day: ${date.toLocaleDateString()}`
    case "week":
      return `Week: ${date.toLocaleDateString()} - ${"end.week(date).toLocaleDateString()"}`
    case "month":
      return `Month: ${date.toLocaleDateString().slice(3)}`
    case "year":
      return `Year: ${date.getFullYear()}`
  }
}

const HomePage: React.FC = () => {
  const [{ calendars }] = useQuery(getCalendarsDB, {})
  const { dispatch, state } = useStore()

  const onChange = useCallback(
    (e) => {
      const scale = e.target.value as Scale
      const value = intervals.find((i) => i.key === scale)!.value

      dispatch({ type: "setScale", payload: { value: scale } })
      dispatch({ type: "setValue", payload: { value } })
    },
    [dispatch]
  )

  const date = useMemo(() => dFormat(state.date.value, state.date.scale), [state])

  return (
    <Box>
      <Grid templateColumns="1fr 2fr 1fr" gap={3}>
        <Button
          colorScheme="blue"
          onClick={() => dispatch({ type: "val--" })}
          leftIcon={<ArrowLeftIcon />}
        >
          Previous
        </Button>
        <Select mb="3" onChange={onChange} value={state.date.scale}>
          {intervals.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Button
          colorScheme="blue"
          onClick={() => dispatch({ type: "val++" })}
          rightIcon={<ArrowRightIcon />}
        >
          Next
        </Button>
      </Grid>
      <Flex justify="space-between">
        <Heading size="lg" mb="2">
          {date}
        </Heading>
        <Button colorScheme="green" onClick={() => dispatch({ type: "reset" })}>
          Reset
        </Button>
      </Flex>
      <SimpleGrid columns={3} spacing={3}>
        {calendars.map((calendar) => (
          <VStack p="4" pt="2" shadow="md" borderWidth="1px" key={calendar.id} align="flex-start">
            <Flex justify="space-between" w="100%">
              <Link href="/calendars/[id]" as={`/calendars/${calendar.id}`}>
                <Heading size="md">{calendar.name}</Heading>
              </Link>
              <HStack>
                <LinkIconButton
                  size="xs"
                  colorScheme="green"
                  icon={<EditIcon />}
                  href="/calendars/[id]/edit"
                  as={`/calendars/${calendar.id}/edit`}
                  aria-label="edit"
                />
                <IconButton size="xs" colorScheme="red" icon={<DeleteIcon />} aria-label="delete" />
              </HStack>
            </Flex>
            <Suspense fallback={<Spinner />}>
              <CalendarEvents calendar={calendar} />
            </Suspense>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  )
}

const Main: React.FC = () => {
  const currentUser = useCurrentUser()

  return currentUser ? (
    <HomePage />
  ) : (
    <>
      <Heading>Welcome to GCAL app</Heading>
      <Heading size="lg">Go login</Heading>
    </>
  )
}

const Home: BlitzPage = () => {
  return (
    <Suspense fallback={() => <Spinner />}>
      <Main />
    </Suspense>
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
