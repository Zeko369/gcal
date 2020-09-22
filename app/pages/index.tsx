import React, { Suspense } from "react"
import { BlitzPage, useQuery } from "blitz"
import { Spinner, Heading, Box, Wrap } from "@chakra-ui/core"

import { useCurrentUser } from "app/hooks/useCurrentUser"
import Layout from "app/layouts/Layout"
import getCalendarsDB from "app/calendars/queries/getCalendars"

const HomePage: React.FC = () => {
  const [{ calendars }] = useQuery(getCalendarsDB, {})

  return (
    <Wrap>
      {calendars.map((calendar) => (
        <Box p={4} shadow="md" borderWidth="1px" key={calendar.id} w="250px">
          <Heading size="md">{calendar.name}</Heading>
        </Box>
      ))}
    </Wrap>
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
