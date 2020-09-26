import React, { ReactNode, Suspense } from "react"
import { Head } from "blitz"
import { HStack, Flex, Box, Heading, Avatar, Button, Spinner, Grid } from "@chakra-ui/core"
import { Link, LinkButton } from "chakra-next-link"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const User: React.FC = () => {
  const currentUser = useCurrentUser()

  return currentUser ? (
    <HStack alignItems="center">
      <Button onClick={async () => await logout()}>Logout</Button>
      <Avatar name={currentUser.name || ""} />
    </HStack>
  ) : (
    <HStack>
      <LinkButton href="/login">Login</LinkButton>
    </HStack>
  )
}

const Nav = () => {
  return (
    <Grid p="2" bg="#1a73e8" templateColumns="repeat(3, 1fr)" gap={6}>
      <Box>
        <Link href="/">
          <Heading color="white">Gcal thingy</Heading>
        </Link>
      </Box>

      <HStack justify="center">
        <Link href="/calendars" color="white" _activeLink={{ fontWeight: "bold" }}>
          Calendars
        </Link>
      </HStack>

      <Flex justifyContent="flex-end">
        <Suspense fallback={<Spinner />}>
          <User />
        </Suspense>
      </Flex>
    </Grid>
  )
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "gcal"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <Box w="800px" maxW="80%" m="0 auto" mt="2">
        {children}
      </Box>
    </>
  )
}

export default Layout
