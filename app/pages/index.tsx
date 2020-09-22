import React, { Suspense } from "react"
import { BlitzPage, useRouter, useQuery } from "blitz"
import { Button, Container, Spinner, Heading, List, ListItem } from "@chakra-ui/core"

import { useCurrentUser, CurrentUser } from "app/hooks/useCurrentUser"
import getCalendars from "app/queries/getCalendars"
import googleAuth from "app/mutations/googleAuth"
import Layout from "app/layouts/Layout"

const LoggedIn: React.FC<{ currentUser: CurrentUser }> = ({ currentUser }) => {
  const router = useRouter()

  const auth = async () => {
    const authorizeUrl = await googleAuth()
    router.push(authorizeUrl)
  }

  const [calendars] = useQuery(getCalendars, {})

  return calendars.ok ? (
    <>
      <Heading size="sm">Calendars: </Heading>
      <List>
        {calendars.data?.data.items?.map((calendar) => (
          <ListItem key={calendar.id}>{calendar.summary}</ListItem>
        ))}
      </List>
    </>
  ) : (
    <>
      <Heading size="sm">Token probably wrong</Heading>
      <Button onClick={auth}>Google auth</Button>
    </>
  )
}

const UserInfo: React.FC = () => {
  const currentUser = useCurrentUser()

  return (
    <Container>
      {currentUser ? (
        <Suspense fallback={<Spinner />}>
          <LoggedIn currentUser={currentUser} />
        </Suspense>
      ) : (
        <>
          <Heading>Welcome to GCAL app</Heading>
        </>
      )}
    </Container>
  )
}

const Home: BlitzPage = () => {
  return (
    <Suspense fallback={() => <Spinner />}>
      <UserInfo />
    </Suspense>
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
