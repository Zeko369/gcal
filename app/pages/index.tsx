import React, { Suspense } from "react"
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
} from "@chakra-ui/core"

import { useCurrentUser } from "app/hooks/useCurrentUser"
import Layout from "app/layouts/Layout"
import getCalendarsDB from "app/calendars/queries/getCalendars"
import getEvents from "app/queries/getEvents"
import { Calendar } from "@prisma/client"
import { LinkIconButton } from "chakra-next-link"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"

const CalendarEvents: React.FC<{ calendar: Calendar }> = ({ calendar }) => {
  const [{ data }] = useQuery(getEvents, { calendarId: calendar.uuid })

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
          {data.soFar / 60}h [{data.all / 60}]
        </strong>
      </Text>
      <Text>Count: {data.formatted.length}</Text>
    </VStack>
  )
}

const HomePage: React.FC = () => {
  const [{ calendars }] = useQuery(getCalendarsDB, {})

  return (
    <SimpleGrid columns={3} spacing={5}>
      {calendars.map((calendar) => (
        <VStack p="4" pt="2" shadow="md" borderWidth="1px" key={calendar.id} align="flex-start">
          <Flex justify="space-between" w="100%">
            <Heading size="lg">{calendar.name}</Heading>
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
