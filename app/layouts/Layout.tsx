import React, { ReactNode, Suspense } from "react"
import { Head, useMutation, useSession } from "blitz"
import { HStack, Flex, Box, Heading, Avatar, Button, Spinner, Grid } from "@chakra-ui/react"
import { Link, LinkButton } from "chakra-next-link"
import NextLink from "next/link"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const User: React.FC = () => {
  const [currentUser] = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  return currentUser ? (
    <HStack alignItems="center">
      <Button onClick={async () => await logoutMutation()}>Logout</Button>
      <NextLink href="/user">
        <Avatar name={currentUser?.name || ""} cursor="pointer" />
      </NextLink>
    </HStack>
  ) : (
    <HStack>
      <LinkButton href="/login">Login</LinkButton>
    </HStack>
  )
}

const Links: React.FC = () => {
  const { isLoading, userId } = useSession()

  return !isLoading && userId ? (
    <HStack justify="center">
      <Link href="/calendars" color="white" _activeLink={{ fontWeight: "bold" }}>
        Calendars
      </Link>
    </HStack>
  ) : (
    <Box />
  )
}

const Nav: React.FC = () => {
  return (
    <Grid p="2" bg="#1a73e8" templateColumns="repeat(3, 1fr)" gap={6} alignItems="center">
      <Heading color="white">
        <Link href="/">Gcal</Link>
      </Heading>

      <Suspense fallback={() => null}>
        <Links />
      </Suspense>

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

      {/* Main */}
      <Box as="main" height="calc(100vh - 56px)">
        <Nav />
        <Box w="1000px" maxW="90%" m="0 auto" my="4" pb="10">
          {children}
        </Box>
      </Box>

      {/* Footer */}
      <Box as="footer" bg="#000" color="white" py="4" textAlign="center">
        Gcal app copyright Fran Zekan
      </Box>
    </>
  )
}

export default Layout
