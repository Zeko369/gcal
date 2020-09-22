import React, { Suspense } from "react"
import { BlitzPage, useRouter, useQuery } from "blitz"
import { Button, Container, Spinner, Heading, List, ListItem } from "@chakra-ui/core"

import { useCurrentUser, CurrentUser } from "app/hooks/useCurrentUser"
import getCalendars from "app/queries/getCalendars"
import googleAuth from "app/mutations/googleAuth"
import { LinkButton } from "app/components/Link"
import logout from "app/auth/mutations/logout"
import Layout from "app/layouts/Layout"

const LoggedIn: React.FC<{ currentUser: CurrentUser }> = ({ currentUser }) => {
  const router = useRouter()

  const auth = async () => {
    const authorizeUrl = await googleAuth()
    router.push(authorizeUrl)
  }

  const [calendars] = useQuery(getCalendars, {})

  return (
    <Container>
      <Button onClick={async () => await logout()}>Logout</Button>
      <div>
        User id: <code>{currentUser.id}</code>
        <br />
        User role: <code>{currentUser.role}</code>
      </div>
      <br />
      {calendars.ok ? (
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
      )}
    </Container>
  )
}

const UserInfo: React.FC = () => {
  const currentUser = useCurrentUser()

  return (
    <Container>
      {currentUser ? (
        <LoggedIn currentUser={currentUser} />
      ) : (
        <>
          <Heading>Please login</Heading>
          <LinkButton href="/login">Login</LinkButton>
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
